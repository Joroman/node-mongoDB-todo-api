const {SHA256} = require('crypto-js');

var message = 'I am user number 3';

var has = SHA256(message);

console.log(`Message ${message}`);
console.log(`Has256 is ${has}`);

//because this user _id is unique and certify how make the request
var data = {
    id: 4
};
//JSON.stringify transform the data javascript object to String
var token ={
    data,
    hash:SHA256(JSON.stringify(data)+ 'somesecret').toString()
}

//Now I try to figurate an atack like a MEN IN THE MIDDLE, 
//an verify that someone change the get data and dont trust
//I might try to change the token data id property to 5 and also create the hash
//the person on the middle, the person on the client trying to manipulate that data, they do not
//have acces to the same salt, he doesn't know the secret because the secret is only on the server.
//SO when try to rehash and update token out hash to a new value it's not going to march the hash that we
//create later.

token.data.id= 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();





//How to verify that the token is not manipulated I have to use the exact same salt 'somesrcret'
// call to string to get back the string value.
var resultHash= SHA256(JSON.stringify(token.data) + 'somesecret').toString();
 if (resultHash === token.hash){
    console.log('Data was not change');
 }else{
     console.log("Data was change don't trust");
 }