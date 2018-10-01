// ======================================================================
// ============          WEB APP IN REACT           =====================
// ======================================================================
import React from "react"
import ReactDOM from "react-dom"
import { Route, HashRouter, Switch } from 'react-router-dom'
import M from "materialize-css"

import Header from "../Header"
import Footer from "../Footer"

import { DefaultTokens, EssencialToken, getNewTokenID, TokenItem } from '../../CoreLogic/Token'
import { FiniteStateAutomata, } from '../../CoreLogic/FiniteStateAutomata'
import TokenPage from '../TokenPage/'
import AutomataPage from '../AutomataPage/'
import CardToTopic from './CardToTopic'

type AppState = {
    SideMenu: M.Sidenav | null,
    Tokens: Map<String, TokenItem>,
    Automatas: Array<any>,
    Grammars: Array<any>,
}

class App extends React.Component<{}, AppState> {

    constructor(props) {
        super (props)

        this.state = {
            SideMenu: null,
            Tokens: new Map(DefaultTokens),
            Automatas: [],
            Grammars: [],
        }
    }
 
    componentDidMount() {
        const sideDOMNode = document.getElementById('SideNav') as HTMLElement
        const modalDOMNode = document.querySelectorAll('.modal')
        
        const SideMenu = M.Sidenav.init(sideDOMNode, {})
        M.Modal.init(modalDOMNode, {})

        this.setState({SideMenu}) 
    }

    addNewTokens(newTokens: EssencialToken[]) {

        this.setState((preState) => {
            newTokens.forEach(
                (newToken) => {
                    if (preState.Tokens.has(newToken.name) == false) {
                        preState.Tokens.set(
                            newToken.name,
                            { description: newToken.description, id: getNewTokenID() }
                        )
                    }
                }
            ) 

            M.toast({html: 'New tokens added'})
            return {Tokens: preState.Tokens}
        })
    }

    render() {

        const colors: Array<string> = [
            "red lighten-2",
            "indigo lighten-2",
            "cyan lighten-1",
            "green lighten-2",
            "brown lighten-2",
        ].sort(() => Math.random() - 0.5)

          
        return (
            <React.Fragment>
                <Header />
                
                <main>
                    
                    <br />

                    <Switch>
                        <Route 
                            exact 
                            path   = '/'
                            render = {() => {
                                return (
                                    <React.Fragment>
                                        <div className="row">
                                            <div className="col s12">
                                                <CardToTopic 
                                                    name	= {"Tokens"} 
                                                    link	= {"/tokens"}
                                                    materializeCSSColor = {colors[0]} 
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col s12">
                                                <CardToTopic 
                                                    name	= {"Automatas"} 
                                                    link	= {"/automatas"}
                                                    materializeCSSColor = {colors[1]} 
                                                />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                            }}
                        />

                        <Route 
                            path   = '/tokens'
                            render = {
                                () => 
                                <TokenPage 
                                    Tokens           = {this.state.Tokens}
                                    addNewTokens     = {(newTokens: EssencialToken[]) => this.addNewTokens(newTokens)}
                                    deleteToken      = {(tokenName: String) => {
                                        this.setState(
                                            (preState) => {
                                                if (tokenName === "EOF" || tokenName === "Error") return null
                                                preState.Tokens.delete(tokenName)
                                                return {Tokens: preState.Tokens}
                                            }
                                        )
                                    }}
                                />
                            }
                        />

                        <Route 
                            path   = '/automatas'
                            render = {
                                () => 
                                <AutomataPage 
                                    Tokens = {this.state.Tokens}
                                    Automatas = {this.state.Automatas}
                                    DeleteAutomata = {(index: number) => {
                                        
                                    }}
                                    AddAutomata = {(newFSA: FiniteStateAutomata) => {
                                        this.setState(preState => {
                                            preState.Automatas.push(newFSA)
                                            return {Automatas : preState.Automatas}
                                        })
                                    }}
                                    
                                />
                            }
                        />
                    </Switch>
                    
                    <br /><br />
                    <br /><br /><br /><br />

                </main>

                <Footer />

            </React.Fragment>
        )
    }
    
}


ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById("ReactApp"))
