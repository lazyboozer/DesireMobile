import * as desire from "bitcoinjs-lib";

import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';


import { ElectrumClientService } from "../../src/app/electrum-client-service"
declare const Buffer
@Injectable()

export class walletService {
  public keys = {
    private: "",
    public: ""
  }
  public balance = null;
  public convertCurrency = null;
  public convertCurrencySymbol = "USD";

  public balance_unconfirmed = null;
  public histories = [];
  public confirmation = 0;
  public addresses = [];
  private network;
  private ecpair;

  constructor(public wallet: ElectrumClientService, private storage: Storage, public http: Http) {
    this.network = desire.networks.desire;

    storage.get("privKey").then((priv) => {
      storage.get("pubKey").then((pub) => {
        console.log(priv);
        if (priv == null || pub == null) {
          this.create_wallet();
        } else {
          this.keys.private = priv;
          this.keys.public = pub //DSLdCa24CXi47xdLrf8Z1X4UiBUbuJb9mt;
        }

        this.update_balance();

        setInterval(() => {
          this.update_balance();
          this.updateConvertPrice();
          this.update_history();
        }, 20000);

        this.wallet.blockchainAddress_listunspent(this.keys.public, (e) => {
          console.log(e);
        })

        storage.get("CurrencySymbol").then(symbol => {
          if (symbol != null) {
            this.convertCurrencySymbol = symbol;
          }
          this.updateConvertPrice();
        })

        this.update_history();

      });
    })
  }

  public updateConvertPrice() {
    this.convertCurrency = null;
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("Access-Control-Allow-Origin", "*");
    let options = new RequestOptions({ headers: headers });
    var url = "";
    if (!document.URL.startsWith('file:///')) {
      url = "http://localhost:8100/convertPrice"
    } else {
      url = "https://api.coinmarketcap.com/v1/ticker/desire/";
    }

    url += "?convert=";


    this.http.get(url + this.convertCurrencySymbol, options).subscribe(data => {
      var result: any;
      result = data;
      result = JSON.parse(result._body)[0];
      this.convertCurrency = result["price_" + this.convertCurrencySymbol.toLowerCase()];
    })
  }

  public create_wallet = () => {

    if (!document.URL.startsWith('file:///')) {
      function rng() { return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }
      this.ecpair = desire.ECPair.makeRandom({
        network: this.network,
        rng: rng
      })
    } else {
      this.ecpair = desire.ECPair.makeRandom({
        network: this.network
      })
    }


    this.keys.private = this.ecpair.toWIF();
    this.keys.public = this.ecpair.getAddress();

    this.storage.set("privKey", this.keys.private);
    this.storage.set("pubKey", this.keys.public);

    console.log('Private Address: ' + this.keys.private)
    console.log('Public Address: ' + this.keys.public)
  }

  public make_transaction = (address, amount, fee, callback) => {
    var privKey = this.keys.private;

    var transaction = desire.ECPair.fromWIF(this.keys.private, this.network);
    var txb = new desire.TransactionBuilder(this.network);

    //tx_hash = "3f4008151d518a8cf3eb933540b90ec346a5c4ec0153dac405631b5412fa2109"
    //address = "DDFAzWxfUALtmfgh8oeCVcTDV3o24VdVgt"
    this.storage.get("listspended_temp").then((list) => {
      if (list == null) {
        list = [];
      }
      this.wallet.blockchainAddress_listunspent(this.keys.public, (e) => {
        console.log(e);
        if (e.result != null) {
          var unspents = e.result;
          var inputsList = [];
          var inputVolume = 0;
          var tx_size = 0;
          for (var i = 0; i < unspents.length; i++) {
            var unspent = unspents[i];
            if (list.indexOf(unspent.tx_hash) == -1) {
              console.log(unspent);
              if ((amount + fee) > inputVolume) {
                // if (!check(inputsList, unspent.tx_hash)) {
                inputsList.push(unspent);
                console.log("!");
                //}
                inputVolume += unspent.value;
              } else break;
            } else {
              console.log("Use other input because this input is reserved");
            }

          }

          if (amount + fee <= inputVolume) {
            var inputListsNumber = [];

            for (var i = 0; i < inputsList.length; i++) {
              txb.addInput(inputsList[i].tx_hash, inputsList[i].tx_pos);

              if (inputListsNumber.indexOf(inputsList[i].tx_pos) == -1) {
                inputListsNumber.push(inputsList[i].tx_pos);
              }
            }

            txb.addOutput(address, amount);
            txb.addOutput(this.keys.public, inputVolume - amount - fee);

            for (var i = 0; i < inputsList.length; i++) {
              txb.sign(i, transaction);
            }

            console.log(inputsList);
            var rawtx = txb.build().toHex();
            tx_size = rawtx.length * 0.5;
            callback({ success: 1, message: "", result: { rawtx: rawtx, size: tx_size, unspentList: inputsList } });
            return rawtx;
          } else {
            callback({ success: 0, message: "Not enough balance" });
          }

        }
      })
    });

    function check(arr, txhash) {
      var found = false;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].tx_hash == txhash) {
          found = true;
          break;
        }
      }

      return found;
    }


  }

  public send_transaction = (rawtx, amount, callback) => {
    this.wallet.blockchainTransaction_broadcast(rawtx, data => {
      console.log(data);
      this.openHistory(() => {
        this.addHistory("sent", amount, data.result, true);
        this.addHistory("received", 0, data.result, false);
        this.saveHistory();
        setTimeout(() => {
          this.update_history();
        }, 500);

      });
      callback(data.result);
    });
  }

  public update_balance = () => {
    this.wallet.blockchainAddress_getBalance(this.keys.public, data => {
      if (data.success) {
        this.balance = this.NumberToDesire(data.result.confirmed).toFixed(8);
        this.balance_unconfirmed = this.NumberToDesire(data.result.unconfirmed).toFixed(8);
      } else {
        console.error(data.message);
      }
    });
  }
  //"tx_hash":25d1b3b5c1b95846d7c0c0a025af6d22c8aee50fd0fd5c1701e98e3c2d21f1ef
  //"height": 35925
  //"transaction": 0100000001aadcb477c9e7edb64f073a309c0f393d7951fb419547dccdccf8cce73523f536000000006a473044022065dafbb8fc1937eab7caf7a95757aef70a0116055efd685a5f4013da12aacca802205e803986c9475c1443e4c0a482af8619d99571e84809f2a2fa2bdc9f731d34f8012103e7cd2f9bce75a604ac67d5cb86f0383778e064af39ed82863ddc0aae16d0eddefeffffff02be850100000000001976a9149a6b60f74a6bae176df05c3b0a118f85bab5c58588ac6043993b000000001976a91479e9413015766e9078e1f85cb9834063d044ff9d88ac548c0000

  historylist = [];
  public openHistory = (callback => {
    this.storage.get("history").then((history) => {
      this.historylist = (history == null ? [] : history);
      callback();
    });
  });

  public saveHistory = (() => {
    this.storage.set("history", this.historylist);
  });

  public addHistory = (type, value, txhash, showInHistory) => {
    if (this.historylist == null) {
      this.historylist = [];
    }
    this.historylist.push({
      type: type,
      value: this.NumberToDesire(value).toFixed(8),
      timestamp: Date.now(),
      txhash: txhash,
      show: showInHistory
    })

  }

  public update_history = () => {
    this.histories = [];
    let that = this;

    this.openHistory(() => {
      this.wallet.blockchainAddress_listunspent(this.keys.public, (e) => {
        if (e.result != null) {
          var unspents = e.result;
          var inputsList = [];
          var inputVolume = 0;
          var tx_size = 0;
          console.log(unspents);
          for (var j = 0; j < unspents.length; j++) {

            var isInHistory = false;
            for (var i = 0; i < that.historylist.length; i++) {
              if (that.historylist[i].txhash == unspents[j].tx_hash) {
                isInHistory = true;
                break;
              }
            }
            console.log(isInHistory + " | " + unspents[j].value);

            if (!isInHistory) {
              this.addHistory("received", unspents[j].value, unspents[j].tx_hash, true);
            }
          }
          this.saveHistory();
        };
        that.histories = that.historylist;
      });
    });



    /*
    this.wallet.blockchainAddress_getHistory(this.keys.public, data => {
      if (data.success) {
        var h = data.result;
        for (var i = 0; i < h.length; i++) {
          var transaction = h[i];
          that.wallet.blockchainTransaction_getInfo(transaction.tx_hash, (e) => {
            if (e.status == 1) {
              var inputs = e.data.vin;
              var outputs = e.data.vout;
              var timestamp = e.data.time;
              var confirmations = e.data.confirmations;

              var outputsBalance = 0;
              for (var i = 0; i < outputs.length; i++) {
                if (outputs[i].scriptPubKey.addresses[0] == that.keys.public) {
                  outputsBalance += outputs[i].valueSat;
                }
              }

              if (outputsBalance > 0) {
                that.histories.push({
                  value: that.NumberToDesire(outputsBalance).toFixed(8),
                  type: "received",
                  timestamp: timestamp * 1000,
                  confirmations: confirmations
                })
                //console.log(that.histories);
              } else {

                for (var i = 0; i < inputs.length; i++) {
                  that.wallet.blockchainTransaction_getInfo(inputs[i].txid, (e) => {

                    if (e.status == 1) {
                      // console.log(e.data.vout.length);
                      for (var i = 0; i < e.data.vout.length; i++) {
                        //console.log(JSON.stringify(e.data.vout[i]));
                        if (e.data.vout[i].scriptPubKey.addresses[0] == that.keys.public) {
                          outputsBalance += e.data.vout[i].valueSat;
                        }
                      }
                      if (outputsBalance > 0) {
                        that.histories.push({
                          value: that.NumberToDesire(-outputsBalance).toFixed(8),
                          type: "sent",
                          timestamp: timestamp * 1000,
                          confirmations: confirmations
                        })
                      }
                    }

                  });
                }

              }




            } else {
              console.log("Oops, error at blockchain: " + e.message);
            }

          });
          console.log(that.histories);
        }

      } else {
        console.error(data.message);
      }
    })
    */
  }

  public validAddress(address, callback) {
    this.wallet.blockchainAddress_validate(address, callback);
  }

  private NumberToDesire = (number) => {
    return number / 100000000;
  }


}