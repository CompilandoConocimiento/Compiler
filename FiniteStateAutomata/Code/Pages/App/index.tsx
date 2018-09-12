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

        /*
            //var bigStr = "3.14-8*2+4-(5-2-(2/8*4+170)/7+1.0e-9)";
            window["test"] = new Lexer(arithmetic, "1*(2+3)");

            var tokens = [];
            var curr;
            while((curr = window.test.getNextToken().token) != 0){
                tokens.push(curr);
                if(curr == -1) window.test.advance();
            }

            const grammar1: CFG = new CFG(new Set([1, 2, 3, 4, 5, 6, 10]), new Set(['E', 'T', 'F']), 'E');
            grammar1.addRule('E', ['E', 1, 'T']);
            grammar1.addRule('E', ['E', 2, 'T']);
            grammar1.addRule('E', ['T']);
            grammar1.addRule('T', ['T', 3, 'F']);
            grammar1.addRule('T', ['T', 4, 'F']);
            grammar1.addRule('T', ['F']);
            grammar1.addRule('F', [5, 'E', 6]);
            grammar1.addRule('F', [10]);
            window["cfg1"] = grammar1;

            const grammar2: CFG = new CFG(new Set([1, 2, 3, 4, 5, 6, 10]), new Set(['E']), 'E');
            grammar2.addRule('E', ['E', 1, 'E']);
            grammar2.addRule('E', ['E', 2, 'E']);
            grammar2.addRule('E', ['E', 3, 'E']);
            grammar2.addRule('E', ['E', 4, 'E']);
            grammar2.addRule('E', [5, 'E', 6]);
            grammar2.addRule('E', [10]);
            window["cfg2"] = grammar1;

            console.log(tokens);
            var root = grammar2.validateTokens(tokens);
            window["root"] = root;
            console.log(root);

        */
  
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
