import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { walletService } from '../../../src/app/walletService';
import * as QRCode from 'qrcode';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(private toastCtrl: ToastController, public navCtrl: NavController, private alertCtrl: AlertController, public wallet: walletService, private storage: Storage) {

  }

  ionViewDidLoad() {

  }

  public updateCurrency() {
    this.wallet.updateConvertPrice();
    this.storage.set("CurrencySymbol", this.wallet.convertCurrencySymbol);
  }

  importKeys() {
    let alert = this.alertCtrl.create({
      title: "Warning",
      message: "This will remove the currently desire balance if you import a new private address. If you want to keep this balance, please write down your private key from <b>\"Show Private Address\"</b>.<br>Please enter <b>\"Confirm\"</b> input box <b>\"yes\"</b> if you want to replace the currently private address.",
      inputs: [
        {
          name: 'address',
          placeholder: 'Private Address'
        },
        {
          name: 'confirm',
          placeholder: 'Confirm'
        }
      ],
      buttons: [
        {
          text: 'Import',
          handler: (data) => {
            if (data.confirm == "yes") {

              var success = this.wallet.create_wallet(data.address);

              if (success) {
                this.storage.remove("listspended_temp");
                this.storage.remove("history");
                this.wallet.updateOverall();

                let toast = this.toastCtrl.create({
                  message: "Private key imported",
                  duration: 2000,
                  position: 'top'
                })
                toast.present();
              } else {
                let toast = this.toastCtrl.create({
                  message: "Invalid private key",
                  duration: 2000,
                  position: 'top'
                })
                toast.present();
              }
            } else {
              let toast = this.toastCtrl.create({
                message: "Aborted",
                duration: 2000,
                position: 'top'
              })
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
  showKeys() {
    this.storage.get("privKey").then((priv) => {
      this.storage.get("pubKey").then((pub) => {
        let alert = this.alertCtrl.create({
          title: 'Wallet Information',
          message: '<b>Public Key:</b> ' + pub + "<br><br><b>Private Key:</b> " + priv,
          buttons: [
            {
              text: "Copy private key",
              handler: () => {
                this.copyAddress(priv);
              }
            },
            {
              text: "Dismiss"
            }
          ]
        });
        alert.present();
      });
    });
  }

  clearCache() {
    let alert = this.alertCtrl.create({
      title: "Warning",
      message: "This will remove entire history of transactions and clears used input transactions. This won't remove your desire account balance.",
      buttons: [
        {
          text: 'Clear',
          handler: () => {
            this.storage.remove("listspended_temp");
            this.storage.remove("history");
            let toast = this.toastCtrl.create({
              message: "Cache/History cleared",
              duration: 2000,
              position: 'top'
            })
            toast.present();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  copyAddress(val) {
    this.copyTextToClipboard(val, (e) => {
      var message = "";
      if (e == 1) {
        message = "Private Address copied"
      } else {
        message = "Private Address couldn't be copied."
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
}
