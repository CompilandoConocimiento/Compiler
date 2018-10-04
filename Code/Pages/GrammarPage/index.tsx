import React from "react"

import { CFG } from "../../CoreLogic/ContextFreeGrammar"
import GrammarCard from './GrammarCard'

import Style from './Style.css'

type GrammarPageState = {
    ModalData: M.Modal | null,
    ModalContent: JSX.Element,
}

type GrammarPageProps = {
    Grammars: Array<CFG>,
}

export default class GrammarPage extends React.Component<GrammarPageProps, GrammarPageState> {

    constructor(props) {
        super (props)

        this.state = {
            ModalData: null,
            ModalContent: <br />
        }
    }

    componentDidMount() {
        const buttonNodes = document.querySelectorAll('.fixed-action-btn')
        const modalNodes = document.querySelectorAll('.modal')
        M.FloatingActionButton.init(buttonNodes, {hoverEnabled: false})

        const ModalData = M.Modal.init(modalNodes, {inDuration: 120, outDuration: 100})[0]
        this.setState({ModalData: ModalData})
    }
    
    callForceUpdate () {
        this.forceUpdate()
    }

    render () {

        return (
            <React.Fragment>

            <h3 className="center blue-grey-text text-darken-3"> 
                Grammars
            </h3>

            <div className="container">

                <div className={Style.Container}>
                    {this.props.Grammars.map(
                        (grammar, index) => {
                            return (
                                <GrammarCard 
                                    key     = {`grammar ${index}`}
                                    Grammar = {grammar}
                                />
                            )
                        }
                    )}
                </div>
                

                <br />
                <br />

                <div className="row">
                    <div className="file-field input-field col s12">
                        <div 
                            className = "waves-effect waves-teal btn-flat btn-large indigo lighten-5"
                            style     = {{textTransform: "initial", width: "100%"}}
                        >
                            <i className="material-icons">attach_file</i>
                            &nbsp;
                            &nbsp;
                            <span>Load File</span>
                            <input 
                                id       = "fileTokens"
                                type     = "file" 
                                onChange = {
                                    e => {console.log(e)}
                                }
                            />
                        </div>
                        <div className="file-path-wrapper" style={{display: "none"}}>
                            <input id = "fileTokensMCSS" className="file-path validate" type="text" />
                        </div>

                        <br />

                    </div>
                </div>

            </div>


            <div id="ModalGrammar" className="modal modal-fixed-footer">
                <div className="modal-content">
                    { this.state.ModalContent }
                </div>
                <div className="modal-footer">
                    <a 
                        className = "modal-close waves-effect waves-green btn-flat"
                        onClick   = {() => this.state.ModalData!.close()}
                    >
                        Close
                    </a>
                </div>
            </div>
        
            
            </React.Fragment>
        )
    }

}
