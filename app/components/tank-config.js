import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { inject as service } from '@ember/service';

export default class TankConfigComponent extends Component {
    @service store;

    @tracked
    config = this.args.config;

    @tracked
    formIsNotEdited = true;

    @action
    editForm() {
        this.formIsNotEdited = false;
        console.log("Edit form Tankconfig");
        return;
    }

    @action
    async save(event) {
        event.preventDefault();
        
        console.log(this.config);

        await this.config.save().then(() => {
            this.formIsNotEdited = true;
        });
    }
}
