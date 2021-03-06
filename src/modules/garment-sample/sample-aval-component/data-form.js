import { bindable, inject, computedFrom } from "aurelia-framework";
import { Service, CoreService, SalesService } from "./service";

const UnitLoader = require('../../../loader/garment-units-loader');
const CuttingInLoader = require('../../../loader/garment-sample-cutting-in-by-ro-loader');
const SewingOutLoader = require('../../../loader/garment-sample-sewing-out-by-ro-loader');

@inject(Service, CoreService, SalesService)
export class DataForm {
    @bindable readOnly = false;
    @bindable isEdit = false;
    @bindable title;
    @bindable data = {};
    @bindable selectedCuttingIn;
    @bindable selectedSewingOut;

    constructor(service, coreService, salesService) {
        this.service = service;
        this.coreService = coreService;
        this.salesService = salesService;
    }

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        deleteText: "Hapus",
    };

    controlOptions = {
        label: {
            length: 2
        },
        control: {
            length: 5
        }
    };

    avalComponentTypes = [
        "CUTTING",
        "SEWING"
    ];

    @computedFrom("data.SampleAvalComponentType")
    get itemsColumns() {
        return [
            "Kode Barang",
            "Keterangan",
            "Jumlah Aval",
            "Satuan",
        ].concat(this.data.SampleAvalComponentType == "SEWING" ? ["Size", "Warna"] : []);
    }

    @computedFrom("data.Unit")
    get cuttingInFilter() {
        this.selectedCuttingIn = null;

        if (this.data.Unit) {
            return {
                UnitId: this.data.Unit.Id, CuttingType: "Main Fabric"
            };
        } else {
            return {
                UnitId: 0, CuttingType: "Main Fabric"
            };
        }
    }

    @computedFrom("data.Unit")
    get sewingOutFilter() {
        this.selectedSewingOut = null;

        if (this.data.Unit) {
            return {
                UnitToId: this.data.Unit.Id,
                SewingTo: "CUTTING",
                "GarmentSewingOutItem.Any(RemainingQuantity>0)": true
            };
        } else {
            return {
                UnitToId: 0
            };
        }
    }

    async bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;

        if (!this.data.Unit) {
            var unit = await this.coreService.getSampleUnit({ size: 1, keyword: 'SMP1', filter: JSON.stringify({ Code: 'SMP1' }) });
            this.data.Unit = unit.data[0];
        }
    }

    unitView = (unit) => {
        return `${unit.Code} - ${unit.Name}`;
    }

    get unitLoader() {
        return UnitLoader;
    }

    get cuttingInLoader() {
        return CuttingInLoader;
    }

    get sewingOutLoader() {
        return SewingOutLoader;
    }

    get itemsOptions() {
        return {
            type: this.data.SampleAvalComponentType
        };
    }

    avalComponentTypeChanged() {
        this.selectedCuttingIn = null;
        this.selectedSewingOut = null;
    }

    async selectedSewingOutChanged(newValue, oldValue) {
        if (newValue) {
            this.context.error.Items = [];
            this.data.RONo = newValue.RONo;
            this.data.Article = newValue.Article;
            this.data.Comodity = newValue.Comodity;

            let priceResult = await this.service.getComodityPrice({ filter: JSON.stringify({ ComodityId: this.data.Comodity.Id, UnitId: this.data.Unit.Id, IsValid: true }) });
            if (priceResult.data.length > 0) {
                this.data.Price = priceResult.data[0].Price;
            }
            else {
                this.data.Price = 0;
            }

            Promise.resolve(this.service.getSewingOut({

                filter: JSON.stringify({ RONo: this.data.RONo, UnitToId: this.data.Unit.Id, SewingTo: "CUTTING", "GarmentSewingOutItem.Any(RemainingQuantity>0)": true }),
                select: "new (UnitToCode,SewingOutDate, IsDifferentSize, GarmentSewingOutItem.Select(new (Identity as SewingOutItemId,BasicPrice, new (ProductId as Id, ProductCode as Code, ProductName as Name) as Product, DesignColor, RemainingQuantity, new (SizeId as Id, SizeName as Size) as Size, GarmentSampleSewingOutDetail.Select(new (Identity as SewingOutDetailId, Quantity, new (SizeId as Id, SizeName as Size) as Size)) as Details, Color)) as Items)",

            }))
                .then(result => {
                    this.data.Items = [];
                    result.data.forEach(data => {
                        (data.Items || []).forEach(item => {
                            if (data.IsDifferentSize) {
                                (item.Details || []).forEach(detail => {
                                    if (detail.Quantity > 0) {
                                        // this.data.Items.push(Object.assign(item, detail, {
                                        //     SourceQuantity: detail.Quantity
                                        // }));
                                        this.data.Items.push({
                                            IsSave: true,
                                            SewingDate: data.SewingOutDate,
                                            IsDifferentSize: data.IsDifferentSize,
                                            SampleSewingOutItemId: item.SewingOutItemId,
                                            Product: item.Product,
                                            DesignColor: item.DesignColor,
                                            RemainingQuantity: item.RemainingQuantity,
                                            SampleSewingOutDetailId: detail.SewingOutDetailId,
                                            Quantity: detail.Quantity,
                                            SourceQuantity: detail.Quantity,
                                            Size: detail.Size,
                                            SizeName: detail.Size.Size,
                                            BasicPrice: item.BasicPrice,
                                            ComodityPrice: this.data.Price,
                                            Color: item.Color
                                        });
                                    }
                                });
                            } else {
                                if (item.RemainingQuantity > 0) {
                                    this.data.Items.push(Object.assign(item, {
                                        IsSave: true,
                                        SewingDate: data.SewingOutDate,
                                        Quantity: item.RemainingQuantity,
                                        SampleSewingOutItemId: item.SewingOutItemId,
                                        SourceQuantity: item.RemainingQuantity,
                                        BasicPrice: item.BasicPrice,
                                        ComodityPrice: this.data.Price,
                                        SizeName: item.Size.Size,
                                        Color: item.Color
                                    }));
                                }
                            }
                        });
                    });
                    this.data.Items.sort((a, b) => a.Color.localeCompare(b.Color) || a.SizeName.localeCompare(b.SizeName));
                    this.context.checkedAll = true;
                });
        }
        else {
            (this.context.selectedSewingOutViewModel || {}).editorValue = "";
            this.data.RONo = null;
            this.data.Article = null;
            this.data.Comodity = null;
            this.data.Items = [];
            this.data.Price = 0;
        }
    }

    async selectedCuttingInChanged(newValue, oldValue) {
        if (newValue) {
            this.context.error.Items = [];
            this.data.RONo = newValue.RONo;
            this.data.Article = newValue.Article;
            // ambil dari sample request by ro
            let noResult = await this.service.getSampleRequestByRONo({ size: 1, filter: JSON.stringify({ RONoSample: this.data.RONo }) });
            this.data.Comodity = noResult.data[0].Comodity;

            let priceResult = await this.service.getComodityPrice({ filter: JSON.stringify({ ComodityId: this.data.Comodity.Id, UnitId: this.data.Unit.Id, IsValid: true }) });
            if (priceResult.data.length > 0) {
                this.data.Price = priceResult.data[0].Price;
            }
            else {
                this.data.Price = 0;
            }

            Promise.resolve(this.service.getCuttingIn({ filter: JSON.stringify({ RONo: this.data.RONo, UnitId: this.data.Unit.Id, CuttingType: "Main Fabric" }) }))
                .then(result => {
                    // (this.data.Items || []).splice(0);
                    this.data.Items = [];
                    result.data.forEach(data => {
                        (data.Items || []).forEach(item => {
                            (item.Details || []).forEach(detail => {
                                if (detail.RemainingQuantity > 0) {
                                    this.data.Items.push(Object.assign(detail, {
                                        IsSave: true,
                                        SampleCuttingDate: data.CuttingInDate,
                                        Quantity: detail.RemainingQuantity,
                                        SampleCuttingInDetailId: detail.Id,
                                        SourceQuantity: detail.RemainingQuantity,
                                        BasicPrice: detail.BasicPrice,
                                        ComodityPrice: this.data.Price
                                    }));
                                }
                            });
                        });
                    });
                    // this.data.Items = result.data
                    //     .reduce((items, data) => items.concat(data.Items.map(item => {
                    //         return Object.assign(item, {

                    //         })
                    //     })), []);
                    this.context.checkedAll = true;
                });
            return;
        }
        else {
            (this.context.selectedCuttingInViewModel || {}).editorValue = "";
            this.data.RONo = null;
            this.data.Article = null;
            this.data.Items = [];
        }
    }

    changeCheckedAll() {
        (this.data.Items || []).forEach(i => i.IsSave = this.context.checkedAll);
    }

    get totalQuantity() {
        var qty = 0;
        if (this.data.Items) {
            for (var item of this.data.Items) {
                if (item.IsSave)
                    qty += item.Quantity;
            }
        }
        return qty;
    }
}