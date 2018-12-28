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
      console.log(stock_requests, typeof(stock_requests))
      typeof(stock_requests) == 'string' ? stock_requests = stock_requests.map(function(x){ return x.toUpperCase() })
      let like = req.query.like
      console.log(stock_requests)
      let test = await si.getStocksInfo(stocks)
      res.send('working')
    
    MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(db_collection)
        stocks.forEach((stock) =>{
          let stockObj = test.find(obj => {
            return obj.symbol === stock
          })
          collection.findOneAndUpdate({name: stock}, {name:stock,price:stockObj.regularMarketPrice}, {upsert:true, returnOriginal:false}, (err, data) =>{
            console.log(data.value)
          })
        })
      })
    });
    
};
