import { Component } from '@angular/core';
import { ModalController, ViewController, NavController, NavParams, ToastController } from 'ionic-angular';
import { walletService } from '../../../src/app/walletService';

import * as QRCode from 'qrcode';

@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html'
})
export class ReceivePage {
  public amount = "";
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public toastCtrl: ToastController, public wallet: walletService) {

  }

  ionViewDidLoad() {
    var canvas = document.getElementById("receiveqr");
    console.log("Canvas: " + canvas);
    QRCode.toCanvas(canvas, this.wallet.keys.public,
      {
        scale: 6,
        margin: 2,
        color: {
          dark: "#ffffffff",
          light: "#242424FF"
        }
      }
      , function (error) {
        if (error) console.error("QR CODE ERROR: " + error);
        console.log("success!");
      })
  }

  copyAddress(val) {
    this.copyTextToClipboard(val, (e) => {
      var message = "";
      if (e == 1) {
        message = "Address copied"
      } else {
        message = "Address couldn't be copied."
      }
      let toast = this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: "top"
      });
      toast.present();
    });

  }

  copyTextToClipboard(text, callback) {
    var textArea: any = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      if (successful) {
        callback(1)
      } else {
        callback(-1);
      }
      console.log('Copying text command was ' + successful);
    } catch (err) {
      callback(-1);
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  }

  openRequestQR() {
    if (this.amount.toString().trim() == "" || (+this.amount) <= 0) {
      var shakeClassList = document.getElementById("shakeWhenError").classList;

      if (shakeClassList.contains("shake")) {
        shakeClassList.remove("shake");
      }
      setTimeout(() => {
        shakeClassList.add("shake");
      }, 1);
      setTimeout(() => {
        shakeClassList.remove("shake");
      }, 1000);

    } else {
      let profileModal = this.modalCtrl.create(RequestShowQR, { address: this.wallet.keys.public, amount: this.amount });
      profileModal.present();
    }

  }
}


@Component({
  selector: 'page-requestshowqr',
  templateUrl: 'requestshowqr.html'
})
export class RequestShowQR {
  public receiveAddress = "";
  public amount = "";
  public data = "";
  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.amount = (+params.get("amount")).toFixed(8);
    this.receiveAddress = params.get("address");

    this.data = "desire://" + this.receiveAddress + "?amount=" + this.amount;
  }

  ionViewDidLoad() {
    var canvas = document.getElementById("receiveqr2");
    console.log("Canvas: " + canvas);
    QRCode.toCanvas(canvas, this.data,
      {
        scale: 6,
        margin: 2,
        color: {
          dark: "#ffffffff",
          light: "#242424FF"
        }
      }
      , function (error) {
        if (error) console.error("QR CODE ERROR: " + error);
        console.log("success!");
      })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}