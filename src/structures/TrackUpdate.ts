import { EventRaw, Event } from "./Event";
import { Song, SongRaw } from "./Song";

interface TrackUpdateRaw {
  song: SongRaw;
  requester: { name: string } | null;
  startTime: string;
  listeners: number;
  event: EventRaw | null;
  lastPlayed: SongRaw[];
}

export class TrackUpdate {
  /**
   * The current song.
   */
  readonly song: Song;

  /**
   * Event info
   * @Nullable
   */
  readonly event?: Event;

  /**
   * Date when the music started playing
   */
  readonly startedAt: Date;

  /**
   * Last 2 songs played.
   */
  readonly lastPlayed: Song[] = [];

  /**
   * Number of listeners
   */
  readonly listeners: number;

  /**
   * Requester name
   * @Nullable
   */
  readonly requester?: string;

  constructor(data: TrackUpdateRaw) {
    this.song = new Song(data.song);
    this.requester = data.requester?.name;
    this.startedAt = new Date(data.startTime);
    this.listeners = data.listeners;

    if (data.event) {
      this.event = new Event(data.event);
    }

    this.lastPlayed.push(...data.lastPlayed.map((s) => new Song(s)));
  }

  /**
   * Date in time milliseconds when the music started playing
   */
  get startedTimestamp() {
    return this.startedAt.getTime();
  }
}
