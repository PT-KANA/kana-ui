module.exports = [
    {
        route: "/upload/main",
        name: "PILLAR - Unggah File",
        moduleId: "./modules/upload/main/index",
        nav: true,
        title: "Unggah File",
        auth: true,
        settings: {
          group: "dashboard-dp",
          permission: { C9: 1, B1: 1, B12: 1 },
          iconClass: "fa fa-dashboard",
        },
    }
    ]
