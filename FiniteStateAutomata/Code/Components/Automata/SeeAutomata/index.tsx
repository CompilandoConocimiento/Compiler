import React from "react"
import {FiniteStateAutomata} from "../../../FiniteStateAutomata/FiniteStateAutomata"

export interface propsType {
    FSA: FiniteStateAutomata
}

const SeeAutomata: React.StatelessComponent<propsType> = (props: propsType) => {
    
    if (props.FSA == null) return <div id="SeeAutomataModal" className="modal modal-fixed-footer"></div>
    //console.log(props.FSA)

    const finalStates = Array.from(props.FSA.states.values())
                        .filter(state => state.isFinalState).
                        map(state => state.id)

    const finalStateItems = finalStates.map( (e, index) => {
        const isFinal = index + 1 == finalStates.length

        return (
            <span key={`${e} f`}>{e} {isFinal? "": ", "}</span>
        )
    })


    return (
        <div id="SeeAutomataModal" className="modal modal-fixed-footer">
            <div className="modal-content">
                
                <h4>See the Automata {props.FSA.getName()}</h4>

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
                        {
                            finalStateItems 
                        }
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
                                    <td style={{padding: "1rem", fontSize: "1.2rem"}}>"{element[0]}"</td>
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
                                <span style={{padding: "1rem", fontSize: "1.4rem"}}>State {stateElement[0]}</span>
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

            </div>
            <div className="modal-footer">
                <a className="modal-close waves-effect waves-green btn-flat">
                    Close
                </a>
            </div>
        </div>
    )

}


export default SeeAutomata