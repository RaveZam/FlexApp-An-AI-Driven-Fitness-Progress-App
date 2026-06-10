const { withEntitlementsPlist } = require("expo/config-plugins");

// expo-notifications is auto-applied (it ships a config plugin and is a
// dependency) and unconditionally injects the `aps-environment` push
// entitlement. This app only uses LOCAL notifications and signs with a free
// Apple team, which cannot provision Push Notifications — so the entitlement
// breaks the build. Strip it on every prebuild. Must be listed LAST in
// app.json plugins so it runs after expo-notifications.
module.exports = function withNoApsEnvironment(config) {
  return withEntitlementsPlist(config, (cfg) => {
    delete cfg.modResults["aps-environment"];
    return cfg;
  });
};
