module.exports = {
  // this should match the JS Control class or functional constructor name.
  JS_CONTROL_NAME: 'JsControlName', 
  externals: {
    // these are libraries that are available at Runtime from Decisions:
    jquery: 'jQuery',
    moment: 'moment'
    // any library you do not want in your JS Control bundle
    // you will need to add a Script Control for it
    // https://documentation.decisions.com/docs/javascript-control-using-library
    // and add it as an external here
    // https://webpack.js.org/configuration/externals/
  },
};
