import React, { Component } from 'react';
import {
  Animated,
  Easing,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Constants } from 'expo';

import SideSwipe from 'react-native-sideswipe'; // Version can be specified in package.json
import { Card, Badge } from 'react-native-elements'; // Version can be specified in package.json

import '@expo/vector-icons'; // Version can be specified in package.json

const { width } = Dimensions.get('window');
const data = [1, 2, 3, 4, 5];

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Center Aligned</Text>
        <SideSwipe
          data={data}
          style={{ width, maxHeight: 225 }}
          itemWidth={width}
          threshold={120}
          contentOffset={0}
          renderItem={({ item }) => (
            <View style={{ width: width, paddingHorizontal: 10 }}>
              <Card
                title="Local Modules"
                containerStyle={{ maxWidth: width, height: 225 }}>
                <Badge value={item} />
                <Text style={{ marginTop: 10 }}>
                  Science has not yet mastered prophecy. We predict too much for the next year and yet far too little for the next 10. I don't know what you could say about a day in which you have seen four beautiful sunsets.
                </Text>
              </Card>
            </View>
          )}
        />

        <Text style={{ marginTop: 40 }}>Left Aligned with Peaking</Text>
        <SideSwipe
          data={data}
          style={{ width, maxHeight: 225 }}
          itemWidth={width - 60}
          threshold={80}
          contentOffset={12}
          renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
            <Animated.View
              style={{
                maxWidth: width - 60,
                height: 225,
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}>
              <Card title="Local Modules">
                <Badge value={item} />
                <Text style={{ marginTop: 10 }}>
                  Science has not yet mastered prophecy. We predict too much for the next year and yet far too little for the next 10. I don't know what you could say about a day in which you have seen four beautiful sunsets.
                </Text>
              </Card>
            </Animated.View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
