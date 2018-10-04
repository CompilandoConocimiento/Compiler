import React from "react"

import {FiniteStateAutomata, serializedAutomata} from "../../CoreLogic/FiniteStateAutomata"
import {TokenItem, TokenJSON, Token, tokenID} from "../../CoreLogic/Token"
import AutomataCard from "./AutomataCard"
import SeeAutomata from "./SeeAutomata"
import LexerViewer from "./LexerViewer"
import { saveFile } from '../../Helpers/SaveFile'
import { loadFileAsJSON } from '../../Helpers/LoadFile'
import {regularExpressionsGrammar} from '../../Helpers/DefaultCreations'

import Style from "./Style.css"

type AutomataPageState = {
    selectedAutomatas: Array<number>,
    ModalData: M.Modal | null,
    ModalContent: JSX.Element,
}

type AutomataPageProps = {
    Tokens: Map<string, TokenItem>,
    addNewTokens(newTokens: Array<Token>): void,
    Automatas: FiniteStateAutomata[],
    DeleteAutomata: (number) => void,
    AddAutomata: (newFSA: FiniteStateAutomata) => void
}

export default class AutomataPage extends React.Component<AutomataPageProps, AutomataPageState> {

    constructor(props) {
        super (props)

        this.state = {
            selectedAutomatas: [],
            ModalData: null,
            ModalContent: <br />
        }
    }

    componentDidMount() {
        const buttonNodes = document.querySelectorAll('.fixed-action-btn')
        const modalNodes = document.querySelectorAll('.modal')
        M.FloatingActionButton.init(buttonNodes, {hoverEnabled: false})

        const ModalData = M.Modal.init(modalNodes, {inDuration: 120, outDuration: 100})[0]
        this.setState({ModalData: ModalData})
    }
    
    callForceUpdate () {
        this.forceUpdate()
    }

    saveAutomatas (Automatas: FiniteStateAutomata[]) {
        const tokenById: Map<tokenID, Token> = new Map()
        this.props.Tokens.forEach( (item, name) => {
            tokenById.set(item.id, {name: name, description: item.description})
        })

        let TokensUsed: Set<tokenID> = new Set()

        const JSONAutomatas = Automatas.map(
            fsa => {
                TokensUsed = new Set([...TokensUsed, ...[...fsa.states.values()].map(state => state.token)])
                return fsa.serialize()
            }
        )

        const JSONTokens: Array<TokenJSON> = Array.from(TokensUsed).map( tokenID => {
            const token = tokenById.get(tokenID)!

            return {
                id: tokenID, 
                description: token.description,
                name: token.name
            }
        })

        const data: serializedAutomata = {
            Tokens: JSONTokens,
            Automatas: JSONAutomatas,
        }

        saveFile("Automatas.json", JSON.stringify(data,null,2) )
    }

    showOperationFAB() {

        const binaryOperation = (operation: (a, b) => any) => {
            if (this.state.selectedAutomatas.length == 0) {
                M.toast({html: "No selected automatas"})
                return
            }

            let fsa1: FiniteStateAutomata = this.props.Automatas[this.state.selectedAutomatas[0]].clone()
            const fsa2 = !this.props.Automatas[this.state.selectedAutomatas[1]]? null: 
            this.props.Automatas[this.state.selectedAutomatas[1]].clone()

            fsa1 = operation(fsa1, fsa2)
            this.props.AddAutomata(fsa1)
            this.setState({selectedAutomatas: []})
        }

        const SuperJoinOperation = () => {
            if (this.state.selectedAutomatas.length == 0) {
                M.toast({html: "No selected automatas"})
                return
            }

            const FSAs = this.state.selectedAutomatas.map(index => {
                return this.props.Automatas[index].clone()
            })

            const newFSA = FiniteStateAutomata.superJoin(FSAs)
            this.setState({selectedAutomatas: []})
            this.props.AddAutomata(newFSA)
        }

        const join            = () => binaryOperation((a, b) => a.join(b))
        const concat          = () => binaryOperation((a, b) => a.concat(b))
        const positiveClosure = () => binaryOperation((a, _) => a.positiveClosure(a))
        const kleeneClosure   = () => binaryOperation((a, _) => a.kleeneClosure(a))
        const optionalClosure = () => binaryOperation((a, _) => a.optionalClosure(a))
        const toDFA           = () => binaryOperation((a, _) => a.toDFA())
        const superJoin       = SuperJoinOperation

        return (
            <div className="fixed-action-btn">
                <a className="btn-floating btn-large red">
                    <i className="large material-icons">mode_edit</i>
                </a>

                <ul className="left-align" style={{"marginLeft": "-4.5rem"}}>
                    <li>
                        <a className="btn-floating" style={{"width": "130px"}} onClick={join}>
                            Join
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "130px"}} onClick={concat}>
                            Concatenate
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "130px"}} onClick={positiveClosure}>
                            Positive Closure
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "130px"}} onClick={kleeneClosure} >
                            Kleene Closure
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "130px"}} onClick={optionalClosure} >
                            Optional Closure
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "130px"}} onClick={toDFA} >
                            Deterministic
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "130px"}} onClick={superJoin} >
                            Super Join
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating indigo" style={{"width": "130px"}}
                            onClick   = {() => {
                                const stringText = prompt("Give me a string to recognize")
                                if (stringText == null) return 
                                const haveMeta: boolean = confirm("Does it have metachars?")
                                const name = prompt("Give me a name for the automata")
                                if (name == null) return 

                                const newAutomata = FiniteStateAutomata.basicFSA(stringText, haveMeta)
                                newAutomata.setName(name)
                                this.props.AddAutomata(newAutomata)
                            }}
                        >
                            Create Basic Automata
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating indigo" style={{"width": "130px"}}
                            onClick   = {() => {
                                let regularExpresion = prompt("Give me a Regular Expression")!
                                console.log(regularExpresion)
                                const result = regularExpressionsGrammar.parseString(regularExpresion)
                                console.log(result)
                                
                                if (result.derivations.length == 0) {
                                    M.toast({html: "Not a valid Regular Expresion"})
                                    return
                                }
                                
                                const newAutomata = regularExpressionsGrammar.executeActions(result) 
                                this.props.AddAutomata(newAutomata)
                            }}
                        >
                            Create with R.E.
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating blue" 
                            style     = {{"width": "120px"}} 
                            onClick   = {() => {this.setState({selectedAutomatas: []})}}
                        >
                            Clear
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating green" 
                            style     = {{"width": "120px"}} 
                            onClick   = {() => {
                                const data = this.state.selectedAutomatas
                                    .map( index => this.props.Automatas[index] )

                                this.saveAutomatas(data)
                            }}
                        >
                            Download
                        </a>
                    </li>
                </ul>
            </div>
        )
    }

    render () {

        return (
            <React.Fragment>

            <h3 className="center blue-grey-text text-darken-3"> 
                Automatas
            </h3>

            <div className="container">
                <div className={Style.Container}>
                    {this.props.Automatas.map(
                        (fsa, index) => {
                            return (
                                <AutomataCard
                                    key            = {String(`automata ${index}`)}
                                    FSA            = {fsa}
                                    isSelected     = {this.state.selectedAutomatas!.indexOf(index) != -1}
                                    Tokens         = {this.props.Tokens}
                                    DeleteAutomata = {() => this.props.DeleteAutomata(index)}
                                    forceUpdate    = {() => this.callForceUpdate()}
                                    SelectAutomata = {() => {
                                        this.setState( preState => {
                                            if (preState.selectedAutomatas.indexOf(index) != -1) {
                                                preState.selectedAutomatas.splice( 
                                                    preState.selectedAutomatas.indexOf(index), 1 
                                                );
                                            }
                                            else preState.selectedAutomatas.push(index)

                                            return {selectedAutomatas: preState.selectedAutomatas}
                                        })
                                    }}
                                    ShowAutomata = {
                                        (FSA: FiniteStateAutomata) => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: <SeeAutomata FSA={FSA} Tokens={this.props.Tokens}/>}
                                            })
                                        }
                                    }
                                    ShowLexer = {
                                        (FSA: FiniteStateAutomata) => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: <LexerViewer FSA={FSA} Tokens={this.props.Tokens}/>}
                                            })
                                        }
                                    }
                                />
                            )
                        }
                    )}
                </div>

                <br />
                <br />

                <div className="row">
                    <div className="file-field input-field col s12">
                        <div 
                            className = "waves-effect waves-teal btn-flat btn-large indigo lighten-5"
                            style     = {{textTransform: "initial", width: "100%"}}
                        >
                            <i className="material-icons">attach_file</i>
                            &nbsp;
                            &nbsp;
                            <span>Load File</span>
                            <input 
                                id       = "fileTokens"
                                type     = "file" 
                                onChange = {
                                    (e) => {
                                        loadFileAsJSON(e.target, (data: serializedAutomata) => {
                                            const tokenById: Map<tokenID, Token> = new Map()
                                            data.Tokens.forEach(tokenData => {
                                                tokenById.set(tokenData.id, {name: tokenData.name, description: tokenData.description})
                                            })

                                            let newTokens: Array<Token> =  []
                                            
                                            tokenById.forEach( (tokenData, _) => {
                                                if (!this.props.Tokens.has(tokenData.name)) {
                                                    newTokens.push(tokenData)
                                                }
                                            })

                                            this.props.addNewTokens(newTokens)

                                            let newAutomatas: Array<FiniteStateAutomata> = data.Automatas
                                                .map( fsa => FiniteStateAutomata.deserialize(fsa)!)
                                                .filter (fsa => fsa != null)
                                                
                                            newAutomatas.forEach(fsa => {
                                                    fsa!.states.forEach(
                                                        (state) => {
                                                            const tokenName = tokenById.get(state.token)!.name
                                                            state.token = this.props.Tokens.get(tokenName)!.id as tokenID
                                                        }
                                                    )
                                                    
                                                    this.props.AddAutomata(fsa!)
                                                })
                                        })
                                    }
                                }
                            />
                        </div>
                        <div className="file-path-wrapper" style={{display: "none"}}>
                            <input id = "fileTokensMCSS" className="file-path validate" type="text" />
                        </div>

                        <br />

                    </div>
                </div>

            </div>


            <div id="ModalAutomata" className="modal modal-fixed-footer">
                <div className="modal-content">
                    { this.state.ModalContent }
                </div>
                <div className="modal-footer">
                    <a 
                        className = "modal-close waves-effect waves-green btn-flat"
                        onClick   = {() => this.state.ModalData!.close()}
                    >
                        Close
                    </a>
                </div>
            </div>
        
            { this.showOperationFAB() }
            
            </React.Fragment>
        )
    }

}
