import Model, { attr } from '@ember-data/model';


export default class DfpStateModel extends Model {
    @attr('boolean') isWashed;
    @attr('boolean') isRunning;
    @attr('boolean') isSecurity;
    @attr('boolean') isEmergencyStopped;
    @attr('boolean') isDisableSecurity;
    @attr('date') lastWashing;
}
