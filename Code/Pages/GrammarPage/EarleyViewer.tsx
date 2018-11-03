import React from "react"
import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token } from "../../CoreLogic/Token";

export interface EarleyViewerProps {
    Grammar: CFG,
    Tokens: Map<string, TokenItem>
}

export interface EarleyViewerState {
    testString: string,
    sets: Array<JSX.Element> | null,
    tokenById: Map<tokenID, Token>
}

export default class EarleyViewer extends React.Component<EarleyViewerProps, EarleyViewerState> {
    
    constructor(props: EarleyViewerProps) {
        super (props)

        const tokenById: Map<tokenID, Token> = new Map()

        props.Tokens.forEach( (item, name) => {
            tokenById.set(item.id, {name: name, description: item.description})
        })

        this.state = {
            testString: "",
            sets: null, 
            tokenById: tokenById,
        }

    }

    createNewTable () {
        const newSets: Array<JSX.Element> = []
        let set = 0, cnt = 0

        const result = this.props.Grammar.parseStringWithEarley(this.state.testString, (itemSet, position) => {
            newSets.push(
                <div key={`set ${set}`}>
                    <h5 className="blue-grey-text text-darken-4">Set {set++} <b>{this.state.tokenById.get(position)!.name}</b></h5>
                    <table>
                        <tbody>
                            {
                                itemSet.map(item => {
                                    return (
                                        <tr key={`item ${cnt++}`}>
                                            <td style={{width: "2%"}}>{item.LHS}</td>
                                            <td style={{width: "2%"}}>=></td>
                                            <td style={{width: "10%"}}>
                                                {
                                                    [...item.rule.RHS, ""].map((c, idx) => {
                                                        let str = ""
                                                        if(idx == item.position){
                                                            str += "• "
                                                        }
                                                        if(this.props.Grammar.isTerminal(c)){
                                                            str += this.state.tokenById.get(c)!.name
                                                        }else{
                                                            str += c
                                                        }
                                                        return str
                                                    }).join(" ")
                                                }
                                            </td>
                                            <td style={{width: "10%"}}>({item.start})</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )
        })!

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

        this.setState({sets: newSets})

    }

    render () {
        return (
            <div>
                <h4 className="blue-grey-text text-darken-4">Earley parser using {this.props.Grammar.getName()}</h4>

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

                {this.state.sets}

                <div id="graphTree" style={{height: "25rem"}}></div>

            </div>
        )
    }
}