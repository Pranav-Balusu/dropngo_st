const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// This is a common solution for native-only modules on web.
config.resolver.extraNodeModules = {
  'react-native-maps': path.resolve(__dirname, 'node_modules/react-native-web/dist/exports/View'),
};

module.exports = config;