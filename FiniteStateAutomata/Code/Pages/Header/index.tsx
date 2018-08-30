import React from "react"

import Style from "./Style.css"

export interface propsType {
    join: () => void,
    concat: () => void
    positiveClosure: () => void,
    kleeneClosure: () => void,
    optionalClosure: () => void,
    superJoin: () => void,
    toDFA: () => void,
}


export default function Header(props: propsType) {
    return (
        <React.Fragment>
            <div className="navbar-fixed blue-grey darken-3">
                <nav className="blue-grey darken-3">
                    <div className="nav-wrapper blue-grey darken-3 container">
                        
                        <a className="brand-logo center">
                            <span className={Style.Header}>
                                <b>Finite</b> State Automata
                            </span>
                        </a>
                        
                        <a href="" data-target="SideNav" className="sidenav-trigger show-on-large">
                            <i className="material-icons white-text">menu</i>
                        </a>

                        <a href="/" className="right" style={{height: "100%"}}>
                            <i className="material-icons">home</i>
                        </a>

                    </div>
                </nav>
            </div>

            <ul id="SideNav" className="sidenav">
                <li className="center">
                    <br />
                    <h5 style={{fontWeight: 200, fontSize: "1.9rem"}}>
                        <b>Menu</b>
                    </h5>
                </li>
				<br />
                <li><div className="divider"></div></li>
                <li><a className="subheader">Basic Ideas</a></li>
                <li>
                    <a className="waves-effect" href="#!">
                        See Automatas
                    </a>
                    <a data-target="AddAutomataModal" className="waves-effect modal-trigger">
                        Create Basic Automata
                    </a>
                </li>
                <li><div className="divider"></div></li>
                <li><a className="subheader">Operations</a></li>
                <li>
                    <a className="waves-effect" href="#!" onClick={props.join}>
                        Join
                    </a>
                    <a className="waves-effect" href="#!" onClick={props.concat}>
                        Concatenate
                    </a>
                    <a className="waves-effect" href="#!" onClick={props.positiveClosure}>
                        Positive Closure
                    </a>
                    <a className="waves-effect" href="#!" onClick={props.kleeneClosure} >
                        Kleene Closure
                    </a>
                    <a className="waves-effect" href="#!" onClick={props.optionalClosure} >
                        Optional Closure
                    </a>
                    <a className="waves-effect" href="#!" onClick={props.toDFA} >
                        to Deterministic
                    </a>
                    <a className="waves-effect" href="#!" onClick={props.superJoin} >
                        Super Join
                    </a>
                </li>
            </ul>
        </React.Fragment>
    )
}