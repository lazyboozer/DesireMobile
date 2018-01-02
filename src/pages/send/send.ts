import { Component } from '@angular/core';
import { ModalController, ViewController, NavController, NavParams, ToastController } from 'ionic-angular';
import { walletService } from '../../../src/app/walletService';
import { LoadingController } from 'ionic-angular';
import * as WAValidator from "wallet-address-validator";
import * as QRCode from 'qrcode';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

declare var parseInt;
@Component({
  selector: 'page-send',
  templateUrl: 'send.html'
})
export class SendPage {

  public payToAddress = "";
  public payToAmount = 0;
  public payToFee = 0.00001;
  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, public modalCtrl: ModalController, public wallet: walletService, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {

  }

  openScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      if (!barcodeData.cancelled && barcodeData.format == "QR_CODE") {
        var code = barcodeData.text;

        if (WAValidator.validate(code, "DSR")) {
          this.payToAddress = code;
        } else {
          if (code.indexOf("desire") != -1) {
            var splittenCode = code.split("://");
            var address = splittenCode[1].split("?amount=")[0];
            var amount = splittenCode[1].split("?amount=")[1];

            if (WAValidator.validate(address, "DSR")) {
              this.payToAddress = address;
              this.payToAmount = +amount;
            };
          }
        }
      }

    }, (err) => {
      // An error occurred
    });
  }

  gotoSendConfirmation() {
    let loading = this.loadingCtrl.create({
      content: "Creating transaction..."
    });
    loading.present();
    var errorElement = document.getElementById("errorText");
    errorElement.innerHTML = "";
    console.log(this.wallet.keys.private);
    if (this.payToAddress.trim() != "") {
      if (this.payToAmount != 0) {
        if (this.wallet.balance >= this.payToAmount + this.payToFee) {
          if (WAValidator.validate(this.payToAddress, "DSR")) {
            this.wallet.make_transaction(this.payToAddress, this.decimalToFullNumber(this.payToAmount), this.decimalToFullNumber(this.payToFee), (e) => {
              if (e.success) {
                this.wallet.make_transaction(this.payToAddress, this.decimalToFullNumber(this.payToAmount), this.decimalToFullNumber(this.payToFee * e.result.size * 0.001), (ex) => {
                  if (ex.success) {
                    let profileModal = this.modalCtrl.create(SendConfimrationPage, { payToAddress: this.payToAddress, payToAmount: this.payToAmount, payToFee: this.payToFee * ex.result.size * 0.001, txraw: ex.result.rawtx, size: ex.result.size });
                    profileModal.present();
                    loading.dismiss();
                  } else {
                    errorElement.innerHTML = e.message;
                    loading.dismiss();
                  }
                });
              } else {
                errorElement.innerHTML = e.message;
                loading.dismiss();
              }
            });
          } else {
            errorElement.innerHTML = "This is not a desire address!";
            loading.dismiss();
          }


        } else {
          errorElement.innerHTML = "Not enough fund";
          loading.dismiss();
        }
      } else {
        errorElement.innerHTML = "Amount field is empty or zero";
        loading.dismiss();
      }
    } else {
      errorElement.innerHTML = "Address field is empty";
      loading.dismiss();
    }


  }

  decimalToFullNumber(number) {
    var result = parseInt((number * 100000000).toFixed(0))
    console.log(result);
    return result;
  }

}


@Component({
  selector: 'page-send_confirmation',
  templateUrl: 'send_confirmation.html'
})
export class SendConfimrationPage {
  public payToAddress = "";
  public payToAmount = "";
  public payToFee = "";
  public payToSummary = "";
  public transactionSize = 0;
  private transactionRaw = "";;
  constructor(params: NavParams, public viewCtrl: ViewController, public wallet: walletService, public loadingCtrl: LoadingController) {
    this.payToAddress = params.get("payToAddress");
    this.payToAmount = (+params.get("payToAmount")).toFixed(8);
    this.payToFee = (+params.get("payToFee")).toFixed(8);

    this.transactionSize = params.get("size");
    this.transactionRaw = params.get("txraw");

    this.transactionSize = this.transactionSize * 0.001;

    this.payToSummary = ((+params.get("payToAmount")) + (+params.get("payToFee"))).toFixed(8);
  }

  ionViewDidLoad() {

  }



  gotoSendConfirmation() {
    let loading = this.loadingCtrl.create({
      content: "Sending transaction..."
    });
    loading.present();

    var errorElement = document.getElementById("errorText2");
    errorElement.innerHTML = "";

    this.wallet.send_transaction(this.transactionRaw, (ex) => {
      console.log(ex);
      if (ex.indexOf("The") !== -1) {
        errorElement.innerHTML = "Transaction couldn't send:<br><br>" + ex.split("[")[0].replace("(", "<br>(");
      } else {
        this.wallet.update_balance();
        this.dismiss();
      }
      loading.dismiss();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
