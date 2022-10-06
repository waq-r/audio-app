import React, {useState} from "react";

const TextFileUpload = ({ setDescriptionData }) => {
    const [selectedFile, setSelectedFile] = useState('')

    // read content of uploaded text file and set setTextFile()
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file.name)
        const reader = new FileReader();
        reader.onload = (e) => {
            setDescriptionData(e.target.result.replace(/(\r\n|\n|\n\n|\r)/gm, "<br>"));
        };
        reader.readAsText(file);
    }
    return (
        <div className="ui basic inverted buttons">
            <label className="ui inverted button">
            <i className="file alternate icon"></i>Upload Text File
                    <input style={{display: 'none'}}
                    type="file"
                    accept="text/*"
                    onChange={(e) => handleFileChange(e)}
                />
            </label>
            <span className="ui inverted black label">{` ${selectedFile}`}</span>
        </div>
    );
}


export default TextFileUpload;