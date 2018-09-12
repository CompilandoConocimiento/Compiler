import React from "react"
import { FiniteStateAutomata } from "../../../FiniteStateAutomata/FiniteStateAutomata";

export interface propsType {
    name: string,
    onClick: () => any,
    SelectAutomata: () => any,
    isSelected: boolean,
    FSA: FiniteStateAutomata
}


const AutomataCard: React.StatelessComponent<propsType> = (props: propsType) => {

    return (
        <div className={`card blue-grey darken-${props.isSelected? "1": "3"}`}>
            <div className="card-content white-text">
                <span className="card-title">Automata {props.name}</span>
            </div>

            <div className="card-action">
            <ul>
                <li>
                    <a className="waves-effect waves-green btn-flat"
                        onClick={() => {
                            const value = prompt("Introduce the string to check:")
                            if(value != null) alert(`The string was ${props.FSA.validateString(value!)? "accepted": "rejected"}`)
                        }}>
                        Validate String
                    </a>
                </li>
                <li>
                    <a 
                        data-target = "SeeLexicalResultModal" 
                        className   = "modal-trigger waves-effect waves-green btn-flat"
                        onClick     = {props.onClick}>
                        Lexical Analysis
                    </a>
                </li>
                <li>
                    <a 
                        data-target = "LexicalAnalysisModal" 
                        className   = "waves-effect waves-green btn-flat modal-trigger" 
                        onClick     = {props.onClick}
                    > 
                    </a>
                </li>
                <li>
                    <a className = "waves-effect waves-green btn-flat"
                        onClick  = {props.SelectAutomata}
                    >
                        Select
                    </a>
                </li>
                <li>
                    <a 
                        data-target = "SeeAutomataModal"
                        className   = "waves-effect waves-green btn-flat modal-trigger"
                        onClick     = {props.onClick}
                    > 
                        See it
                    </a>
                </li>
            </ul>
                    
            </div>
        </div>
    )
}


export default AutomataCard