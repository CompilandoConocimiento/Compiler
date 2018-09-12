import React from "react"

import {FiniteStateAutomata} from "../../../FiniteStateAutomata/FiniteStateAutomata"
import DefaultAutomatas from "../../../FiniteStateAutomata/DefaultAutomatas"

import AutomataCard from "../AutomataCard"
import SeeAutomata from "../SeeAutomata"
import AddAutomata from "../AddAutomata"

import SeeLexicalResult from "../../LexicalAnalysis"

import Style from "./Style.css"

type MyState = {
    Automatas: Array<FiniteStateAutomata>, 
    actualAutomata: FiniteStateAutomata | null
    selectedAutomatas: Array<number>
}


export default class ShowAutomatas extends React.Component<{}, MyState> {

    constructor(props) {
        super (props)

        this.state = {
            Automatas: DefaultAutomatas,
            actualAutomata: null,
            selectedAutomatas: [],
        }
    }

    componentDidMount() {
        const elements = document.querySelectorAll('.fixed-action-btn');
        M.FloatingActionButton.init(elements, {hoverEnabled: false})
    }

    render () {

        const binaryOperation = (operation) => {
            let fsa1: FiniteStateAutomata = this.state.Automatas[this.state.selectedAutomatas[0]].clone()
            const fsa2 = !this.state.Automatas[this.state.selectedAutomatas[1]]? null: 
            this.state.Automatas[this.state.selectedAutomatas[1]].clone()

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

        const JoinOperation = () => {

            const FSAs = this.state.selectedAutomatas.map(index => {
                return this.state.Automatas[index].clone()
            })

            const newFSA = FiniteStateAutomata.superJoin(FSAs)

            this.setState( (preState) => {
                preState.Automatas.push(newFSA)
                return {Automatas: preState.Automatas}
            })
        }

        const join            = () => binaryOperation((a, b) => a.join(b))
        const concat          = () => binaryOperation((a, b) => a.concat(b))
        const positiveClosure = () => binaryOperation((a, _) => a.positiveClosure(a))
        const kleeneClosure   = () => binaryOperation((a, _) => a.kleeneClosure(a))
        const optionalClosure = () => binaryOperation((a, _) => a.optionalClosure(a))
        const toDFA           = () => binaryOperation((a, _) => a.toDFA(a))
        const superJoin       = JoinOperation


        return (
            <React.Fragment>

            <h3 className="center blue-grey-text text-darken-3"> 
                Automatas
            </h3>
                    
            <div className={Style.Container}>
                {this.state.Automatas.map( 
                    (fsa, index) => {

                        return (
                            <AutomataCard 
                                key     = {String(index)}   
                                name    = {fsa.getName()} 
                                FSA     = {fsa}
                                onClick = {() => {
                                    this.setState({actualAutomata: fsa})
                                }} 
                                isSelected={this.state.selectedAutomatas!.indexOf(index) != -1}
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
                            />
                        )
                    }
                )}
            </div>


            <AddAutomata 
                addNew={(name: string, character: string) => {
                    this.setState( (preState) => {
                        const newAutomata = FiniteStateAutomata.basicFSA(character)
                        newAutomata.name = name
                        newAutomata.alphabeth = new Set(Array(256).fill(0).map( (_, index ) => String.fromCharCode(index)))
                        preState.Automatas.push(newAutomata)
                        return {Automatas: preState.Automatas}
                    })
                }} 
            />

            <div className="fixed-action-btn">
                <a className="btn-floating btn-large red">
                    <i className="large material-icons">mode_edit</i>
                </a>
                <ul className="left-align" style={
                    {"marginLeft": "-5rem"}}
                >
                    <li>
                        <a className="btn-floating" style={{"width": "100px"}} href="#!" onClick={join}>
                            Join
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "100px"}} href="#!" onClick={concat}>
                            Concatenate
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "100px"}} href="#!" onClick={positiveClosure}>
                            Positive Closure
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "100px"}} href="#!" onClick={kleeneClosure} >
                            Kleene Closure
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "100px"}} href="#!" onClick={optionalClosure} >
                            Optional Closure
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "100px"}} href="#!" onClick={toDFA} >
                            Deterministic
                        </a>
                    </li>
                    <li>
                        <a className="btn-floating" style={{"width": "100px"}} href="#!" onClick={superJoin} >
                            Super Join
                        </a>
                    </li>
                    <li>
                        <a data-target="AddAutomataModal" className="modal-trigger btn-floating" style={{"width": "100px"}} href="#!" onClick={superJoin} >
                            Create Basic Automata
                        </a>
                    </li>
                    
                    <li>
                        <a className="btn-floating" style={{"width": "100px"}} href="#!" onClick={() => {
                            this.setState({selectedAutomatas: []})
                        }} >
                            Clear
                        </a>
                    </li>
                </ul>
            </div>
      
            <SeeAutomata FSA={this.state.actualAutomata!} />

            <SeeLexicalResult FSA={this.state.actualAutomata!} />

            </React.Fragment>
        )
    }

}
