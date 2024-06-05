import Constants from "../utils/Constants";
import { Client, ClientOpts } from "./Client";

export class KPopClient extends Client {
  constructor(options?: ClientOpts) {
    super({
      ...options,
      url: Constants.KPOP_GATEWAY_URL,
    });
  }
}
