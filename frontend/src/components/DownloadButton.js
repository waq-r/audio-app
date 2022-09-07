import React from 'react'
import htmlToFormattedText from "html-to-formatted-text"

const DownloadButton = ({recordId, audio, url, markAsDownloaded}) => {

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
            const link = document.createElement('a')

            // download text file first
            //create text file blob
            const textFile = new Blob([htmlToFormattedText(audio.description)], {type: "text/plain;charset=utf-8"});
            link.href = window.URL.createObjectURL(textFile)
            link.download = `${name}.txt`
            link.click()


            // set 2 second time interval for audio download
            setTimeout(() => {
                link.href = window.URL.createObjectURL(blob)
                link.download = name + '.' + audio.audio.split('/').pop()
                link.click()
            }
                , 2000)
                // remove link after download
            setTimeout(() => {
                link.remove()
            }
                , 3000)

            //send callback to mark video as downloaded
            markAsDownloaded(recordId)
            

        }

    return (
        
        <button className="ui button" onClick={() => download()}>Download</button>

    );
}

export default DownloadButton