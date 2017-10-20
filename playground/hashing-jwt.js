const jwt = require ('jsonwebtoken');

//two methods jwt.sign jwt.verify

var data = {
    id:10
}
//the token value is the value that get back to the users when they sign up or log in.
//it's also the value that store in tokens array. 
var token = jwt.sign(data,'123abc');

console.log(token);   /**
    User.create(user)
    .then((user)=>{
        res.send(user);
    })
    .catch((e)=>res.status(400).send())
     */
    
    /**var user = new User({
        email:req.body.email,
        password:req.body.password
    });

    user.save().then((user)=>{
        res.send(user);
    }).catch((e)=> res.status(400).send())**/

var decoded=jwt.verify(token, '123abc');

console.log('decoded',decoded);