import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token, TokenEOF } from "../../CoreLogic/Token";

export interface LL1ViewerProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

export interface LL1ViewerState {
    testString: string,
    table: Array<JSX.Element> | null,
    tokenById: Map<tokenID, Token>
}

export default class LL1Viewer extends React.Component<LL1ViewerProps, LL1ViewerState> {
    
    constructor(props: LL1ViewerProps) {
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

    static getDerivedStateFromProps(_, preState: LL1ViewerState) {
        return {testString: preState.testString}
    }

    createNewTable () {
        const newTable: Array<JSX.Element> = []
        let row = 0

        const result = this.props.Grammar.parseStringWithLL1(this.state.testString, (stackContent, position, action) => {
            if(action.length == 0) action.push("ε")
            newTable.push(
                <tr key={`row ${row++}`}>
                    <td>
                        {
                            stackContent.map(c => {
                                if(c === TokenEOF || this.props.Grammar.isTerminal(c)){
                                    return this.state.tokenById.get(c)!.name
                                }else{
                                    return c
                                }
                            }).join(" ")
                        }
                    </td>
                    <td>
                        {this.state.tokenById.get(position)!.name}
                    </td>
                    <td>
                        {
                            action.map(c => {
                                if(this.props.Grammar.isTerminal(c)){
                                    return this.state.tokenById.get(c)!.name
                                }else{
                                    return c
                                }
                            }).join(" ")
                        }
                    </td>
                </tr>
            )
        })

        if(result == null){
            M.toast({html: "Not a LL(1) grammar"})
            this.setState({table: null})
            return
        }

        if (result.derivations.length == 0) {
            M.toast({html: "Not a valid string"})                            
        }else{
            M.toast({html: "Valid string"})

            let parseResult = this.props.Grammar.executeActions(result)
            window['parseResult'] = parseResult
            console.log(parseResult)

            if (typeof parseResult === 'string' || typeof parseResult === 'number') 
                M.toast({html: "Result: " + String(parseResult)})
        }

        this.setState({table: newTable})

    }

    render () {
        return (
            <div>
                <h4 className="blue-grey-text text-darken-4">LL(1) parser using {this.props.Grammar.getName()}</h4>

                <div className="row">
                    <div className="input-field col s10">
                        <input 
                            id          = "testString"
                            type        = "text" 
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

            </div>
        )
    }
}