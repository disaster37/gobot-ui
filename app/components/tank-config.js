import Component from '@glimmer/component';

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
        
        const data = {
            version: this.config.version,
            enable: this.config.enable,
            name: this.config.name,
            depth: this.config.depth,
            sensorHeight: this.config.sensorHeight,
            literPerCm: this.config.literPerCm,
        };
        
        console.log(data);

        
        const config = this.store.createRecord('tank-config', data);
        await config.save().then(() => {
            this.formIsNotEdited = true;
        });
    }
}
