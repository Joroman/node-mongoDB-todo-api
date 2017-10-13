//external libraries
const express = require('express');
const bodyParser= require('body-parser');
//local libraries
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express() ;
//configure the middleware
app.use(bodyParser.json());

//creating a new todos
app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.listen(3000,()=>{
    console.log("Server start on port 3000");
});

module.exports = {app};
