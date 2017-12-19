import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { walletService } from '../../../src/app/walletService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public wallet: walletService) {

  }

}
