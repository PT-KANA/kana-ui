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
           
            var endpoint = 'sales-return/upload';
            var request = {
                method: 'POST',
                headers: {
                },
                body: formData
            };
 
           
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
                        alert("Urutan format kolom CSV tidak sesuai.\n Format: Tanggal Retur,No Identitas Customer,	No Penjualan,Kode Barang,Harga Barang,No Faktur Pajak,Tanggal Faktur Pajak,Keterangan");
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
