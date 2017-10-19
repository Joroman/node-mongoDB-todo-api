const jwt = require ('jsonwebtoken');

//two methods jwt.sign jwt.verify

var data = {
    id:10
}
//the token value is the value that get back to the users when they sign up or log in.
//it's also the value that store in tokens array. 
var token = jwt.sign(data,'123abc');

console.log(token);

var decoded=jwt.verify(token, '123abc');

console.log('decoded',decoded);