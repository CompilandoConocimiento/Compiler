import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token, TokenEOF } from "../../CoreLogic/Token";

import * as Style from "./Style.css"

export interface SeeLR0TableProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

const SeeLR0Table: React.StatelessComponent<SeeLR0TableProps> = (props: SeeLR0TableProps) => {

    const tokenById: Map<tokenID, Token> = new Map()
    props.Tokens.forEach( (item, name) => {
        tokenById.set(item.id, {name: name, description: item.description})
    })

    return (
        <div>
            <h4 className="blue-grey-text text-darken-4">LR(0) table for Grammar {props.Grammar.getName()}</h4>

            <table>
                <thead>
                    <tr key={`header`}>
                        <td>&nbsp;</td>
                        {
                            [...props.Grammar.terminalSymbols, TokenEOF, ...props.Grammar.nonTerminalSymbols].map(c => {
                                if(c === TokenEOF || props.Grammar.isTerminal(c))
                                    return (<td className={Style.TDHeader} key={`header ${c}`}>{tokenById.get(c as tokenID)!.name}</td>)
                                else
                                    return (<td className={Style.TDHeader} key={`header ${c}`}>{c}</td>)
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from(props.Grammar.LR0Table!.keys()).map(stateID => {
                            let row = props.Grammar.LR0Table!.get(stateID)!
                            return (
                                <tr key={`row ${stateID}`}>
                                    <td className={Style.TDHeader} >State {stateID}</td>
                                    {
                                        [...props.Grammar.terminalSymbols, TokenEOF, ...props.Grammar.nonTerminalSymbols].map(c => {
                                            let strProd = ""
                                            if(row.has(c)){
                                                let action = row.get(c)!
                                                if(typeof action === "number"){
                                                    strProd = "Go to state " + action
                                                }else{
                                                    strProd = "Reduce " + action.LHS + " => "
                                                    strProd += action.rule.RHS.map(d =>{
                                                        if(tokenById.has(d)){
                                                            return tokenById.get(d)!.name
                                                        }else{
                                                            return d
                                                        }
                                                    }).join(" ")
                                                    if(action.rule.RHS.length == 0) strProd += "ε";
                                                }
                                            }
                                            return (
                                                <td className={Style.TDText} key={`item ${stateID} ${c}`}>{strProd}</td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

        </div>
    )
}
export default SeeLR0Table