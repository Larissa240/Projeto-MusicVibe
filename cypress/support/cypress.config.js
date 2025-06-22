const { defineConfig } = require('cypress');
const codeCoverage = require('@cypress/code-coverage/task');

module.exports = defineConfig({
    e2e: {
      setupNodeEvents(on, config) {
        codeCoverage(on, config);
        return config;
      }
    }
});