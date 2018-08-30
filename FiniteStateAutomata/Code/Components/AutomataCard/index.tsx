import React from "react"

interface propsType {
    name: string,
    onClick: () => any
}

const AutomataCard: React.StatelessComponent<propsType> = (props: propsType) => {
    
    return (
        <div className="card blue-grey darken-1">
            <div className="card-content white-text">

                <span className="card-title">Automata {props.name}</span>

            </div>

            <div className="card-action">
                <a onClick={props.onClick}>See it</a>
            </div>
        </div>
    )
}


export default AutomataCard