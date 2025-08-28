import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';
import config from '../config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = config.APP.Namespace;

  @service session;

  get headers() {
    if (this.session.isAuthenticated) {
      return {
        Authorization: `Bearer ${this.session.data.authenticated.token}`,
      };
    } else {
      return {};
    }
  }
}