import React from 'react';
import SlidePanelPage from 'pages/index/SlidePanel';
import ProxyMapPage from 'pages/index/ProxyMap';
import PiePage from 'pages/index/Pie';
import BarPage from 'pages/index/Bar';
export default class IndexPage extends React.Component {
    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand">React组件</a>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
