import React from "react"
import Style from "./Style.css"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token } from "../../CoreLogic/Token";

export interface RecursiveViewerProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

    
export default class RecursiveViewer extends React.Component<RecursiveViewerProps, {}> {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let codeNode = document.getElementById("RealCode")

        //@ts-ignore
        hljs.highlightBlock(codeNode)
    }

    render() {
        const tokenById: Map<tokenID, Token> = new Map()
        this.props.Tokens.forEach( (item, name) => {
            tokenById.set(item.id, {name: name, description: item.description})
        })

        return (
            <div>
                <h4 className="blue-grey-text text-darken-4">Recursive descent parser for Grammar {this.props.Grammar.getName()}</h4>

                <pre className={Style.codeWrapper}>
                    <code id="RealCode" className={`z-depth-2 ${Style.Code}`}>
                        {
                            this.props.Grammar.recursiveDescent()
                        }
                    </code>
                </pre>

            </div>
        )
    }
    
}