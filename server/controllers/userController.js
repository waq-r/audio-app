const User = require('../models/userModel')

const loginUser = async (req, res) => {
    const {email, password} = req.body
    console.log(req.body)

    try {
        const user = await User.findOne({email: email})
        if(!user) {
            return res.status(400).json({msg: 'User does not exist'})
        }
        if(password !== user.password) {
            return res.status(400).json({msg: 'Incorrect password'})
        }
        res.json({msg: 'Logged in successfully'})
    }
    catch (err) {
        return res.status(500).json({msg: err.message})
    }

}

const signupUser = async (req, res) => {
    const {name, email, password, role, notification} = req.body
    console.log(req.body)

    try {
        const user = await User.create({name, email, password, role, notification})
        res.status(201).json({user})
    }
    catch (err) {
        console.log(err)
        res.status(400).json({error: err.message})
    }
}

// update user notification by +1
const incrementUserNotfications = async (req, res) => {
    const userRole = req.params.role

    try {
        const user = await User.updateMany({role: userRole}, { $inc: { notification: 1 } })
        console.log(user)
        res.status(201).json({modifiedCount: user.modifiedCount})
    }
    catch (err) {
        console.log(err)
        res.status(400).json({error: err.message})
    }
}


module.exports = { signupUser, loginUser, incrementUserNotfications }