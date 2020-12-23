import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { computed } from '@ember/object';
import moment from 'moment';

export default class TfpActionComponent extends Component {

    @service('tfp') tfpService;

    @tracked
    config = this.args.config;

    @tracked
    state = this.args.state;

    @tracked error;


    @action
    refresh() {
        this.args.refreshRoute();
    }

    @action
    setError(error) {
        this.error = error;
    }

    @action
    changeBlister(name) {
        let caller;
        switch(name) {
            case "UVC1":
                caller = "changeUVC1Blister";
                break;
            case "UVC2":
                caller = "changeUVC2Blister";
                break;
            case "Ozone":
                caller = "changeOzoneBlister";
                break;
            default:
                return;

        }

        let res;
        res = this.tfpService.call(caller);
        res.then(result => {
             
        }).catch(error => {
            this.setError(error);
        })
           
        this.refresh();
    }

    @computed
    get isUVC1BlisterOk() {
        const nbHours = moment().diff(moment(this.state.UVC1BlisterTime), 'hours');
        if(this.config.UVC1BlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }

    @computed
    get isUVC2BlisterOk() {
        const nbHours = moment().diff(moment(this.state.UVC2BlisterTime), 'hours');
        if(this.config.UVC2BlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }

    @computed
    get isOzoneBlisterOk() {
        const nbHours = moment().diff(moment(this.state.ozoneBlisterTime), 'hours');
        if(this.config.ozoneBlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }
}
