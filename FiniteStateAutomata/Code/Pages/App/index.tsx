// ======================================================================
// ============          WEB APP IN REACT           =====================
// ======================================================================

import React from "react"
import ReactDOM from "react-dom"
import { HashRouter } from 'react-router-dom'
import M from "materialize-css"

import Header from "../Header"
import Footer from "../Footer"

import ShowAutomatas from "../../Components/Automata/ShowAutomatas"

type MyState = {
    
}

class App extends React.Component<{}, MyState> {

    constructor(props) {
        super (props)

  
    }
 
    componentDidMount() {
        const SideDOMNode = document.getElementById('SideNav') as HTMLElement
        const ModalDOMNode = document.querySelectorAll('.modal')
        
        const SideMenu = M.Sidenav.init(SideDOMNode, {})
        M.Modal.init(ModalDOMNode, {})

        this.setState({SideMenu}) 
    }

    render() {

        return (
            <React.Fragment>

                <Header />
                
                <main style={{padding: "1.2rem"}}>
                    <br />

                    <ShowAutomatas />

                    {
                        /*
                          <AddAutomata 
                                addNew={(name: string, character: string) => {
                                    this.setState( (preState) => {
                                        const newAutomata = FiniteStateAutomata.basicFSA(character)
                                        newAutomata.setName(name)
                                        preState.Automatas.push(newAutomata)
                                        return {Automatas: preState.Automatas}
                                    })
                                }} 
                            />

                            <LexicalAnalysis FSA={this.state.actualAutomata!} />

                            <SeeAutomata FSA={this.state.actualAutomata!} />
                        */
                    }
                    
                    <br />
                    <br />

                    

                    <br />
                    <br />
                    <br />
                    <br />

                </main>

                <Footer />
            </React.Fragment>
        )
    }
    
}


ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById("ReactApp"))
