/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = () => ({
  type: "widget",
  name: "RestActivityWidget",
  // Live Activities (countdown + Dynamic Island) require iOS 16.2.
  deploymentTarget: "16.2",
});
