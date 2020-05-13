import Model, { attr } from '@ember-data/model';

export default class TfpconfigModel extends Model {
  @attr('boolean') pondPumpRunning;
  @attr('boolean') UVC1Running;
  @attr('boolean') UVC2Running;
  @attr('boolean') waterfallPumpRunning;
  @attr('boolean') pondBubbleRunning;
  @attr('boolean') filterBubbleRunning;
  @attr('date') UVC1BlisterTime;
  @attr('date') UVC2BlisterTime;
  @attr('number') UVC1BlisterMaxTime;
  @attr('number') UVC2BlisterMaxTime;
  @attr('date') BacteriumTime;
  @attr('date') updatedAt;
  @attr('date') createdAt;
  @attr('number') version;
}
