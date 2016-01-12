const sourceContext = require.context('./src', true, /\.js$/);
sourceContext.keys().forEach(sourceContext);
const testsContext = require.context('./spec', true, /Spec\.js$/);
testsContext.keys().forEach(testsContext);
