import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from "@ember/object";

export default class TankRoute extends Route.extend(AuthenticatedRouteMixin) {

    model = function (params) {
        var tankConfig = this.store.findAll('tank-config', {reload: true});
        var tankState = this.store.findAll('tank', {reload: true});
        return hash({
          tankConfig: tankConfig,
          tankState: tankState
        });
    }
    
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('tankConfigs', model.tankConfig);
        controller.set('tankStates', model.tankState);
    }
    
    @action
    refreshRoute() {
        this.refresh();
        console.log("Route refreshed");
    }
}
