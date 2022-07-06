import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";

export default class TankActionComponent extends Component {

    @tracked
    state = this.args.state;
}
