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
  renderItem: CarouselRenderProps =>
    | Array<React$Element<*> | boolean>
    | React$Element<*>
    | null,
  itemWidth: number,
  contentOffset: number,
  threshold: number,
  useNativeDriver: boolean,
  extractKey: (item: *, index: number) => string,
  shouldCapture: GestureState => boolean,
  shouldRelease: GestureState => boolean,
  onIndexChange: number => void,
};

export type CarouselProps = CarouselDefaultProps & {
  data: Array<*>,
  index?: number,
  style?: Styles,
  flatListStyle?: Styles,
  contentContainerStyle?: Styles,
};

export type CarouselRenderProps = {
  itemIndex: number,
  currentIndex: number,
  itemCount: number,
  item: *,
  animatedValue: Animated.Value,
};
