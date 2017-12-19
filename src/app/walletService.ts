import * as walletGenerator from "bitcoinjs-lib";
import * as desire from "bitcoin-core";
import { Injectable } from "@angular/core";

@Injectable()

export class walletService {
  public wallet = {
    private: "",
    public: ""
  }

  public balance = null;
  public transaction = null;
  private client = null;
  public confirmation = 0;

  constructor() {

  }

  loadContent = (firstInit) => {
    if (firstInit) {
      this.client = new desire({
        headers: true,
        host: '35.185.122.226',
        port: 9998,
        username: 'XWKjwnPFTaVrvbxXafbzrRU2fAngJJuy',
        password: 'mPAxvHLEkFvqGvqgC8SpyjPwKyPwbjwn',
        timeout: 30000
      });
    }

    this.client.getBalance(this.wallet.public, this.confirmation).then((balance) => {
      this.balance = balance[0];
      console.log(balance);
    });

    this.client.command("listtransactions", this.wallet.public)
  }

  createWallet = () => {
    var key = walletGenerator.ECPair.makeRandom({
      network: walletGenerator.networks.desire
    })

    this.wallet.private = key.toWIF();
    this.wallet.public = key.getAddress();

    this.wallet.public = "DGCVQCEN3Xsa9s9rAcrTcGyyPoRt6vRvcS";
  }


}