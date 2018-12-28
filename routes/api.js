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

let stock_data = {stockData: []}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let stock_requests = req.query.stock
      typeof(stock_requests) == 'string' ? stock_requests = [stock_requests.toUpperCase()] : stock_requests = stock_requests.map(function(x){ return x.toUpperCase() })
      let like = undefined
      console.log(like !== undefined)
      let test = await si.getStocksInfo(stock_requests)
    
    MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(db_collection)
        stock_requests.forEach((stock) =>{
          let stockObj = test.find(obj => {
            return obj.symbol === stock
          })
          console.log(stock_data)
          if(like !== undefined){
            collection.findOneAndUpdate({name: stock}, {$inc:{likes:1}}, {returnOriginal:false}, (err, data) =>{
              console.log(data.value)
              console.log(stock_data)
          })}
          else {
            collection.findOneAndUpdate({name: stock}, {name:stock,price:stockObj.regularMarketPrice}, {upsert:true, returnOriginal:false}, (err, data) =>{
              stock_data.stockData.append(data.value)
              console.log(data.value)
              console.log(stock_data)
              })
            }
          
        })
        res.json(stock_data)
      })
    });
    
};
