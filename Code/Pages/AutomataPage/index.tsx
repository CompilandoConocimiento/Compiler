import React from "react"

import {FiniteStateAutomata} from "../../CoreLogic/FiniteStateAutomata"
import AutomataCard from "./AutomataCard"

import Style from "./Style.css"

type MyState = {
    Automatas: Array<FiniteStateAutomata>, 
    selectedAutomatas: Array<number>
}

export default class ShowAutomatas extends React.Component<{}, MyState> {

    constructor(props) {
        super (props)

        const minusSign = FiniteStateAutomata.basicFSA('-');
        minusSign.setName("Minus sign");

        this.state = {
            Automatas: [minusSign],
            selectedAutomatas: [],
        }
    }

    componentDidMount() {
        const elements = document.querySelectorAll('.fixed-action-btn');
        M.FloatingActionButton.init(elements, {hoverEnabled: false})
    }
    
    callForceUpdate () {
        this.forceUpdate()
    }

    showOperationFAB() {

        const binaryOperation = (operation: (a, b) => any) => {
            let fsa1: FiniteStateAutomata = this.state.Automatas[this.state.selectedAutomatas[0]].clone()
            const fsa2 = !this.state.Automatas[this.state.selectedAutomatas[1]]? null: 
            this.state.Automatas[this.state.selectedAutomatas[1]].clone()

            fsa1 = operation(fsa1, fsa2)

            this.setState( (preState) => {
                preState.Automatas.push(fsa1)
                return {
                    selectedAutomatas: [],
                    Automatas: preState.Automatas
                }
            })
        }

        const SuperJoinOperation = () => {

            const FSAs = this.state.selectedAutomatas.map(index => {
                return this.state.Automatas[index].clone()
            })

            const newFSA = FiniteStateAutomata.superJoin(FSAs)

            this.setState( (preState) => {
                preState.Automatas.push(newFSA)
                return {
                    selectedAutomatas: [],
                    Automatas: preState.Automatas
                }
            })
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
                        <a data-target="AddAutomataModal" className="modal-trigger btn-floating" style={{"width": "130px"}}>
                            Create Basic Automata
                        </a>
                    </li>
                    
                    <li>
                        <a 
                            className = "btn-floating" 
                            style     = {{"width": "120px"}} 
                            onClick   = {() => {this.setState({selectedAutomatas: []})}}
                        >
                            Clear
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
                    {this.state.Automatas.map( 
                        (fsa, index) => {
                            return (
                                <AutomataCard
                                    forceUpdate = {() => this.callForceUpdate()}
                                    key     = {String(`automata ${index}`)}
                                    name    = {fsa.getName()}
                                    FSA     = {fsa}
                                    onClick = {() => {
                                    }} 
                                    isSelected     = {this.state.selectedAutomatas!.indexOf(index) != -1}
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
            </div>  

            { this.showOperationFAB() }
            
            </React.Fragment>
        )
    }

}
