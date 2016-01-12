const testsContext = require.context('./spec', true, /Spec\.js$/);
testsContext.keys().forEach(testsContext);
