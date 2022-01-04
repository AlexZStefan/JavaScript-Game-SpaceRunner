import express from 'express';
import session from 'express-session';
import mysql from 'mysql';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

//we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//now please load my static html and css files for my express app, from my /dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// port dynamically assigned by the hosting env so env variable is used
// it`s part of env in which a process runs
const port = process.env.PORT || 3000

let con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "cmp5360"
});

con.connect((err) => {
	if (err) throw err;
	console.log("Connected!");
	con.query("SELECT * FROM user", (err, result, fields) => {
		if (err) throw err;
		console.log(result);
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

let highscore;
app.post('/', (request, response) => {
	let username = request.body.username;
	let password = request.body.password;

	if (username && password) {
		// check database table for existing username
		con.query(`SELECT * FROM user WHERE name = "${username}" AND password = "${password}" `, (error, results, fields) => {

			if ((results.length > 0)) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.ID = results[0]["ID"];
				highscore = results[0]["score"];

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

app.post('/signUp', (request, response) => {
	let username = request.body.username;
	let password = request.body.password;

	if (username && password) {
		// check database table for existing username
		con.query(`SELECT * FROM user WHERE name = "${username}" AND password = "${password}" `, (error, results, fields) => {

			// if results is 0 then insert data into database table
			if ((results.length <= 0)) {
				request.session.registered = true;
				request.session.username = username;

				// insert data into database table
				con.query(`INSERT INTO user (name, password, score) VALUES ("${username}", "${password}", "0")`);

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

app.get("/", (req, res) => {
	res.sendFile(__dirname + "./index.html")
});

app.get("/game", (req, res) => {
	res.sendFile(__dirname + "/static/game.html");
});

app.get("/gamescore", (req, res) => {
	res.json(highscore);
});

// save highscore into database 
app.patch("/game", async (req, resp) => {
	const data = await req.body;
	con.query(`
	  UPDATE user SET score = "${data.score}" WHERE ID ="${req.session.ID}"`);
	//   const gotData = data.categoryChoice;
	//   console.log(data.score);
	//   console.log(req.session.ID);
})

app.get("/signUp", (req, res) => {
	//res.status(404).sendFile(__dirname + "/public/signUp.html");
	res.sendFile(__dirname + "/static/signUp.html")
});

app.get("/aboutUs", (req, res) => {
	//res.status(404).sendFile(__dirname + "/public/signUp.html");
	res.sendFile(__dirname + "/static/aboutUs.html")
});

app.get("*", (req, res) => {
	res.status(404).sendFile(__dirname + "/404.html")
});
