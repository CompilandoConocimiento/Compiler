// ======================================================================
// ============          WEB APP IN REACT           =====================
// ======================================================================

import React from "react"
import ReactDOM from "react-dom"
import { HashRouter } from 'react-router-dom'
import M from "materialize-css"

import Header from "../Header"
import Footer from "../Footer"

import {FiniteStateAutomata, getNewID, basicFSA, stateID} from "../../FiniteStateAutomata"
import AutomataCard from "../../Components/AutomataCard/"
import Style from "./Style.css"


type MyState = {Automatas: Array<FiniteStateAutomata>, SideMenu: any}

class App extends React.Component<{}, MyState> {

    constructor(props) {
        super (props)

        this.state = {
            Automatas: [basicFSA('0'), basicFSA('1')],
            SideMenu: null,
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

        return (
            <React.Fragment>
                <Header />

                <main style={{padding: "1.2rem"}}>
                    <br />


                    <h3 className="blue-grey-text text-darken-3"> Automatas </h3>
                    <div className={Style.Container}>
                        {this.state.Automatas.map( 
                            (_, index) => {

                                return (
                                    <AutomataCard 
                                        key     = {String(index)}   
                                        name    = {String(index)} 
                                        onClick = {()=>3} 
                                    />
                                )
                            }
                        )}
                    </div>

                    <button data-target="AddAutomataModal" className="btn modal-trigger">Modal</button>

                    <div id="AddAutomataModal" className="modal bottom-sheet">
                        <div className="modal-content">
                        <h4>Modal Header</h4>
                        <p>A bunch of text</p>
                        </div>
                        <div className="modal-footer">
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a>
                        </div>
                    </div>
                    
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


// =================================

const eps = '\0';

// (a|b)*c+
var example = new FiniteStateAutomata(new Set(['a', 'b', 'c']));
let q: Array<stateID> = [];
for(var i = 0; i <= 10; ++i) q[i] = getNewID();
example.setInitialState(q[0]);
example.addTransition(q[0], eps, q[1])
example.addTransition(q[0], eps, q[7])
example.addTransition(q[1], eps, q[2])
example.addTransition(q[1], eps, q[4])
example.addTransition(q[2], 'a', q[3])
example.addTransition(q[4], 'b', q[5])
example.addTransition(q[3], eps, q[6])
example.addTransition(q[5], eps, q[6])
example.addTransition(q[6], eps, q[1])
example.addTransition(q[6], eps, q[7])
example.addTransition(q[7], eps, q[8])
example.addTransition(q[8], 'c', q[9])
example.addTransition(q[9], eps, q[8])
example.addTransition(q[9], eps, q[10])
example.setFinalState(q[10])

//example from the class
var sign = basicFSA('+');            // +
sign.join(basicFSA('-'));            // +|-
sign.optionalClosure();              // (+|-)?
var digit = basicFSA('0');
for(var i = 1; i <= 9; ++i)
    digit.join(basicFSA(i.toString()));
digit.positiveClosure();             // D+
var integers = sign.clone();
integers.concat(digit);              // (+|-)?D+

var decimals = integers.clone();
decimals.concat(basicFSA('.'));      // (+|-)?D+.
decimals.concat(digit.clone());      // (+|-)?D+.D+

var exponent = basicFSA('e');
exponent.concat(integers.clone());   // e(+|-)?D+
exponent.optionalClosure();          // (e(+|-)?D+)?

decimals.concat(exponent.clone());   // (+|-)?D+.D+(e(+|-)?D+)?

//unknown language, taken from RPC
var contestExample = new FiniteStateAutomata(new Set(['a', 'b']));
let r: Array<stateID> = [];
for(var i = 0; i <= 4; ++i) r[i] = getNewID();
contestExample.setInitialState(r[0]);
contestExample.addTransition(r[0], 'a', r[3])
contestExample.addTransition(r[0], 'b', r[1])
contestExample.addTransition(r[1], 'a', r[1])
contestExample.addTransition(r[1], 'b', r[1]);
contestExample.addTransition(r[1], 'b', r[3]);
contestExample.addTransition(r[2], 'a', r[0]);
contestExample.addTransition(r[2], 'a', r[1]);
contestExample.addTransition(r[2], 'b', r[4]);
contestExample.addTransition(r[3], 'a', r[2]);
contestExample.addTransition(r[3], 'b', r[4]);
contestExample.addTransition(r[4], 'a', r[2]);
contestExample.addTransition(r[4], 'a', r[4]);
contestExample.setFinalState(r[0]);
contestExample.setFinalState(r[2]);

var test: Array<[string, boolean]> = [["aaaaaaaa", true], ["abababab", false], ["bbbbaaa", true], ["a", false], ["b", false], ["abaaba", true], ["bbaab", false], ["babab", false], ["bbbaaba", true], ["bbaabbaa", true]];

test.forEach(caso => {
    console.log("String " + caso[0] + " is " + contestExample.validateString(caso[0]) + ", correct answer is " + caso[1]);
});

var example4 = contestExample.toAFD();
console.log("");

test.forEach(caso => {
    console.log("String " + caso[0] + " is " + example4.validateString(caso[0]) + ", correct answer is " + caso[1]);
});

var sign = basicFSA('+');            // +
sign.join(basicFSA('-'));            // +|-
sign.optionalClosure();              // (+|-)?
var digit = basicFSA('D');
digit.positiveClosure();             // D+
var integers = sign.clone();
integers.concat(digit);              // (+|-)?D+

var decimals = integers.clone();
decimals.concat(basicFSA('.'));      // (+|-)?D+.
decimals.concat(digit.clone());      // (+|-)?D+.D+

var exponent = basicFSA('E');
exponent.join(basicFSA('e'));        // E|e
exponent.concat(integers.clone());   // (E|e)(+|-)?D+
exponent.optionalClosure();          // ((E|e)(+|-)?D+)?

decimals.concat(exponent.clone());   // (+|-)?D+.D+((E|e)(+|-)?D+)?

var decimals3 = decimals.toAFD();

decimals3.states.forEach(state =>{
    console.log("Estado " + (state.id-74-32) + ":");
    if(state.isFinalState) console.log("final")
    state.transitions.forEach((toStates, character) =>{
        var str = character + " -> ";
        toStates.forEach(toId =>{
            str += (toId-74-32) + ",";
        });
        console.log(" " + str);
    });
});