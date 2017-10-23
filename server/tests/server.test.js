const expect = require('expect');
const request = require('supertest');
const {ObjectID} =require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST / todos',()=>{
    it('should create a new todo', (done)=>{
        var text = 'Test todo text';

        //use supertest in order to test the /todos api that handler the request
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
                expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);id
            }
            // calling wiht no arguments fetch all the todos
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err)=>done(err));
        });
    });

    it('should not create todo with invalid body data', (done)=>{
        request(app)
        .post('/todos')
        .send({   })
        .expect(400)
        .end((err, res)=>{
            if(err) {
                return done(err);
            }

            Todo.find({}).then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((err)=>done(err));
        });
    });
});

describe('GET /todos route', ()=>{
    it('should get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body).toExist();
           expect(res.body.docs.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET todos/:id', ()=>{
    it('should return todo doc',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    })
    //is an asynchronous test sou I have to specify done right here
    it('Should return 404 if todo not found',(done)=>{
        id = new ObjectID().toHexString;
        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    })
    it('should return 404 for non-object id is',(done)=>{
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    })
});

describe('Delete /todos/:id', ()=>{
    
    it('should return 200 and the todo is remove',(done)=>{
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId)
        })
        //asynchornous query the database
        .end((err, res)=>{
            if(err) return done(err);

            Todo.findById(hexId).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch((e)=>done(e));
        });

    });

    it('should return 404 for invalid ObjectId',(done)=>{
        request(app)
        .delete(`/todos/${123}`)
        .expect(404)
        .end(done);
    });
    it('should return 404 the todo not found',(done)=>{
        var id = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
        
});

describe('Test the PATCH /todos/:id api',()=>{
  
    it('Should send 404 for invalid id',(done)=>{
        var id = new ObjectID().toHexString();
     
        request(app)
        .patch(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
    it('Should return 404 for unable to find todo',(done)=>{
        request(app)
        .patch(`/todos/${123}`)
        .expect(404)
        .end(done);
    });

    it('should return 200 and the update todo',(done)=>{
        var id = todos[0]._id.toHexString();
        var text = "Tonto"
        var completed = true;

        request(app)
        .patch(`/todos/${id}`)
        .send({text,completed})
        .expect(200)
        .expect((res)=>{
           expect(res.body.todo._id).toBe(id);
           expect(res.body.todo.completed).toBe(true);
           expect(res.body.todo.completedAt).toExist();
           expect(res.body.todo.completedAt).toBeA('number');
           expect(res.body.todo.text).toBe(text);
        })
        .end(done);
    });

    it('Should update todo, clear completedAt to null when is not completed and return 200',(done)=>{
        var id = todos[1]._id.toHexString();

        request(app)
        .patch(`/todos/${id}`)
        .send({
                text:'Clear completedAt',
                completed:false})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe('Clear completedAt');
            expect(res.body.todo.completed).toBeFalsy();
            expect(res.body.todo.completedAt).toNotExist();
           
        })
        .end((err, res)=>{
            if(err) return done(err);

            Todo.findById(id).then((todo)=>{
                expect(todo._id.toHexString()).toBe(id);
                expect(todo.text).toBe('Clear completedAt');
                done();
            }).catch((e)=>done(e));
        });
    })
});

describe('GET /users/me',()=>{
    it('Should return a users if its authenticated',(done)=>{

        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('It should return 401 if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', ()=>{
    it('Should sign up the user (create the user)', (done)=>{
        var email = 'juan@gmail.com';
        var password= '456abc';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.body.email).toBe(email);
            expect(res.body._id).toExist();
            expect(res.headers['x-auth']).toExist();
        })
        .end((err)=>{
            if(err){
                return done(err)
            }

            User.findOne({email}).then((user)=>{
                expect(user.email).toBe(email);
                expect(user.password).toNotBe(password);
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });
    //invalid email or password less 6 caracters
    it('Should return validation error if request invalid',(done)=>{
        var email = 'juangmail.com';
        var password= '456ab';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done);
    });

    it('Should not create the user if the email in use', (done)=>{
        request(app)
        .post('/users')
        .send({
            email:users[1].email,
            password:users[1].password
        })
        .expect(400)
        .end(done)
    });
});

describe('POST /users/login', ()=>{
    it('should login user and return 200 and auth token', (done)=>{
        var email=users[1].email;
        var password =users[1].password;
        request(app)
        .post('/users/login')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
        })
        .end((err,res)=>{
            if(err) return done(err);

            User.findById(users[1]._id).then((user)=>{
                expect(user.email).toBe(email);
                expect(user.tokens[0]).toInclude({
                    access:'auth',
                    token:res.headers['x-auth']
                });
                done();
            }).catch((e)=>{
                done(e);
            })
        });
    });

    it('should reject invalid login return 400',(done)=>{

        request(app)
        .post('/users/login')
        .send({
            email: 'jaime@gmail.com',
            password:'userTwoPas'
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err,res)=>{
            if(err) done(err);

            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(0);
                done();
            })
            .catch((e)=>{done(e)})
        });
    });
});
