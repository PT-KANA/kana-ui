import {  bindable, inject } from "aurelia-framework";
import { Service } from "./service";
import { Router } from "aurelia-router";
import moment from "moment";

@inject(Router, Service)
export class List {
  dataToBePosted = [];
  @bindable isRefresh=false;
  columns = [
    {
      field: "isAccurate", title: "Post", checkbox: true, sortable: false,
      formatter: function (value, data, index) {
        this.checkboxEnabled = !data.isPosted;
        return ""
      }
    },
    { field: "OrderDownPaymentNumber", title: "No Penjualan" },
    { field: "CustomerNo", title: "Pelanggan" },
    { field: "TransDate", title: "Tanggal Penjualan", formatter: function (value, data, index) {
      return moment(value).format("DD MMM YYYY"); }},
    { field: "BranchName", title: "Location" },
  ];

  loader = (info) => {
    var order = {};
    if (info.sort) order[info.sort] = info.order;

    var arg = {
      page: parseInt(info.offset / info.limit, 10) + 1,
      size: info.limit,
      keyword: info.search,
      order: order,
    };

    return this.service.search(arg).then((result) => {
      var resultPromise = [];
      console.log(result);
      if (result && result.data && result.data.length > 0) {
        resultPromise = result.data;
      }
      return Promise.all(resultPromise).then((newResult) => {
        return {
          total: result.info.total,
          data: newResult,
        };
      });
    });
  };

  constructor(router, service) {
    this.service = service;
    this.router = router;
    this.uomId = "";
    this.uoms = [];
  }

  contextCallback(event) {
    
  }

  upload() {
    this.router.navigateToRoute("upload");
  }
  refresh() {
    var ClientId= "10c9a510-48b4-48c0-9c15-3adc687c79a8";
    var AccurateEndpoint="http://localhost:5000/v1/integration/authcallback";
    var AccuScope= "item_view item_save customer_save sales_invoice_view sales_invoice_save";
    return this.service.refresh(ClientId,AccurateEndpoint,AccuScope).then((result) => {
     
      console.log(result);
    
    });
  
  
    this.isRefresh=true;
  }
  posting() {
    if (this.dataToBePosted.length > 0) {
      this.service.post(this.dataToBePosted).then(result => {
        this.table.refresh();
      }).catch(e => {
        this.error = e;
      })
    }
  }
}
