import React from "react"
import {Link} from "react-router-dom"

import * as DataConverts from "../App/Routes.json"

export default function Header(props) {
    return (
        <React.Fragment>
            <div className="navbar-fixed blue-grey darken-3">
                <nav className="blue-grey darken-3">
                    <div className="nav-wrapper blue-grey darken-3 container">
                        <a className="brand-logo center hide-on-small-only" style={{fontSize: "1.9rem"}}>
                            <b>Binary</b> Conversions
                        </a>
                        <a className="brand-logo center hide-on-med-and-up" style={{fontSize: "1.1rem"}}>
                            <b>Binary</b> Conversions
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
                        <b>Binary</b> Conversions
                    </h5>
                </li>
				<br />
                {
                    DataConverts.Data.map(
                        Topic => {
                            const SubTopics = Topic.SubTypes.map(
                                Type =>
                                <li key={Type[0]}>
                                    <Link className="waves-effect" to={Type[1]}>
                                        {Type[0]}
                                    </Link>
                                </li>
                            )
                            return (
                                <React.Fragment key={Topic.Name}>
                                    <li><div className="divider"></div></li>
                                    <li><a className="subheader">{Topic.Name}</a></li>
                                    {SubTopics}
                                </React.Fragment>
                            )
                        }
                    )
                }
            </ul>
        </React.Fragment>
    )
}
