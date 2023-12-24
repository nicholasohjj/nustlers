module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver', 
        {
          root: ['./src'], // Assuming your source files are in the 'src' directory
          alias: {
            'react-native-maps': 'react-native-web-maps',
            // Additional aliases can be added here
          },
        }
      ],

      // Other plugins can be added here
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
