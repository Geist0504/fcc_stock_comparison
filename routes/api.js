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
      let stock_data = {stockData: []}
      let stock_requests = req.query.stock
      typeof(stock_requests) == 'string' ? stock_requests = [stock_requests.toUpperCase()] : stock_requests = stock_requests.map(function(x){ return x.toUpperCase() })
      let like = req.query.like
      let stock_results = await si.getStocksInfo(stock_requests)
    
     MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(db_collection)
        stock_requests.forEach((stock) =>{
          let stockObj = stock_results.find(obj => {return obj.symbol === stock})
          console.log(stock, like)
          collection.findOneAndUpdate({name: stock}, {name:stock,price:stockObj.regularMarketPrice, likes: {$exists: false}, {upsert:true, returnOriginal:false}, (err, data) =>{})
          if(like !== undefined){
            collection.findOneAndUpdate({name: stock}, {$inc:{likes:1}}, {upsert: true, returnOriginal:false}, (err, data) =>{
               stock_data.stockData.push(data.value)
              if(stock == stock_requests[stock_requests.length - 1]){ 
                res.json(stock_data)
              }
            }
          )}
          else {
             collection.findOne({name: stock}, (err, data) =>{
               stock_data.stockData.push(data)
               if(stock == stock_requests[stock_requests.length - 1]){ 
                res.json(stock_data)
                }
              })
            }
          
        })
      })
    });
    
};
