import AjaxService from 'ember-ajax/services/ajax';
import { computed } from "@ember/object";
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';
import config from '../config/environment';

export default class AjaxAppService extends AjaxService.extend(TokenAuthorizerMixin) {

  namespace = config.APP.Namespace;

  @computed('session.data.authenticated.access_token')
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      // OAuth 2
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
    }

    return headers;
  }
}
