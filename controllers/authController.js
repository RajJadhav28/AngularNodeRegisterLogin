const User=require('../models/Users');
const  jwt = require('jsonwebtoken');

// handle errors
const handleErrors=(err)=>{
    console.log(err.message, err.code);
    let errors={email:'', password:''};// initializing an object to store error messages for email and password fields

    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email='that email is not registered';
    }

    //incorrect password
    if(err.message === 'incorrect password'){
        errors.password='that password is incorrect';   
    }

    if(err.code===11000){
        errors.email='that email is already registered';
        return errors;
    }


    //validation errors
    // if(err.message.includes('user validation failed')){
     if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        });
    }
    return errors;
}


//creates a JWT token for the user with a specified expiration time
const maxAge=3*24*60*60;
const  createToken = (id)=>{
    return jwt.sign({id}, 'net ninja secret',{//'net ninja secret' is the secret key used to sign the token, which should be kept 
                                              //private and not shared with anyone
        expiresIn: maxAge
    });
}

module.exports.signup_get=(req, res)=>{
    res.render('signup');
}

// module.exports.signup_post= async (req, res)=>{
//     const { email, password }=req.body;
//     // console.log(email, password);
//     // res.send('new signup');
//     try{
//         const user= await User.create({ email, password});
//         res.status(201).json({ user: user._id });
//     }catch(err){
//     const errors=handleErrors(err);
//         res.status(400).json({ errors});
//     }
// }

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });// we get the user from the database 
        const token= createToken(user._id);// access the ID that we get from the user and create a token for that user
        console.log('token created:', token);   // new line
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}); // set the cookie with the token and expiration time
        res.status(201).json({ user: user._id });

        res   // <-- changed line
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_get=(req, res)=>{
    res.render('login');
}

module.exports.login_post= async (req, res)=>{
    const { email, password }=req.body;// desteructuring the email and password from the request body

    // User.login(email, password)// calling the login method from the User model to authenticate the user
    // console.log(email, password);// it is used to log the email and password to the console for debugging purposes.
    // res.send('user login');
    try{
        // const user= await User.login_get(email, password);// calling the login method from the User model to authenticate the user
        // const user = await User.login(email, password);
        // res.status(200).json({ user: user._id });// if the login is successful, it sends a response with a status code of 200 and the user's ID in JSON format
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        // res.status(200).json({ user: user._id });

        const user = await User.login(email, password);
        const token = createToken(user._id);   // declares token
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });   // only ONE response
  
    }catch(err){
        // res.status(400).json({ err: 'error logging in' });
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt','',{maxAge:1});// set the cookie to an empty string and set the maxAge to 1 millisecond, effectively 
                                    // deleting the cookie
    res.redirect('/');// redirect the user to the home page after logging out
}