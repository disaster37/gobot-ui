import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class LoginController extends Controller {
  @service('session') sessionManager;

  actions = {
    authenticate: function () {
      const credentials = this.getProperties('username', 'password');
      const authenticator = 'authenticator:jwt'; // or 'authenticator:jwt'

      console.log(credentials);

      this.sessionManager.authenticate(authenticator, credentials);
    }
  }
}
