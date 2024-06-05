import { JPopClient } from "./clients/JPopClient";
import { KPopClient } from "./clients/KPopClient";
import { Album } from "./structures/Album";
import { Song } from "./structures/Song";
import { Event } from "./structures/Event";
import Constants from "./utils/Constants";
import { Artist } from "./structures/Artist";
import { ClientError } from "./errors/ClientError";
import { GatewayError } from "./errors/GatewayError";

export = {
  KPopClient,
  JPopClient,
  Constants,
  Song,
  Album,
  Event,
  Artist,
  ClientError,
  GatewayError,
};
