import EmberRouter from '@ember/routing/router';
import config from 'dfp-ui/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  //this.route('tfp-config');
  this.route('home');
  this.route('login');
  this.route('config');
  this.route('tfp');
  this.route('dfp');
  this.route('tank');
});
