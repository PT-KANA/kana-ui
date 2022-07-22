import { inject, bindable, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class Create {
    @bindable infoArea;
    @bindable error = {};

    controlOptions = {
        label: {
          length: 4,
        },
        control: {
          length: 4,
        },
    };


    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = {};
       
    }
    
    async bind(context) {
        this.context = context;
      
    }

    async activate(context) {
        this.data = context.data;
        this.error = context.error;
       
    }

    list() {
        this.router.navigateToRoute('list');
    }

   

    cancelCallback(event) {
      this.list();
    }

    saveCallback(event) {

        this.disabled = true;

        var e = {};
        var formData = new FormData();
        var fileInput = document.getElementById("fileCsv");
        var fileList = fileInput.files;
        if (fileList[0] == undefined) {
            e.file = "File Path harus dipilih";
            this.error = e;
        } else {
            formData.append("file", fileList[0]);
           
            var endpoint = 'sales/upload';
            var request = {
                method: 'POST',
                headers: {
                },
                body: formData
            };
 
            // var promise = this.service.endpoint.client.fetch(endpoint, request);
            // this.service.publish(promise);
            // return promise.then(response => {
            //     if (response.status == 201) {
            //         alert("Data Berhasil Diupload");
            //         this.service.publish(promise);
            //         this.list();
            //     }
            //     else if (response.status == 400 || response.status == 200) {
            //         this.disabled = false;
            //         response.json()
            //             .then(result => {
            //                 alert(result.message);
            //             });
            //         this.router.navigateToRoute('upload');
            //         this.service.publish(promise);
            //     }
            // })
            var promise = this.service.endpoint.client.fetch(endpoint, request);
            this.service.publish(promise);
            return promise
                .then((result) => {
                    this.service.publish(promise);
                    if (result.status == 200 || result.status == 500) {
                        var getRequest = this.service.endpoint.client.fetch(endpoint, request);
                        this.service._downloadFile(getRequest);
                        this.service.publish(getRequest);
                        alert("Upload gagal!\n Ada beberapa data yang harus diperbaiki. Silahkan lihat Error Log untuk melihat detil dari error tersebut.");
                        this.list();
                    }
                    else if (result.status == 404) {
                        alert("Urutan format kolom CSV tidak sesuai.\n Format: Barcode,Name, Email,    Financial Status, Paid at,  Fulfillment Status,   Fulfilled at, Accepts Marketing,    Currency, Subtotal, Shipping, Taxes,    Total,    Discount Code,    Discount Amount,  Shipping Method,  Created at,   Lineitem quantity,    Lineitem name,    Lineitem price,   Lineitem compare at price,    Lineitem sku, Lineitem requires shipping,   Lineitem taxable, Lineitem fulfillment status,  Billing Name, Billing Street,   Billing Address1, Billing Address2, Billing Company,  Billing City, Billing Zip,  Billing Province, Billing Country,  Billing Phone,    Shipping Name,    Shipping Street,  Shipping Address1,    Shipping Address2,    Shipping Company, Shipping City,    Shipping Zip, Shipping Province,    Shipping Country, Shipping Phone,   Notes,    Note Attributes,  Cancelled at, Payment Method,   Payment Reference,    Refunded Amount,  Vendor,   Outstanding Balance,  Employee, Location, Device ID,    Id,   Tags, Risk Level,   Source,   Lineitem discount,    Tax 1 Name,   Tax 1 Value,  Tax 2 Name,   Tax 2 Value,  Tax 3 Name,   Tax 3 Value,  Tax 4 Name,   Tax 4 Value,  Tax 5 Name,   Tax 5 Value,  Phone,    Receipt Number,   Duties,   Billing Province Name,    Shipping Province Name,   Payment ID,   Payment Terms Name,   Next Payment Due At");
                    }
                    else {
                        alert("Data Berhasil Diupload");
                        this.list();

                    }
                    return Promise.resolve(result);
                });
        }
    }

}
