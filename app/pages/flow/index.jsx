import React from 'react'
import Flow from '../../components/flow'
import {
    ELEMENT_TYPE_PROCESS,
    ELEMENT_TYPE_DECISION,
    OPTION_ELEMENT_CREATE,
    OPTION_ELEMENT_UPDATE,
    PROCESS_SUBTYPE_WORKFLOW,
    PROCESS_SUBTYPE_ACTION,
    PROCESS_SUBTYPE_MANUAL,
    ELEMENT_STATUS_ERROR,
    ELEMENT_STATUS_DISABLED,
    ELEMENT_STATUS_PROCESSS,
    ELEMENT_STATUS_SUCCESS,
    ELEMENT_STATUS_PAUSE
} from '../../components/flow/common/constants'
export default class FlowPage extends React.Component {
    state = {
        id: '',
        text: '',
        subType: 0,
        status: ''
    }
    updateFn = null
    onAdd(type) {
        this.updateFn([{ type: OPTION_ELEMENT_CREATE, data: type }])
    }
    onBeforeRender(fn) {
        this.updateFn = fn
    }
    onSelect(element) {
        if (element) {
            this.setState({ id: element.id, text: element.attribute.text, subType: element.subType })
        } else {
            this.setState({ id: '', text: '', subType: 0 })
        }
    }
    onTextChange(e) {
        this.setState({ text: e.target.value })
    }
    onSubTypeChange(e) {
        this.setState({ subType: e.target.value })
    }
    onStatusChange(e) {
        this.setState({ status: e.target.value })
    }
    onModify() {
        let { id, text, subType, status } = this.state
        let optionData = []
        if (text) {
            optionData.push({ id, field: 'attribute.text', value: text })
        }
        if (subType) {
            optionData.push({ id, field: 'subType', value: subType })
        }
        if (status) {
            status = status == -1 ? '' : status
            optionData.push({ id, field: 'status', value: status })
        }
        this.updateFn([{ type: OPTION_ELEMENT_UPDATE, data: optionData }])
    }
    render() {
        let { id, text, subType, status } = this.state
        return (
            <div className="card panel-primary">
                <div className="card-body">
                    <div className="btn-group mb-2">
                        <button type="button" className="btn btn-secondary btn-info" onClick={this.onAdd.bind(this, ELEMENT_TYPE_PROCESS)}>
                            添加流程节点
                        </button>
                        <button type="button" className="btn btn-secondary btn-success" onClick={this.onAdd.bind(this, ELEMENT_TYPE_DECISION)}>
                            添加判断节点
                        </button>
                    </div>
                    <Flow onBeforeRender={this.onBeforeRender.bind(this)} onSelect={this.onSelect.bind(this)} />
                    <aside>
                        <form>
                            <div className="form-group row">
                                <label className="col-form-label col-form-label-sm">节点名称</label>
                                <input type="text" className="form-control form-control-sm" value={text} onChange={this.onTextChange.bind(this)} />
                            </div>
                            <div className="form-group row">
                                <label className="col-form-label col-form-label-sm">节点子类型</label>
                                <div className="form-control">
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="subtype" checked={subType == PROCESS_SUBTYPE_WORKFLOW} value={PROCESS_SUBTYPE_WORKFLOW} onClick={this.onSubTypeChange.bind(this)} disabled={!id} />编排
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="subtype" checked={subType == PROCESS_SUBTYPE_ACTION} value={PROCESS_SUBTYPE_ACTION} onClick={this.onSubTypeChange.bind(this)} disabled={!id} />操作
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline disabled">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="subtype" checked={subType == PROCESS_SUBTYPE_MANUAL} value={PROCESS_SUBTYPE_MANUAL} onClick={this.onSubTypeChange.bind(this)} disabled={!id} />人工
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-form-label col-form-label-sm">节点状态</label>
                                <div className="form-control">
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="status" checked={status == ELEMENT_STATUS_ERROR} value={ELEMENT_STATUS_ERROR} onClick={this.onStatusChange.bind(this)} disabled={!id} />error
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="status" checked={status == ELEMENT_STATUS_DISABLED} value={ELEMENT_STATUS_DISABLED} onClick={this.onStatusChange.bind(this)} disabled={!id} />disabled
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline disabled">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="status" checked={status == ELEMENT_STATUS_PROCESSS} value={ELEMENT_STATUS_PROCESSS} onClick={this.onStatusChange.bind(this)} disabled={!id} />process
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline disabled">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="status" checked={status == ELEMENT_STATUS_SUCCESS} value={ELEMENT_STATUS_SUCCESS} onClick={this.onStatusChange.bind(this)} disabled={!id} />success
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline disabled">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="status" checked={status == ELEMENT_STATUS_PAUSE} value={ELEMENT_STATUS_PAUSE} onClick={this.onStatusChange.bind(this)} disabled={!id} />pause
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline disabled">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="status" checked={status == '-1'} value="-1" onClick={this.onStatusChange.bind(this)} disabled={!id} />origin
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <button type="button" className="btn btn-primary" disabled={!id} onClick={this.onModify.bind(this)}>
                                    修改
                                </button>
                            </div>
                        </form>
                    </aside>
                </div>
            </div>
        )
    }
}
