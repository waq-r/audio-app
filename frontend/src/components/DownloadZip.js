import React from 'react'
import JSZip from 'jszip'
import htmlToFormattedText from "html-to-formatted-text"
import { saveAs } from 'file-saver'

const DownloadZip = ({audio, url, recordId, markAsDownloaded}) => {

        //make URL slug of title
        const slug = (text) => {
            return text
                    .replace(/ +/g, '-')
                    .replace(/[^\w ]+/g, '')
        }
        const name = slug(audio.title)

        // fetch file from server into a blob to download and save locally
        const download = async () => {
            console.log('Downloading: ', url)
            const response = await fetch(url)
            const blob = await response.blob()
            // const link = document.createElement('a')
            // link.href = window.URL.createObjectURL(blob)
            // link.download = slug(audio.title) + '.' + audio.audio.split('/').pop()
            // link.click()
            const zip = new JSZip();
            const dir = zip.folder(name)

            dir.file(name + '.txt', htmlToFormattedText(audio.description) )

            dir.file(slug(audio.title) +'.'+ audio.audio.split('/').pop(), blob, {base64: true})

            zip.generateAsync({type:"blob"}).then(function(content) {

                saveAs(content, name + '.zip')
            })
            
            markAsDownloaded(recordId)
        }

    return (
        
        <button className="ui button" onClick={() => download()}>Zip</button>

    );
}

export default DownloadZip