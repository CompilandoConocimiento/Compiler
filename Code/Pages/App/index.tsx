// ======================================================================
// ============          WEB APP IN REACT           =====================
// ======================================================================
import React from "react"
import ReactDOM from "react-dom"
import { Route, HashRouter, Switch } from 'react-router-dom'
import M from "materialize-css"

import Header from "../Header"
import Footer from "../Footer"

import { Token, DefaultTokens, EssencialToken, getNewTokenID } from '../../CoreLogic/Token'
import TokenPage from '../TokenPage/'
import AutomataPage from '../AutomataPage/'
import CardToTopic from './CardToTopic'

type AppState = {
    SideMenu: M.Sidenav | null,
    Tokens: Array<Token>,
    Automatas: Array<any>,
    Grammars: Array<any>,
}

class App extends React.Component<{}, AppState> {

    constructor(props) {
        super (props)

        this.state = {
            SideMenu: null,
            Tokens: [...DefaultTokens],
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
        const tokensNames: Set<String> = new Set(this.state.Tokens.map (t => t.name))

        newTokens = newTokens.filter( (newToken: EssencialToken) =>  {
            if (tokensNames.has(newToken.name)) return false
            tokensNames.add(newToken.name)
            return true
        })

        const newFilteredTokens = newTokens.map(
            newToken => {
                return {
                    name: newToken.name, 
                    description: newToken.description,
                    id: getNewTokenID()
                }
            } 
        )

        this.setState((preState) => {
            M.toast({html: 'New tokens added'})
            return {Tokens: [...preState.Tokens, ...newFilteredTokens]}
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
                                />
                            }
                        />

                        <Route 
                            path   = '/automatas'
                            render = {
                                () => 
                                <AutomataPage 
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
