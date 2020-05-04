import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonOnOffComponent extends Component {
    @tracked isOn = this.args.isOn;
    @tracked actionOn = this.args.actionOn;
    @tracked actionOff = this.args.actionOff;
    @tracked service = this.args.service;

    @action
    change(isOn){
        console.log("New state: " + isOn);
        if(isOn){
            this.service.call(this.actionOn);
        }
        else {
            this.service.call(this.actionOff);
        }
        
        this.isOn = isOn;
    }

}