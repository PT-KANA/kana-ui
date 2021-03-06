export class ItemView {

    constructor() {
        this.columns = ['Unit', 'Nama Barang', 'Jumlah', 'Satuan', 'Harga Total'];
    }

    activate(context) {
        console.log(context);
        this.data = context.data;
        this.isShowing = false;
        if (context.context.options) {
            this.IDR = context.context.options.IDR;
            this.rate = context.context.options.rate;
            this.payToSupplierCurrency = context.context.options.payToSupplierCurrency;
            this.sameCurrency = context.context.options.SameCurrency;
            if (this.IDR) {
                this.data.payToSupplierIDR = this.data.payToSupplier * this.rate;
                this.data.currencyIDR = "IDR";
            }
        }
    }

    toggle() {
        this.isShowing = !this.isShowing;
    }
}
