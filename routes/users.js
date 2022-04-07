const routes = require('express').Router();
const User = require('../models/user');

// Show all the users (Get  http://localhost:3000/api/users) 
routes.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Error when getting users.' });
        }
        res.json(users);
    });
});

// Show a specific user (Get http://localhost:3000/api/users/:id )
routes.get('/:id', (req, res) => {
    User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Error when getting user.' });
        }
        res.json(user);
    });
});


// Create a new user (POST  http://localhost:3000/api/users)
routes.post('/', (req, res) => {
    const newUser = new User(req.body);
    try {
        if (newUser.name == '' || newUser.age == '' || newUser.id == '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        if (newUser.age > 100) {
            return res.status(400).json({ error: 'Age must be less than 100' });
        }
        newUser.save((err, user) => {
            if (err) {
                return res.status(409).json({ error: 'User already exists' });
            }
            res.json({ message: `User ${user.name} created successfully` });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Update a user (PUT http://localhost:3000/api/users/:id ) 
routes.put('/:id', (req, res) => {
    try {
        if (req.body.name == '' || req.body.age == '' || req.body.id == '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        if (req.body.age > 100) {
            return res.status(400).json({ error: 'Age must be less than 100' });
        }
        if (User.findOne({ id: req.body.id })) {
            if (req.params.id != req.body.id) {
                return res.status(409).json({ error: `User with id ${req.body.id} already exists` });
            }
        }
        User.findOne({ id: req.params.id }, (err, user) => {
            if (err) {
                return res.status(404).json({ error: "User not found" });
            }
            try {
                user.id = req.body.id;
                user.name = req.body.name;
                user.age = req.body.age;
                
                user.save((err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Error when updating user.' });
                }
                res.json({ message: `User ${user.id} updated successfully` });
            });
            } catch (error) {
                return res.status(500).json({ error: 'Internal server error' }); // fixes crash if user id is not changed
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Delete a user (DELETE http://localhost:3000/api/users/:id ) 
routes.delete('/:id', (req, res) => {
    try {
        User.findOne({ id: req.params.id }, (err, user) => {
            if (err) {
                return res.status(404).send({ error: "User not found" });
            }
            user.remove((err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.json({ message: `User ${user.id} deleted successfully` });
            });
            
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = routes;