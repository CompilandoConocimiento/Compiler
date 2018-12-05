import React from "react"
import Style from "./Style.css"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token } from "../../CoreLogic/Token";

export interface RecursiveViewer {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

const RecursiveViewer: React.StatelessComponent<RecursiveViewer> = (props: RecursiveViewer) => {

    const tokenById: Map<tokenID, Token> = new Map()
    props.Tokens.forEach( (item, name) => {
        tokenById.set(item.id, {name: name, description: item.description})
    })

    return (
        <div>
            <h4 className="blue-grey-text text-darken-4">Recursive descent parser for Grammar {props.Grammar.getName()}</h4>

            <pre className={Style.codeWrapper}>
                <code className={Style.Code}>
                    {
                        props.Grammar.recursiveDescent()
                    }
                </code>
            </pre>

        </div>
    )
}
export default RecursiveViewer