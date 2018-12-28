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
      let stock_requests = req.query.stock
      let test = await si.getStocksInfo(stocks)
      res.send('working')
    
    MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(db_collection)
        collection.findOneAndUpdate({name: 'AMZN'}, {name:'AMZN',price:test[0].regularMarketPrice}, {upsert:true}, (err, data) =>{
          console.log(err, data.value)
        })
      })
    });
    
};
