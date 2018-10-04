import React from "react"
import {Link} from "react-router-dom"

type CardProps = {
    name: string,
    materializeCSSColor: string,
    link: string
  }

function CardToTopic (props: CardProps) {
    return (
        <Link to={props.link} onClick={() => scroll(0, 0)}>
            <span 
                className = {`card hoverable ${props.materializeCSSColor}`} 
                style     = {{"display": "block"}}>
                
                <span className="card-content white-text" style={{"display": "block"}}>
                    <span className="card-title">
                        {props.name}
                    </span>
                </span>
            </span>
        </Link>
    )
}

export default CardToTopic