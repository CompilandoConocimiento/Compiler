import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar";


import Style from "./Style.css"

interface propsType {
    Grammar: CFG,
    SeeGrammar: any,
    isSelected: boolean,
    DeleteGrammar: () => any,
    forceUpdate: () => void,
    SelectGrammar: () => any
}

export default function GrammarCard (props: propsType) {

    const colorStyle = `darken-${props.isSelected? "1": "3"}`
    const depthStyle = props.isSelected? "z-depth-5" : "hoverable"

    return (
        <div className={`card blue ${colorStyle} ${depthStyle}`} >
            
            <div className="card-content white-text" onClick={props.SelectGrammar}>
                <div className={Style.unselectable}>
                    <span className="flow-text" style={{overflow: "auto"}}>
                        Grammar: {props.Grammar.getName()}
                    </span>
                </div>
            </div>

            <div className="card-action">
                <ul>
                    <li>
                        <a 
                            className = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick  = {() => {return null}}
                        >
                            <i className="material-icons">text_rotation_none</i>
                            &nbsp;
                            &nbsp;
                            Add Rule
                        </a>
                    </li>
                    <li>
                        <a 
                            className   = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick={() => {
                                const value = prompt("Introduce the string to check:")
                                if(value == null) return  

                                const result = props.Grammar.parseStringWithEarley(value)
                                if (result.derivations.length == 0) {
                                    M.toast({html: "Not a valid string"})
                                    return                                
                                }

                                let parseResult = props.Grammar.executeActions(result)
                                window['parseResult'] = parseResult
                                console.log(parseResult)

                                if (typeof parseResult === 'string' || typeof parseResult === 'number') 
                                    M.toast({html: String(parseResult)})
                            }}
                        >
                            <i className="material-icons">check</i>
                            &nbsp;
                            &nbsp;
                            Parse String
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick  = {props.SelectGrammar}
                        >
                            <i className="material-icons">radio_button_checked</i>
                            &nbsp;
                            &nbsp;
                            Select
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick   = {
                                () => props.SeeGrammar()
                            }
                        > 
                            <i className="material-icons">open_in_new</i>
                            &nbsp;
                            &nbsp;
                            See it
                        </a>
                    </li>
                </ul>

                <div className="divider" style={{backgroundColor: "#e3f2fd"}}></div>

                <ul>
                    <li>
                        <a className = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick  = {() => {
                                const newName = prompt("Give me a new name:", props.Grammar.getName())
                                if (newName != null) props.Grammar.setName(newName)
                                props.forceUpdate()
                            }}
                        >
                            <i className="material-icons">edit</i>
                            &nbsp;
                            &nbsp;
                            Rename
                        </a>
                    </li>
                    <li>
                        <a
                            className = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick  = {() => props.DeleteGrammar()}
                        >
                            <i className="material-icons">delete_forever</i>
                            &nbsp;
                            &nbsp;
                            Delete
                        </a>
                    </li>
                </ul>
                        
            </div>

        </div>
    )
}
