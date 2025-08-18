import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from "@glimmer/tracking";
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service session;
  @service router;
  
  @tracked errorMessage;

  @action
  async authenticate(e) {
    e.preventDefault();
    e.stopPropagation();
    const credentials = { username: this.username, password: this.password };
    const authenticator = 'authenticator:jwt'; // or 'authenticator:token'
    this.session.authenticate(authenticator, credentials).catch(err => {
      if (err.status === 401) {
        alert('Incorrect username or password');
        return;
      }
      let errorMessage = '';
      if (err.text) {
        try {
          if (this.isJsonResponse(err.text)) {
            errorMessage = JSON.parse(err.text).errors[0].message;
          } else {
            errorMessage = err.text;
          }
        } catch(er) {
          alert('An unexpected error occurred. ' + er.toString());
        }
      } else {
        errorMessage = err;
      }
      alert(errorMessage);
    });
  }

  isJsonResponse(response) {
    if (typeof response !== 'string') return false;
    try {
      const result = JSON.parse(response);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }
}