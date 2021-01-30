import React, { Component } from 'react';
import {
  Alert,
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Constants } from 'expo';
import { Connect, query, mutation } from 'urql'; // Version can be specified in package.json
import { FontAwesome } from '@expo/vector-icons'; // Version can be specified in package.json

const QUERY = `
  query($id: String!) {
    pokemon(id: $id) {
      name
      image
      classification
      maxHP
      maxCP
      resistant
      fleeRate
      # favorite
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        image
        name
        classification
        maxHP
        maxCP
      }
    }
  }
`;

const MUTATION = `
 mutation ToggleFavorite($id: String!) {
   toggleFavorite(id: $id) {
     id
     favorite
   }
 }
`;

export default class PokemonDetail extends Component {
  state = {
    currentIndex: 0,
  };

  componentWillMount = () => {
    Image.prefetch(this.props.image);
  };

  render() {
    const { navigation } = this.props;
    const {
      state: { params: { id, image, name, maxCP, maxHP, classification } },
    } = navigation;

    return (
      <Connect
        typeInvalidation={false}
        query={query(QUERY, { id })}
        mutation={{
          toggleFavorite: mutation(MUTATION),
        }}
        shouldInvalidate={(changedTypenames, typenames, mutationResponse, data) => {
          return data.pokemon.favorite !== mutationResponse.favorite;
        }}
        children={({ loaded, data, toggleFavorite, error }) => {
          if (error) Alert.alert(error.message);
          if (!loaded) {
            return (
              <View style={styles.container}>
                <TouchableWithoutFeedback
                  onPress={() => this.props.navigation.goBack()}>
                  <Text style={styles.header}>
                    {'Pokedex.'}
                  </Text>
                </TouchableWithoutFeedback>
                <Text style={styles.title}>
                  {name.toUpperCase()}
                </Text>
                <View style={styles.metaData}>
                  <Text style={styles.meta}>
                    <Text style={styles.label}>Max HP: </Text>{maxHP}
                  </Text>
                  <Text style={styles.meta}>
                    <Text style={styles.label}>Max CP: </Text>{maxCP}
                  </Text>
                  <Text style={[styles.meta, { width: '100%' }]}>
                    <Text style={styles.label}>Classification: </Text>
                    {classification}
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  style={styles.forms}
                  contentContainerStyle={{
                    width: '100%',
                    alignItems: 'flex-end',
                    paddingLeft: 8,
                  }}>
                  <Image
                    resizeMode="contain"
                    source={{ uri: image }}
                    style={styles.image}
                  />
                </ScrollView>
              </View>
            );
          }

          const {
            pokemon: {
              favorite,
              evolutions,
              weight,
              height,
              attacks: { fast, special },
              resistant,
              fleeRate,
            },
          } = data;

          return (
            <View style={styles.container}>
              <TouchableWithoutFeedback
                style={{ margin: 24 }}
                onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.header}>
                  {'< Back'}
                </Text>
              </TouchableWithoutFeedback>
              <TouchableOpacity
                style={styles.favorite}
                onPress={() => toggleFavorite({ id })}>
                <FontAwesome
                  size="24"
                  name={favorite ? 'heart' : 'heart-o'}
                  color="black"
                />
              </TouchableOpacity>
              <Text style={styles.title}>
                {name.toUpperCase()}
              </Text>
              <View style={styles.metaData}>
                <Text style={styles.meta}>
                  <Text style={styles.label}>Max HP: </Text>{maxHP}
                </Text>
                <Text style={styles.meta}>
                  <Text style={styles.label}>Max CP: </Text>{maxCP}
                </Text>
                <Text style={[styles.meta, { width: '100%' }]}>
                  <Text style={styles.label}>Classification: </Text>
                  {classification}
                </Text>
              </View>
              <View style={styles.metaData}>
                <Text style={[styles.meta, { width: '100%' }]}>
                  <Text style={styles.label}>Weight: </Text>
                  {`${weight.minimum} <> ${weight.maximum}`}
                </Text>
                <Text style={[styles.meta, { width: '100%' }]}>
                  <Text style={styles.label}>Height: </Text>
                  {`${height.minimum} <> ${height.maximum}`}
                </Text>
              </View>
              <View style={styles.metaData}>
                <Text style={[styles.meta, { width: '100%' }]}>
                  <Text style={styles.label}>Fast Attacks: </Text>
                  {fast.map(f => f.name).join(', ')}
                </Text>
                <Text style={[styles.meta, { width: '100%' }]}>
                  <Text style={styles.label}>Special Attacks: </Text>
                  {special.map(s => s.name).join(', ')}
                </Text>
                <Text style={[styles.meta, { width: '100%' }]}>
                  <Text style={styles.label}>Resistant: </Text>
                  {resistant.join(', ')}
                </Text>
              </View>
              <View style={styles.metaData}>
                <Text style={[styles.meta, { width: '100%' }]}>
                  <Text style={styles.label}>Flee Rate: </Text>
                  {fleeRate}
                </Text>
              </View>
              <ScrollView
                horizontal
                style={styles.forms}
                contentContainerStyle={{
                  width: '100%',
                  alignItems: 'flex-end',
                  paddingLeft: 8,
                }}>
                <Image
                  resizeMode="contain"
                  source={{ uri: image }}
                  style={styles.image}
                />
                {!!evolutions &&
                  evolutions.map(e => (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        navigation.navigate('Details', { ...e });
                      }}>
                      <Image
                        resizeMode="contain"
                        source={{ uri: e.image }}
                        style={styles.image}
                      />
                    </TouchableWithoutFeedback>
                  ))}
              </ScrollView>
            </View>
          );
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
  },
  header: {
    margin: 24,
    fontSize: 32,
    fontFamily: 'regular',
    color: 'black',
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: 'black',
    fontSize: 32,
    letterSpacing: 1.2,
    color: 'black',
    backgroundColor: 'transparent',
    marginHorizontal: 24,
  },
  forms: {
    position: 'absolute',
    bottom: 25,
    paddingLeft: 2,
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 16,
  },
  metaData: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
    marginHorizontal: 24,
    flexWrap: 'wrap',
  },
  meta: {
    fontFamily: 'light',
    color: 'black',
    fontSize: 18,
    marginRight: 8,
  },
  label: {
    fontFamily: 'bold',
    color: 'black',
    fontSize: 18,
  },
  favorite: {
    position: 'absolute',
    top: 48,
    right: 24,
  },
});
