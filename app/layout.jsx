import React, { Component } from 'react'
import { Link } from 'react-router'
class Layout extends Component {
    render() {
        return (
            <div className="com-layout">
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                    <a className="navbar-brand" href="#">
                        Component
                    </a>
                    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to={{ pahthname: 'flow' }}>
                                    流程图
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <section className="container">{this.props.children}</section>
            </div>
        )
    }
}

export default Layout
