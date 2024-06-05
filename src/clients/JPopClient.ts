import Constants from "../utils/Constants";
import { Client, ClientOpts } from "./Client";

export class JPopClient extends Client {
  constructor(options?: ClientOpts) {
    super({
      ...options,
      url: Constants.JPOP_GATEWAY_URL,
    });
  }
}
