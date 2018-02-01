import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ReceivePage, RequestShowQR } from '../pages/receive/receive';
import { ScanPage } from '../pages/scan/scan';
import { HomePage } from '../pages/home/home';
import { SendPage, SendConfimrationPage } from '../pages/send/send';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { walletService } from './walletService';
import { HttpModule } from '@angular/http';
import { ElectrumClientService } from './electrum-client-service';
import { TCPServices } from '../../src/app/TCPServices';
import { SortGridPipe } from '../../src/app/SortGridPipe';
import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@NgModule({
  declarations: [
    MyApp,
    ReceivePage,
    RequestShowQR,
    ScanPage,
    HomePage,
    SendPage,
    SendConfimrationPage,
    SettingsPage,
    TabsPage,
    SortGridPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ReceivePage,
    RequestShowQR,
    ScanPage,
    HomePage,
    SendPage,
    SendConfimrationPage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    walletService,
    ElectrumClientService,
    TCPServices,
    SecureStorage,
    SortGridPipe,
    BarcodeScanner,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
