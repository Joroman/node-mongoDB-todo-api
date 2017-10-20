//relative path
const {User} = require('./../models/user');
//define a middleware function

var authenticate = (req, res, next)=>{
    var token = req.header('x-auth');
    
        User.findByToken(token).then((user)=>{
            if(!user) {
                //to not ducplicate use retunr Promise.reject() in order to 
                //go to the catch(err)=>{res.satuts.(401).send();}
                return Promise.reject();
            } 
            req.user=user;
            req.token = token;
            next();
        }).catch((err)=>{
            res.status(401).send();
        })
}
//module.exports = {authenticate = authenticate}
module.exports = {authenticate};
