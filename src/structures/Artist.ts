import Constants from "../utils/Constants";

export interface ArtistRaw {
  id: number;
  name?: string;
  nameRomaji?: string;
  image?: string;
}

export class Artist {
  /**
   * Artist id.
   */
  readonly id: number;

  /**
   * Artist name.
   * @Nullable
   */
  readonly name: string | null;

  /**
   * Artist romaji name.
   * @Nullable
   */
  readonly nameRomaji: string | null;

  /**
   * Artist image.
   * @Nullable
   */
  readonly image: string | null;

  constructor(data: ArtistRaw) {
    this.id = data.id;
    this.name = data.name || null;
    this.nameRomaji = data.nameRomaji || null;
    this.image = data.image || null;
  }

  /**
   * Artist image url.
   * @Nullable
   */
  get imageURL() {
    return this.image ? `${Constants.CDN_URL}/${this.image}` : null;
  }
}
