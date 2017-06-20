import AbstractModel from './AbstractModel';
import { ELEMENT_TYPE_EVENT } from '../constants';
export default class EventModel extends AbstractModel {
    constructor(data, type) {
        super(data);
        this.type = ELEMENT_TYPE_EVENT;
        this.subType = type;
    }
}