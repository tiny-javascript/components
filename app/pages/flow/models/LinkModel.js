import AbstractModel from './AbstractModel';
import { ELEMENT_TYPE_LINK } from '../constants';
export default class LinkModel extends AbstractModel {
    constructor(data) {
        super(data);
        this.type = ELEMENT_TYPE_LINK;
    }
}