const expect = require('expect');
const request = require('supertest');
const {ObjectID} =require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

const todos = [
    {   _id: new ObjectID(),
        text:'first test todo'},
    {   _id: new ObjectID(),
        text:'second test todo',
        completed:true,
        completedAt:1234}
];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{ 
        return Todo.insertMany(todos);    
    }).then(()=>done());
});

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
