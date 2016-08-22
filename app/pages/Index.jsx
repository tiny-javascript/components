import React from 'react';
import SlidePanelPage from 'pages/SlidePanel';
import ProxyMapPage from 'pages/ProxyMap';
import PiePage from 'pages/Pie';
import BarPage from 'pages/Bar';
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
                <SlidePanelPage/>
                <BarPage/>
                <PiePage/>
                <ProxyMapPage/>
            </div>
        );
    }
}
