import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @inject session;
  @service store;
  @service router;

  async beforeModel() {
    await this.session.setup();
  }

  model(params) { 
    if(this.session.isAuthenticated) {
      console.log("Read model form application route");
      return hash({
        boards: this.store.findAll('board'),
      });
    }
  }
  
  setupController(controller, model) {
    console.log("Set controller form application route");
    super.setupController(controller, model);
    if(this.session.isAuthenticated) {
      controller.set('boards', model.boards);
    }
  }
}