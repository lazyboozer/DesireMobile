import { Component } from '@angular/core';

import { ReceivePage } from '../receive/receive';
import { HomePage } from '../home/home';
import { SendPage } from '../send/send';
import { SettingsPage } from '../settings/settings';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ReceivePage;
  tab3Root = SendPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
