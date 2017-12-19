import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as QRCode from 'qrcode';

@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html'
})
export class ReceivePage {
  public receiveAddress = "DPgpaRBgC9ctgW6a5HsHhyB4w4xJXhMipN";

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    var canvas = document.getElementById("receiveqr");
    console.log("Canvas: " + canvas);
    QRCode.toCanvas(canvas, this.receiveAddress, function (error) {
      if (error) console.error("QR CODE ERROR: " + error);
      console.log("success!");
    })
  }
}
