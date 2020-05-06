import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from "@ember/object";

export default class HomeRoute extends Route.extend(AuthenticatedRouteMixin) {

  model = function (params) {
    var tfpConfig = this.store.findAll('tfp-config', { reload: true });
    //tfpConfig.reload();
    return Ember.RSVP.hash({
      tfpConfig: tfpConfig,
    });
    
  }

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('tfpConfig', model.tfpConfig.firstObject);

  }

  @action
  refresh() {
    this.refresh();
  }
}
