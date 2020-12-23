import Model, { attr } from '@ember-data/model';

export default class DfpConfigModel extends Model {

    @attr('number') forceWashingDuration;
    @attr('number') forceWashingDurationWhenFrozen;
    @attr('number') temperatureThresholdWhenFrozen;
    @attr('number') waitTimeBetweenWashing;
    @attr('number') washingDuration;
    @attr('number') startWashingPumpBeforeWashing;
    @attr('date') updatedAt;
    @attr('date') createdAt;
    @attr('number') version;

}
