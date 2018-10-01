import React from "react"

import {FiniteStateAutomata} from "../../CoreLogic/FiniteStateAutomata"
import Style from "./Style.css"

interface propsType {
    name: string,
    ShowAutomata: (FSA: FiniteStateAutomata) => any,
    onClick: () => any,
    SelectAutomata: () => any,
    isSelected: boolean,
    FSA: FiniteStateAutomata
    forceUpdate: () => void,
}

export default function AutomataCard (props: propsType) {

    const colorStyle = `darken-${props.isSelected? "1": "3"}`
    const depthStyle = props.isSelected? "z-depth-5" : "hoverable"

    return (
        <div className={`card blue-grey ${colorStyle} ${depthStyle}`} >
            
            <div className="card-content white-text" onClick={props.SelectAutomata}>
                <div className={Style.unselectable}>
                    <span className="flow-text" style={{overflow: "auto"}}>
                        Automata: {props.name}
                    </span>
                </div>
            </div>

            <div className="card-action">

                <ul>
                    <li>
                        <a className="waves-effect waves-green btn-flat"
                            onClick={() => {
                                const value = prompt("Introduce the string to check:")
                                if(value == null) return  
                                const result =`The string was ${props.FSA.validateString(value!)? "accepted": "rejected"}`
                                M.toast({html: result})
                            }}>
                            <i className="material-icons">check</i>
                            &nbsp;
                            &nbsp;
                            Validate String
                        </a>
                    </li>
                    <li>
                        <a 
                            className   = "waves-effect waves-green btn-flat"
                            onClick     = { () => {}}>
                            <i className="material-icons">format_list_bulleted</i>
                            &nbsp;
                            &nbsp;
                            Lexical Analysis
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "waves-effect waves-green btn-flat"
                            onClick  = {props.SelectAutomata}
                        >
                            <i className="material-icons">radio_button_checked</i>
                            &nbsp;
                            &nbsp;
                            Select
                        </a>
                    </li>
                    <li>
                        <a 
                            className   = "waves-effect waves-green btn-flat"
                            onClick     = {() => props.ShowAutomata(props.FSA)}
                        > 
                            <i className="material-icons">open_in_new</i>
                            &nbsp;
                            &nbsp;
                            See it
                        </a>
                    </li>
                </ul>

                <div className="divider" style={{backgroundColor: "#546e7a"}}></div>

                <ul>
                    <li>
                        <a className = "waves-effect waves-green btn-flat"
                            onClick  = {() => {
                                
                            }}
                        >
                            <i className="material-icons">add_circle</i>
                            &nbsp;
                            &nbsp;
                            Set token to Final States
                        </a>
                    </li>
                    <li>
                        <a className = "waves-effect waves-green btn-flat"
                            onClick  = {() => {
                                const newName = prompt("Give me a new name:", props.FSA.getName())
                                if (newName != null) props.FSA.setName(newName)
                                props.forceUpdate()
                            }}
                        >
                            <i className="material-icons">edit</i>
                            &nbsp;
                            &nbsp;
                            Rename
                        </a>
                    </li>
                </ul>
                        
            </div>

        </div>
    )
}
