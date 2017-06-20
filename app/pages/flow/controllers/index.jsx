import React from 'react';
import AbstractController from './AbstractController';
import EventController from './EventController';
import TaskController from './TaskController';
import { ELEMENT_TYPE_EVENT, ELEMENT_TYPE_TASK, ELEMENT_TYPE_MANAGER } from '../constants';
function controller(type) {
    switch (type) {
        case ELEMENT_TYPE_EVENT:
            return EventController;
        case ELEMENT_TYPE_TASK:
            return TaskController
        default:
            return AbstractController;
    }
}

export default controller;