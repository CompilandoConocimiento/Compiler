import React from "react"



export default function AddAutomata(props: {addNew: (name: string, value: string) => void}) {

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
                <p>Select a name and the string it should recognize</p>

                <div className="row">
                    <div className="input-field col s6">
                        <input placeholder="name" id="automataNewName" type="text" />
                        <label htmlFor="first_name">Tell me the name of the automata</label>
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s6">
                        <input placeholder="string" id="automataNewChar" type="text" />
                        <label htmlFor="first_name">Tell me the string</label>
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
