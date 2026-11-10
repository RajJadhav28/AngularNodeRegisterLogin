const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const requireAuth = (req, res, next)=>{
    const token= req.cookies.jwt;//jwt is stored in the cookies of the request object, so we can access it using req.cookies.jwt
                                 //check json web token exists & is verified
    if(token){
        jwt.verify(token, 'net ninja secret', (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}
// check current user
const checkUser= (req, res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'net ninja secret', async (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;// if the user is not available in the database, we can set the user object to null in the 
                //response locals and call next() to move on to the next middleware function
                next();
            }else{
                res.locals.user = decodedToken;// valid user logged in, so we can set the user object in the response locals to 
                //the decoded token, which contains the user's ID and other information
                let user= await User.findById(decodedToken.id);// we can use the decoded token to find the user in the database 
                //and set it in the response locals
                res.locals.user = user;// it is to check user logged in is available in the database or not, if not then we can set 
                //the user object to null
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}
module.exports={requireAuth, checkUser};