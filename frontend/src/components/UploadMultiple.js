import React, {useState} from "react"
import parse from 'html-react-parser'
import TextFileUpload from "./TextFileUpload"


const UploadMultiple = ({setTitleAndNotes}) => {

    const [files, setFiles] = useState([])
    const [lines, setLines] = useState([])
    const [isActive, setIsActive] = useState(false)

    const onFileTextDelete = (file) => {
        const updatedFiles = files.filter((f) => 
            f.id !== file.id
        )
        setFiles(updatedFiles)

    }
    const onFileTextClick = (file) => {
        const updatedFiles = files.map((f) => {

            if(f.id === file.id) {
                return {...f, ...{"selected": true}}
            }
            return f
        })
        setFiles(updatedFiles)
        setTitleAndNotes(file)

    }
    
    const toggleClass = () => {
        setIsActive(!isActive)
    }
    const getFileTextLines = (data) => {
        const lines = data.split("<br>").map(line => {return  {text: line, name: null} })
        console.log('lines: ',lines)

        setLines(lines)
    }

    const handleFileChange = (e) => {
        Array.from(e.target.files).forEach((f, i) => {
            const fileName = f.name
            const fileId = Date.now() + i

            const reader = new FileReader()
            reader.onload = (f) => {
                const fileInfo = {
                    id: fileId,
                    name: fileName,
                    text: f.target.result.replace(/(\r\n|\n|\r)/gm, "<br>"),
                    checked: false
                }

                setFiles(files => [...files, fileInfo])
            }
            reader.readAsText(f)
            
        })
        
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
                            {files && files.length > 0 && <div className="ui inverted relaxed divided list" style={{overflow: 'auto', maxHeight: 200 }}>
                                    {files.map((file) => {
                                        return (
                                            <div key={file.id} className="item">
                                                <div className={`${file.selected?"ui inverted olive segment":"ui inverted segment"}`} >
                                                    <div className="ui small header">{`${file.name}`}</div>
                                                    <div className="ui content">{parse(`${file.text}`)}</div>
                                                
                                                <div className="ui right floated content">
                                                    <button 
                                                        className={`${file.selected?'ui olive button':'ui grey button'}`}
                                                        onClick={()=> {onFileTextClick(file)}}
                                                    >{`${file.selected?'Selected':'Select'}`}
                                                    </button>
                                                    <button 
                                                        className="ui grey button"
                                                        onClick={()=>{onFileTextDelete(file)}}
                                                    >Delete
                                                    </button>
                                                </div>
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
                                                <div className=" content" onClick={()=> setTitleAndNotes(line)}>
                                                    <div className="header">Audio title {i}</div>
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
    </div>
    )
    
}

export default UploadMultiple