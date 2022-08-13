const path = require('path')

const uploadFile = (req, res) =>{
    let sampleFile
    let uploadPath
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.')
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile
    uploadPath = __dirname + '/../public/' + sampleFile.name
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err)
  
      res.send('File uploaded!')
    })
  }

  const saveFile = async (req, res) => {
    console.log("Request Files ", req.params);

    let sampleFile
    let uploadPath
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.')
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile
    uploadPath = __dirname + '/../public/' + req.params.media+ '/' + sampleFile.name
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).json({error: err})
  
      res.status(201).json({msg: 'File uploaded!'})
    })


}

const getFile = async (req, res) => {
  console.log("req params ", req.params);
    const filePath = path.resolve(__dirname + `{/../public/${req.params.type}/${req.params.media}`)
    console.log("Path at server: ", filePath);
    res.sendFile(filePath)
}


module.exports = {uploadFile, saveFile, getFile}