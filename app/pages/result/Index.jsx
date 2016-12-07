import React from 'react';
export default class IndexPage extends React.Component {
    state = {
        automation: 'Radio Checkbox Form Table Tabs Menu Cascader Progress Select Tooltip Popover Modal Popconfirm message Dropdown Icon Row Col Breadcrumb Collapse Upload Alert Tree',
        cmdb: 'Input InputNumber Select Checkbox Radio DatePicker Form Table Button Tabs Menu Mention Tag Modal message Affix Grid Upload Tooltip Popover',
        uem: 'Modal Dropdown Pagination Tabs Button Select Cascader Upload Popover Tooltip message Popconfirm Table Switch',
        mointor: 'Select Button Icon Row Col Tooltip Spin InputNumber Table Collapse Tag message Form Menu Dropdown Modal QueueAnim Breadcrumb Checkbox DatePicker Radio Timeline BackTop',
        apm: 'Table Select Input DatePicker Modal Button Tag Checkbox Radio',
        show: 'Input InputNumber Checkbox message Button Popover Icon Form Select Radio Tooltip Modal Table Alert Pagination Dropdown Menu Tabs Upload Progress ColorPicker ColorGroupPicker',
        itsm: 'Input Checkbox message Button Popover Row Col Icon Form Select Radio DatePicker notification Tooltip Card Modal Switch Table Tag Alert Pagination Dropdown Menu Tabs TimePicker Cascader Upload Popconfirm Progress',
        tenant: 'Modal message Button Row Col Form Input Upload Icon Progress Tooltip Select Table Pagination Badge Dropdown Menu Spin Radio Checkbox Popover DatePicker InputNumber Tree QueueAnim'
    }
    _format() {
        let tmp = [];
        for (let key in this.state) {
            const value = this.state[key];
            tmp = tmp.concat(value.split(' '));
        }
        tmp = _.uniq(tmp).sort();
        return tmp;
    }
    render() {
        const data = this._format();
        return (
            <div className="container">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand">Antd组件统计结果</a>
                        </div>
                    </div>
                </nav>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>组件名称</th>
                            {_.keys(this.state).map(key => {
                                return <th key={key}>{key}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => {
                            return (
                                <tr key={item}>
                                    <td>{item}</td>
                                    {_.keys(this.state).map(key => {
                                        const values = this.state[key].split(' ');
                                        const cls = values.indexOf(item) !== -1 && 'success' || '';
                                        const res = values.indexOf(item) !== -1 && 'Y' || '';
                                        return <td className={cls} key={key}>{res}</td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}
