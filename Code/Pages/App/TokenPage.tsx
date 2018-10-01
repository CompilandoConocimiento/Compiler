import React from "react"
import { loadFileAsJSON } from "../../Helpers/LoadFile"
import { Token, EssencialToken } from '../../CoreLogic/Token'


export default function TokenPage(props: {Tokens: Token[], addNewTokens(newTokens: Array<EssencialToken>): void}) {

    function addNewToken () {
        const newTokenName = prompt(`Name of new Token:`)
        const newDescription = (newTokenName != null)? prompt(`Description of Token.${newTokenName}:`) : ""

        if (newTokenName == null || newDescription ==  null) return
        
        const newToken: EssencialToken = {name: newTokenName, description: newDescription}
        props.addNewTokens([newToken])
    }

    function addNewTokensFromFile(data: any) {
        if (data.constructor !== Array) return
        let newTokens = data.filter(token => 
            (token.name !== undefined && token.description !== undefined)
        ) 

        newTokens = newTokens.map(token => {
            return {name: token.name, description: token.description}
        })

        props.addNewTokens(newTokens)
    }

    return (
        <div id="Tokens" className="container">
            <h3 className="center blue-grey-text text-darken-3">Tokens</h3>
            <br />
            
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                </thead>

                <tbody>
                {
                    props.Tokens.map( (token: Token) => (
                        <tr key={`token ${token.id}`}>
                            <td>{token.id}</td>
                            <td>{token.name}</td>
                            <td>{token.description}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
            

            <br />
            <div className="row">
                <a 
                    className = "waves-effect waves-teal btn-flat indigo lighten-5"
                    style     = {{textTransform: "initial"}}
                    onClick   = {() => addNewToken()}
                >
                    <i className="material-icons">library_add</i>
                    &nbsp;
                    &nbsp;
                    Add Another manually
                </a>
                
                &nbsp;

                <div className="file-field input-field">
                    <div 
                        className = "waves-effect waves-teal btn-flat indigo lighten-5"
                        style     = {{textTransform: "initial"}}
                    >
                        <i className="material-icons">attach_file</i>
                        &nbsp;
                        &nbsp;
                        <span>Load File</span>
                        <input 
                            id       = "fileTokens"
                            type     = "file" 
                            onChange = {
                                (e) => {
                                    loadFileAsJSON(e.target, (data) => {
                                        const fileDOMNode1 = document.getElementById("fileTokens") as HTMLInputElement
                                        const fileDOMNode2 = document.getElementById("fileTokensMCSS") as HTMLInputElement

                                        fileDOMNode1.value = "";
                                        fileDOMNode2.value = "";
                                        addNewTokensFromFile(data)
                                    })
                                }
                            }
                        />
                    </div>
                    <div className="file-path-wrapper" style={{display: "none"}}>
                        <input id = "fileTokensMCSS" className="file-path validate" type="text" />
                    </div>
                </div>

            </div>

        </div>
    )
}