import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { service } from '@ember/service';
import moment from 'moment';

export default class configComponent extends Component {

    @service store;

    @tracked
    state = this.args.state;

    @tracked
    formIsNotEdited = true;


    @action
    editForm() {
        this.formIsNotEdited = false;
        console.log("Edit form TFPconfig");
        return;
    }

    @action
    async save(event) {
        event.preventDefault();
        
        console.log(this.state);

        await this.state.save().then(() => {
            this.formIsNotEdited = true;
        });
    }
}
