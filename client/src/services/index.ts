import axios from "axios";

import { HttpService } from "./http.service";

export class HttpServiceFactory {
  createHttpService(): HttpService {
    return new HttpService(axios);
  }
}
