import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token } from "../../CoreLogic/Token";

export interface SeeGrammarProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

const SeeGrammar: React.StatelessComponent<SeeGrammarProps> = (props: SeeGrammarProps) => {

    const tokenById: Map<tokenID, Token> = new Map()
    props.Tokens.forEach( (item, name) => {
        tokenById.set(item.id, {name: name, description: item.description})
    })

    setTimeout(() => {
        const elements = document.querySelectorAll('.tooltipped')
        M.Tooltip.init(elements, {})
    }, 900)

    return (
        <div>
            <h4 className="blue-grey-text text-darken-4">Grammar: {props.Grammar.getName()}</h4>

            <h5 className="blue-grey-text text-darken-4">Terminal Symbols</h5>
            <ul className="browser-default">
                {
                    props.Grammar.terminalSymbols.toArray().map( (terminalSymbol, index) => {
                        const tokenName = tokenById.get(terminalSymbol)
                        return (
                            <li key={`token ${index}`}>
                                {terminalSymbol}: {tokenName != undefined? tokenName.name : "Unknown name"}
                            </li>
                        )
                    })
                }
            </ul>

            <br />

            <h5 className="blue-grey-text text-darken-4">Not Terminal Symbols</h5>
            <ul className="browser-default">
                {
                    props.Grammar.nonTerminalSymbols.toArray().map( (nonterminalSymbol, index) =>
                        <li key={`token non${index}`}>
                            {nonterminalSymbol}
                        </li>
                    )
                }
            </ul>

            <h5 className="blue-grey-text text-darken-4">Rules</h5>

            The initial symbol is {props.Grammar.initialSymbol}
            <table className="browser-default">
                <tbody>
                    {
                        props.Grammar.productions.toArray().map( (productionData) =>
                            <tr key={`production ${productionData[0]}`}>
                                <td>{productionData[0]}</td>
                                <td>{" => "}</td>
                                <td>
                                    {
                                        productionData[1].toArray()
                                        .map( (production, productionIndex) => {
                                            return (
                                                <React.Fragment key={`production ${productionIndex}`}>
                                                <span
                                                    className     = "tooltipped" 
                                                    data-position = "top" 
                                                    data-tooltip  = {production.callback == null ? "" : production.callback.toString()}
                                                >
                                                {
                                                    production.RHS.length > 0 ? 
                                                    production.RHS.map( c => {
                                                        if (typeof c == 'number') {
                                                            const tokenName = tokenById.get(c)
                                                            return (tokenName != undefined)? tokenName.name : "Unknown name"
                                                        }
                                                        else return c
                                                    }).join(" ") : "ε"
                                                }
                                                </span>
                                                {
                                                    (productionIndex + 1 == productionData[1].size())?
                                                    "" : <span> {" | "} <br /> </span>
                                                }
                                                
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            
        </div>
    )
}
export default SeeGrammar