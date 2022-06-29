import { RestService } from "../../utils/rest-service";

const uri = "product";
 

export class Service extends RestService {
  constructor(http, aggregator, config, api) {
    super(http, aggregator, config, "upload");
  }

  search(info) {
    var endpoint = `${uri}`;
    return super.list(endpoint, info);
  }

  
}
