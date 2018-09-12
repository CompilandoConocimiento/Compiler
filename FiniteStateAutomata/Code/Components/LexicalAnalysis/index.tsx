import React from "react"
import {FiniteStateAutomata} from "../../FiniteStateAutomata/FiniteStateAutomata"
import {Lexer} from "../../FiniteStateAutomata/Lexer"
import {token, tokenDescriptions} from "../../FiniteStateAutomata/Types"

export interface propsType {
    FSA: FiniteStateAutomata
}

export interface stateType {
    stringData: string,
    FSA: FiniteStateAutomata,
    table: Array<JSX.Element> | null
}


export default class SeeLexicalResult extends React.Component<propsType, stateType> {

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

        console.log("sdsd")


        const lexer = new Lexer(this.state.FSA, this.state.stringData)
        const newTable: Array<JSX.Element> = []
        let currentIndex = 0;
        while ( true ) {
            let currentToken = lexer.getNextToken()
            if (currentToken.token == token.Error) {
                lexer.advance()
            }
            newTable.push(
                <tr key={currentIndex}>
                    <td> {this.state.stringData.substring(currentIndex, currentToken.position)} </td>
                    <td> {currentToken.token} </td>
                    <td> {tokenDescriptions.get(currentToken.token)} </td>
                </tr>
            )

            currentIndex = currentToken.position
            if (currentToken.token == token.EOF) break
        }

        this.setState({table: newTable})

    }

    render () {
        if (this.props.FSA == null) return (
            <div id="SeeLexicalResultModal" className="modal modal-fixed-footer"></div>
        )

        return (
            <div id="SeeLexicalResultModal" className="modal modal-fixed-footer">
                <div className="modal-content container">
                    
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
                                <td>String</td>
                                <td>token</td>
                                <td>Name</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.table}
                        </tbody>
                    </table>


                </div>
                <div className="modal-footer">
                    <a className="modal-close waves-effect waves-green btn-flat">
                        Close
                    </a>
                </div>
            </div>
        )
    }
    

}
