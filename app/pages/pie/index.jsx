import React from 'react';
import PieComponent from 'components/Pie/Index';
export default class Pie extends React.Component {
    render() {
        var data = [
            {
                'value': 4,
                'name': 'Locke',
                'color': '#98abc5'
            }, {
                'value': 8,
                'name': 'Reyes',
                'color': '#8a89a6'
            }, {
                'value': 23,
                'name': 'Shephard',
                'color': '#a05d56'
            }, {
                'value': 42,
                'name': 'Kwon',
                'color': '#d0743c'
            }, {
                'value': 15,
                'name': 'Ford',
                'color': '#7b6888'
            }, {
                'value': 16,
                'name': 'Jarrah',
                'color': '#6b486b'
            }
        ];
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">Pie-饼图</div>
                <div className="panel-body">
                    <PieComponent data={data}/>
                </div>
            </div>
        );
    }
}
