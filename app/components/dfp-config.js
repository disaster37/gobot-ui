import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { inject as service } from '@ember/service';

export default class DfpConfigComponent extends Component {

    @service store;

    @tracked
    config = this.args.config;

    @tracked
    formIsNotEdited = true;

    @action
    editForm() {
        this.formIsNotEdited = false;
        console.log("Edit form dfpConfig");
        return;
    }

    @action
    async save(event) {
        event.preventDefault();
        
        const data = {
            forceWashingDuration: this.config.forceWashingDuration,
            forceWashingDurationWhenFrozen: this.config.forceWashingDurationWhenFrozen,
            temperatureThresholdWhenFrozen: this.config.temperatureThresholdWhenFrozen,
            waitTimeBetweenWashing: this.config.waitTimeBetweenWashing,
            washingDuration: this.config.washingDuration,
            startWashingPumpBeforeWashing: this.config.startWashingPumpBeforeWashing,
            version: this.config.version,
        };
        
        console.log(data);

        
        const tfpConfig = this.store.createRecord('dfp-config', data);
        await tfpConfig.save().then(() => {
            this.formIsNotEdited = true;
        });
    }
}
