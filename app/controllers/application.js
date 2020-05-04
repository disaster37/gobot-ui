import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
    @service session;

    @action
    toRoute(routeName){
        this.transitionToRoute(routeName);
    }

    @action
    logout(){
        this.session.invalidate();
        this.transitionToRoute("/")
    }

    @action
    login(){
        this.transitionToRoute("/login")
    }
}
