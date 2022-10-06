import React, {useState} from "react"
import parse from 'html-react-parser'
import TextFileUpload from "./TextFileUpload"


const UploadMultiple = ({setDescriptionData}) => {

    const [fileText, setFileText] = useState([])
    const [text, setText] = useState([])
    const [lines, setLines] = useState([])
    const [isActive, setIsActive] = useState(false)

    
    const toggleClass = () => {
        setIsActive(!isActive)
    }
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
        <div className="ui inverted fluid accordion">
            <div className="active title" onClick={toggleClass}>
                <i className="dropdown icon"></i>
                Uploads multiple text files.
            </div>
            <div className={isActive?'active content':'content'}>
        
                <div className="ui stackable two column grid">
                
                <div className="column">
                    <div className="ui inverted segment">
                            {fileText && fileText.length > 0 && <div className="ui inverted relaxed divided list" style={{overflow: 'auto', maxHeight: 200 }}>
                                    {fileText.map((item, index) => {
                                        return (
                                            <div key={index} className="item">
                                                <div className="content" onClick={()=> setDescriptionData(`${text[index]}`)}>
                                                    <div className="header">{item.name}</div>
                                                    <div className="description">{parse(`${text[index]}`)}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                            </div> }
                            
                        <label className="ui inverted basic button">
                        <i className="folder open icon"></i>Upload Multiple Files
                                <input style={{display: 'none'}}
                                type="file"
                                accept="text/*"
                                multiple
                                onChange={(e) => handleFileChange(e)}
                            />
                        </label>
                    </div>
                </div>
                
                <div className="column">
                    <div className="ui inverted segment">
                            {lines && lines.length > 0 && <div className="ui inverted relaxed divided list" style={{overflow: 'auto', maxHeight: 200 }}>
                                    {lines.map((line, i) => {
                                        return (
                                            <div key={i} className="item">
                                                <div className=" content" onClick={()=> setDescriptionData(line)}>
                                                    <div className="header">Audio title {i}</div>
                                                    <div className="description">{parse(line)}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                                    
                            </div> }
                            
                        <TextFileUpload setDescriptionData={getFileTextLines} />
                    </div>
                </div>

                </div>
        
        </div>
    </div>
    )
    
}

export default UploadMultiple