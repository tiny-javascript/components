import AbstractModel from './AbstractModel';
import { ELEMENT_TYPE_TASK } from '../constants';
export default class TaskModel extends AbstractModel {
    constructor(name) {
        super(name);
        this.type = ELEMENT_TYPE_TASK;
    }
}