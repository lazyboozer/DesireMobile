import { Component } from '@angular/core';

import { ReceivePage } from '../receive/receive';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ReceivePage;
  tab3Root = ContactPage;

  constructor() {

  }
}
