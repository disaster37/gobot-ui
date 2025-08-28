# dfp-ui

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

## Installation

Ember: 6.4.0

> If package issue, create local file on root project `.npmrc` with value `legacy-peer-deps=true`

- `git clone <repository-url>` this repository
- `cd dfp-ui`
- `npm install`

- `ember install ember-simple-auth@6.1.0`
- `ember install ember-simple-auth-token`
- `ember install ember-moment`
- `ember install ember-websockets`
- `ember install ember-bootstrap`
- `ember install ember-power-select`
- `ember generate ember-bootstrap --preprocessor=sass`
- `ember install ember-ajax-fetch`
- `npm install --save-dev  @ember/string`
- `ember install ember-cli-string-helpers`
- `npm install --save-dev   moment`
- `ember install ember-truth-helpers`

## Running / Development

- `npm run start`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

- `npm run test`
- `npm run test:ember -- --server`

### Linting

- `npm run lint`
- `npm run lint:fix`

### Building

- `npm exec ember build` (development)
- `npm run build` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
