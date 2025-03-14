// Get the client
import mysql from "mysql2/promise";

// Create the connection to database
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
});

// A simple SELECT query
// try {
//   const [results, fields] = await connection.query(
//     'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45'
//   );

//   console.log(results); // results contains rows returned by server
//   console.log(fields); // fields contains extra meta data about results, if available
// } catch (err) {
//   console.log(err);
// }

// Using placeholders

try {
  const [results] = await connection.query("DROP DATABASE IF EXISTS test");

  console.log(results);

  connection.end(() => {
    console.log("Connection closed.");
  });
} catch (err) {
  console.log(err);

  connection.end(() => {
    console.log("Connection closed.");
  });
}
