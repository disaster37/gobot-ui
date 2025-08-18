import Route from '../authenticated';
import { hash } from 'rsvp';
import { action } from "@ember/object";
import { service } from '@ember/service';

export default class TankRoute extends Route {
    @service store;

    model = function (params) {
        var tankConfig = this.store.findAll('tank-config', {reload: true});
        var tankState = this.store.findAll('tank', {reload: true});
        return hash({
          tankConfig: tankConfig,
          tankState: tankState
        });
    }
    
    setupController(controller, model) {
        super.setupController(controller, model);
        controller.set('tankConfigs', model.tankConfig);
        controller.set('tankStates', model.tankState);
    }
    
    @action
    refreshRoute() {
        this.refresh();
        console.log("Route refreshed");
    }
}
