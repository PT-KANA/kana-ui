export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Revisi Tanggal Bon Terima Unit' },
        ]);

        this.router = router;
    }
}
