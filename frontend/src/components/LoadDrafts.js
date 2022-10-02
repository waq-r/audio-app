import React, {useState, useEffect, useCallback} from "react"
import {useAuthContext} from '../hooks/useAuthContext'

const LoadDrafts = () => {
    const {user} = useAuthContext()

    const [buttonClass, setButtonClass] = useState("ui button")
    const [drafts, setDrafts] = useState([])

    const getDrafts = useCallback(async () => {
        const response = await fetch("/api/audio?draft=false",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                }

            })
        
        const data = await response.json()
        console.log('useCallback:', data)
        setDrafts(data)
    }, [user])

    useEffect(() => {
        // load drafts from mongo db audio collection                
        console.log('useEffect before:')
        getDrafts()
        console.log('useEffect after:')


    }, [getDrafts])

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