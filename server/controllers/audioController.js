const { default: mongoose } = require('mongoose')
const Audio = require('../models/audioModel')
const fs = require('fs')

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
    //const { page = 1, limit = 10 } = req.query
    const where = req.query
    
    Audio.find(where, (err, audios) => {
        if(err) {
            return res.status(400).json({msg: err.message})
        }
        res.status(200).json(audios)
    }).sort({createdAt: -1})
}

const saveAudio = async (req, res) => {
    const {audio, title, description, draft} = req.body
    try {
        const newAudio = await Audio.create({audio, title, description, draft})
        res.status(200).json(newAudio)
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }

}

const saveAudioAndFile = async (req, res) => {
    const {audio, title, description, draft} = req.body
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were found.' })
          }

        const newAudio = await Audio.create({audio, title, description, draft})

        let audioFile = req.files.audioFile
        let uploadPath = __dirname + `/../public/audio/${newAudio._id}.${newAudio.audio.split('/')[1]}`

        audioFile.mv(uploadPath, function(err) {

            if (err) return res.status(500).json({ message: err.message })
            res.status(200).json(newAudio)
          })
    }
    catch (err) {
        res.status(400).json({message: err})
    }
}

const deleteAudio = async (req, res) => {
    const {id, type} = req.params
    
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({msg: 'Invalid ID. No such audio'})
        }

    let path = __dirname + `/../public/audio/${id}.${type}`

    fs.unlink(path, (err) => {
        if (err) return res.status(500).json({ message: err.message })
      })      

    const audio = await Audio.findByIdAndDelete({_id: id})

        if(!audio) {
            return res.status(400).json({msg: 'No such audio'})
        }

    res.status(200).json(audio)
}


module.exports = {getAudio, getAllAudios, saveAudio, deleteAudio, saveAudioAndFile}