import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from './screen/Home';
import PlayScreen from './screen/PlayScreen';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    PlayScreen: PlayScreen
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);