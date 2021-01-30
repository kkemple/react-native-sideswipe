import React, { Component } from 'react';
import { Dimensions, Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import { Connect, query } from 'urql'; // Version can be specified in package.json
import SideSwipe from 'react-native-sideswipe'; // Version can be specified in package.json

import { CarouselItem } from './components';

const { width } = Dimensions.get('window');

const QUERY = `
  query($first: Int!) {
    pokemons(first: $first) {
      id
      name
      image
      classification
      maxHP
      maxCP
    }
  }
`;

export default class PokemonList extends Component {
  state = {
    currentIndex: 0,
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Pokedex.
        </Text>
        <Connect
          query={query(QUERY, { first: 200 })}
          children={({ loaded, data }) => {
            return !loaded
              ? <View style={styles.loading}>
                  <Text style={styles.tagline}>
                    Gotta catch 'em all.
                  </Text>
                </View>
              : <SideSwipe
                  data={data.pokemons}
                  style={{ flex: 1, width }}
                  itemWidth={CarouselItem.WIDTH}
                  threshold={CarouselItem.WIDTH / 4}
                  extractKey={item => item.name}
                  contentOffset={24}
                  useNativeDriver={false}
                  onIndexChange={index =>
                    this.setState(() => ({ currentIndex: index }))}
                  renderItem={({ item, ...rest }) => (
                    <CarouselItem
                      {...rest}
                      {...item}
                      navigation={this.props.navigation}
                    />
                  )}
                />;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagline: {
    margin: 24,
    fontSize: 32,
    fontFamily: 'light',
    color: 'black',
    letterSpacing: 1.2,
  },
  title: {
    margin: 24,
    fontSize: 32,
    fontFamily: 'regular',
    color: 'black',
    letterSpacing: 1.2,
  },
});
