import { ELEMENT_TYPE_EVENT, ELEMENT_TYPE_PROCESS, ELEMENT_TYPE_DECISION, ELEMENT_TYPE_CONNECTOR } from '../common/constants'
import EventController from './event_controller'
import ProcessController from './process_controller'
import DecisionController from './decision_controller'
import ConnectorController from './connector_controller'

class ControllerFactory {
    static create(type) {
        let controller = null
        switch (type) {
            case ELEMENT_TYPE_EVENT:
                controller = EventController
                break
            case ELEMENT_TYPE_PROCESS:
                controller = ProcessController
                break
            case ELEMENT_TYPE_DECISION:
                controller = DecisionController
                break
            case ELEMENT_TYPE_CONNECTOR:
                controller = ConnectorController
                break
        }
        return controller
    }
}

export default ControllerFactory
