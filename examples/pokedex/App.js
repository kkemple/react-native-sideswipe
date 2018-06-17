import React, { Component } from 'react';
import { ActivityIndicator, Animated, Easing, View, StyleSheet } from 'react-native';
import { Font } from 'expo';
import { Provider, Client } from 'urql'; // Version can be specified in package.json
import { StackNavigator } from 'react-navigation'; // Version can be specified in package.json

import PokemonList from './PokemonList';
import PokemonDetail from './PokemonDetail';
import cache from './cache'

const client = new Client({
  cache,
  url: 'https://graphql-pokemon.now.sh',
});

const RouteStack = StackNavigator(
  {
    Home: {
      screen: PokemonList,
    },
    Details: {
      screen: PokemonDetail,
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0,
      },
    }),
  }
);

export default class App extends Component {
  state = {
    currentIndex: 0,
    fontsLoaded: false,
  };

  componentDidMount = async () => {
    await Font.loadAsync({
      regular: require('./assets/fonts/DINNextLTPro-Regular.otf'),
      bold: require('./assets/fonts/DINNextLTPro-Heavy.otf'),
      black: require('./assets/fonts/DINNextLTPro-Black.otf'),
      light: require('./assets/fonts/DINNextLTPro-Light.otf'),
      'ultra-light': require('./assets/fonts/DINNextLTPro-UltraLight.otf'),
    });

    this.setState({ fontsLoaded: true });
  };

  render() {
    return (
      <Provider client={client}>
        {this.state.fontsLoaded
          ? <RouteStack />
          : <View style={styles.loader}>
              <ActivityIndicator color="black" />
            </View>}
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
