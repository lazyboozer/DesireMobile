import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner) {
    this.scan();
  }

  scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log(JSON.stringify(barcodeData));
    }, (err) => {
      console.log("Error Scan: " + err);
    });
  }

}
