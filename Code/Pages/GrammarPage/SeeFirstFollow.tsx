import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token, TokenDefault } from "../../CoreLogic/Token";

export interface SeeFirstFollowProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

const SeeFirstFollow: React.StatelessComponent<SeeFirstFollowProps> = (props: SeeFirstFollowProps) => {

    const tokenById: Map<tokenID, Token> = new Map()
    props.Tokens.forEach( (item, name) => {
        tokenById.set(item.id, {name: name, description: item.description})
    })

    return (
        <div>
            <h4 className="blue-grey-text text-darken-4">First and Follow sets for Grammar {props.Grammar.getName()}</h4>

            <h5 className="blue-grey-text text-darken-4">First sets</h5>
            <ul className="browser-default">
                {
                    props.Grammar.nonTerminalSymbols.toArray().map( LHS =>
                        <li key={`first ${LHS}`}>
                            First({LHS}) = &#123;
                            {
                                props.Grammar.first.get(LHS)!.toArray().map(c => {
                                    if(c === TokenDefault){
                                        return "ε"
                                    }else{
                                        return tokenById.get(c)!.name
                                    }
                                }).join(", ")
                            }
                            &#125;
                        </li>
                    )
                }
            </ul>

            <h5 className="blue-grey-text text-darken-4">Follow sets</h5>
            <ul className="browser-default">
                {
                    props.Grammar.nonTerminalSymbols.toArray().map( LHS =>
                        <li key={`follow ${LHS}`}>
                            Follow({LHS}) = &#123;
                            {
                                props.Grammar.follow.get(LHS)!.toArray().map(c => 
                                    tokenById.get(c)!.name
                                ).join(", ")
                            }
                            &#125;
                        </li>
                    )
                }
            </ul>

        </div>
    )
}
export default SeeFirstFollow