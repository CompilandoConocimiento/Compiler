import React from "react"

import { loadFileAsJSON } from "../../Helpers/LoadFile"
import { EssencialToken, TokenItem } from '../../CoreLogic/Token'
import { saveFile } from '../../Helpers/SaveFile'

import Style from "./Style.css"

export type TokenPageProps = {
    Tokens: Map<String, TokenItem>, 
    addNewTokens(newTokens: Array<EssencialToken>): void,
    deleteToken(tokenName: String): void,
}

export default function TokenPage(props: TokenPageProps) {

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
                    <th>x</th>
                </tr>
                </thead>

                <tbody>
                {
                    [ ...props.Tokens.keys() ].map( (tokenName: String) => {
                        const tokenData = props.Tokens.get(tokenName)
                        return (
                            <tr key={`token ${tokenData!.id}`}>
                                <td style={{fontSize: "0.9em"}}><b>{tokenData!.id}</b></td>
                                <td style={{fontSize: "0.9em"}}>{tokenName}</td>
                                <td style={{fontSize: "0.85em"}}>{tokenData!.description}</td>
                                <td className={Style.unselectable}>
                                    <i 
                                        className = "material-icons red-text" 
                                        style     = {{fontSize: "1.5rem", cursor: "pointer"}}
                                        onClick   = {() => props.deleteToken(tokenName)} 
                                    >
                                        delete_forever
                                    </i>
                                </td>
                            </tr>
                        )
                    })
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

                    <br />

                </div>

                <a 
                    className = "waves-effect waves-teal btn-flat indigo lighten-5"
                    style     = {{textTransform: "initial"}}
                    onClick   = {() => {
                        const data = [...props.Tokens.keys()].map(tokenName => {
                            return {
                                name: tokenName,
                                description: props.Tokens.get(tokenName)!.description
                            }
                        })
                        
                        saveFile("Tokens.json", JSON.stringify(data,null,2) )
                    }}
                >
                    <i className="material-icons">cloud_download</i>
                    &nbsp;
                    &nbsp;
                    Create local file
                </a>

            </div>

        </div>
    )
}