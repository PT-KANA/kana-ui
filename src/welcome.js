//import {computedFrom} from 'aurelia-framework';
import { inject, bindable } from 'aurelia-framework';
import { Config } from "aurelia-api";
import { Container } from 'aurelia-dependency-injection';

export class Welcome {
  heading = 'Selamat datang di aplikasi KANA';
  firstName = 'John';
  lastName = 'Doe';
  previousValue = this.fullName;

  //Getters can't be directly observed, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below
  //as well as the corresponding import above.
  //@computedFrom('firstName', 'lastName')

  constructor() {
    var config = Container.instance.get(Config);
    var _accurate = config.getEndpoint("accurate").client.baseUrl;
    var _upload = config.getEndpoint("upload").client.baseUrl;
    var scope = 'item_view item_save customer_save sales_invoice_save';

    var clientId = '10c9a510-48b4-48c0-9c15-3adc687c79a8';

    setTimeout(window.open(`${_accurate}/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${_upload}integration/authcallback&scope=${scope}`, "Request Token Accurate", "width=200, height=100"), 1000);
  
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  submit() {
    this.previousValue = this.fullName;
    alert(`Welcome, ${this.fullName}!`);
  }

  canDeactivate() {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }
}

export class UpperValueConverter {
  toView(value) {
    return value && value.toUpperCase();
  }
}
