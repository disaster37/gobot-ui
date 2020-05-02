import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  pondPumpRunning() {
    return faker.random.boolean();
  },

  UVC1Running() {
    return faker.random.boolean();
  },

  UVC2Running() {
    return faker.random.boolean();
  },

  pondBubbleRunning() {
    return faker.random.boolean();
  },

  filterBubbleRunning() {
    return faker.random.boolean();
  },

  waterfallPumpRunning() {
    return faker.random.boolean();
  }
});
