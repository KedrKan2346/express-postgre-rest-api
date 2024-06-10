function run() {
  console.log('Executed index file:');
  console.log(
    `db name: [${process.env.DB_NAME}]; db user: [${process.env.DB_USER_NAME}]; db name: [${process.env.DB_USER_PASSWORD}];`
  );
}

run();

console.log(`starting on port: [${process.env.API_SERVER_PORT}]`);

// TODO: Validate parameters and throw error

const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(process.env.API_SERVER_PORT);

console.log(`server started on port: [${process.env.API_SERVER_PORT}]`);
