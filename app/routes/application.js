import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Application extends Route {

  @service('session') sessionManager;

  model = function (params) {
    if(this.sessionManager.isAuthenticated) {
      console.log("Read model form application route");
      return hash({
        boards: this.store.findAll('board'),
      });
    }
  }

  setupController(controller, model) {
    this._super(controller, model);
    if(this.sessionManager.isAuthenticated) {
      controller.set('boards', model.boards);
    }
  }
}
