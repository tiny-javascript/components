import AbstractModel from './AbstractModel';
import { ELEMENT_TYPE_MANAGER } from '../constants';
export default class ManagerModel extends AbstractModel {
    constructor(name) {
        super(name);
        this.type = ELEMENT_TYPE_MANAGER;
    }
}