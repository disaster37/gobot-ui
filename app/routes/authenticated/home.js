import { hash } from 'rsvp';
import Route from '../authenticated';
import { action } from "@ember/object";
import { service } from '@ember/service';

export default class HomeRoute extends Route {
  @service store;

  model = function (params) {
    var tfpState = this.store.findAll('tfp-state', { reload: true });
    var tfpConfig = this.store.findAll('tfp-config', {reload: true});
    var tank = this.store.findAll('tank', {reload: true});
    return hash({
      tfpState: tfpState,
      tfpConfig: tfpConfig,
      tank: tank
    });
    
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('tfpState', this.store.peekRecord('tfp-state', 1));
    controller.set('tfpConfig', this.store.peekRecord('tfp-config', 1));
    controller.set('tankStates', model.tank);
  }

  @action
  refreshRoute() {
    this.refresh();
    console.log("Route refreshed");
  }
}
