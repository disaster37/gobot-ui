import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { inject as service } from '@ember/service';

export default class configComponent extends Component {

    @service store;

    @tracked
    config = this.args.config;

    @tracked
    formIsNotEdited = true;

    @tracked
    UVC1BlisterTime = moment(this.config.UVC1BlisterTime).format('DD/MM/YYYY');

    @tracked
    UVC2BlisterTime = moment(this.config.UVC2BlisterTime).format('DD/MM/YYYY');

    @tracked
    ozoneBlisterTime = moment(this.config.ozoneBlisterTime).format('DD/MM/YYYY');

    modes = ["UVC", "ozone", "none"];

    @action
    modeChange(mode){
        this.config.mode = mode;
        console.log("Mode change :" + mode);
    }

    @action
    editForm() {
        this.formIsNotEdited = false;
        console.log("Edit form TFPconfig");
        return;
    }

    @action
    async save(event) {
        event.preventDefault();
        
        const data = {
            UVC1BlisterMaxTime: this.config.UVC1BlisterMaxTime,
            UVC2BlisterMaxTime: this.config.UVC2BlisterMaxTime,
            ozoneBlisterMaxTime: this.config.ozoneBlisterMaxTime,
            mode: this.config.mode,
            UVC1BlisterTime: moment(this.UVC1BlisterTime, 'DD/MM/YYYY').toDate(),
            UVC2BlisterTime: moment(this.UVC2BlisterTime, 'DD/MM/YYYY').toDate(),
            ozoneBlisterTime: moment(this.ozoneBlisterTime, 'DD/MM/YYYY').toDate(),
            isWaterfallAuto: this.config.isWaterfallAuto,
            startTimeWaterfall: this.config.startTimeWaterfall,
            stopTimeWaterfall: this.config.stopTimeWaterfall,
            version: this.config.version,
        };
        
        console.log(data);

        
        const config = this.store.createRecord('tfp-config', data);
        await config.save().then(() => {
            this.formIsNotEdited = true;
        });
    }
}
