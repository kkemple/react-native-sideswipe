/* @flow */
import { Animated, StyleSheet } from 'react-native';

export type Styles = StyleSheet.Styles;

export type GestureEvent = {
  nativeEvent: {
    changedTouches: Array<*>,
    identifier: number,
    locationX: number,
    locationY: number,
    pageX: number,
    pageY: number,
    target: number,
    timestamp: number,
    touches: Array<*>,
  },
};

export type GestureState = {
  stateID: number,
  moveX: number,
  moveY: number,
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  vx: number,
  vy: number,
  numberActiveTouches: number,
};

export type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number,
    }
  },
};

type CarouselDefaultProps = {
  contentOffset: number,
  data: Array<*>,
  extractKey: (item: *, index: number) => string,
  itemWidth: number,
  onEndReached: () => void,
  onEndReachedThreshold: number,
  onIndexChange: number => void,
  renderItem: CarouselRenderProps =>
    | Array<React$Element<*> | boolean>
    | React$Element<*>
    | null,
  shouldCapture: GestureState => boolean,
  shouldRelease: GestureState => boolean,
  threshold: number,
  useNativeDriver: boolean,
};

export type CarouselProps = CarouselDefaultProps & {
  index?: number,
  style?: Styles,
  flatListStyle?: Styles,
  useVelocityForIndex?: boolean,
  contentContainerStyle?: Styles,
};

export type CarouselRenderProps = {
  itemIndex: number,
  currentIndex: number,
  itemCount: number,
  item: *,
  animatedValue: Animated.Value,
};
