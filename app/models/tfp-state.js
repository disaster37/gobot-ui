import Model, { attr } from '@ember-data/model';

export default class TfpstateModel extends Model {
  @attr('boolean') pondPumpRunning;
  @attr('boolean') UVC1Running;
  @attr('boolean') UVC2Running;
  @attr('boolean') waterfallPumpRunning;
  @attr('boolean') pondBubbleRunning;
  @attr('boolean') filterBubbleRunning;
  @attr('date') UVC1BlisterTime;
  @attr('date') UVC2BlisterTime;
  @attr('date') ozoneBlisterTime;
  @attr('number') UVC1BlisterNbHour;
  @attr('number') UVC2BlisterNbHour;
  @attr('number') ozoneBlisterNbHour;
  @attr('boolean') acknoledgeWaterfallAuto;
  @attr('date') BacteriumTime;
  @attr('date') updatedAt;
  @attr('date') createdAt;
  @attr('number') version;
}
