/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


 var originalConsoleLog = console.log.bind(console);
 console.log = function (str) {
   originalConsoleLog(str);
   display.innerHTML += str + '\n';
 };

var app = {
    // Application Constructor




    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        app.receivedEvent('deviceready');

        function copyDatabaseFile(dbName) {

          var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
          var targetDirName = cordova.file.dataDirectory;

          return Promise.all([
            new Promise(function (resolve, reject) {
              resolveLocalFileSystemURL(sourceFileName, resolve, reject);
            }),
            new Promise(function (resolve, reject) {
              resolveLocalFileSystemURL(targetDirName, resolve, reject);
            })
          ]).then(function (files) {
            var sourceFile = files[0];
            var targetDir = files[1];
            return new Promise(function (resolve, reject) {
              targetDir.getFile(dbName, {}, resolve, reject);
            }).then(function () {
              console.log("file already copied");
            }).catch(function () {
              console.log("file doesn't exist, copying it");
              return new Promise(function (resolve, reject) {
                sourceFile.copyTo(targetDir, dbName, resolve, reject);
              }).then(function () {
                console.log("database file copied");
              });
            });
          });
        }

        function notifikacija(){
          cordova.plugins.notification.local.schedule({
            id         : 46,
            title      : window.localStorage.getItem("autor"),
            text       : window.localStorage.getItem("citat"),
            sound      : null,
            every      :"minute",
            icon		   : "file://foglogo.png",
            smallicon	 : "file://foglogo.png",
            autoClear  : false,
            at         : new Date(new Date().getTime())

          });
        }

        copyDatabaseFile('citati.db').then(function () {
          // success! :)
          var db = sqlitePlugin.openDatabase('citati.db');
          db.readTransaction(function (txn) {
            txn.executeSql("SELECT * FROM citati where kategorija='Success' ORDER BY RANDOM() LIMIT 1", [], function (tx, res) {
              console.log('Successfully read from pre-populated DB:');
              //console.log(JSON.stringify(res.rows.item(0)));
              window.localStorage.setItem("citat", res.rows.item(0).citat);
              window.localStorage.setItem("autor", res.rows.item(0).autor);
              console.log("Citat: " + window.localStorage.getItem("citat"));
              console.log("Autor: " + window.localStorage.getItem("autor"));
              console.log("----------------------------------------");
            });
          });
        }).catch(function (err) {
          // error! :(
          console.log(err);
        });

        notifikacija();

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
