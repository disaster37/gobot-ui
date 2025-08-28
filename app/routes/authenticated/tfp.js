import Route from '../authenticated';

import { hash } from 'rsvp';
import { action } from "@ember/object";
import { service } from '@ember/service';

export default class TfpRoute extends Route {
  @service store;  
  
  model(params) {
    var tfpState = this.store.findAll('tfp-state', { reload: true });
    var tfpConfig = this.store.findAll('tfp-config', {reload: true});
    return hash({
      tfpState: tfpState,
      tfpConfig: tfpConfig
    });
    
  }
    
  setupController(controller, model) {
    super.setupController(controller, model);
    this.store.findAll('tfp-state', { reload: true });
    this.store.findAll('tfp-config', {reload: true});
    controller.set('tfpState', this.store.peekRecord('tfp-state', 1));
    controller.set('tfpConfig', this.store.peekRecord('tfp-config', 1));
  }
    
  @action
  refreshRoute() {
    this.refresh();
    console.log("Route TFP refreshed");
  }
}
