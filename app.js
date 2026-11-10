const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');   // declared once, here

const app = express();

// middleware (runs on every request, in this order)
app.use(express.static('public'));
app.use(express.json());   // parses JSON body into req.body
app.use(cookieParser());   // parses cookies into req.cookies

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Koti:Admin1234@cluster0.liqoqq9.mongodb.net/node-auth';
mongoose.connect(dbURI)
  .then((result) => {
    app.listen(3000);
    console.log('Connected to DB & server running on port 3000');
  })
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.get('/welcome', (req, res) => res.render('welcome'));   // <-- new
app.use(authRoutes);

// // cookies (test routes)
// app.get('/set-cookie', (req, res) => {
//   res.cookie('newUser', false);
//   res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
//   res.send('you got the cookie');
// });

// app.get('/read-cookie', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);
//   res.json(cookies);
// });