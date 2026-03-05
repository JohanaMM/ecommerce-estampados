import React, { Component } from "react";

const links = [<a href="/">Inicio</a>, <a href="/">Lista de productos</a>]

class Navbar extends Component {


    render() {return(
        <>
            <nav>
                <ul>
                    {links.map(function(link, i){
                    return <li key={link + i}>{link}</li>
                    })}
                </ul>
            </nav>
        </>
    )}
}

export default Navbar;