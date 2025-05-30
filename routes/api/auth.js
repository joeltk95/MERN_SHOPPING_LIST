const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

//Item Model
const User = require('../../models/User');

// @route POST api/auth
// @desc Auth user
// @access Public
router.post('/', (req, res) => {
    const  { email, password } = req.body;

    //Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' }); //bad request
    }

    //Check for existing user
    User.findOne({ email: email})
        .then(user => {
            if(!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            
            //Validate password
            bcrypt.compare(password, user.password) //compare plaintext password and hash password
                .then(isMatch => {
                    if(!isMatch) {
                        return res.status(400).json({ msg: 'Invalid credentials' });
                    }

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            
                            //send response
                            res.json({
                                token: token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                    }
                            });
                        }
                    )
                })
            
        })
}); 

// @route GET api/auth/user
// @desc Get user data
// @access Private 
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password') //disregard password
        .then(user => res.json(user));
});

module.exports = router;