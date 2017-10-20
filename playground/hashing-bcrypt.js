const bcrypt = require('bcryptjs');

var password = '123abc';

//generate salut 10 is the rounds biger is the number biger is the salt and more robuts is the hasing
bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(password,salt, (err, hash)=>{
        //this hash value is the value to store in the database not the password.
        console.log('HASH:', hash);
    });
});

hashpassword='$2a$10$ISkqbjU8iADZ4PODP7Nb9OHL7.opH5zHpv7fk8aTxddoZSaMkeZpW';
//COMPARING THE PASSWORD TO THE HASHING STORE VALUE ON DATABASE IN ORDER OT KNOW IF THE SIGN IN IS CORRECT
bcrypt.compare(password, hashpassword,(err, res)=>{
    console.log(res);
});