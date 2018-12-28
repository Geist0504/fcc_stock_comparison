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
        function resolve(response, stock_data){
          if(stock_data.stockData.length === 1){
            response.json(stock_data)
          }
          else{
            stock_data.stockData[0].rel_likes = stock_data.stockData[0].likes - stock_data.stockData[1].likes
            stock_data.stockData[1].rel_likes = 0 - stock_data.stockData[0].rel_likes
            delete stock_data.stockData[0].likes
            delete stock_data.stockData[1].likes
            response.json(stock_data)
          }
        }
        
        stock_requests.forEach((stock) =>{
          let stockObj = stock_results.find(obj => {return obj.symbol === stock})
          collection.findOneAndUpdate({name: stock}, {$setOnInsert: {name:stock,likes: 0}, $set: {price:stockObj.regularMarketPrice}}, {upsert:true, returnOriginal:false}, (err, data) =>{})
          if(like !== undefined){
            collection.findOneAndUpdate({name: stock}, {$inc:{likes:1}}, {upsert: true, returnOriginal:false}, (err, data) =>{
               stock_data.stockData.push(data.value)
              if(stock == stock_requests[stock_requests.length - 1]){ 
                resolve(res, stock_data)
              }
            }
          )}
          else {
             collection.findOne({name: stock}, (err, data) =>{
               stock_data.stockData.push(data)
               if(stock == stock_requests[stock_requests.length - 1]){ 
                 resolve(res, stock_data)
                }
              })
            }
          
        })
      })
    });
    
};
