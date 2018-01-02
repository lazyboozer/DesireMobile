import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { walletService } from '../../../src/app/walletService';

declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, public wallet: walletService, private storage: Storage) {

  }

  openUrl() {
    var url = "https://altmix.org/coins/13-Desire/explorer/address/";
    this.storage.get("pubKey").then((pub) => {
      window.open(url + pub);
    });
  }

}
