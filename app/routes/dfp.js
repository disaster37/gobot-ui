import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from "@ember/object";

export default class DfpRoute extends Route.extend(AuthenticatedRouteMixin) {

    model = function (params) {
        var dfpConfig = this.store.findAll('dfp-config', {reload: true});
        return hash({
          dfpConfig: dfpConfig
        });
    }
    
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('dfpConfig', model.dfpConfig.firstObject);
    }
    
    @action
    refreshRoute() {
        this.refresh();
        console.log("Route refreshed");
    }
}
