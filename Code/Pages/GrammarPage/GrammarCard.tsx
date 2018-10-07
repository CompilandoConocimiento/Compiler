import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar";


import Style from "./Style.css"
import { TokenItem } from "../../CoreLogic/Token";

interface propsType {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
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
                            onClick  = {() => {
                                const LHS = prompt("Introduce the LHS:")
                                if(LHS == null) return
                                if(!props.Grammar.isNonTerminal(LHS)){
                                    M.toast({html: "Invalid non-terminal"})
                                    return
                                }
                                const rhs = prompt("Introduce the RHS (separated by spaces):\nFor terminal symbols, use the name of the token.")
                                if(rhs == null) return
                                const callbackStr = prompt("Introduce the callback for this rule:")
                                let callback = null
                                if(callbackStr != null && callbackStr.length > 0){
                                    try{
                                        callback = new Function("return " + callbackStr)()
                                    }catch(e){}
                                }
                                const RHS = rhs.split(" ").filter(c => c.length > 0).map(c =>{
                                    if(props.Grammar.isNonTerminal(c)){
                                        return c
                                    }else if(props.Tokens.has(c)){
                                        const id = props.Tokens.get(c)!.id
                                        props.Grammar.terminalSymbols.add(id)
                                        return id
                                    }else{
                                        return null
                                    }
                                }).filter(c => c != null)
                                props.Grammar.addRule(LHS, RHS, callback)
                                M.toast({html: "New rule added"})
                            }}
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
                            onClick  = {() => {return}}
                        >
                            <i className="material-icons">edit</i>
                            &nbsp;
                            &nbsp;
                            Change associated automata
                        </a>
                    </li>
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
