export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'List Monitoring Pengiriman Barang Jadi Sample' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View:Monitoring Pengiriman Barang Jadi Sample' },
        ]);

        this.router = router;
    }
}