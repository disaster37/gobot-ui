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

        this.config.UVC1BlisterTime = moment(this.UVC1BlisterTime, 'DD/MM/YYYY').toDate();
        this.config.UVC2BlisterTime = moment(this.UVC2BlisterTime, 'DD/MM/YYYY').toDate();
        this.config.ozoneBlisterTime = moment(this.ozoneBlisterTime, 'DD/MM/YYYY').toDate();
        
        console.log(this.config);

        await this.config.save().then(() => {
            this.formIsNotEdited = true;
        });
    }
}
