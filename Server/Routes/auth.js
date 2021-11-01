const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require('dotenv').config()


router.post('/register', (req, res) => {
    const { name, email, password, phonenumber, Stateplace, Address, district, pincode } = req.body
    if (!email || !password || !name || !phonenumber || !Address || !district || !pincode || !Stateplace) {
        return res.status(422).json({
            error: "please add all the fields"
        })
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({
                error: "User already exists with that mail"
            })
        }
        bcrypt.hash(password, 10)
            .then(hashedpassword => {
                const user = new User({
                    email,
                    password: hashedpassword,
                    name,
                    phonenumber,
                    Stateplace,
                    Address,
                    district,
                    pincode
                })
                user.save()
                    .then(user => {
                        res.json({ message: "saved successfully" })
                    })
                    .catch(err => {
                        console.log(err)
                    })

            })

    })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({
            error: "please add email or password"
        })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({
                    error: "invalid credentials"
                })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                       const token = jwt.sign({_id:savedUser._id},`${process.env.JWT_SECRET}`)
                       const {_id,name,email}=savedUser
                       res.json({token,user:{_id,name,email}})
                    }
                    else {
                        return res.status(422).json({
                            error: "invalid credentials"
                        })

                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        })

})
module.exports = router