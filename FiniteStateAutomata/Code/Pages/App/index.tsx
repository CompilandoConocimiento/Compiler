// ======================================================================
// ============          WEB APP IN REACT           =====================
// ======================================================================

import React from "react"
import ReactDOM from "react-dom"
import { HashRouter } from 'react-router-dom'
import M from "materialize-css"

import Header from "../Header"
import Footer from "../Footer"

import {FiniteStateAutomata} from "../../FiniteStateAutomata/FiniteStateAutomata"
import {Lexer} from "../../FiniteStateAutomata/Lexer"
import AutomataCard from "../../Components/AutomataCard/"
import SeeAutomata from "../../Components/SeeAutomata/"
import Style from "./Style.css"




function AddAutomata(props: {addNew: (a: string, b: string) => void}) {

    function AddAutomata() {
        const name: string = (document.getElementById('automataNewName') as HTMLInputElement).value
        const value: string = (document.getElementById('automataNewChar') as HTMLInputElement).value
        
        props.addNew(name, value);
        (document.getElementById('automataNewName') as HTMLInputElement).value = "";
        (document.getElementById('automataNewChar') as HTMLInputElement).value = "";
    }

    return (
        <div id="AddAutomataModal" className="modal modal-fixed-footer">
            <div className="modal-content">
                
                <h4>Create an Automata</h4>
                <p>Select a name and the basic character it should recognize</p>

                <div className="row">
                    <div className="input-field col s6">
                        <input placeholder="name" id="automataNewName" type="text" />
                        <label htmlFor="first_name">Tell me the name of the automata</label>
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s6">
                        <input placeholder="character" id="automataNewChar" type="text" maxLength={1} />
                        <label htmlFor="first_name">Tell me the character</label>
                    </div>
                </div>
                

            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">
                    Close
                </a>
                <a href="#!" onClick={AddAutomata} className="modal-close waves-effect waves-green btn-flat">
                    Create
                </a>
            </div>
        </div>
    )
}

type MyState = {
    Automatas: Array<FiniteStateAutomata>, 
    SideMenu: any, 
    actualAutomata: FiniteStateAutomata | null
    selectedAutomatas: Array<number>
}

class App extends React.Component<{}, MyState> {

    constructor(props) {
        super (props)

        const plusSign = FiniteStateAutomata.basicFSA('+');
        plusSign.setName("Plus sign");
        plusSign.setFinalToken(1);

        const minusSign = FiniteStateAutomata.basicFSA('-');
        minusSign.setName("Minus sign");
        minusSign.setFinalToken(2);

        const multSign = FiniteStateAutomata.basicFSA('*');
        multSign.setName("Multiplication sign");
        multSign.setFinalToken(3);

        const divSign = FiniteStateAutomata.basicFSA('/');
        divSign.setName("Division sign");
        divSign.setFinalToken(4);

        const openParenthesis = FiniteStateAutomata.basicFSA('(');
        openParenthesis.setName("Opening parenthesis");
        openParenthesis.setFinalToken(5);

        const closeParenthesis = FiniteStateAutomata.basicFSA(')');
        closeParenthesis.setName("Closing parenthesis");
        closeParenthesis.setFinalToken(6);

        const integer = FiniteStateAutomata.basicFSA('d');
        integer.positiveClosure();
        integer.setName("Integer");

        const decimal = integer.clone();
        decimal.concat(FiniteStateAutomata.basicFSA('.'));
        decimal.concat(integer.clone());
        decimal.setName("Decimal");

        const exponent = FiniteStateAutomata.basicFSA('E').join(FiniteStateAutomata.basicFSA('e'));
        exponent.concat(plusSign.clone().join(minusSign.clone()).optionalClosure().concat(integer.clone()));

        const float = decimal.clone().concat(exponent.clone());
        float.setName("Float");

        const number = FiniteStateAutomata.superJoin([integer.clone(), decimal.clone(), float.clone()]);
        number.setName("Number");
        number.setFinalToken(10);

        const arithmetic = FiniteStateAutomata.superJoin([plusSign.clone(), minusSign.clone(), multSign.clone(), divSign.clone(), openParenthesis.clone(), closeParenthesis.clone(), number.clone()]);
        arithmetic.setName("Arithmetic expressions")

        window["test"] = new Lexer(arithmetic, "4+1.5e-7/(3.9-2*8)");

        this.state = {
            Automatas: [plusSign, minusSign, multSign, divSign, openParenthesis, closeParenthesis, integer, decimal, float, number, arithmetic],
            SideMenu: null,
            actualAutomata: null,
            selectedAutomatas: [],
        }
    }
 
    componentDidMount() {
        let SideDOMNode = document.getElementById('SideNav')
        let ModalDOMNode = document.querySelectorAll('.modal')
        
        let SideMenu = M.Sidenav.init(SideDOMNode, {})
        M.Modal.init(ModalDOMNode, {})

        this.setState({SideMenu}) 
    }


    render() {

        const binaryOperation = (operation) => {
            let fsa1: FiniteStateAutomata = this.state.Automatas[this.state.selectedAutomatas[0]].clone()
            const fsa2 = !this.state.Automatas[this.state.selectedAutomatas[1]]? null: 
            this.state.Automatas[this.state.selectedAutomatas[1]].clone()
            console.log(this.state.selectedAutomatas)

            if (!fsa1) {
                M.toast({html: 'Select the automata'})
                return
            }

            fsa1 = operation(fsa1, fsa2)

            this.setState( (preState) => {
                preState.Automatas.push(fsa1)
                return {Automatas: preState.Automatas}
            })
        }

        return (
            <React.Fragment>
                <Header 
                    join = {() => binaryOperation((a, b) => a.join(b))}
                    concat= {() => binaryOperation((a, b) => a.concat(b))}
                    positiveClosure={() => binaryOperation((a, _) => a.positiveClosure(a))}
                    kleeneClosure={() => binaryOperation((a, _) => a.kleeneClosure(a))}
                    optionalClosure={() => binaryOperation((a, _) => a.optionalClosure(a))}
                    toDFA={() => binaryOperation((a, _) => a.toDFA(a))}
                    superJoin={
                        () => {

                            const FSAs = this.state.selectedAutomatas.map(index => {
                                return this.state.Automatas[index].clone()
                            })
                
                            const newFSA = FiniteStateAutomata.superJoin(FSAs)

                            this.setState( (preState) => {
                                preState.Automatas.push(newFSA)
                                return {Automatas: preState.Automatas}
                            })
                        }
                    }
                />

                <main style={{padding: "1.2rem"}}>
                    <br />


                    <h3 className="blue-grey-text text-darken-3"> Automatas </h3>
                    <div className={Style.Container}>
                        {this.state.Automatas.map( 
                            (fsa, index) => {

                                return (
                                    <AutomataCard 
                                        key     = {String(index)}   
                                        name    = {fsa.getName()} 
                                        auto    = {fsa}
                                        onClick = {() => {
                                            this.setState({actualAutomata: fsa})
                                        }} 
                                        isSelected={this.state.selectedAutomatas!.indexOf(index) != -1}
                                        SelectAutomata = {() => {
                                            this.setState( preState => {

                                                if (preState.selectedAutomatas.indexOf(index) != -1) {
                                                    preState.selectedAutomatas.splice( preState.selectedAutomatas.indexOf(index), 1 );
                                                }
                                                else preState.selectedAutomatas.push(index)

                                                return {selectedAutomatas: preState.selectedAutomatas}
                                            })
                                        }}
                                    />
                                )
                            }
                        )}
                    </div>

                    <AddAutomata 
                        addNew={(name: string, character: string) => {
                            this.setState( (preState) => {
                                const newAutomata = FiniteStateAutomata.basicFSA(character)
                                newAutomata.setName(name)
                                newAutomata.alphabeth = new Set(Array(256).fill(0).map( (_, index ) => String.fromCharCode(index)))
                                preState.Automatas.push(newAutomata)
                                return {Automatas: preState.Automatas}
                            })
                        }} 
                    />

                    <SeeAutomata FSA={this.state.actualAutomata!} />
                    
                    
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
