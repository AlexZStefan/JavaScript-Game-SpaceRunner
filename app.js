const express = require('express')
const app = express()
// port dynamically assigned by the hosting env so env variable is used
// it`s part of env in which a process runs
const port = process.env.PORT || 3000

let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cmp5360"
});

con.connect((err) =>{
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM user", (err, result, fields)=> {
    if (err) throw err;
    console.log(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

let bodyParser = require('body-parser');

// can replace the app. use by calling this f in the app.post("/", urlencodedParser()
let urlencodedParser = bodyParser.urlencoded({extended:true});

app.use(bodyParser.urlencoded({
   extended: false
}));

var session = require('express-session');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json());

app.post('/', (request, response)=> {
	let username = request.body.username;
	let password = request.body.password;

	if (username  && password) {
     // check database table for existing username
		con.query(`SELECT * FROM user WHERE name = "${username}" AND password = "${password}" `,  function(error, results, fields) {
       
      if ((results.length > 0) ) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/game');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/signUp', (request, response)=> {
	let username = request.body.username;
	let password = request.body.password;

	if (username  && password) {
    // check database table for existing username
		con.query(`SELECT * FROM user WHERE name = "${username}" AND password = "${password}" `,  function(error, results, fields) {
      
      // if results is 0 then insert data into database table
      if ((results.length <= 0) ) {
				request.session.registered = true;
				request.session.username = username;
        // insert data into database table
        con.query(`INSERT INTO user (name, password) VALUES ("${username}", "${password}")`);

				response.redirect('/');
			} else {
				response.send('User already exists, try again');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.use(express.static("static"));

app.get("/", (req, res)=>{
  //res.status(404).sendFile(__dirname + "/public/signUp.html");
  res.sendFile(__dirname + "./index.html")
});

app.get("/game", (req, res)=>{
  res.sendFile(__dirname + "/static/game.html")
});

app.get("/signUp", (req, res)=>{
  //res.status(404).sendFile(__dirname + "/public/signUp.html");
  res.sendFile(__dirname + "/static/signUp.html")
});

app.get("*", (req, res)=>{
  res.status(404).sendFile(__dirname + "/404.html")
});