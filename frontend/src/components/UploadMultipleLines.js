import React, {useState} from "react"
import parse from 'html-react-parser'
import TextFileUpload from "./TextFileUpload"


const UploadMultiple = ({setTitleAndNotes}) => {

    const [lines, setLines] = useState([])
    const [isActive, setIsActive] = useState(false)
    
    const toggleClass = () => {
        setIsActive(!isActive)
    }
    const getFileTextLines = (data) => {
        const lines = data.split("<br>").map(line => {return  {text: line, name: null} })

        setLines(lines)
    }

    return (
        <div className="ui inverted fluid accordion">
            <div className="active title" onClick={toggleClass}>
                <i className="dropdown icon"></i>
                Uploads multiple text files.
            </div>
            <div className={isActive?'active content':'content'}>
                
                <div className="column">
                    <div className="ui inverted segment">
                            {lines && lines.length > 0 && <div className="ui inverted relaxed divided list" style={{overflow: 'auto', maxHeight: 200 }}>
                                    {lines.map((line, i) => {
                                        return (
                                            <div key={i} className="item">
                                                <div className=" content" onClick={()=> setTitleAndNotes(line)}>
                                                    <div className="header">Line {i+1}</div>
                                                    <div className="description">{parse(`${line.text}`)}</div>
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
    )
    
}

export default UploadMultiple