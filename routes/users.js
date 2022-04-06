const routes = require('express').Router();
const User = require('../models/user');

// Show all the users (Get  http://localhost:3000/api/users) 
routes.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.send(err);
        }
        res.json(users);
    });
});

// Show a specific user (Get http://localhost:3000/api/users/:id )
routes.get('/:id', (req, res) => {
    User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});


// Create a new user (POST  http://localhost:3000/api/users)
routes.post('/', (req, res) => {
    console.log(req.body);
    const newUser = new User(req.body);
    try {
        newUser.save((err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    } catch (error) {
        return 
    }
});


// Update a user (PUT http://localhost:3000/api/users/:id ) 
routes.put('/:id', (req, res) => {
    try {
        User.findOne({ id: req.params.id }, (err, user) => {
            if (err) {
                res.send(err);
            }
            user.id = req.body.id;
            user.name = req.body.name;
            user.age = req.body.age;
            user.save((err, user) => {
                if (err) {
                    res.send(err);
                }
                res.json(user);
            });
        });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});


// Delete a user (DELETE http://localhost:3000/api/users/:id ) 
routes.delete('/:id', (req, res) => {
    try {
        User.findOne({ id: req.params.id }, (err, user) => {
            if (err) {
                res.send(err);
            }
            user.remove((err, user) => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'User successfully deleted' });
            });
            
        });
    } catch (error) {
        return res.status(404).json({ message: 'Something went wrong' });
    }
});


module.exports = routes;