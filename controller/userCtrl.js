// const mongoose = require('mongooose');
const Users = require('../models/userModels')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const fs = require('fs');
const path = require('path');
 
const {CLIENT_URL} = process.env

const useCtrl = {
    register: async (req, res) => {
        try {
            const {name, email, password, avatar} = req.body

            if( !name || !email || !password || avatar ) {
                return res.status(400).json({msg: 'Please fill the all Field'})
            }
                
            if(!validateEmail(email)) {
                return res.status(400).json({msg: 'Invalide Email'})
            }
            
            const user = await Users.findOne({email})

            if(user) {
                return res.status(400).json({msg: 'This email already exists'})
            }

            if( password.length < 6) {
                return res.status(400).json({msg: 'Password must be at least  6 character'})
            }

            const hashPassword = await bcrypt.hash(password, 12)

            const file = req.file;
            if(!file) return res.status(400).send('No image in the request')
            const fileName = file.filename
            const basePath = `${req.protocol}://${req.get('host')}/upload/`;

            // const newUser = {
            //     name, email, password: hashPassword, avatar: `${basePath}${fileName}`
            // }

            const activationToken = createActivationToken(newUser);

            const url = `${CLIENT_URL}/user/activate/${activationToken}`;
            // const shortUrl = url.substring(0, 100)

            sendEmail(email, url, 'Verify your email address')

            let userCreate = new Users({
                name: req.body.name,
                email: req.body.email,
                password: `${req.body}.${hashPassword}`,
                avatar: `${basePath}${fileName}`,// "http://localhost:3000/public/upload/image-2323232"
            })
        
            userCreate = await userCreate.save();
        
            if(!userCreate) 
            return res.status(500).send('The user cannot be created')

            
            // res.status(200).json({
            //     success: true,
            //     msg: 'img uplode',
            //     image: `${basePath}${fileName}`
            // })

            res.json({
                msg: 'Register success! please active your email to start',
                success: true,
                image: `${basePath}${fileName}`
            })
            
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    activateEmail : async (req, res) => {
        try {
            const {activationToken} = req.body;
            const user = jwt.verify(activationToken, process.env.ACTIVATION_SECRET_TOKEN)

            const {name, email, password} = user;

            const check = await Users.findOne({email})

            if(check) {
                return res.status(400).json({
                    msg: 'this email already exist.'
                })
            }

            const newUser = new Users({
                name, email, password
            })

            await newUser.save();

            res.json({msg: 'Account has been activate!'})
            
            
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    login: async (req, res) => {
        try {

            const {email, password} = req.body;

            const user = await Users.findOne({email});
            if(!user) {
                return res.status(400).json({
                    msg: 'This email does not exist.'
                })
            }

            const match = await bcrypt.compare(password, user.password);

            if(!match) {
                return res.status(400).json({
                    msg: 'Password is incorrect.'
                })
            }

            const refresToken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refresToken, {
                httpOnly: true,
                path: '/user/refreshtoken',
                maxAge: 7*24*60*60*1000 // 7days
            })

            res.json({msg: "Login success!"})
            
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    getAccessToken: (req, res) =>{
        try {

            const rfToken = req.cookies.refreshtoken;

            if(!rfToken){
                return res.status(400).json({
                    msg: 'Please Login now!'
                })
            }

            jwt.verify(rfToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err){
                    return res.status(400).json({
                        msg: 'Please Login now!'
                    })
                }
                
                const accessToken = createAccessToken({id: user.id})
                res.json({accessToken})
            })

        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body;
            const user = await Users.findOne({email});

            if(!user) {
                return res.status(400).json({
                    msg : "This email does not found!"
                })
            }

            const accessToken = createAccessToken({id: user._id});

            const url = `${CLIENT_URL}/user/reset/${accessToken}`
            sendEmail(email, url, 'Reset your password')

            res.json({msg: 'Resend password, please check your email.'})
            
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {password} = req.body;

            const hashPassword = await bcrypt.hash(password, 12);

            await Users.findOneAndUpdate({_id: req.user.id}, {
                password: hashPassword
            })

            res.json({msg: 'Password successfuly changed!'})

            
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    getUserInfo: async (req, res) => {
        try {

            const user = await Users.findById(req.user.id).select('-password');

            res.json(user)
            
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    getAllUserInfo: async(req, res) => {
        try {

            const user = await Users.find().select('-password')
            res.json(user)
            
        } catch (err) {

            return res.status(500).json( {msg : err.message })
            
        }
    },
    logout : async (req, res) => {
        try {

            res.clearCookie('refreshtoken', {path: '/user/refreshtoken'});

            return res.json({msg: 'Logout success!'})

            // const user = await Users.findById()
            
        } catch (err) {
            return res.status(500).json({msg : err.message})
            
        }
    },
    updateUser: async(req, res) => {
        try {

            const {name, avatar } = req.body;

            await Users.findOneAndUpdate({_id : req.user.id}, {
                name, avatar
            })

            res.json({msg : 'Update Success!'})

            
        } catch (err) {
            return res.status(500).json({msg : err.message})          
        }
    },
    updateUserRole: async(req, res) => {
        try {

            const { role } = req.body;

            await Users.findOneAndUpdate({_id : req.params.id}, {
                role
            })

            res.json({msg : 'Update Success!'})

            
        } catch (err) {
            return res.status(500).json({msg : err.message})          
        }
    },
    deleteUser: async (req, res) =>{
        try {

            await Users.findByIdAndDelete(req.params.id)

                // console.log(req.path)
                // fs.unlink('upload/online-1647251662867.jpg'+path, function (err) {
                //     if (err) throw err;
                //     console.log('File deleted!');
                // });

            res.json({msg : 'Delete Success!'})
            
        } catch (err) {
            return res.status(400).json({msg : err.message})
            
        }
    }
};

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_SECRET_TOKEN, {expiresIn: '5m'} )
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SERCRT, {expiresIn: '15m'} )
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'} )
}


const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


module.exports = useCtrl;