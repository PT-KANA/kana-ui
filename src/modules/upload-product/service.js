import { RestService } from "../../utils/rest-service";

const uri = "master/item";
 

export class Service extends RestService {
  constructor(http, aggregator, config, api) {
    super(http, aggregator, config, "upload");
  }

  search(info) {
    var endpoint = `${uri}`;
    return super.list(endpoint, info);
  }

  post(data) {
    var endpoint = 'master/item/post';
    return super.post(endpoint, data);
}
}
