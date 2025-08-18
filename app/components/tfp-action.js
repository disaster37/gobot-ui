import Component from '@glimmer/component';
import { service } from '@ember/service';
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

    @computed('config.{UVC1BlisterMaxTime,UVC1BlisterTime}')
    get isUVC1BlisterOk() {
        const nbHours = moment().diff(moment(this.config.UVC1BlisterTime), 'hours');
        if(this.config.UVC1BlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }

    @computed('config.{UVC2BlisterMaxTime,UVC2BlisterTime}')
    get isUVC2BlisterOk() {
        const nbHours = moment().diff(moment(this.config.UVC2BlisterTime), 'hours');
        if(this.config.UVC2BlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }

    @computed('config.{ozoneBlisterMaxTime,ozoneBlisterTime}')
    get isOzoneBlisterOk() {
        const nbHours = moment().diff(moment(this.config.ozoneBlisterTime), 'hours');
        if(this.config.ozoneBlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }
}
