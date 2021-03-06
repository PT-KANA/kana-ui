import { inject } from "aurelia-framework";
import { Service } from "./service";
import { Router } from "aurelia-router";
import moment from "moment";

@inject(Router, Service)
export class List {
  constructor(router, service) {
    this.service = service;
    this.router = router;
  }

  context = ["detail packinglist", "detail bon"];

  columns = [
    {
      field: "date",
      title: "Tanggal",
      formatter: function (value, data, index) {
        return moment(value).format("DD MMM YYYY");
      },
    },
    { field: "bonNo", title: "No. Bon" },
    { field: "shift", title: "Shift" },
    { field: "group", title: "Group" },
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
      var data = {};
      data.total = result.total;
      data.data = result.data;
      return data;
    });
  };

  // contextClickCallback(event) {
  //   var arg = event.detail;
  //   var data = arg.data;
  //   switch (arg.name) {
  //     case "detail":
  //       this.router.navigateToRoute("view", { id: data.id });
  //       break;
  //     case "print":
  //       this.service.getPdfById(data.id);
  //       break;
  //   }
  // }

  // contextShowCallback(index, name, data) {
  //   switch (name) {
  //     case "print":
  //       return data;
  //     default:
  //       return true;
  //   }
  // }

  contextCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "detail packinglist":
        this.router.navigateToRoute("view", {
          id: data.id,
        });
        break;
      case "detail bon":
      this.router.navigateToRoute("view-bon", {
        id: data.id,
      });
      break;
    }
  }

  create() {
    this.router.navigateToRoute("create");
  }
  generatedExcel(){
    this.router.navigateToRoute('excel');
  }
}
