const express = require('express');
// postgress database 
const { Client } = require('pg');

var fs = require('fs');

const app = express();

app.listen(3000, () => {
  console.log('server started');
});

const client = new Client({
  user: 'postgres',
  host: '86.3.6.249',
  database: 'postgre',
  password: 'asd123',
  port: 5432  
})

/*
client.connect((err)=> {
  if (err) throw err;
  console.log("Connected!");
});


app.listen(5432, () => {
  console.log('server started');
});

*/


// can be any name of folder "static"
app.use(express.static("static"));


app.get("/", (req, res)=>{
  //res.status(404).sendFile(__dirname + "/public/signUp.html");
  res.sendFile(__dirname + "/index.html");
});

app.get("/game", (req, res)=>{
  res.sendFile(__dirname + "/game.html");
});

app.get("/signUp", (req, res)=>{
  //res.status(404).sendFile(__dirname + "/public/signUp.html");
  res.sendFile(__dirname + "/signUp.html");
});

app.get("*", (req, res)=>{
  res.status(404).sendFile(__dirname + "/404.html");
});


