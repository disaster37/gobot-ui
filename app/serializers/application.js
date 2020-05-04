import DS from 'ember-data';
import { decamelize } from '@ember/string';

export default class ApplicationSerializer extends DS.JSONAPISerializer {
  keyForAttribute(key) {
    switch(key) {
      case "UpdatedAt":
        return "updatedAt";
      case "CreatedAt":
        return "createdAt";
      case "DeletedAt":
        return "deletedAt";
      default:
        return decamelize(key);
    }
    
  }
}
