import Route from '../authenticated';
import { hash } from 'rsvp';
import { action } from "@ember/object";
import { service } from '@ember/service';

export default class DfpRoute extends Route {
    @service store;
    

    model = function (params) {
        var dfpConfig = this.store.findAll('dfp-config', {reload: true});
        return hash({
          dfpConfig: dfpConfig
        });
    };
    
    setupController(controller, model) {
        super.setupController(controller, model);
        controller.set('dfpConfig', this.store.peekRecord('dfp-config', 1));
    }
    
    @action
    refreshRoute() {
        this.refresh();
        console.log("Route refreshed");
    }
}
