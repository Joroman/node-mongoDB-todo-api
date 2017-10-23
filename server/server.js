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
var {authenticate} = require('./middleware/authenticate');

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

//users
app.post('/users',(req, res)=>{
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);

    user.save().then(()=>{
        //chain promise
        return user.generateAuthToken();
        //res.send(user);
    }).then((token)=>{
        //header take to argumetns key value pairs
        //x-auth create a custom header for example in our application I'm using jwt
        res.header('x-auth', token).send(user);

    }).catch((e)=>res.status(400).send(e));   
});

//to add the middleware it only have to reference the function as a second argumetn of the route
app.get('/users/me',authenticate,(req, res)=>{
   res.send(req.user);
});

//POST /users/login pick up (email, possword)
app.post('/users/login',(req, res)=>{
    var body = _.pick(req.body, ['email','password']);
    
        User.findByCredentials(body.email, body.password).then((user)=>{
            return user.generateAuthToken().then((token)=>{
                res.header('x-auth',token).send(user);
            }); 
          
        }).catch((e)=>{res.status(400).send()});
     
});

app.delete('/users/me/token',authenticate,(req, res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });
});

app.listen(port,()=>{
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
