const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./mysql');
// const util = require('util');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(express.json());


app.post('/login', (req, res) => {
    const { address } = req.body;
  
    const selectQuery = 'SELECT * FROM users WHERE address = ?';
    const insertQuery = 'INSERT INTO users (`address`) VALUES (?)';
    const updateQuery = 'UPDATE users SET updated_at = NOW() WHERE address = ?';
  
    const selectPromise = new Promise((resolve, reject) => {
      connection.query(selectQuery, [address], (error, existingUser) => {
        if (error) {
          console.error(error);
          reject('Internal server error.');
        } else {
          resolve(existingUser);
        }
      });
    });
  
    selectPromise.then(existingUser => {
      if (existingUser.length === 0) {
        const insertPromise = new Promise((resolve, reject) => {
          connection.query(insertQuery, [address], (insertError) => {
            if (insertError) {
              console.error(insertError);
              reject('Internal server error.');
            } else {
              resolve('User created.');
            }
          });
        });
  
        return insertPromise;
      } else {
        const updatePromise = new Promise((resolve, reject) => {
          connection.query(updateQuery, [address], (updateError) => {
            if (updateError) {
              console.error(updateError);
              reject('Internal server error.');
            } else {
              resolve('User updated.');
            }
          });
        });
  
        return updatePromise;
      }
    }).then(message => {
      res.status(201).json({ message }); // Assuming 201 for user creation or 200 for update
    }).catch(errMessage => {
      res.status(500).json({ error: errMessage });
    });
  });

  app.listen(5000, () => {
    console.log(`Server started on port`);
  });
  