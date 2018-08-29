import React from "react"

export default function Footer(props) {

    return (
        <footer className="page-footer blue-grey darken-3">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h6 className="white-text">What is this?</h6>
                        <p className="white-text">
                            This webapp/book is a simple converter for the many
                            representations of numbers in a computer.
                        </p>
                    </div>
                    <div className="col l4 offset-l2 s12">
                        <h6 className="white-text">Authors</h6>
                        <ul className="browser-default" style={{fontSize: "1.1rem"}}>
                            <a href="https://SoyOscarRH.github.io" target="_blank">
                                <li className="white-text">
                                    <b>Soy</b>Oscar<b>RH</b>
                                </li>
                            </a>
                        </ul>

                        <br />
                        <a href="https://github.com/CompilandoConocimiento" target="_blank">
                            <h6 className="white-text">Github</h6>
                        </a>

                        <a href="https://CompilandoConocimiento.com" target="_blank">
                            <h6 className="white-text">CompilandoConocimiento.com</h6>
                        </a>

                    </div>
                </div>
            </div>
            
            <div className="footer-copyright blue-grey darken-4">
                <div className="container">
                    Made by CompilandoConocimiento. Making the world a happier place
                </div>
            </div>
        </footer>
    )
}