import React from "react"
import { FiniteStateAutomata } from "../../../FiniteStateAutomata/FiniteStateAutomata";
import { tokenDescriptions } from "../../../FiniteStateAutomata/Types";
import Style from "./Style.css"

export interface propsType {
    forceUpdate: () => void,
    name: string,
    onClick: () => any,
    SelectAutomata: () => any,
    isSelected: boolean,
    FSA: FiniteStateAutomata
}


const AutomataCard: React.StatelessComponent<propsType> = (props: propsType) => {

    return (
        <div className={`card blue-grey darken-${props.isSelected? "1": "3"} ${props.isSelected? "z-depth-5" : "hoverable"} `} >
            <div 
                className="card-content white-text" onClick={props.SelectAutomata}>
                <div className={Style.unselectable}>
                    <span className="flow-text" style={{overflow: "auto"}}>Automata {props.name}</span>
                </div>
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
                    <a className = "waves-effect waves-green btn-flat"
                        onClick  = {() => {
                            const newToken = prompt("Give token ID:")
                            const newName = prompt("Give token name:")
                            if (newToken != null && newName != null) {
                                tokenDescriptions.set(Number(newToken), newName)
                                props.FSA.setFinalToken(Number(newToken))
                            }
                        }}
                    >
                        Set token to Final States
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
                    <a className = "waves-effect waves-green btn-flat"
                        onClick  = {() => {
                            const newName = prompt("Give me a new name:", props.FSA.getName())
                            if (newName != null) props.FSA.setName(newName)
                            props.forceUpdate()
                        }}
                    >
                        Rename
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