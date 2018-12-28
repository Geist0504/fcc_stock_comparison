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
      typeof(stock_requests) == 'string' ? stock_requests = [stock_requests.toUpperCase()] : stock_requests = stock_requests.map(function(x){ return x.toUpperCase() })
      let like = req.query.like
      console.log(like !== undefined)
      let stock_results = await si.getStocksInfo(stock_requests)
      let stock_data = await Mongo()
        function Mongo(){
          return new Promise((resolve, reject) => {
            let stock_data = {stockData: []}
            MongoClient.connect(CONNECTION_STRING, function(err, db) {
            let collection = db.collection(db_collection)
            stock_requests.forEach((stock) =>{
              let stockObj = stock_results.find(obj => {return obj.symbol === stock})
              console.log(stock, like)
              collection.findOneAndUpdate({name: stock}, {name:stock,price:stockObj.regularMarketPrice, likes:0}, {upsert:true, returnOriginal:false}, (err, data) =>{})
              if(like !== undefined){
                console.log('triggered')
                collection.findOneAndUpdate({name: stock}, {$inc:{likes:1}}, {returnOriginal:false}, async (err, data) =>{
                   console.log(data.value)
                   await stock_data.stockData.push(data.value)
                }
              )}
              else {
                 collection.findOne({name: stock}, async (err, data) =>{
                   console.log(stock_data)
                   await stock_data.stockData.push(data)
                   console.log(stock_data)
                  })
                }
              })
            })
          resolve(stock_data)
        })
        }
      
    console.log(stock_data)
    res.json(stock_data)
    console.log('sent')
    });
    
};
