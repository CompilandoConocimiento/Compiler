import React from "react"
import { FiniteStateAutomata } from "../../FiniteStateAutomata";

export interface propsType {
    name: string,
    onClick: () => any,
    SelectAutomata: () => any,
    isSelected: boolean,
    auto: FiniteStateAutomata
}


const AutomataCard: React.StatelessComponent<propsType> = (props: propsType) => {
    
    return (
        <div className={`card blue-grey darken-${props.isSelected? "1": "3"}`}>
            <div className="card-content white-text">
                <span className="card-title">Automatas {props.name}</span>
            </div>

            <div className="card-action">
                <a className="waves-effect waves-green btn-flat"
                    onClick={() => {
                        const value = prompt("Valid String")
                        alert(`The string was ${props.auto.validateString(value!)? "acepted": "rejected"}`)
                    }}>
                    Validate String
                </a>
                <a className="waves-effect waves-green btn-flat"
                    onClick={props.SelectAutomata}>
                    Select
                </a>
                <a data-target="SeeAutomataModal" className="modal-trigger" onClick={props.onClick}> See it</a>
            </div>
        </div>
    )
}


export default AutomataCard