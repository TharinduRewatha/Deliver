const express = require('express')
const app = express()
const cors = require('cors')
const port = 3003
const mysql = require('mysql2');

app.use(cors())
let corsOptions = {    origin: ["http://localhost:3306"]}
// Server configuration
app.use(express.urlencoded({limit: "1mb", extended: true}));
app.use(express.json({limit: "1mb"}));
app.use(cors(corsOptions)); 

const connection = mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password  :'19990920',
  database : 'distributed',
  port : 3306
});


async function wait() {
    await connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
 }

app.get('/alljoketypes', (req, res) => {
  connection.query("SELECT * FROM joketypes", function(error, results){
    //console.log("query response is ", results);
    res.json(results);
  })

})

app.get('/alljokes', (req, res) => {
    connection.query("SELECT * FROM jokes", function(error, results){
      //console.log("query response is ", results);
      res.json(results);
    })
  
  })

  app.get('/randomjokes', (req, res) => {
  connection.query('SELECT * FROM jokes ORDER BY RAND() LIMIT 1', function (error, results, fields) {
    if (error) throw error;
   // console.log('Randomized value:', results[0].joke);
    res.json(results[0].joke)
  });
})

// function getRandomJokeByType(jokeType) {
//   return new Promise((resolve, reject) => {
//     // create MySQL query to select a random joke of a specific type
//     const query = `SELECT joke FROM jokes WHERE joketype = ? ORDER BY RAND() LIMIT 1`;

//     // execute MySQL query with the selected joke type as a parameter
//     pool.query(query, [jokeType], (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results[0].joke_text);
//       }
//     });
//   });
// }

// // retrieve a random joke of the user-selected type from the req.parameter
// const jokeType = req.parameter.jokeType;
// getRandomJokeByType(jokeType)
//   .then(jokeText => {
//     // do something with the retrieved joke text
//   })
//   .catch(err => {
//     // handle error
//   });


app.get('/getalltypes', (req, res) => {
connection.query('SELECT type FROM joketypes', function (error, results, fields) {
  if (error) throw error;
  //console.log('Ids:', results);
  res.json(results)
});
})
  

//   app.post('/data', function(req, res){
//     var type =req.body.type
//     var jokeid = req.body.jokeid;
//     var name = req.body.name;
//     var joke = req.body.joke;
//     moderated = true;
//     _active = true;

//     connection.query("INSERT INTO jokes (type, jokeid, name,joke,moderated,_active) VALUES ("+type+"','"+jokeid+"','"+name+"','"+joke+"','"+moderated+"','"+_active+"')", function(err, result){
//         if(err) throw err;
//             console.log("1 record inserted");
//         });
//     res.send(username);
// });

app.post('/data' , async(req, res) => {
  let sql = 'INSERT INTO jokes SET ?'
  let post = {
      type: req.body.type,
      name: req.body.name,
      joke: req.body.joke,
      moderated:1,
      _active:1
  }
  const con = await connection.promise().query(sql, post, (err, res) => {
      if(err) throw err;
      console.log(err);
      console.log('1 record inserted');
      console.log(res);
      
  });
  console.log(con);
  res.send(con)
});

 
//'"+type+"','"+jokeid+"','"+name+"','"+joke+"','"+moderated+"','"+_active+"'
  // con.connect(function(err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  //   var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  //   con.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("1 record inserted");
  //   });
  // });

  // con.connect(function(err) {
  //   if (err) throw err;
  //   con.query("SELECT name, address FROM customers", function (err, result, fields) {
  //     if (err) throw err;
  //     console.log(result);
  //   });
  // });

app.listen(port, () => {
  console.log(`Example app listening at deliverjokes.centralindia.cloudapp.azure.com`)
wait();
})
