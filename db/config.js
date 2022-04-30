const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mui_backend",
});

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("MySQL is Connected.");
// });

module.exports = db;
