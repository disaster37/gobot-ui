import { computed } from '@ember/object';
import FetchService from 'ember-ajax-fetch/services/fetch';
import config from '../config/environment';
import { service } from '@ember/service';

export default class ExtendedFetchService extends FetchService {
  @service session;
  namespace = config.APP.Namespace;
 
   @computed('session.data.authenticated.{access_token,token}', 'session.isAuthenticated')
   get headers() {
     let headers = {};
     if (this.session.isAuthenticated) {
       // OAuth 2
       headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
     }
 
     return headers;
   }
}