const User=require('../models/Users');
const  jwt = require('jsonwebtoken');

// handle errors
const handleErrors=(err)=>{
    console.log(err.message, err.code);
    let errors={email:'', password:''};// initializing an object to store error messages for email and password fields


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
    return jwt.sign({id}, 'net ninja secret',{
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

module.exports.login_post=(req, res)=>{
    const { email, password }=req.body;// desteructuring the email and password from the request body
    console.log(email, password);// it is used to log the email and password to the console for debugging purposes.
    res.send('user login');
}