/*  
    Sep 30 2019   Initial
*/
var express = require('express');
var app = express();
app.get('/api', (req, res) => {
  res.json({message: 'Welcome to the Server Yves, check me'});
  console.log('/api served');
});
app.listen(8081, ()=>{
  console.log('API listening on port 8081');
});

