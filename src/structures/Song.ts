import { Album, AlbumRaw } from "./Album";
import { Artist, ArtistRaw } from "./Artist";

export interface SongRaw {
  id: number;
  title: string;
  duration: number;
  artists: ArtistRaw[];
  albums: AlbumRaw[];
}

export class Song {
  /**
   * The song id.
   */
  readonly id: number;

  /**
   * The song name.
   */
  readonly title: string;

  /**
   * The artists that participated on this song.
   */
  readonly artists: Artist[] = [];

  /**
   * The albums this song is present.
   */
  readonly albums: Album[] = [];

  /**
   * Duration in milliseconds of this song.
   */
  readonly duration: number;

  constructor(data: SongRaw) {
    this.id = data.id;
    this.title = data.title;
    this.duration = data.duration * 1000;

    this.artists.push(...data.artists.map((a) => new Artist(a)));
    this.albums.push(...data.albums.map((a) => new Album(a)));
  }

  get imageURL() {
    return this.albums[0]?.imageURL || null;
  }
}
