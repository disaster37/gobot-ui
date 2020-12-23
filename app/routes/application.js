import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default class Application extends Route {

  model = function (params) {
    console.log("Read model form application route");
    return hash({
      boards: this.store.findAll('board'),
    });
  }

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('boards', model.boards);
  }
}
