import EmberRouter from '@ember/routing/router';
import config from 'dfp-ui/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('authenticated', { path: '' }, function() {
    // all routes that require the session to be authenticated
    this.route('home', { path: '' });
    this.route('config');
    this.route('tfp');
    this.route('dfp');
    this.route('tank');
  });
});
