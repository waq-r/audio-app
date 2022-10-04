import React, {useState, useEffect} from "react"
import {useAuthContext} from '../hooks/useAuthContext'

const LoadDrafts = () => {
    const {user} = useAuthContext()

    const [buttonClass, setButtonClass] = useState("ui button")
    const [drafts, setDrafts] = useState([])

    useEffect(() => {
        // load drafts from mongo db audio collection                
        const getDrafts = async () => {
            const response = await fetch("/api/audio?draft=false",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${user.token}`
                    }
    
                })
            
            const data = await response.json()

            if (!response.ok) {
                console.log("Error getting drafts")
            }
            if (response.ok) {
                //push blobUrl, blobType and id into result object
                setDrafts(data.map(item => {
                    return {...item, ...{
                        blobUrl: `/api/file/audio/${item._id}.${item.audio.split('/')[1]}`,
                        blobType: item.audio,
                        id: Math.floor(new Date(item.date).getTime() / 1000),
                        selected: false,
                    }
                    }
                }))
            }

        }
        getDrafts()

    }, [user])

    return (
        <div className="ui inverted segment">
            <div className="ui grid">
                <div className="row">
                    <div className="column">
                        <button 
                            className={buttonClass} 
                            onClick={() => setButtonClass("ui button loading")}
                        >
                            Load Drafts ({drafts.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadDrafts