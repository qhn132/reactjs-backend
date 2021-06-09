const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
// const expressJwt = require('express-jwt'); // for authorization check

class Auth {

    signup(req, res) {
        // console.log(req.body)
        const user = new User(req.body)
        user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Faild"
                });
            }
            user.salt = undefined
            user.hashed_password = undefined
            res.json(user)
        })
    }
    signin(req, res) {
        // find the user base on email
        const { email, password } = req.body;
        console.log(req.body)
        User.findOne({ email }, (error, user) => {
            if (error || !user) {
                return res.status(400).json({
                    email: email,
                    error: 'User with that email does not exist. Please signup'
                })
            }
            // if user is found make sure email and password match
            // create authenticate method in user model
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: 'Email and password not match'
                })
            }
            // generate a signed token with user id and secret
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            // persist the token as 't' in cookie with
            res.cookie('t', token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email, role } = user;
            return res.json(
                {
                    token, user: { _id, email, name, role }
                }
            )
        })
    }
    signout(req, res) {
        res.clearCookie('t');
        res.json({
            message: "Signout Success"
        })
    }
    // requireSignin() {
    //     expressJwt({
    //         secret: process.env.JWT_SECRET,
    //         algorithms: ["HS256"], // added later
    //         userProperty: "auth",
    //     })
    // }
    isAuth(req, res, next) {
        const data = req.headers["x-access-token"] || req.headers["authorization"];
        const token = data.split(' ')
        if (!token) {
            return res.status(401).send("Access denied. No token provided.")
        }
        try {
            const decoded = jwt.verify(token[1], 'bomaylatao')
            let user = req.profile && req.profile._id == decoded._id
            if (!user) {
                return res.status(403).json({
                    error: "Access Denied",
                })
            }
            next();
        } catch (ex) {
            console.log(ex)
            res.status(400).send("Invalid token.");
        }
    }
    isAdmin(req, res, next) {
        if (req.profile.role == 0) {

            return res.status(403).send({
                error: "Admin resource! Access Denined"
            })
        }
        next()
    }

}
export default new Auth;