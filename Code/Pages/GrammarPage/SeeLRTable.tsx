import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token, TokenEOF } from "../../CoreLogic/Token";

import * as Style from "./Style.css"

export interface SeeLRTableProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
    type: number
}

const SeeLRTable: React.StatelessComponent<SeeLRTableProps> = (props: SeeLRTableProps) => {

    const tokenById: Map<tokenID, Token> = new Map()
    props.Tokens.forEach( (item, name) => {
        tokenById.set(item.id, {name: name, description: item.description})
    })

    const strType = props.type == 0 ? "LR(0)" : (props.type == 1 ? "LR(1)" : "LALR(1)")

    return (
        <div>
            <h4 className="blue-grey-text text-darken-4">{strType} table for Grammar {props.Grammar.getName()}</h4>

            <table>
                <thead>
                    <tr key={`header`}>
                        <td>&nbsp;</td>
                        {
                            [...props.Grammar.terminalSymbols.toArray(), TokenEOF, ...props.Grammar.nonTerminalSymbols.toArray()].map(c => {
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
                        Array.from(props.Grammar.LRTable!.keys()).map(stateID => {
                            let row = props.Grammar.LRTable!.get(stateID)!
                            return (
                                <tr key={`row ${stateID}`}>
                                    <td className={Style.TDHeader} >State {stateID}</td>
                                    {
                                        [...props.Grammar.terminalSymbols.toArray(), TokenEOF, ...props.Grammar.nonTerminalSymbols.toArray()].map(c => {
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
export default SeeLRTable