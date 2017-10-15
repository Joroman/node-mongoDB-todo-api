//external libraries
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser= require('body-parser');
//local libraries
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express() ;
const port = porcess.env.PORT || 3000;
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

app.get('/todos', (req, res)=>{
    Todo.find().then((docs)=>{
        res.send({docs});
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',(req, res)=>{

    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    Todo.findById(req.params.id)
        .then((todo)=>{
            if(!todo) res.status(404).send();
            
            res.send({todo});
        })
        .catch((e)=>{res.status(400).send()});
})

app.listen(port,()=>{
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
