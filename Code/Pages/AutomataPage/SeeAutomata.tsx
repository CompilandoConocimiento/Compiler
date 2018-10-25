import React from "react"
import {FiniteStateAutomata} from "../../CoreLogic/FiniteStateAutomata"
import {TokenItem} from "../../CoreLogic/Token"

export interface propsType {
    FSA: FiniteStateAutomata,
    Tokens: Map<string, TokenItem>
}

export interface stateType {

}

const SeeAutomata = (props: propsType) => {

    const tokenAsArray: Array<[number, string]> = [...props.Tokens.keys()].map( (tokenName) => {
        const data: [number, string] = [props.Tokens.get(tokenName)!.id, tokenName]
        return data
    })
    const TokenID: Map<number, string> = new Map(tokenAsArray)
    
    const finalStateItems: JSX.Element[] = Array.from(props.FSA.states.values())
        .filter(state => state.isFinalState)
        .map(state => {
            const name = (TokenID.get(state.token) != undefined)? 
                ` (Token.${TokenID.get(state.token)})` : "No token" 
            
            return (
                <span key={`${state.id} f`}>
                    &nbsp; &nbsp;
                    {state.id}: {name},
                    <br />
                </span>
            )
        })

    setTimeout(() => props.FSA.graph(document.getElementById("graphAutomata")!), 300)

    return (
        <div>
            <h4 className="blue-grey-text text-darken-4">See the Automata {props.FSA.getName()}</h4>
            <table>
                <thead>
                <tr>
                    <th>Initial State</th>
                    <th>Final States</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{props.FSA.initialState}</td>
                    <td>
                    {`{ `}
                        <br />
                        {finalStateItems} 
                    {`}`}
                    </td>
                </tr>
                </tbody>
            </table>
            
            {
                Array.from( props.FSA.states.entries() ).map( stateElement => {
                    const state = stateElement[1]
                    const transitions = Array.from( state.transitions.entries() )
                    const TransitionsItems = transitions.map(element => {
                        const transitionsvalues = Array.from(element[1].values())
                        return (
                            <tr key={`stateElement ${stateElement[0]} ${element[0]}`}>
                                <td style={{padding: "1rem", fontSize: "1.2rem"}}>"{element[0] == props.FSA.epsilonCharacter ? 'ε' : element[0]}"</td>
                                <td>
                                {`{ `}
                                    {
                                        transitionsvalues.map( (e, index) => {
                                            const isFinal = index + 1 == transitionsvalues.length

                                            return (
                                                <span key={`${element[0]} ${index}`}>{e} {isFinal? "": ", "}</span>
                                            )
                                        })
                                    }
                                    {`}`}
                                </td>
                            </tr>
                        )
                    })
                    return (
                        <React.Fragment key={stateElement[0]}>
                            <br />
                            <br />
                            <span style={{padding: "1rem", fontSize: "1.4rem"}}>
                                State {stateElement[0]}
                                {" "}
                                {(props.FSA.initialState == stateElement[0])? "(Initial State)" : ""}
                                {(props.FSA.isFinalState(stateElement[0]))? "(Final State)" : ""}
                            </span>
                            <table>
                                <thead>
                                <tr>
                                    <th>Character</th>
                                    <th>Transitions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {TransitionsItems}
                                </tbody>
                            </table>
                            <br />
                        </React.Fragment>
                    )
                })
            }

            <div id = "graphAutomata" style={{height: "25rem"}}/>

            
        </div>
    )
}


export default SeeAutomata;