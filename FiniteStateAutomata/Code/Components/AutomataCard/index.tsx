import React from "react"


export default function AutomataCard (props: { name: string, onClick: () => any }) {
    
    return (
        <div className="card blue-grey darken-1">
            <div className="card-content white-text">

                <span className="card-title">{props.name}</span>

            </div>

            <div className="card-action">
                <a onClick={props.onClick()}>See it</a>
            </div>
        </div>
    )

} 