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
           
            var endpoint = 'UploadExcel';
            var request = {
                method: 'POST',
                headers: {
                },
                body: formData
            };
 
            var promise = this.service.endpoint.client.fetch(endpoint, request);
            this.service.publish(promise);
            return promise.then(response => {
                if (response.status == 200) {
                    alert("Data Berhasil Diupload");
                    this.service.publish(promise);
                    this.list();
                }
                else if (response.status == 400) {
                    this.disabled = false;
                    response.json()
                        .then(result => {
                            alert(result.message);
                        });
                    this.router.navigateToRoute('upload');
                    this.service.publish(promise);
                }
            })
        }
    }

}
