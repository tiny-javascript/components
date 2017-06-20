import uuid from 'uuid';
export default class AbstractModel {
    constructor(data) {
        data = data || {}
        this.id = data.id || uuid.v4();
        this.name = data.name || '';
        this.type = data.type || '';
        this.prevs = data.prevs || [];
        this.nexts = data.nexts || [];
        this.attrs = data.attrs || {};
    }
}