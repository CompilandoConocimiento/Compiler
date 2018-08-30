// ======================================================================
// ============          WEB APP IN REACT           =====================
// ======================================================================

import React from "react"
import ReactDOM from "react-dom"
import { HashRouter } from 'react-router-dom'
import M from "materialize-css"

import Header from "../Header"
import Footer from "../Footer"

import {FiniteStateAutomata, basicFSA, superJoin} from "../../FiniteStateAutomata"
import AutomataCard from "../../Components/AutomataCard/"
import SeeAutomata from "../../Components/SeeAutomata/"
import Style from "./Style.css"




function AddAutomata(props: {addNew: (a: string) => void}) {

    function AddAutomata() {
        const value: string = (document.getElementById('automataNewChar') as HTMLInputElement).value
        
        props.addNew(value);
        (document.getElementById('automataNewChar') as HTMLInputElement).value = ""
    }

    return (
        <div id="AddAutomataModal" className="modal modal-fixed-footer">
            <div className="modal-content">
                
                <h4>Create an Automata</h4>
                <p>Select a name and the basic character it should recognize</p>

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

        const sign = basicFSA('+');            // +
        sign.join(basicFSA('-'));            // +|-
        sign.optionalClosure();              // (+|-)?
        const digit = basicFSA('D');
        digit.positiveClosure();             // D+
        const integers = sign.clone();
        integers.concat(digit);              // (+|-)?D+

        const decimals = integers.clone();
        decimals.concat(basicFSA('.'));      // (+|-)?D+.
        decimals.concat(digit.clone());      // (+|-)?D+.D+

        const exponent = basicFSA('E');
        exponent.join(basicFSA('e'));        // E|e
        exponent.concat(integers.clone());   // (E|e)(+|-)?D+
        exponent.optionalClosure();          // ((E|e)(+|-)?D+)?

        decimals.concat(exponent.clone());   // (+|-)?D+.D+((E|e)(+|-)?D+)?

        let third = basicFSA('L');
        third.join(basicFSA('D'));
        third.kleeneClosure();
        third = basicFSA('L').concat(third);

        let fourth = basicFSA('S');
        fourth.join(basicFSA('T'));
        fourth.positiveClosure();



        this.state = {
            Automatas: [integers, decimals, third, fourth],
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
                
                            const newFSA = superJoin(FSAs)
                
                            window["newFSA"] = newFSA

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
                                        name    = {String(index)} 
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
                        addNew={(character: string) => {
                            this.setState( (preState) => {
                                const newAutomata = basicFSA(character)
                                newAutomata.alphabeth = new Set(Array(256).fill(0).map( (_, index ) => String.fromCharCode(index)))
                                preState.Automatas.push(newAutomata)
                                return {Automatas: preState.Automatas}
                            })
                        }} 
                    />

                    <SeeAutomata FSA={this.state.actualAutomata!} name={String(this.state.Automatas.indexOf(this.state.actualAutomata!))} />
                    
                    
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
