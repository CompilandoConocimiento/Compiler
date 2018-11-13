import React from "react"

import { CFG, serializedCFG } from "../../CoreLogic/ContextFreeGrammar"
import { TokenItem, tokenID, Token, TokenJSON, TokenError } from "../../CoreLogic/Token"
import GrammarCard from './GrammarCard'
import SeeGrammar from './SeeGrammar'
import SeeLL1Table from './SeeLL1Table'
import SeeLR0Table from './SeeLR0Table'
import SeeFirstFollow from "./SeeFirstFollow";
import LL1Viewer from "./LL1Viewer";
import LR0Viewer from "./LR0Viewer";
import EarleyViewer from "./EarleyViewer";

import Style from './Style.css'
import { saveFile } from "../../Helpers/SaveFile";
import { loadFile } from "../../Helpers/LoadFile";
import { FiniteStateAutomata } from "../../CoreLogic/FiniteStateAutomata";
import { GrammarOfGrammars } from "../../Helpers/DefaultCreations";

type GrammarPageState = {
    selectedGrammars: Array<number>
    ModalData: M.Modal | null,
    ModalContent: JSX.Element,
}

type GrammarPageProps = {
    Automatas: Array<FiniteStateAutomata>,
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
                TokensUsed = new Set([...TokensUsed, ...[...(cfg.FSA == null ? [] : cfg.FSA.states.values())].map(state => state.token)])
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

        const unaryOperation = (operation: (a: CFG) => CFG) => {
            if (this.state.selectedGrammars.length == 0) {
                M.toast({html: "No selected grammars"})
                return
            }

            const newCFGs = this.state.selectedGrammars.map(index => {
                return this.props.Grammars[index]
            })

            newCFGs.forEach(cfg => this.props.AddGrammar(operation(cfg)))

            this.setState({selectedGrammars: []})
        }

        const removeLeftRecursion = () => unaryOperation((a) => a.removeLeftRecursion())

        const augment = () => unaryOperation((a) => a.augment())

        return (
            <div className="fixed-action-btn">
                <a className="btn-floating btn-large red">
                    <i className="large material-icons">mode_edit</i>
                </a>

                <ul className="left-align" style={{"marginLeft": "-5rem"}}>
                    <li>
                        <a 
                            className = "btn-floating indigo" style={{"width": "140px"}}
                            onClick   = {() => {
                                const nonTerminalsStr = prompt("Introduce the non-terminal symbols, separated with spaces:")
                                if(nonTerminalsStr == null) return
                                const nonTerminals = nonTerminalsStr.split(" ").filter(c => c.length > 0)

                                const terminalsStr = prompt("Introduce the terminal symbols, separated with spaces. Use the name of the tokens:")
                                if(terminalsStr == null) return
                                let validTerminals: boolean = true
                                const terminals = terminalsStr.split(" ").filter(c => c.length > 0).map(c => {
                                    if(this.props.Tokens.has(c)){
                                        const id = this.props.Tokens.get(c)!.id
                                        return id
                                    }else{
                                        return TokenError
                                    }
                                }).filter(c => {validTerminals = validTerminals && (c != TokenError); return c != TokenError})
                                if(!validTerminals){
                                    M.toast({html: "Invalid terminal symbols"})
                                    return
                                }

                                const initial = prompt("Introduce the initial non-terminal:")
                                if(initial == null || initial.length == 0) return
                                if(nonTerminals.indexOf(initial) === -1){
                                    M.toast({html: "Invalid initial non-terminal"})
                                    return
                                }

                                let message = "Introduce the ID for the associated automata for this grammar:\n"
                                let i = 0
                                message += this.props.Automatas.map(fsa => "" + (i++) + ": " + fsa.getName()).join("\n")
                                let idx = prompt(message)
                                if(idx == null) return
                                let newIdx = Number(idx)
                                if(isNaN(newIdx)) return
                                if(0 <= newIdx && newIdx < i){
                                    let name = prompt("Introduce a name for ths grammar:")
                                    const newCFG = new CFG(new Set(terminals), new Set(nonTerminals), initial, this.props.Automatas[newIdx])
                                    newCFG.setName(name == null ? "" : name)
                                    this.props.AddGrammar(newCFG)
                                    M.toast({html: "Grammar added"})
                                }
                            }}
                        >
                            Create Grammar
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating indigo" style={{"width": "140px"}}
                            onClick   = {removeLeftRecursion}
                        >
                            Remove left recursion
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating indigo" style={{"width": "140px"}}
                            onClick   = {augment}
                        >
                            Augment
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating blue" 
                            style     = {{"width": "140px"}} 
                            onClick   = {() => {this.setState({selectedGrammars: []})}}
                        >
                            Clear selection
                        </a>
                    </li>
                    <li>
                        <a 
                            className = "btn-floating green" 
                            style     = {{"width": "140px"}} 
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
                                    Automatas = {this.props.Automatas}
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
                                    SeeLL1Table = {
                                        () => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: 
                                                    <SeeLL1Table 
                                                        Grammar = {grammar}
                                                        Tokens  = {this.props.Tokens}
                                                    />
                                                }
                                            })
                                        }
                                    }
                                    SeeLR0Table = {
                                        () => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: 
                                                    <SeeLR0Table 
                                                        Grammar = {grammar}
                                                        Tokens  = {this.props.Tokens}
                                                    />
                                                }
                                            })
                                        }
                                    }
                                    SeeFirstFollow = {
                                        () => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: 
                                                    <SeeFirstFollow 
                                                        Grammar = {grammar}
                                                        Tokens  = {this.props.Tokens}
                                                    />
                                                }
                                            })
                                        }
                                    }
                                    LL1Viewer = {
                                        () => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: 
                                                    <LL1Viewer 
                                                        Grammar = {grammar}
                                                        Tokens  = {this.props.Tokens}
                                                    />
                                                }
                                            })
                                        }
                                    }
                                    LR0Viewer = {
                                        () => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: 
                                                    <LR0Viewer 
                                                        Grammar = {grammar}
                                                        Tokens  = {this.props.Tokens}
                                                    />
                                                }
                                            })
                                        }
                                    }
                                    EarleyViewer = {
                                        () => {
                                            this.setState(() => {
                                                this.state.ModalData!.open()
                                                return {ModalContent: 
                                                    <EarleyViewer 
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
                                        if(e.target.files!.length == 0) return
                                        let filename = e.target.files![0].name.toLowerCase().split(".")
                                        let ext = filename.pop()
                                        if(ext === "json"){
                                            loadFile(e.target, (data: serializedCFG) => {
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
                                                    if(cfg.FSA != null){
                                                        cfg.FSA.states.forEach(
                                                            (state) => {
                                                                const tokenName = tokenById.get(state.token)!.name
                                                                state.token = this.props.Tokens.get(tokenName)!.id as tokenID
                                                            }
                                                        )
                                                    }

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
                                                    
                                                    if(cfg.FSA != null) this.props.AddAutomata(cfg.FSA)
                                                    this.props.AddGrammar(cfg)
                                                })
                                            })
                                        }else if(ext === "cfg"){
                                            loadFile(e.target, (data: string) => {
                                                let result = GrammarOfGrammars.parseStringWithEarley(data)!
                                                if(result.derivations.length == 0){
                                                    M.toast({html: "Not a valid grammar"})
                                                }else{
                                                    let newCFG = GrammarOfGrammars.executeActions(result)
                                                    newCFG.setName(filename.join("."))
                                                    this.props.AddGrammar(newCFG)
                                                }
                                            }, false)
                                        }
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
