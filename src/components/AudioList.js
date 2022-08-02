import React from "react";

const AudioList = ({ audioList, onDelete }) => {
  return (
    <div className="ui middle aligned divided list">
      {audioList.map(audio => (
        <div key={audio.id} className="item">
            <div className="">{audio.blobURL}</div>
            <div className="ui message" dangerouslySetInnerHTML={{__html: audio.description}} />
            <div>
                <audio
                    src={audio.blobURL}
                    controls="controls"
                />
      </div>
            <div className="right floated content">
              <button
                className="ui button"
                onClick={() => onDelete(audio)}
              >
                Delete
              </button>
            </div>
        </div>
      ))}
    </div>
  );
}

export default AudioList;