import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
    selector: 'jhi-import-product',
    templateUrl: './import-product.component.html',
    styles: []
})
export class ImportProductComponent implements OnInit {
    fileDir: String;
    arrayBuffer: any;
    file: File;
    constructor() {}

    ngOnInit() {}

    incomingfile(event) {
        this.file = event.target.files[0];
    }

    importFile() {
        const fileReader = new FileReader();
        fileReader.onload = e => {
            this.arrayBuffer = fileReader.result;
            const data = new Uint8Array(this.arrayBuffer);
            const arr = new Array();
            for (let i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            const bstr = arr.join('');
            const workbook = XLSX.read(bstr, { type: 'binary' });
            const first_sheet_name = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[first_sheet_name];
            console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        };
        fileReader.readAsArrayBuffer(this.file);
    }
}