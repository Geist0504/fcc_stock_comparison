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
const si = require('stock-info');
const stocks = ['AMZN', 'NFLIX'];


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const db_collection = 'stocks'

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let test = await si.getStocksInfo(stocks)
      console.log(test[0].regularMarketPrice)
      res.send('working')
    
    MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(db_collection)
        //collection.find(searchQuery).toArray(function(err,docs){res.json(docs)});
      })
    });
    
};
