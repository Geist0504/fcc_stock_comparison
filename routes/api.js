/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
let fetch = require('node-fetch')
import looku from 'yahoo-stocks';
//let yahoo        = require('yahoo-stocks');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const db_collection = 'stocks'

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
    let test = await fetch('https://finance.google.com/finance/info?q=NASDAQ%3aGOOG')
    lookup('APPL').then(responese => {
      console.log(responese)
    })
    console.log(test)
      res.send('working')
    
    MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(db_collection)
        //collection.find(searchQuery).toArray(function(err,docs){res.json(docs)});
      })
    });
    
};
