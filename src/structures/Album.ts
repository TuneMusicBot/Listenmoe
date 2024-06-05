import Constants from "../utils/Constants";

export interface AlbumRaw {
  id: number;
  name?: string;
  nameRomaji?: string;
  image?: string;
}

export class Album {
  /**
   * Album id.
   */
  readonly id: number;

  /**
   * Album name.
   * @Nullable
   */
  readonly name: string | null;

  /**
   * Album romaji name.
   * @Nullable
   */
  readonly nameRomaji: string | null;

  /**
   * Album image.
   * @Nullable
   */
  readonly image: string | null;

  constructor(data: AlbumRaw) {
    this.id = data.id;
    this.name = data.name || null;
    this.nameRomaji = data.nameRomaji || null;
    this.image = data.image || null;
  }

  /**
   * Album image url.
   * @Nullable
   */
  get imageURL() {
    return this.image ? `${Constants.CDN_URL}/${this.image}` : null;
  }
}
