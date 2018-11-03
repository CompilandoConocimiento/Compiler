import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar";


import Style from "./Style.css"
import { TokenItem, TokenError } from "../../CoreLogic/Token";
import { FiniteStateAutomata } from "../../CoreLogic/FiniteStateAutomata";

interface propsType {
    Grammar: CFG,
    Automatas: Array<FiniteStateAutomata>
    Tokens: Map<string, TokenItem>
    SeeGrammar: any,
    SeeFirstFollow: any,
    SeeLL1Table: any,
    LL1Viewer: any,
    EarleyViewer: any,
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
                                
                                const rhs = prompt("Introduce the RHS (separated with spaces):\nFor terminal symbols, use the name of the token.")
                                if(rhs == null) return
                                let validRHS: boolean = true
                                const RHS = rhs.split(" ").filter(c => c.length > 0).map(c =>{
                                    if(props.Grammar.isNonTerminal(c)){
                                        return c
                                    }else if(props.Tokens.has(c)){
                                        const id = props.Tokens.get(c)!.id
                                        props.Grammar.terminalSymbols.add(id)
                                        return id
                                    }else{
                                        return TokenError
                                    }
                                }).filter(c => {validRHS = validRHS && (c != TokenError); return c != TokenError})
                                if(!validRHS){
                                    M.toast({html: "Invalid RHS"})
                                    return
                                }

                                const callbackStr = prompt("Introduce the callback for this rule:")
                                let callback = null
                                if(callbackStr != null && callbackStr.length > 0){
                                    try{
                                        callback = new Function("return " + callbackStr)()
                                    }catch(e){}
                                }

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
                        <a 
                            className   = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick = {
                                () => {
                                    props.Grammar.calculateFirstSets()
                                    props.Grammar.calculateFollowSets()
                                    props.SeeFirstFollow()
                                }
                            }
                        >
                            <i className="material-icons">table_chart</i>
                            &nbsp;
                            &nbsp;
                            See First and Follow sets
                        </a>
                    </li>
                    <li>
                        <a 
                            className   = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick   = {
                                () => {
                                    props.Grammar.buildLL1Table()
                                    if(props.Grammar.LL1Table == null){
                                        M.toast({html: "Not a LL(1) grammar"})
                                    }else{
                                        props.SeeLL1Table()
                                    }
                                }
                            }
                        >
                            <i className="material-icons">table_chart</i>
                            &nbsp;
                            &nbsp;
                            See LL(1) table
                        </a>
                    </li>
                    <li>
                        <a 
                            className   = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick={() => {
                                if(props.Grammar.FSA == null){
                                    M.toast({html: "This grammar doesn't have any associated automata"})
                                    return
                                }
                                props.LL1Viewer()
                            }}
                        >
                            <i className="material-icons">check</i>
                            &nbsp;
                            &nbsp;
                            Parse String with LL(1) algorithm
                        </a>
                    </li>
                </ul>

                <div className="divider" style={{backgroundColor: "#e3f2fd"}}></div>

                <ul>
                    <li>
                        <a 
                            className   = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick={() => {
                                if(props.Grammar.FSA == null){
                                    M.toast({html: "This grammar doesn't have any associated automata"})
                                    return
                                }
                                props.EarleyViewer()
                            }}
                        >
                            <i className="material-icons">check</i>
                            &nbsp;
                            &nbsp;
                            Parse String with Earley algorithm
                        </a>
                    </li>
                </ul>

                <div className="divider" style={{backgroundColor: "#e3f2fd"}}></div>

                <ul>
                    <li>
                        <a className = "waves-effect waves-green btn-flat blue-text text-lighten-5"
                            onClick  = {() => {
                                let message = "Introduce the ID for the new automata:\n"
                                let i = 0
                                message += props.Automatas.map(fsa => "" + (i++) + ": " + fsa.getName()).join("\n")
                                let idx = prompt(message)
                                if(idx == null) return
                                let newIdx = Number(idx)
                                if(isNaN(newIdx)) return
                                if(0 <= newIdx && newIdx < i){
                                    props.Grammar.FSA = props.Automatas[newIdx]
                                    M.toast({html: "The new automata for the grammar \"" + props.Grammar.getName() + "\" is now \"" + props.Grammar.FSA.getName() + "\""})
                                }
                            }}
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
