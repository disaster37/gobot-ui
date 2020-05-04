import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class LoginController extends Controller {
  @service('session') sessionManager;

  @tracked errorMessage;

  @action
  async authenticate() {
    const credentials = this.getProperties('username', 'password');
    const authenticator = 'authenticator:jwt'; // or 'authenticator:jwt'

    try {
      await this.sessionManager.authenticate(authenticator, credentials);
    } catch(error) {
      if (error.status == 401) {
        this.errorMessage = "Login failed"
      } else {
        this.errorMessage = error.json.message;
      }
    }

    if(this.sessionManager.isAuthenticated) {
      this.transitionToRoute("/home");
    }
    
  }
  
}
