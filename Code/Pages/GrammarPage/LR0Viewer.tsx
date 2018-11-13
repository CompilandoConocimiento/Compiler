import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token } from "../../CoreLogic/Token";

export interface LR0ViewerProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

export interface LR0ViewerState {
    testString: string,
    table: Array<JSX.Element> | null,
    tokenById: Map<tokenID, Token>
}

export default class LR0Viewer extends React.Component<LR0ViewerProps, LR0ViewerState> {
    
    constructor(props: LR0ViewerProps) {
        super (props)

        const tokenById: Map<tokenID, Token> = new Map()

        props.Tokens.forEach( (item, name) => {
            tokenById.set(item.id, {name: name, description: item.description})
        })

        this.state = {
            testString: "",
            table: null, 
            tokenById: tokenById,
        }

    }

    createNewTable () {
        const newTable: Array<JSX.Element> = []
        let row = 0

        const result = this.props.Grammar.parseStringWithLR0(this.state.testString, (stackContent, position, action) => {
            newTable.push(
                <tr key={`row ${row++}`}>
                    <td>
                        {
                            stackContent.map((c, idx) => {
                                if(this.props.Grammar.isNonTerminal(c)){
                                    return c
                                }else if(idx%2==1 && this.props.Grammar.isTerminal(c)){
                                    return this.state.tokenById.get(c)!.name
                                }else{
                                    return "S" + c
                                }
                            }).join(" ")
                        }
                    </td>
                    <td>
                        {this.state.tokenById.get(position)!.name}
                    </td>
                    <td>
                        {
                            action == null ? "error" : (typeof action === "object" ? action.LHS + " => " + action.rule.RHS.map(c => {
                                if(this.state.tokenById.has(c)){
                                    return this.state.tokenById.get(c)!.name
                                }else{
                                    return c
                                }
                            }).join(" ") + (action.rule.RHS.length == 0 ? "ε" : "") : "S" + action)
                        }
                    </td>
                </tr>
            )
        })

        if(result == null){
            M.toast({html: "Not a LR(0) grammar"})
            this.setState({table: null})
            document.getElementById("graphTree")!.innerHTML = ""
            return
        }

        if (result.derivations.length == 0) {
            M.toast({html: "Not a valid string"})
            document.getElementById("graphTree")!.innerHTML = ""
        }else{
            M.toast({html: "Valid string"})

            let parseResult = this.props.Grammar.executeActions(result)
            window['parseResult'] = parseResult
            console.log(parseResult)

            this.props.Grammar.graph(document.getElementById("graphTree")!, result)

            if (typeof parseResult === 'string' || typeof parseResult === 'number') 
                M.toast({html: "Result: " + String(parseResult)})
        }

        this.setState({table: newTable})

    }

    render () {
        return (
            <div>
                <h4 className="blue-grey-text text-darken-4">LR(0) parser using {this.props.Grammar.getName()}</h4>

                <div className="row">
                    <div className="input-field col s10">
                        <textarea 
                            id          = "testString"
                            value       = {this.state.testString}
                            onChange    = {(e) => {this.setState({testString: e.target.value})}}
                        />
                        <label htmlFor="testString">String to parse</label>
                    </div>

                    <div className="btn green waves-effect" onClick={() => this.createNewTable()}>
                        Parse it!
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>Stack</td>
                            <td>Current token</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.table}
                    </tbody>
                </table>

                <div id="graphTree" style={{height: "25rem"}}></div>

            </div>
        )
    }
}