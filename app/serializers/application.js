import DS from 'ember-data';
import { decamelize } from '@ember/string';

export default class ApplicationSerializer extends DS.JSONAPISerializer {
  keyForAttribute(key) {
    return decamelize(key);
  }

  attrs = {
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  }
}
