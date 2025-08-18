import { hash } from 'rsvp';
import Route from '../authenticated';
import { service } from '@ember/service';

export default class ConfigRoute extends Route {
  @service store;


  model = function (params) {
    return hash({
      tfpConfig: this.store.findAll('tfp-config'),
      dfpConfig: this.store.findAll('dfp-config'),
      tankConfig: this.store.findAll('tank-config'),
    });
    
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('tfpConfig', this.store.peekRecord('tfp-config', 1));
    controller.set('dfpConfig', this.store.peekRecord('dfp-config', 1));
    controller.set('tankConfigs', this.store.peekRecord('tank-config', 1));
  }
}
