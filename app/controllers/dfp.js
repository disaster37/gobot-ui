import Controller from '@ember/controller';
import { action } from "@ember/object";

export default class DfpController extends Controller {

    @action
    reload(){
        this.send("refreshRoute");
    }
}
