import React from 'react'
import Flow from '../../components/flow'
import { ELEMENT_TYPE_PROCESS, ELEMENT_TYPE_DECISION, OPTION_ELEMENT_CREATE } from '../../components/flow/common/constants'
export default class FlowPage extends React.Component {
    updater = null
    onAdd(type) {
        this.updater([{ type: OPTION_ELEMENT_CREATE, data: type }])
    }
    onBeforeRender(fn) {
        this.updater = fn
    }
    render() {
        return (
            <div className="card panel-primary">
                <div className="card-body">
                    <div className="btn-group btn-group-sm mb-2">
                        <button type="button" className="btn btn-secondary btn-info" onClick={this.onAdd.bind(this, ELEMENT_TYPE_PROCESS)}>
                            添加流程节点
                        </button>
                        <button type="button" className="btn btn-secondary btn-success" onClick={this.onAdd.bind(this, ELEMENT_TYPE_DECISION)}>
                            添加判断节点
                        </button>
                    </div>
                    <Flow height="800" onBeforeRender={this.onBeforeRender.bind(this)} />
                </div>
            </div>
        )
    }
}
