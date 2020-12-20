import Model, { attr } from '@ember-data/model';

export default class TankModel extends Model {
    @attr('number') level;
    @attr('number') volume;
    @attr('number') percent;
}
