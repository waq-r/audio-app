import React, {useState} from "react"
import parse from 'html-react-parser'
import TextFileUpload from "./TextFileUpload"


const UploadMultiple = () => {

    const [fileText, setFileText] = useState([])
    const [text, setText] = useState([])
    const [lines, setLines] = useState([])
    
    const getFileTextLines = (data) => {
        let lines = data.split("<br>")
        setLines(lines)
    }

    

    const handleFileChange = (e) => {
        Array.from(e.target.files).forEach(file => {
            setFileText(fileText => [...fileText, file])

            const reader = new FileReader()
            reader.onload = (file) => {
                setText(text => [...text, file.target.result.replace(/(\r\n|\n|\r)/gm, "<br>")])
        }
        reader.readAsText(file)
            
        })
        
        //setFileText(texts)
    }


    return (
        <div className="ui container">

        <div className="ui secondary inverted segment">
                <h2 className="ui header">Upload Multiple Files</h2>
                <div className="ui segment">
                {fileText && fileText.length > 0 && <div className="ui list">
                        {fileText.map((item, index) => {
                            return (
                                <div key={index} className="item">
                                    <div className="content">
                                        <div className="header">{item.name}</div>
                                        <div className="description">{parse(`${text[index]}`)}</div>
                                    </div>
                                </div>
                            )
                        }
                        )}
                        
                </div> }
                
            </div>
            <label className="ui button">
            <i className="upload cloud icon"></i>Upload multiple files
                    <input style={{display: 'none'}}
                    type="file"
                    accept="text/*"
                    multiple
                    onChange={(e) => handleFileChange(e)}
                />
            </label>
        </div>

        <div className="ui secondary inverted segment">
                <h2 className="ui header">File Lines</h2>
                <div className="ui segment">
                {lines && lines.length > 0 && <div className="ui list">
                        {lines.map((line, i) => {
                            return (
                                <div key={i} className="item">
                                    <div className="content">
                                        <div className="header">Audio title {i}</div>
                                        <div className="description">{parse(line)}</div>
                                    </div>
                                </div>
                            )
                        }
                        )}
                        
                </div> }
                
            </div>
            <TextFileUpload setDescriptionData={getFileTextLines} />
        </div>

        </div>
    )
}

export default UploadMultiple