import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HomeRoute extends Route {
  @service('tfp') tfpService;

  model = function (params) {
    return this.store.findAll('tfp-config');
  }
}
