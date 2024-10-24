const { query } = require('express');
var mysql = require('mysql');
const db = require('./config.js');
function getDasboardData() {
    const queryString = `
    SELECT * from members as members;
    SELECT * from businesses as businesses;
    SELECT * from businesses as events;
    `;
    return new Promise((resolve, reject) => {
      db.query(queryString, function(error, result) {
        if(error) {
          console.log(error);
        } else {
          resolve(result);
        }
      })
    })
  }
  
  module.exports = {
    getDasboardData
  };