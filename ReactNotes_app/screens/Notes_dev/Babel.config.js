module.exporets = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
        'react-native-reanimated/plugin'
        // una libreria para animaciones en react native
        // trabaja en el hilo de la interfaz de usuario
    ],
  };
}