import parse from 'html-react-parser';


const AudioDetails = ({ audio }) => {
  return (
    <div className="ui raised very padded text container segment">
        <div className="ui header">{audio.audio}</div>
        <div class="meta">
        <span class="date">Joined in 2013</span>
        </div>

        <p className="description">
            {parse(audio.description)}
        </p>
        <div class="ui icon message">
        <i class="inbox icon"></i>
        <div class="content">
        <button class="ui right floated button">Right Floated</button>
            <audio controls>
            Your browser does not support the audio tag.
            </audio>
        </div>
        </div>

    </div>
  );
}

export default AudioDetails;