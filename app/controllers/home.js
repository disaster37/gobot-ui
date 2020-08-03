import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { computed } from '@ember/object';
import moment from 'moment';

export default class HomeController extends Controller {
    @service('tfp') tfpService;

    @tracked tfpError;


    @action
    refresh() {
        this.send('refreshRoute');
    }

    @action
    setTFPError(error) {
        this.tfpError = error;
    }

    @computed
    get isTFPUVC1BlisterOk() {
        const nbHours = moment().diff(moment(this.tfpState.UVC1BlisterTime), 'hours');
        if(this.tfpConfig.UVC1BlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }

    @computed
    get isTFPUVC2BlisterOk() {
        const nbHours = moment().diff(moment(this.tfpState.UVC2BlisterTime), 'hours');
        if(this.tfpConfig.UVC2BlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }

    @computed
    get isTFPOzoneBlisterOk() {
        const nbHours = moment().diff(moment(this.tfpState.ozoneBlisterTime), 'hours');
        if(this.tfpConfig.ozoneBlisterMaxTime > nbHours) {
            return true;
        }
        else {
            return false;
        }
    }
}
