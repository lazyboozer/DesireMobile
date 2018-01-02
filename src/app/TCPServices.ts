import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as util from "../app/util.js";

/*
  Generated class for the TCPServices provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var window: any;
declare var chrome: any;
@Injectable()

export class TCPServices {


  constructor(public http: Http) {
    console.log('Hello TCPServices Provider');
    chrome.sockets.tcp.onReceiveError.addListener(this.receiveErrorListener);
    chrome.sockets.tcp.onReceive.addListener(this.receiveListener);
  }



  str2arrayBuffer(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }


  receiveErrorListener(info) {
    console.log('Client RecvError on socket: ' + info.socketId);
    console.log(info);
  }

  receiveListener(info) {
    function arrayBuffer2str(buf) {
      var str = '';
      var ui8 = new Uint8Array(buf);
      for (var i = 0; i < ui8.length; i++) {
        str = str + String.fromCharCode(ui8[i]);
      }
      return str;
    }

    var buffer = '';
    var recursiveParser;

    console.log('Client Recv: success');
    console.log(info);
    if (info.data) {
      var message = String.fromCharCode.apply(null, new Uint8Array(info.data));

      console.log("received: " + message);
      console.log("received 2: " + arrayBuffer2str(message))
      console.log("JSON:" + JSON.stringify(message));
      console.log("JSON pure: " + JSON.stringify(info.data));
    }
  }

  connectSecureAndSend() {
    var hostname = '35.185.122.226';
    var port = 50002;

    var data = this.makeRequest("server.version", ["2.7.11", "1.0"], 0);

    var message = this.str2arrayBuffer(data);
    console.log("Message: " + message.toString());
    chrome.sockets.tcp.create(function (createInfo) {
      // Set paused to true to prevent read consume TLS handshake data, native
      // readling loop will not pause/abort pending read when set paused after a
      // connection has established.
      var socketID = createInfo.socketId;


      chrome.sockets.tcp.setPaused(socketID, true, function () {
        chrome.sockets.tcp.connect(socketID, hostname, port, function (result) {
          if (result === 0) {
            chrome.sockets.tcp.setPaused(socketID, false, function () {
              chrome.sockets.tcp.secure(createInfo.socketId, { tlsVersion: { min: 'ssl3', max: 'tls1.2' } }, function (result) {
                chrome.sockets.tcp.setPaused(socketID, false, function () {
                  // Test secure send multiple times to ensure that buffer in Android is manipulated correctly.
                  chrome.sockets.tcp.send(socketID, message, function (result) {
                    console.log('connectSecureAndSend: success ' + JSON.stringify(result));
                  });
                });
              });
            });
          }
        });
      });

    });
  }


  makeRequest = (method, params, id) => {
    return JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: id,
    })
  }





}