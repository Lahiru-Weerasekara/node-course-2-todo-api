require('./config/config.js');

const _ = require('lodash');

var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {ObjectID} = require('mongodb');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
    //console.log(req.body);
});


app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    //valid id using isValid
    if (!ObjectID.isValid(id)) {
        //console.log('ID not valid');
        return res.status(404).send();
    }


    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});

    }, (e) => {
        res.status(400).send();
    });


});


app.delete('/todos/:id', (req,res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        //console.log('ID not valid');
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});

    }).catch((e) => {
        res.status(400).send();
    });

});


app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});


app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);


    user.save().then((user) => {
        return user.generateAuthToken();
       //res.send(user);
    }).then((token) => {
        res.header('x-auth', token).send(user);
    })
    .catch((e) => {
        res.status(400).send(e);
    });
});


var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});


app.listen(port, () => {
   console.log(`Started on port ${port}`);
});


// var newTodo = new Todo({
//     text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (e) => {
//     console.log('Unable to save todo')
// });


// var otherTodo = new Todo({
//     text: 'Something'
// });


// var otherTodo = new Todo({
//     text: 'Feed the cat',
//     completed: true,
//     completedAt: 123
// });

// otherTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save', e);
// })


//
// var user = new User({
//     email: 'asd@gmail.com'
// });
//
// user.save().then((doc) => {
//    console.log('User saved', doc);
// }, (e) => {
//     console.log('Unable to save user', e)
// });

module.exports = {app};