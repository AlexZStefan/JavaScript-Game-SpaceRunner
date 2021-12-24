import {con} from "/app.js"

let saveHighscore= (player) =>{

    if(player.score > player.highscore){
        let sql = `INSERT INTO users (highscore) VALUES (${player.score})`;

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
    }
}

let getHighscore = (player) => {

    
con.connect((err) => {
    if (err) throw err;
    con.query("SELECT highscore FROM users",  (err, result, fields) => {
      if (err) throw err;
      console.log(result);
    });
  });
}

export {saveHighscore, getHighscore}