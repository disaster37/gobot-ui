import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | tfp', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:tfp');
    assert.ok(adapter);
  });
});
