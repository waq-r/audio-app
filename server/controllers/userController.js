require('dotenv').config()
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '9d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    const {_id, name, active, role, notification} = user

    // create a token
    const token = createToken(user._id)

    res.status(200).json({_id, name, email, role, notification, active, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
    const {name, email, password} = req.body
  
    try {
      const user = await User.signup(name, email, password)
      const {_id, active, role, notification} = user
      // create a token
      const token = createToken(user._id)
  
      res.status(200).json({_id, name, email, role, notification, active, token})
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }

// update all users notification by +1
const incrementUserNotfications = async (req, res) => {
    const userRole = req.params.role

    try {
        const user = await User.updateMany({role: userRole}, { $inc: { notification: 1 } })
        res.status(201).json({modifiedCount: user.modifiedCount})
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
}

// reset a single user's notification to 0
const resetUserNotification = async (req, res) => {
    const {id} = req.params

    try {
        const user = await User.findByIdAndUpdate(id, {notification: 0})
        res.status(201).json({msg: "Notifications reset"})
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
}

//get a user's notification
const getUserNotification = async (req, res) => {
    const {id} = req.params

    try {
        const user = await User.findById(id)

        res.status(201).json({notifications: user.notification})
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
}

// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(req.body)
        res.status(201).json(users)
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
}

// set user's status to active/inactive
const setUserStatus = async (req, res) => {
    const {id, active} = req.body

    try {
        const user = await User.findByIdAndUpdate(id, {active: active})
        res.status(201).json(user)
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
}


//get a user by id
const getUserById = async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(id)
        res.status(200).json(user)
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// send email to user
const verifyUserEmail = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        const token = createToken(user._id)
        const url = `http://localhost:3000/api/user/verify/${token}`

        const message = {
            from: 'XXXXXXXXXXXXXXXXXX',
            to: email,
            subject: 'Verify your email',
            html: `
                <h1>Verify your email</h1>
                <p>Please click the link below to verify your email</p>
                <a href=${url}>${url}</a>
            `
        }

        await user.updateOne({ email }, { emailToken: token })

        await transporter.sendMail(message)

        res.status(200).json({ msg: "Email sent" })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
        console.log(err)
    }

}

// MailJet send notification to user's email
const sendEmailNotification = async (req, res) => {

    const { To, Subject, TextPart, HTMLPart } = req.body

    const mailjet = require('node-mailjet')
    
	.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET)

    const request = mailjet
	.post("send", {'version': 'v3.1'})
	.request({
		"Messages":[
				{
						"From": {
                                "Email": process.env.EMAIL,
								"Name": process.env.NAME
						},
						"To": To,
						"Subject": Subject,
						"TextPart": TextPart,
						"HTMLPart": HTMLPart
				}
		]
	})
request
	.then((result) => {
        res.status(200).json({ msg: "Email sent" })
	})
	.catch((err) => {
		console.log(err.statusCode)
        res.status(400).json({ error: err.message })
	})
    
    
}





module.exports = { 
                    signupUser, 
                    loginUser, 
                    incrementUserNotfications, 
                    resetUserNotification, 
                    getUserNotification,
                    getAllUsers,
                    setUserStatus,
                    getUserById,
                    sendEmailNotification
                  }