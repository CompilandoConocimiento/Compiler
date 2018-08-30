import React from "react"

export interface propsType {
    name: string,
    onClick: () => any,
    SelectAutomata: () => any,
}

const AutomataCard: React.StatelessComponent<propsType> = (props: propsType) => {
    
    return (
        <div className="card blue-grey darken-1">
            <div className="card-content white-text">

                <span className="card-title">Automatas {props.name}</span>

            </div>

            <div className="card-action">
                <a className="modal-close waves-effect waves-green btn-flat"
                    onClick={props.SelectAutomata}>
                    Select
                </a>
                <a data-target="SeeAutomataModal" className="modal-trigger" onClick={props.SelectAutomata}>See it</a>
            </div>
        </div>
    )
}


export default AutomataCard