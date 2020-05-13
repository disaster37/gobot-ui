import Model, { attr } from '@ember-data/model';

export default class DfpConfigModel extends Model {

    @attr('date') updatedAt;
    @attr('date') createdAt;

}
