import React, { PureComponent } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const width = screenWidth - 25;

export class CarouselItem extends PureComponent {
  static WIDTH = width + 16;

  state = {
    navigationAnimation: new Animated.Value(0),
  };

  componentWillMount = () => {
    Image.prefetch(this.props.image);
  };

  onNavigate = () => {
    const {
      id,
      image,
      navigation,
      classification,
      maxCP,
      maxHP,
      name,
    } = this.props;
    const { navigationAnimation } = this.state;

    Animated.timing(navigationAnimation, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.quad),
    }).start(() => {
      navigation.navigate('Details', {
        id,
        image,
        maxCP,
        maxHP,
        name,
        classification,
      });
      setTimeout(() => navigationAnimation.setValue(0));
    });
  };

  render = () => {
    const {
      animatedValue,
      classification,
      image,
      itemIndex,
      maxCP,
      maxHP,
      name,
    } = this.props;

    const { navigationAnimation } = this.state;

    return (
      <Animated.View style={styles.container}>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: animatedValue.interpolate({
                inputRange: [itemIndex - 1, itemIndex, itemIndex + 1],
                outputRange: [0, 1, 0],
              }),
            },
          ]}>
          {name.toUpperCase()}
        </Animated.Text>
        <Animated.View
          style={[
            styles.metaData,
            {
              opacity: animatedValue.interpolate({
                inputRange: [itemIndex - 1, itemIndex, itemIndex + 1],
                outputRange: [0, 1, 0],
              }),
            },
          ]}>
          <Text style={styles.meta}>
            <Text style={styles.label}>Max HP: </Text>{maxHP}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.label}>Max CP: </Text>{maxCP}
          </Text>
          <Text style={[styles.meta, { width: '100%' }]}>
            <Text style={styles.label}>Classification: </Text>{classification}
          </Text>
        </Animated.View>
        <TouchableWithoutFeedback onPress={this.onNavigate}>
          <Animated.Image
            source={{ uri: image }}
            resizeMode="contain"
            style={[
              styles.pokemon,
              {
                width: navigationAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width - 25, 100],
                  extrapolate: 'clamp',
                }),
                height: navigationAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width - 25, 100],
                  extrapolate: 'clamp',
                }),
              },
              {
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [itemIndex - 1, itemIndex, itemIndex + 1],
                      outputRange: [1, 1.25, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    width: width,
    justifyContent: 'space-around',
    overflow: 'visible',
    alignItems: 'flex-start',
    marginRight: 16,
  },
  pokemon: {
    width: width - 25,
    height: width - 25,
    marginBottom: 36,
  },
  title: {
    fontFamily: 'black',
    fontSize: 32,
    letterSpacing: 1.2,
    color: 'black',
    backgroundColor: 'transparent',
  },
  metaData: {
    alignItems: 'flex-start',
    marginBottom: 'auto',
    flexDirection: 'row',
    marginTop: 8,
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
});
