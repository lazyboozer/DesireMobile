import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as QRCode from 'qrcode';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private storage: Storage) {

  }

  ionViewDidLoad() {

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
}
