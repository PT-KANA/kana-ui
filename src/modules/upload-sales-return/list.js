import { bindable, inject } from "aurelia-framework";
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
    { field: "invoiceNumber", title: "No Penjualan" },
    { field: "transDate", title: "Tanggal Retur", formatter: function (value, data, index) {
      return moment(value).format("DD MMM YYYY"); }
    },
    { field: "customerNo", title: "Pelanggan" },
    
   
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

  refresh(){
    this.service.getCode();
    this.isRefresh=true;
  }

  upload() {
    this.router.navigateToRoute("upload");
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
