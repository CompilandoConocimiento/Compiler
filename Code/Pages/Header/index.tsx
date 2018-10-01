import React from "react"
import {Link} from "react-router-dom"
import Style from "./Style.css"



export default function Header() {
    return (
        <React.Fragment>
            <div className="navbar-fixed blue-grey darken-3">
                <nav className="blue-grey darken-3">
                    <div className="nav-wrapper blue-grey darken-3 container">
                        
                        <a className="brand-logo center">
                            <span className={Style.Header}>
                                <b>Compiler</b> DIY
                            </span>
                        </a>
                        
                        <a href="" data-target="SideNav" className="sidenav-trigger show-on-large">
                            <i className="material-icons white-text">menu</i>
                        </a>

                        <Link to="/" className="right" style={{height: "100%"}}>
                            <i className="material-icons">home</i>
                        </Link>

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
            </ul>
        </React.Fragment>
    )
}
