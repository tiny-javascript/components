import React from 'react';
import AbstractController from './AbstractController';
import EventController from './EventController';
import TaskController from './TaskController';
import ManagerController from './ManagerController';
import LinkController from './LinkController';
import { ELEMENT_TYPE_EVENT, ELEMENT_TYPE_TASK, ELEMENT_TYPE_MANAGER, ELEMENT_TYPE_LINK } from '../constants';
function controller(type) {
    switch (type) {
        case ELEMENT_TYPE_EVENT:
            return EventController;
        case ELEMENT_TYPE_TASK:
            return TaskController;
        case ELEMENT_TYPE_MANAGER:
            return ManagerController;
        case ELEMENT_TYPE_LINK:
            return LinkController;
        default:
            return AbstractController;
    }
}

export default controller;