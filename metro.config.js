const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Exclude .gradle directories from file watching (Windows compatibility)
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  /.*\.gradle.*/,
];

module.exports = withNativeWind(config, { input: "./global.css" });
