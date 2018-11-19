import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token, TokenEOF } from "../../CoreLogic/Token";

import * as Style from "./Style.css"

export interface SeeLL1TableProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

const SeeLL1Table: React.StatelessComponent<SeeLL1TableProps> = (props: SeeLL1TableProps) => {

    const tokenById: Map<tokenID, Token> = new Map()
    props.Tokens.forEach( (item, name) => {
        tokenById.set(item.id, {name: name, description: item.description})
    })

    return (
        <div>
            <h4 className="blue-grey-text text-darken-4">LL(1) table for Grammar {props.Grammar.getName()}</h4>

            <table>
                <thead>
                    <tr key={`header`}>
                        <td>&nbsp;</td>
                        {
                            props.Grammar.terminalSymbols.toArray().map(c => 
                                <td className={Style.TDHeader} key={`header ${c}`}>{tokenById.get(c)!.name}</td>
                            )
                        }
                        <td className={Style.TDHeader}>EOF</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.Grammar.nonTerminalSymbols.toArray().map(LHS => {
                            let row = props.Grammar.LL1Table!.get(LHS)!
                            return (
                                <tr key={`row ${LHS}`}>
                                    <td className={Style.TDHeader} >{LHS}</td>
                                    {
                                        [...props.Grammar.terminalSymbols.toArray(), TokenEOF].map(c => {
                                            let strProd = ""
                                            if(row.has(c)){
                                                let RHS = row.get(c)!.RHS
                                                strProd = RHS.map(d =>{
                                                    if(tokenById.has(d)){
                                                        return tokenById.get(d)!.name
                                                    }else{
                                                        return d
                                                    }
                                                }).join(" ")
                                                if(RHS.length == 0) strProd = "ε";
                                            }
                                            return (
                                                <td className={Style.TDText} key={`item ${LHS} ${c}`}>{strProd}</td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                    {
                        [...props.Grammar.terminalSymbols.toArray(), TokenEOF].map(c =>
                            <tr className={Style.TDText} key={`row ${c}`}>
                                <td className={Style.TDHeader}>{tokenById.get(c)!.name}</td>
                                {
                                    [...props.Grammar.terminalSymbols.toArray(), TokenEOF].map(d => {
                                        if(c == d){
                                            if(c == TokenEOF) return (<td key={`item ${c} ${d}`}>accepted</td>)
                                            else return (<td className={Style.TDText} key={`item ${c} ${d}`}>pop</td>)
                                        }
                                        else return (<td className={Style.TDText} key={`item ${c} ${d}`}>&nbsp;</td>)
                                    })
                                }
                            </tr>
                        )
                    }
                </tbody>
            </table>

        </div>
    )
}
export default SeeLL1Table