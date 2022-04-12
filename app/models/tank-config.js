import Model, { attr } from '@ember-data/model';

export default class TankConfigModel extends Model {
    @attr('date') updatedAt;
    @attr('date') createdAt;
    @attr('number') version;
    @attr('boolean') enable;
    @attr('name') name;
    @attr('number') depth;
    @attr('number') sensorHeight;
    @attr('number') literPerCm;
}
