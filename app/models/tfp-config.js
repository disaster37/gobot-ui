import Model, { attr } from '@ember-data/model';

export default class TfpconfigModel extends Model {
  @attr('number') UVC1BlisterMaxTime;
  @attr('number') UVC2BlisterMaxTime;
  @attr('number') ozoneBlisterMaxTime;
  @attr('boolean') isWaterfallAuto;
  @attr('string') startTimeWaterfall;
  @attr('string') stopTimeWaterfall;
  @attr('boolean') isWaterfallAuto;
  @attr('string') startTimeWaterfall;
  @attr('string') stopTimeWaterfall;
  @attr('string') mode;
  @attr('date') updatedAt;
  @attr('date') createdAt;
  @attr('number') version;

}
