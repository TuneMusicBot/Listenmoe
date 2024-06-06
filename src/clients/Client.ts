import { EventEmitter, once } from "node:events";
import { WebSocket } from "ws";
import { ClientError } from "../errors/ClientError";
import { TrackUpdate } from "../structures/TrackUpdate";
import { GatewayError } from "../errors/GatewayError";

interface ClientOptions {
  url: string;
  timeout?: number;
  skipUTF8Validation?: boolean;
  followRedirects?: boolean;
}

interface RawJson {
  op: number;
  d: unknown;
  t?: string;
}

enum ClientStates {
  CONNECTING,
  CONNECTED,
  DISCONNECTING,
  DISCONNECTED,
}

export type ClientOpts = Omit<ClientOptions, "url">;

export declare interface Client {
  /**
   * Emitted when a gateway connection is made (THIS DOESN'T MEAN THE CONNECTION IS READY).
   * @eventProperty
   */
  on(event: "connected", listener: (took: number) => void): this;

  /**
   * Emitted when a gateway connection is made (THIS DOESN'T MEAN THE CONNECTION IS READY).
   * @eventProperty
   */
  once(event: "connected", listener: (took: number) => void): this;

  /**
   * Emitted when the gateway connection is ready.
   * @eventProperty
   */
  on(
    event: "ready",
    listener: (json: { took: number; message: string }) => void,
  ): this;

  /**
   * Emitted when the gateway connection is ready.
   * @eventProperty
   */
  once(
    event: "ready",
    listener: (json: { took: number; message: string }) => void,
  ): this;

  /**
   * Emitted when the gateway gets disconnected.
   * @eventProperty
   */
  on(
    event: "disconnect",
    listener: (json: { code: number; reason: string; clean: boolean }) => void,
  ): this;

  /**
   * Emitted when the gateway gets disconnected.
   * @eventProperty
   */
  once(
    event: "disconnect",
    listener: (json: { code: number; reason: string; clean: boolean }) => void,
  ): this;

  /**
   * Emitted when a error happens.
   * @eventProperty
   */
  on(event: "error", listener: (error: Error) => void): this;

  /**
   * Emitted when a error happens.
   * @eventProperty
   */
  once(event: "error", listener: (error: Error) => void): this;

  /**
   * Emitted when a packet is received.
   * @eventProperty
   */
  on(event: "raw", listener: (json: RawJson) => void): this;

  /**
   * Emitted when a packet is received.
   * @eventProperty
   */
  once(event: "raw", listener: (json: RawJson) => void): this;

  /**
   * Emitted when a track start playing.
   * @eventProperty
   */
  on(event: "trackUpdate", listener: (update: TrackUpdate) => void): this;

  /**
   * Emitted when a track start playing.
   * @eventProperty
   */
  once(event: "trackUpdate", listener: (update: TrackUpdate) => void): this;

  on(event: "trackUpdateRequest", listener: (data: unknown) => void): this;
  once(event: "trackUpdateRequest", listener: (data: unknown) => void): this;

  on(event: "queueEnd", listener: (data: unknown) => void): this;
  once(event: "queueEnd", listener: (data: unknown) => void): this;

  on(event: "notification", listener: (data: unknown) => void): this;
  once(event: "notification", listener: (data: unknown) => void): this;
}

export class Client extends EventEmitter {
  readonly url: string;
  readonly timeout: number;
  readonly skipUTF8Validation?: boolean;
  readonly followRedirects?: boolean;

  state = ClientStates.DISCONNECTED;

  private heartbeat?: number;
  private heartbeatInterval?: NodeJS.Timeout;
  private heartbeatAck?: number;
  private heartbeatSent?: number;

  private connection?: WebSocket;

  private time?: number;

  constructor(options: ClientOptions) {
    super();

    this.url = options.url;
    this.timeout = options.timeout || 60_000;
    this.skipUTF8Validation = options.skipUTF8Validation;
    this.followRedirects = options.followRedirects;
  }

  get connected() {
    return this.connection && this.state === ClientStates.CONNECTED;
  }

  get connecting() {
    return this.state === ClientStates.CONNECTING;
  }

  get disconnected() {
    return !this.connection && this.state === ClientStates.DISCONNECTED;
  }

  get disconnecting() {
    return this.state === ClientStates.DISCONNECTING;
  }

  /**
   * The previous heartbeat ping
   */
  get ping() {
    return this.heartbeatSent && this.heartbeatAck
      ? this.heartbeatAck - this.heartbeatSent
      : -1;
  }

  /**
   * Connect to listen.moe gateway
   */
  async connect() {
    if (this.connected)
      return Promise.reject(
        new ClientError("Client#connect already connected."),
      );
    if (this.connecting)
      return Promise.reject(
        new ClientError("Client#connect already connecting."),
      );
    if (this.disconnecting) await once(this, "disconnect");

    try {
      this.state = ClientStates.CONNECTING;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeout);

      this.time = Date.now();
      this.connection = new WebSocket(this.url, {
        signal: controller.signal,
        followRedirects: this.followRedirects,
        skipUTF8Validation: this.skipUTF8Validation,
      });

      this.connection.onopen = () => {
        clearTimeout(timeout);
        const took = Date.now() - this.time!;
        this.time = Date.now();

        this.emit("connected", took);
      };
      this.connection.onclose = ({ code, reason, wasClean }) => {
        this.state = ClientStates.DISCONNECTED;
        this.cleanup();
        this.emit("disconnect", { code, reason, clean: wasClean });
      };
      this.connection.onerror = (event) => {
        const err =
          event.error instanceof Error
            ? event.error
            : new GatewayError(event.message);
        this.emit("error", err);
      };
      this.connection.onmessage = ({ data: message }) => {
        try {
          const json = JSON.parse(message.toString());
          this.emit("raw", json);
          switch (json.op) {
            case 0: {
              this.state = ClientStates.CONNECTED;
              const took = Date.now() - this.time!;

              this.heartbeat = json.d.heartbeat;
              this.heartbeatInterval = setInterval(
                () =>
                  this.send({ op: 9 }).then(() => {
                    this.heartbeatSent = Date.now();
                  }),
                this.heartbeat,
              );

              this.emit("ready", { took, message: json.d.message });
              break;
            }
            case 1: {
              switch (json.t) {
                case "TRACK_UPDATE":
                  this.emit("trackUpdate", new TrackUpdate(json.d));
                  break;
                case "TRACK_UPDATE_REQUEST":
                  this.emit("trackUpdateRequest", json.d);
                  break;
                case "QUEUE_END":
                  this.emit("queueEnd", json.d);
                  break;
                case "NOTIFICATION":
                  this.emit("notification", json.d);
                  break;
                default:
                  this.emit("unknownEvent", json);
                  break;
              }
              break;
            }
            case 10: {
              this.heartbeatAck = Date.now();
              break;
            }
          }
        } catch (e) {
          this.emit("error", e);
        }
      };
      return once(this, "connected").then(() => true);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError")
        return Promise.reject(new Error("Client#connect connection timeout."));
      return this.emit("error", e);
    }
  }

  /**
   * Disconnect from listen.moe gateway
   */
  async disconnect() {
    if (this.disconnected)
      return Promise.reject(
        new Error("Client#disconnect already disconnected."),
      );
    if (this.disconnecting) return once(this, "disconnect").then(() => true);

    if (this.connecting) {
      this.state = ClientStates.DISCONNECTING;
      await once(this, "connected");
    }

    this.state = ClientStates.DISCONNECTING;

    this.connection?.close(1_000);
    return once(this, "disconnect").then(() => true);
  }

  /**
   * Send a packet to listen.moe
   */
  send(packet: Record<string, unknown>) {
    if (!this.connected)
      return Promise.reject(new Error("Client#send not connected."));
    return new Promise((resolve, reject) => {
      this.connection?.send(JSON.stringify(packet), (err) =>
        err ? reject(err) : resolve(true),
      );
    });
  }

  private cleanup() {
    this.heartbeat = undefined;
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = undefined;

    if (this.connection) {
      const noop = () => {};

      this.connection.onclose = noop;
      this.connection.onopen = noop;
      this.connection.onmessage = noop;
      this.connection.onerror = noop;

      this.connection.removeAllListeners();
    }

    this.connection = undefined;
  }
}
