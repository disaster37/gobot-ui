import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
    
    @service session;
    @service router;

    @action
    toRoute(routeName){
        this.router.transitionTo(routeName);
    }

    @action
    logout(){
        this.session.invalidate();
        this.router.transitionTo("/")
    }

    @action
    login(){
        this.router.transitionTo("/login")
    }
}
