import React from 'react';
import BarComponent from 'components/Bar/Index';
export default class BarPage extends React.Component {
    render() {
        const data = [
            {
                date: new Date(2015, 0, 1).getTime(),
                apples: 3840,
                bananas: 1920,
                cherries: 960
            }, {
                date: new Date(2015, 1, 1).getTime(),
                apples: 1600,
                bananas: 1440,
                cherries: 960
            }, {
                date: new Date(2015, 2, 1).getTime(),
                apples: 640,
                bananas: 960,
                cherries: 640
            }, {
                date: new Date(2015, 3, 1).getTime(),
                apples: 320,
                bananas: 480,
                cherries: 640
            }
        ];
        const color = {
            'apples': '#eb5154',
            'bananas': '#8c8a92',
            'cherries': '#90ed7d'
        }
        const keys = {
            x: 'date',
            y: ['apples', 'bananas', 'cherries']
        }
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">Bar-柱状图</div>
                <div className="panel-body">
                    <BarComponent data={data} color={color} keys={keys}/>
                </div>
            </div>
        );
    }
}
