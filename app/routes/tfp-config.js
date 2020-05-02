import Route from '@ember/routing/route';

export default class TfpConfigRoute extends Route {
  model() {

    return this.store.findAll('tfp-config');
  }
}
