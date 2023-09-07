const mysql = require('mysql2/promise');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

async function  connectionstablish () {
  const connection = await mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crypto'
  });
  return connection;

}



app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));


app.post('/login', async (req, res) => {
  try {
    const connection = await connectionstablish();
    // const connection = await mysql.createConnection(dbConfig);
   
    const { address } = req.body;
    const [existingUser] = await connection.query('SELECT * FROM users WHERE address = ?', [address]);

    if (existingUser.length === 0) {
      await connection.query('INSERT INTO users (`address`) VALUE (?)', [address]);
      res.status(201).json({ message: 'User created.' });
    } else {
      await  connection.query('UPDATE users SET updated_at = NOW() WHERE address = ?', [address]);
      res.status(200).json({ message: 'User updated.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
// moment.tz.setDefault('Asia/Kolkata');