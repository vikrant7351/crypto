const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fs = require('fs');
// const moment = require('moment-timezone');
const web3 = require('web3');
const bodyParser = require('body-parser');
const multer = require('multer');


const app = express();
app.use(express.json());
app.set('views', path.join(__dirname,'views'))
// app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'views')); // Upload images to the views folder
  },
  filename: function (req, file, cb) {
    cb(null, 'image.png'); // Set the filename as "image.png"
  },
});

const upload = multer({ storage: storage });

const mongourl = 'mongodb://127.0.0.1/userdata';

const connect = async () => {
  try {
    await mongoose.connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    // const user = mongoose.connection;

    console.log('connection connect sucessfully');
  } catch (error) {
    console.log('error connection', error.message);

  }
}

connect();

// module.exports = connect;

let today = new Date('2023-08-22T06:32:53.619+00:00');
let indianTime = today.toLocaleString("en-US", "Asia/Delhi");
console.log(today);
console.log(indianTime);

// Define a schema for the user model
const userSchema = new mongoose.Schema({
  address:String,
 


  // createdAt:{type:Date, default:Date.now},
  // updatedAt:{type:Date },

}, { timestamps: true });



userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model('User', userSchema);


app.get('/', async (req,res)=>{
  res.render('index');

});

app.post('/login', upload.single('image'), async (req, res) => {
  try {
    const { address } = req.body;
    
    const existingUser = await User.findOne({ address });

    if (!existingUser) {
      await User.create({ address });
      res.status(201).json({ message: 'User created.' });
    } else {

      await existingUser.save();

      res.status(200).json({ message: 'User updated.' });
    }

  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  } 
  });


app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.render('users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.listen(4000, () => {
  console.log(`Server is listening on port ${4000}`);
});



