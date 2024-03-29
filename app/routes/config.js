import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ConfigRoute extends Route.extend(AuthenticatedRouteMixin) {

  model = function (params) {
    return hash({
      tfpConfig: this.store.findAll('tfp-config'),
      dfpConfig: this.store.findAll('dfp-config'),
      tankConfig: this.store.findAll('tank-config'),
    });
    
  }

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('tfpConfig', model.tfpConfig.firstObject);
    controller.set('dfpConfig', model.dfpConfig.firstObject);
    controller.set('tankConfigs', model.tankConfig);
  }
}
