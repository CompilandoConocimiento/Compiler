import React from "react"
import {FiniteStateAutomata} from "../../FiniteStateAutomata"

export interface propsType {
    FSA: FiniteStateAutomata
}

const AutomataCard: React.StatelessComponent<propsType> = (props: propsType) => {

	if (props.FSA == null) return <div id="LexicalAnalysisModal" className="modal modal-fixed-footer"></div>

	return (
        <div id="LexicalAnalysisModal" className="modal modal-fixed-footer">
            <div className="modal-content">
                
                <h4>See the Automata {props.FSA.getName()}</h4>

                

            </div>
            <div className="modal-footer">
                <a className="modal-close waves-effect waves-green btn-flat">
                    Close
                </a>
            </div>
        </div>
    )

}

export default AutomataCard