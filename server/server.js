//configuration server env variables file
require('./config/config');

//external libraries
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser= require('body-parser');
//local libraries
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express() ;
const port = process.env.PORT || 3000;
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
});

app.delete('/todos/:id',(req, res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    
        Todo.findByIdAndRemove(id).then((todo)=>{
           if(!todo) return res.status(404).send();
           //res.send({todo:todo}) with ES6 javascript I can make {todo}
            res.send({todo});
        }).catch((err)=>{
            res.status(404).send();
        });
})

app.patch('/todos/:id',(req, res)=>{
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);

    if(!ObjectID.isValid(id)) return res.status(404).send();

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt= new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true})
    .then((todo)=>{
        if(!todo){
            res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>res.status(400).send());
});

app.listen(port,()=>{
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
