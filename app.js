const express = require('express');
const mongoose = require('mongoose');
const authRoutes= require('./routes/authRoutes');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Koti:Admin1234@cluster0.liqoqq9.mongodb.net/node-auth';
// mongoose.connect(dbURI)
//   .then((result) => app.listen(3000))
//   .catch((err) => console.log(err));
mongoose.connect(dbURI)
  .then((result) => {
    app.listen(3000);
    console.log('Connected to DB & server running on port 3000');
  })
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));

app.use(authRoutes);

app.get('/set-cookie',(req, res)=>{
  res.setHeader('Set-Cookie', 'newUser=true');
  res.send('you got the cookie');
});

app.get('/read-cookie',(req, res)=>{
  console.log(req.headers.cookie);
})