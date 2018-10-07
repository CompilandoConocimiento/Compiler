import React from "react"

import { CFG, serializedCFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token, TokenJSON } from "../../CoreLogic/Token"
import GrammarCard from './GrammarCard'
import SeeGrammar from './SeeGrammar'

import Style from './Style.css'
import { saveFile } from "../../Helpers/SaveFile";
import { loadFileAsJSON } from "../../Helpers/LoadFile";
import { FiniteStateAutomata } from "../../CoreLogic/FiniteStateAutomata";

type GrammarPageState = {
    selectedGrammars: Array<number>
    ModalData: M.Modal | null,
    ModalContent: JSX.Element,
}

type GrammarPageProps = {
    Grammars: Array<CFG>,
    addNewTokens(newTokens: Array<Token>): void,
    Tokens: Map<string, TokenItem>,
    AddAutomata: (newFSA: FiniteStateAutomata) => void,
    AddGrammar: (newCFG: CFG) => void,
    DeleteGrammar: (number) => void
}

export default class GrammarPage extends React.Component<GrammarPageProps, GrammarPageState> {

    constructor(props) {
        super (props)

        this.state = {
            selectedGrammars: [],
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

    saveGrammars (Grammars: CFG[]) {
        const tokenById: Map<tokenID, Token> = new Map()
        this.props.Tokens.forEach( (item, name) => {
            tokenById.set(item.id, {name: name, description: item.description})
        })

        let TokensUsed: Set<tokenID> = new Set()

        const JSONGrammars = Grammars.map(
            cfg => {
                TokensUsed = new Set([...TokensUsed, ...[...cfg.FSA.states.values()].map(state => state.token)])
                TokensUsed = new Set([...TokensUsed, ...cfg.terminalSymbols.values()])
                return cfg.serialize()
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

        const data: serializedCFG = {
            Tokens: JSONTokens,
            Grammars: JSONGrammars
        }

        saveFile("Grammars.json", JSON.stringify(data,null,2) )
    }

    ShowOperations() {
        return (
            <div className="fixed-action-btn">
                <a className="btn-floating btn-large red">
                    <i className="large material-icons">mode_edit</i>
                </a>

                <ul className="left-align" style={{"marginLeft": "-4.5rem"}}>
                    <li>
                        <a 
                            className = "btn-floating indigo" style={{"width": "130px"}}
                            onClick   = {() => {return null}}
                        >
                            Create Grammar
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating blue" 
                            style     = {{"width": "120px"}} 
                            onClick   = {() => {this.setState({selectedGrammars: []})}}
                        >
                            Clear
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating green" 
                            style     = {{"width": "120px"}} 
                            onClick   = {() => {
                                const data = this.state.selectedGrammars
                                    .map( index => this.props.Grammars[index] )

                                this.saveGrammars(data)
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
                Grammars
            </h3>

            <div className="container">

                <div className={Style.Container}>
                    {this.props.Grammars.map(
                        (grammar, index) => {
                            return (
                                <GrammarCard 
                                    key     = {`grammar ${index}`}
                                    Grammar = {grammar}
                                    Tokens = {this.props.Tokens}
                                    isSelected = {this.state.selectedGrammars!.indexOf(index) != -1}
                                    forceUpdate    = {() => this.callForceUpdate()}
                                    DeleteGrammar = {() => this.props.DeleteGrammar(index)}
                                    SelectGrammar = {() => {
                                        this.setState( preState => {
                                            if (preState.selectedGrammars.indexOf(index) != -1) {
                                                preState.selectedGrammars.splice( 
                                                    preState.selectedGrammars.indexOf(index), 1 
                                                );
                                            }
                                            else preState.selectedGrammars.push(index)

                                            return {selectedGrammars: preState.selectedGrammars}
                                        })
                                    }}
                                    SeeGrammar = {
                                        () => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: 
                                                    <SeeGrammar 
                                                        Grammar = {grammar}
                                                        Tokens  = {this.props.Tokens}
                                                    />
                                                }
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
                                    e => {
                                        loadFileAsJSON(e.target, (data: serializedCFG) => {
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

                                            let newGrammars: Array<CFG> = data.Grammars
                                                .map( cfg => CFG.deserialize(cfg)!)
                                                .filter (cfg => cfg != null)
                                                
                                            newGrammars.forEach(cfg => {
                                                cfg.FSA.states.forEach(
                                                    (state) => {
                                                        const tokenName = tokenById.get(state.token)!.name
                                                        state.token = this.props.Tokens.get(tokenName)!.id as tokenID
                                                    }
                                                )

                                                cfg.productions.forEach( (rules, _) =>{
                                                    rules.forEach(production =>{
                                                        production.RHS = production.RHS.map(c =>{
                                                            if(cfg.isTerminal(c)){
                                                                const tokenName = tokenById.get(c)!.name
                                                                return this.props.Tokens.get(tokenName)!.id as tokenID
                                                            }else{
                                                                return c
                                                            }
                                                        })
                                                    })
                                                })

                                                cfg.terminalSymbols = new Set(Array.from(cfg.terminalSymbols).map(terminal =>{
                                                    const tokenName = tokenById.get(terminal)!.name
                                                    return this.props.Tokens.get(tokenName)!.id as tokenID
                                                }))
                                                
                                                this.props.AddAutomata(cfg.FSA)
                                                this.props.AddGrammar(cfg)
                                            })
                                        })
                                        e.currentTarget.value = ""
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


            <div id="ModalGrammar" className="modal modal-fixed-footer">
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
        
            { this.ShowOperations() }
            
            </React.Fragment>
        )
    }

}
