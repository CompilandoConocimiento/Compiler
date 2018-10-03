// ======================================================================
// ============          WEB APP IN REACT           =====================
// ======================================================================
import React from "react"
import ReactDOM from "react-dom"
import { Route, HashRouter, Switch } from 'react-router-dom'
import M from "materialize-css"

import Header from "../Header"
import Footer from "../Footer"

import { DefaultTokens, Token, getNewTokenID, TokenItem } from '../../CoreLogic/Token'
import { FiniteStateAutomata, } from '../../CoreLogic/FiniteStateAutomata'
import {CFG} from '../../CoreLogic/CFG'
import TokenPage from '../TokenPage/'
import AutomataPage from '../AutomataPage/'
import CardToTopic from './CardToTopic'
import { metaCharacters } from "../../CoreLogic/State";

type AppState = {
    SideMenu: M.Sidenav | null,
    Tokens: Map<string, TokenItem>,
    Automatas: Array<any>,
    Grammars: Array<any>,
}

class App extends React.Component<{}, AppState> {

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

        const powSign = FiniteStateAutomata.basicFSA('^');
        powSign.setName("Power sign");
        powSign.setFinalToken(5);

        const openParenthesis = FiniteStateAutomata.basicFSA('(');
        openParenthesis.setName("Opening parenthesis");
        openParenthesis.setFinalToken(6);

        const closeParenthesis = FiniteStateAutomata.basicFSA(')');
        closeParenthesis.setName("Closing parenthesis");
        closeParenthesis.setFinalToken(7);

        const integer = FiniteStateAutomata.basicFSA('\\d');
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
        number.setFinalToken(8);

        const piConstant = FiniteStateAutomata.basicFSA('pi');
        piConstant.setName("Pi Constant");
        piConstant.setFinalToken(9);

        const eConstant = FiniteStateAutomata.basicFSA('e');
        eConstant.setName("Euler Constant");
        eConstant.setFinalToken(10);

        const sineFunc = FiniteStateAutomata.basicFSA('sin');
        sineFunc.setName("Sine function");
        sineFunc.setFinalToken(11);

        const cosineFunc = FiniteStateAutomata.basicFSA('cos');
        cosineFunc.setName("Cosine function");
        cosineFunc.setFinalToken(12);

        const tangentFunc = FiniteStateAutomata.basicFSA('tan');
        tangentFunc.setName("Tangent function");
        tangentFunc.setFinalToken(13);

        const arcSineFunc = FiniteStateAutomata.basicFSA('arcsin');
        arcSineFunc.setName("Inverse sine function");
        arcSineFunc.setFinalToken(14);

        const arcCosineFunc = FiniteStateAutomata.basicFSA('arccos');
        arcCosineFunc.setName("Inverse cosine function");
        arcCosineFunc.setFinalToken(15);

        const arcTangentFunc = FiniteStateAutomata.basicFSA('arctan');
        arcTangentFunc.setName("Inverse tangent function");
        arcTangentFunc.setFinalToken(16);

        const logFunc = FiniteStateAutomata.basicFSA('log');
        logFunc.setName("Logarithm base 10 function");
        logFunc.setFinalToken(17);

        const lnFunc = FiniteStateAutomata.basicFSA('ln');
        lnFunc.setName("Natural logarithm function");
        lnFunc.setFinalToken(18);

        const sqrtFunc = FiniteStateAutomata.basicFSA('sqrt');
        sqrtFunc.setName("Square root function");
        sqrtFunc.setFinalToken(19);

        const absFunc = FiniteStateAutomata.basicFSA('abs');
        absFunc.setName("Absolute value function");
        absFunc.setFinalToken(20);

        const arithmetic = FiniteStateAutomata.superJoin(
            [   
                plusSign.clone(), 
                minusSign.clone(), 
                multSign.clone(),
                divSign.clone(),
                powSign.clone(),
                piConstant.clone(),
                eConstant.clone(),
                sineFunc.clone(),
                cosineFunc.clone(),
                tangentFunc.clone(),
                arcSineFunc.clone(),
                arcCosineFunc.clone(),
                arcTangentFunc.clone(),
                logFunc.clone(),
                lnFunc.clone(),
                sqrtFunc.clone(),
                absFunc.clone(),
                openParenthesis.clone(),
                closeParenthesis.clone(),
                number.clone()
            ]
        );
        arithmetic.setName("Arithmetic expressions")

        const orFunc = FiniteStateAutomata.basicFSA('|');
        orFunc.setName("Or function");
        orFunc.setFinalToken(21);

        const andFunc = FiniteStateAutomata.basicFSA('&');
        andFunc.setName("And function");
        andFunc.setFinalToken(22);

        const positiveClosure = FiniteStateAutomata.basicFSA("+");
        positiveClosure.setName("Positive closure");
        positiveClosure.setFinalToken(23);

        const kleeneClosure = FiniteStateAutomata.basicFSA("*");
        kleeneClosure.setName("Kleene closure");
        kleeneClosure.setFinalToken(24);

        const optionalClosure = FiniteStateAutomata.basicFSA("?");
        optionalClosure.setName("Optional closure");
        optionalClosure.setFinalToken(25);

        const symbol = FiniteStateAutomata.basicFSA(String.raw`\w`);
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\d`));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\+`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\*`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\?`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\(`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\)`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\|`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\&`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\\`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\d`, false));
        symbol.join(FiniteStateAutomata.basicFSA(String.raw`\w`, false));
        symbol.setName("Symbol");
        symbol.setFinalToken(26);

        const regularExpressions = FiniteStateAutomata.superJoin([
            orFunc, andFunc, positiveClosure, kleeneClosure, optionalClosure, symbol, openParenthesis, closeParenthesis
        ]);
        regularExpressions.setName("Regular expressions");

        const arithGrammar: CFG = new CFG(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), new Set(['E', 'T', 'P', 'U', 'F']), 'E', arithmetic);
        arithGrammar.addRule('E', ['E', 1, 'T'], function(args){return args[0]+args[2];});
        arithGrammar.addRule('E', ['E', 2, 'T'], function(args){return args[0]-args[2];});
        arithGrammar.addRule('E', ['T'], function(args){return args[0];});

        arithGrammar.addRule('T', ['T', 3, 'P'], function(args){return args[0]*args[2];});
        arithGrammar.addRule('T', ['T', 4, 'P'], function(args){return args[0]/args[2];});
        arithGrammar.addRule('T', ['P'], function(args){return args[0];});

        arithGrammar.addRule('P', ['U', 5, 'P'], function(args){return Math.pow(args[0],args[2]);});
        arithGrammar.addRule('P', ['U'], function(args){return args[0];});

        arithGrammar.addRule('U', [1, 'U'], function(args){return args[1];});
        arithGrammar.addRule('U', [2, 'U'], function(args){return -args[1];});
        arithGrammar.addRule('U', ['F'], function(args){return args[0];});

        arithGrammar.addRule('F', [8], function(args){return Number(args[0]);});
        arithGrammar.addRule('F', [6, 'E', 7], function(args){return args[1];});
        arithGrammar.addRule('F', [11, 6, 'E', 7], function(args){return Math.sin(args[2]);});
        arithGrammar.addRule('F', [12, 6, 'E', 7], function(args){return Math.cos(args[2]);});
        arithGrammar.addRule('F', [13, 6, 'E', 7], function(args){return Math.tan(args[2]);});
        arithGrammar.addRule('F', [14, 6, 'E', 7], function(args){return Math.asin(args[2]);});
        arithGrammar.addRule('F', [15, 6, 'E', 7], function(args){return Math.acos(args[2]);});
        arithGrammar.addRule('F', [16, 6, 'E', 7], function(args){return Math.atan(args[2]);});
        arithGrammar.addRule('F', [17, 6, 'E', 7], function(args){return Math.log10(args[2]);});
        arithGrammar.addRule('F', [18, 6, 'E', 7], function(args){return Math.log(args[2]);});
        arithGrammar.addRule('F', [19, 6, 'E', 7], function(args){return Math.sqrt(args[2]);});
        arithGrammar.addRule('F', [20, 6, 'E', 7], function(args){return Math.abs(args[2]);});
        arithGrammar.addRule('F', [9], function(){return Math.PI;});
        arithGrammar.addRule('F', [10], function(){return Math.E;});

        arithGrammar.setName("Arithmetic expressions")

        window["arithGrammar"] = arithGrammar
        console.log(arithGrammar.executeActions(arithGrammar.parseString("(sin(2*pi/7)+sin(4*pi/7)+sin(8*pi/7))^2*4+abs(-1)+3*arcsin(sqrt(3)/2)")))

        const regExpGrammar = new CFG(new Set([6, 7, 21, 22, 23, 24, 25, 26]), new Set(['E', 'T', 'C', 'F']), 'E', regularExpressions);
        regExpGrammar.addRule('E', ['E', 21, 'T'], function(args){return args[0].join(args[2]);});
        regExpGrammar.addRule('E', ['T'], function(args){return args[0]});

        regExpGrammar.addRule('T', ['T', 22, 'C'], function(args){return args[0].concat(args[2]);});
        regExpGrammar.addRule('T', ['C'], function(args){return args[0]});

        regExpGrammar.addRule('C', ['C', 23], function(args){return args[0].positiveClosure();});
        regExpGrammar.addRule('C', ['C', 24], function(args){return args[0].kleeneClosure();});
        regExpGrammar.addRule('C', ['C', 25], function(args){return args[0].optionalClosure();});
        regExpGrammar.addRule('C', ['F'], function(args){return args[0];});

        regExpGrammar.addRule('F', [6, 'E', 7], function(args){return args[1]});
        regExpGrammar.addRule('F', [26], function(args){
            let str = args[0];
            if(Object.values(metaCharacters).includes(str))
                return FiniteStateAutomata.basicFSA(str);
            if(str[0] == '\\')
                return FiniteStateAutomata.basicFSA(str[1], false)
            else
                return FiniteStateAutomata.basicFSA(str, false)
        });

        regExpGrammar.setName("Regular expressions")

        window["regExpGrammar"] = regExpGrammar
        window["newFSA"] = regExpGrammar.executeActions(regExpGrammar.parseString(String.raw`(a|b)+&\d*`));


        this.state = {
            SideMenu: null,
            Tokens: new Map(DefaultTokens),
            Automatas: [arithmetic, regularExpressions],
            Grammars: [arithGrammar, regExpGrammar],
        }
    }
 
    componentDidMount() {
        const sideDOMNode = document.getElementById('SideNav') as HTMLElement
        const modalDOMNode = document.querySelectorAll('.modal')
        
        const SideMenu = M.Sidenav.init(sideDOMNode, {})
        M.Modal.init(modalDOMNode, {})

        this.setState({SideMenu}) 
    }

    addNewTokens(newTokens: Token[]) {

        this.setState((preState) => {
            newTokens.forEach(
                (newToken) => {
                    if (!preState.Tokens.has(newToken.name)) {
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
                                            <div className="col s10 m6 l4 offset-s1 offset-m3 offset-l4">
                                                <CardToTopic 
                                                    name	= {"Tokens"} 
                                                    link	= {"/tokens"}
                                                    materializeCSSColor = {colors[0]} 
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col s10 m6 l4 offset-s1 offset-m3 offset-l4">
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
                                    addNewTokens     = {(newTokens: Token[]) => this.addNewTokens(newTokens)}
                                    deleteToken      = {(tokenName: string) => {
                                        this.setState(
                                            (preState) => {
                                                if (tokenName === "EOF" || tokenName === "Error" || tokenName === "Default") return null
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
                                    addNewTokens   = {(newTokens: Token[]) => this.addNewTokens(newTokens)}
                                    DeleteAutomata = {(index: number) => {
                                        this.setState(preState => {
                                            return {Automatas: preState.Automatas.filter( (_, i) => i != index )}
                                        })
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
