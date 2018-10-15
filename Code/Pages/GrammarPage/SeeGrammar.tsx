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
                    Array.from(props.Grammar.terminalSymbols).map( (terminalSymbol, index) => {
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
                    Array.from(props.Grammar.nonTerminalSymbols).map( (nonterminalSymbol, index) =>
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
                        Array.from(props.Grammar.productions).map( (productionData) =>
                            <tr key={`production ${productionData[0]}`}>
                                <td>{productionData[0]}</td>
                                <td>{" => "}</td>
                                <td>
                                    {
                                        Array.from(productionData[1])
                                        .map( (production, productionIndex) => {
                                            if (production.RHS.length == 0) 
                                                return (
                                                    <React.Fragment key={`production ${productionIndex}`}>
                                                        <span
                                                        className     = "tooltipped" 
                                                        data-position = "top" 
                                                        data-tooltip  = {production.callback == null ? "" : production.callback.toString()}
                                                        >
                                                            <span key={`production ${productionIndex}`}> &epsilon; </span>
                                                        </span>
                                                    </React.Fragment>
                                                )

                                            return (
                                                <React.Fragment key={`production ${productionIndex}`}>
                                                <span
                                                    className     = "tooltipped" 
                                                    data-position = "top" 
                                                    data-tooltip  = {production.callback == null ? "" : production.callback.toString()}
                                                >
                                                {
                                                    production.RHS.map( (element, rhsIndex) => {
                                                        let text = ""
                                                        if (typeof element == 'number') {
                                                            const tokenName = tokenById.get(element)
                                                            text = (tokenName != undefined)? tokenName.name : "Unknown name"
                                                        }
                                                        else text = element
                
                                                        return (
                                                            <span key={`production - ${productionIndex} ${rhsIndex}`}>
                                                                {text}
                                                                {
                                                                    (rhsIndex + 1 ==production.RHS.length)?
                                                                    "" : " "
                                                                }
                                                            </span>
                                                        )
                                                    })
                                                }
                                                </span>
                                                {
                                                    (productionIndex + 1 == productionData[1].size)?
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