import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from "@ember/object";

export default class HomeRoute extends Route.extend(AuthenticatedRouteMixin) {

  model = function (params) {
    var tfpState = this.store.findAll('tfp-state', { reload: true });
    var tfpConfig = this.store.findAll('tfp-config', {reload: true});
    var tankState = this.store.findAll('tank', {reload: true});
    return hash({
      tfpState: tfpState,
      tfpConfig: tfpConfig,
      tankState: tank
    });
    
  }

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('tfpState', model.tfpState.firstObject);
    controller.set('tfpConfig', model.tfpConfig.firstObject);
    controller.set('tank', model.tank);
  }

  @action
  refreshRoute() {
    this.refresh();
    console.log("Route refreshed");
  }
}
