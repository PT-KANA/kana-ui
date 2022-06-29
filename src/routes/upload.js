module.exports = [
    {
        route: "/upload-product",
        name: "PILLAR - Unggah File",
        moduleId: "./modules/upload-product/index",
        nav: true,
        title: "Unggah File Product",
        auth: true,
        settings: {
          group: "upload",
          permission: { C1: 1, B1: 1, B12: 1 },
          iconClass: "fa fa-upload",
        },
      },
      {
        route: "/upload-sales",
        name: "PILLAR - Unggah File",
        moduleId: "./modules/upload-sales/index",
        nav: true,
        title: "Unggah File Penjualan",
        auth: true,
        settings: {
          group: "upload",
          permission: { C1: 1, B1: 1, B12: 1 },
          iconClass: "fa fa-upload",
        },
      },
      {
        route: "/upload-sales-return",
        name: "PILLAR - Unggah File",
        moduleId: "./modules/upload-sales-return/index",
        nav: true,
        title: "Unggah File Retur Penjualan",
        auth: true,
        settings: {
          group: "upload",
          permission: { C1: 1, B1: 1, B12: 1 },
          iconClass: "fa fa-upload",
        },
      }
     
    ]
