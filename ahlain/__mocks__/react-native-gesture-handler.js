const React = require('react');
const { View } = require('react-native');

module.exports = {
  GestureHandlerRootView: View,
  gestureHandlerRootHOC: (Component) => Component,
  State: {},
  /* map handlers to simple wrappers */
  PanGestureHandler: View,
  PinchGestureHandler: View,
  FlingGestureHandler: View,
  TapGestureHandler: View,
  LongPressGestureHandler: View,
  NativeViewGestureHandler: View,
  /* helpers */
  Directions: {},
};
