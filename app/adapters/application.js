import JSONAPIAdapter from '@ember-data/adapter/json-api';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';
import { computed } from '@ember/object';
import config from '../config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter.extend(TokenAuthorizerMixin) {
  namespace = config.APP.Namespace;

  @computed('session.data.authenticated.access_token')
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      // OAuth 2
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
      headers['content-type'] = 'application/json';
      headers['']
    }

    return headers;
  }

  /*
  shouldReloadRecord(store, snapshot) {
    return true;
  }

  shouldReloadAll(store, snapshot) {
    return true;
  }

  shouldBackgroundReloadRecord(store, snapshot) {
    return false;
  }

  shouldBackgroundReloadAll(store, snapshot) {
    return false;
  }
  */
}
