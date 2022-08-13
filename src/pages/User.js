import React, { useState, useEffect } from "react";
import AudioDetails from "../components/AudioDetails";

const Audios = () => {
  const [audios, setAudios] = useState(null);

  useEffect(() => {
      const fetchAudios = async () => {
            const res = await fetch('/api/audio')

            const data = await res.json()
            //console.log(data)
            if(res.ok) {
                const {audios} = data;
                setAudios(audios)
            }
        }
        fetchAudios()
    }, [])

    return (
        <div>
            <div class="pusher">
                <div class="ui basic segment">

                        <h1>Audios</h1>
                            <div>
                                { audios && audios.map((audio) => (
                                    <AudioDetails key={audio._id} audio={audio} />
                                ))} 
                            </div>
                </div>
            </div>
        </div>
    )
                    }

export default Audios