import Constants from "../utils/Constants";

export interface EventRaw {
  name: string;
  image?: string;
}

export class Event {
  /**
   * Event name.
   */
  readonly name: string;

  /**
   * Event image.
   * @Nullable
   */
  readonly image?: string;

  constructor(data: EventRaw) {
    this.name = data.name;
    this.image = data.image;
  }

  /**
   * Event image url.
   * @Nullable
   */
  get imageURL() {
    return this.image ? `${Constants.CDN_URL}/${this.image}` : null;
  }
}
