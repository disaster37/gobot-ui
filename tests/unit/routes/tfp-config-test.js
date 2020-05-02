import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | tfp-config', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:tfp-config');
    assert.ok(route);
  });
});
