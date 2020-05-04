import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default class ConfigController extends Controller {
    @tracked
    tfpIsNotEdited = true;


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
    saveTFPConfig(data) {
        let tfpConfig = this.store.createRecord('tfp-config', data);
        tfpConfig.save();

    }

    currentDate() {
        return Date.now()
    }
}
