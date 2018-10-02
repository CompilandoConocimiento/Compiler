import React from "react"
import {FiniteStateAutomata} from "../../CoreLogic/FiniteStateAutomata"
import {Lexer} from "../../CoreLogic/Lexer"
import {TokenItem, TokenError, TokenEOF} from "../../CoreLogic/Token"

export interface propsType {
    FSA: FiniteStateAutomata,
    Tokens: Map<String, TokenItem>,
}

export interface stateType {
    stringData: string,
    FSA: FiniteStateAutomata,
    table: Array<JSX.Element> | null
}


export default class LexerViewer extends React.Component<propsType, stateType> {

    constructor(props: propsType) {
        super (props)

        this.state = {
            stringData: "",
            FSA: this.props.FSA,
            table: null,  
        }

    }

    static getDerivedStateFromProps(nextProps: propsType, preState: stateType) {
        if (nextProps.FSA == preState.FSA) return null
        return {stringData: preState.stringData, FSA: nextProps.FSA}
    }

    createNewTable () {

        const tokenAsArray: Array<[Number, String]> = [...this.props.Tokens.keys()].map( (tokenName) => {
            const data: [Number, String] = [this.props.Tokens.get(tokenName)!.id, tokenName]
            return data
        })

        const TokenID: Map<Number, String> = new Map(tokenAsArray)

        const lexer = new Lexer(this.state.FSA, this.state.stringData)
        const newTable: Array<JSX.Element> = []
        let prevIndex = 0;
        let currentToken = 0;
        while (true) {
            currentToken = lexer.getNextToken()
            if (currentToken == TokenError) lexer.advance()

            newTable.push(
                <tr key={prevIndex}>
                    <td> {this.state.stringData.substring(prevIndex, lexer.position)} </td>
                    <td> {currentToken} </td>
                    <td> {this.props.Tokens.get(TokenID.get(currentToken)!)!.description} </td>
                </tr>
            )

            prevIndex = lexer.position
            if (currentToken == TokenEOF) break
        }

        this.setState({table: newTable})

    }

    render () {
        if (this.props.FSA == null) return (
            <div id="SeeLexicalResultModal" className="modal modal-fixed-footer"></div>
        )

        return (
            <div className="container">
                
                <h4>Lexical Analysis using {this.state.FSA.getName()}</h4>

                <div className="row">
                    <div className="input-field col s10">
                        <input 
                            id          = "stringData"
                            type        = "text" 
                            value       = {this.state.stringData}
                            onChange    = {(e) => {this.setState({stringData: e.target.value})}}
                        />
                        <label htmlFor="stringData">String to analyze</label>
                    </div>

                    <div className="btn green waves-effect" onClick={() => this.createNewTable()}>
                        Check it!
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>Lexeme</td>
                            <td>Token</td>
                            <td>Token Name</td>
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