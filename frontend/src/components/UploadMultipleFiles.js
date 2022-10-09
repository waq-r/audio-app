import React, {useState} from "react"
import parse from 'html-react-parser'


const UploadMultipleFiles = ({setTitleAndNotes}) => {

    const [files, setFiles] = useState([])

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
            return {...f, ...{"selected": false}}
        })
        setFiles(updatedFiles)
        setTitleAndNotes(file)

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
            <div className="ui inverted segment">
                {files && files.length > 0 && <div className="ui inverted relaxed divided list" style={{overflow: 'auto', maxHeight: 900 }}>
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
    )
    
}

export default UploadMultipleFiles