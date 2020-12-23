import Route from '@ember/routing/route';

import { hash } from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from "@ember/object";

export default class TfpRoute extends Route.extend(AuthenticatedRouteMixin) {
    model = function (params) {
        var tfpState = this.store.findAll('tfp-state', { reload: true });
        var tfpConfig = this.store.findAll('tfp-config', {reload: true});
        return hash({
          tfpState: tfpState,
          tfpConfig: tfpConfig
        });
        
      }
    
      setupController(controller, model) {
        this._super(controller, model);
        controller.set('tfpState', model.tfpState.firstObject);
        controller.set('tfpConfig', model.tfpConfig.firstObject);
      }
    
      @action
      refreshRoute() {
        this.refresh();
        console.log("Route refreshed");
      }
}
