const { default: mongoose } = require('mongoose')
const Audio = require('../models/audioModel')

const getAudio = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({msg: 'Invalid ID. No such audio'})
    }
    const audio = await Audio.findById(id)

    if(!audio) {
        return res.status(400).json({msg: 'No such audio'})
    }

    res.status(200).json({audio})
}

const getAllAudios = (req, res) => {
    Audio.find({}, (err, audios) => {
        if(err) {
            return res.status(400).json({msg: err.message})
        }
        res.status(200).json({audios})
    }).sort({createdAt: -1})
}

const saveAudio = async (req, res) => {
    const {audio, title, description} = req.body
    console.log(req.body)
    try {
        const newAudio = await Audio.create({audio, title, description})
        res.status(200).json({newAudio})
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }

}

const deleteAudio = async (req, res) => {
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({msg: 'Invalid ID. No such audio'})
    }

        const audio = await Audio.findByIdAndDelete({_id: id})

        if(!audio) {
            return res.status(400).json({msg: 'No such audio'})
        }

        res.status(200).json({audio})
}


module.exports = {getAudio, getAllAudios, saveAudio, deleteAudio}