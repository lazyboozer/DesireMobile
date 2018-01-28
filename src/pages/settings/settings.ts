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

  showKeys() {
    this.storage.get("privKey").then((priv) => {
      this.storage.get("pubKey").then((pub) => {
        let alert = this.alertCtrl.create({
          title: 'Wallet Information',
          message: '<b>Public Key:</b> ' + pub + "<br><br><b>Private Key:</b> " + priv,
          buttons: ['Dismiss']
        });
        alert.present();
      });
    });
  }

  clearCache() {
    this.storage.remove("listspended_temp");
    let toast = this.toastCtrl.create({
      message: "Cache cleared",
      duration: 2000,
      position: 'top'
    })
    toast.present();
  }
}
