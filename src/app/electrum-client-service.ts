import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { stringify } from '@angular/compiler/src/util';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

@Injectable()
export class ElectrumClientService {
  public host = {
    index: -1,
    list: [
      "http://35.185.122.226:50003",
      "http://35.196.94.57:50003"
    ]
  };

  public timeoutTime = 5000;


  constructor(public http: Http) {
    if (this.host.index == -1) {
      this.host.index = Math.floor((Math.random() * this.host.list.length));
    }
  }

  request = (method, params, callback, index = -1) => {
    var data = {
      method: method,
      params: params
    }

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("Access-Control-Allow-Origin", "*");
    let options = new RequestOptions({ headers: headers });

    if (index == -1) {
      index = this.host.index;
    }
    console.log(index);

    var retry = () => {
      index = (index + 1) % this.host.list.length;
      console.error("Server error, gonna try new index: " + index);
      this.request(method, params, callback, index);
    }

    this.http.post(this.host.list[index], data, options)
      .timeout(this.timeoutTime)
      .subscribe(data => {
        console.log("DATA: " + data);
        this.host.index = index;
        var result: any;
        result = data;

        callback(JSON.parse(result._body));
      }, error => {
        retry();
      })

  }

  requestBlockchain = (method, data, callback) => {
    var url = "";
    if (!document.URL.startsWith('file:///')) {
      url = "http://localhost:8100/blockchain"
    } else {
      url = "http://desire.thecryptochat.net/api_fetch.php";
    }


    var methodUri = "?method=" + method;
    var params = "";
    if (data != null) {
      for (var key in data) {
        params += "&" + key + "=" + data[key];
      }
    }

    url = url + methodUri + params;

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("Access-Control-Allow-Origin", "*");
    let options = new RequestOptions({ headers: headers });

    this.http.get(url, options).subscribe(data => {
      var result: any;
      result = data;
      callback(JSON.parse(result._body));
    })
  }

  server_version(client_name, protocol_version, callback) {
    return this.request('server.version', [client_name, protocol_version], callback)
  }
  server_banner(callback) {
    return this.request('server.banner', [], callback)
  }
  serverDonation_address(callback) {
    return this.request('server.donation_address', [], callback)
  }
  serverPeers_subscribe(callback) {
    return this.request('server.peers.subscribe', [], callback)
  }
  blockchainAddress_getBalance(address, callback) {
    return this.request('blockchain.address.get_balance', [address], callback)
  }
  blockchainAddress_getHistory(address, callback) {
    return this.request('blockchain.address.get_history', [address], callback)
  }
  blockchainAddress_getMempool(address, callback) {
    return this.request('blockchain.address.get_mempool', [address], callback)
  }
  blockchainAddress_getProof(address, callback) {
    return this.request('blockchain.address.get_proof', [address], callback)
  }
  blockchainAddress_listunspent(address, callback) {
    return this.request('blockchain.address.listunspent', [address], callback)
  }
  blockchainBlock_getHeader(height, callback) {
    return this.request('blockchain.block.get_header', [height], callback)
  }
  blockchainBlock_getChunk(index, callback) {
    return this.request('blockchain.block.get_chunk', [index], callback)
  }
  blockchainEstimatefee(number, callback) {
    return this.request('blockchain.estimatefee', [number], callback)
  }
  blockchainHeaders_subscribe(callback) {
    return this.request('blockchain.headers.subscribe', [], callback)
  }
  blockchainNumblocks_subscribe(callback) {
    return this.request('blockchain.numblocks.subscribe', [], callback)
  }
  blockchain_relayfee(callback) {
    return this.request('blockchain.relayfee', [], callback)
  }
  blockchainTransaction_broadcast(rawtx, callback) {
    return this.request('blockchain.transaction.broadcast', [rawtx], callback)
  }
  blockchainTransaction_get(tx_hash, height, callback) {
    return this.request('blockchain.transaction.get', [tx_hash, height], callback)
  }
  blockchainTransaction_getMerkle(tx_hash, height, callback) {
    return this.request('blockchain.transaction.get_merkle', [tx_hash, height], callback)
  }
  blockchainUtxo_getAddress(tx_hash, index, callback) {
    return this.request('blockchain.utxo.get_address', [tx_hash, index], callback)
  }
  blockchainTransaction_getInfo(tx_hash, callback) {
    return this.requestBlockchain("gettransaction", { txid: tx_hash }, callback);
  }
  blockchainAddress_validate(address, callback) {
    return this.requestBlockchain("isaddress", { address: address }, callback);
  }
}