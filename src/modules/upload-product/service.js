import { RestService } from "../../utils/rest-service";
import { Config } from "aurelia-api";
import { Container } from 'aurelia-dependency-injection';

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

  getCode(){
    var config = Container.instance.get(Config);
    var _accurate = config.getEndpoint("accurate").client.baseUrl;
    var _upload = config.getEndpoint("upload").client.baseUrl;
    var scope = 'item_view item_save customer_save sales_invoice_save';

    var clientId = '10c9a510-48b4-48c0-9c15-3adc687c79a8';

    setTimeout(window.open(`${_accurate}/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${_upload}integration/authcallback&scope=${scope}`, "Request Token Accurate", "width=200, height=100"), 1000);
  }
}
