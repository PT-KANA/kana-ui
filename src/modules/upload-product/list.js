import { bindable, inject } from "aurelia-framework";
import { Service } from "./service";
import { Router } from "aurelia-router";
import moment from "moment";

@inject(Router, Service)
export class List {
  dataToBePosted = [];
  @bindable isRefresh=false;

  rowFormatter(data, index) {
    if (data.isAccurate)
        return { classes: "success" }
    else
        return {}
  }

  context = ["Rincian"]

  columns = [
    {
      field: "isAccurates", title: "Post", checkbox: true, sortable: false,
      formatter: function (value, data, index) {
        this.checkboxEnabled = !data.isAccurate;
        return ""
      }
    },
    { field: "no", title: "Kode Barang" },
    { field: "name", title: "Nama Barang" },
    { 
      field: "isAccurate", title: "Status Post", 
      formatter: function (value, data, index) {
        return data.isAccurate ? "Sudah Diupload Ke Accurate" : "Belum Diupload Ke Accurate";
      }
    }
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

    return this.service.search(arg)
      .then((result) => {
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

  upload() {
    this.router.navigateToRoute("upload");
  }

  refresh(){
    this.service.getCode();
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
