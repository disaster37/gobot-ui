import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";

export default class BoardStateComponent extends Component {

    @tracked
    boards = this.args.boards;
}
