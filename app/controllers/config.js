import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import moment from 'moment';

export default class ConfigController extends Controller {



    @tracked
    tfpIsNotEdited = true;

    @tracked
    tfpUVC1BlisterTime = moment(this.tfpConfig.UVC1BlisterTime).format('DD/MM/YYYY');

    @tracked
    tfpUVC2BlisterTime = moment(this.tfpConfig.UVC2BlisterTime).format('DD/MM/YYYY');


    @action
    editForm(name) {

        switch(name){
            case "tfpConfig":
                this.tfpIsNotEdited = false;
                console.log("Edit form tfpConfig");
                return;
        }

    }

    @action
    async saveTFPConfig(event) {
        event.preventDefault();
        
        const data = {
            pondPumpRunning: this.tfpConfig.pondPumpRunning,
            UVC1Running: this.tfpConfig.UVC1Running,
            UVC2Running: this.tfpConfig.UVC2Running,
            pondBubbleRunning: this.tfpConfig.pondBubbleRunning,
            filterBubbleRunning: this.tfpConfig.filterBubbleRunning,
            waterfallPumpRunning: this.tfpConfig.waterfallPumpRunning,
            UVC1BlisterMaxTime: this.tfpConfig.UVC1BlisterMaxTime,
            UVC2BlisterMaxTime: this.tfpConfig.UVC2BlisterMaxTime,
            UVC1BlisterTime: moment(this.tfpUVC1BlisterTime, 'DD/MM/YYYY').toDate(),
            UVC2BlisterTime: moment(this.tfpUVC2BlisterTime, 'DD/MM/YYYY').toDate(),
            version: this.tfpConfig.version,
        };
        
        console.log(data);

        
        const tfpConfig = this.store.createRecord('tfp-config', data);
        await tfpConfig.save().then(() => {
            this.tfpIsNotEdited = true;
        });

    }
}
