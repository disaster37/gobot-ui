import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonOnOffComponent extends Component {
    @tracked isOn = this.args.isOn;
    @tracked actionOn = this.args.actionOn;
    @tracked actionOff = this.args.actionOff;
    @tracked service = this.args.service;
    @tracked refresh = this.args.refresh;
    @tracked setError = this.args.error;

    @action
    change(isOn){
        console.log("New state: " + isOn);
        let res;
        if(isOn){
            res = this.service.call(this.actionOn);
        }
        else {
            res = this.service.call(this.actionOff);
        }
        
        res.then(result => {
         this.isOn = isOn;  
        }).catch(error => {
            this.setError(error);
        })
        
        this.refresh();
    }

}