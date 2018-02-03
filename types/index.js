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

export type CarouselProps = {
  data: Array<*>,
  renderItem: CarouselRenderProps =>
    | Array<React$Element<*> | boolean>
    | React$Element<*>
    | null,
  index?: number,
  itemWidth?: number,
  threshold?: number,
  shouldCapture?: GestureState => boolean,
  onIndexChange?: number => void,
  extractKey?: (item: *, index: number) => string,
  style?: Styles,
  contentOffset?: number,
};

export type CarouselRenderProps = {
  itemIndex: number,
  currentIndex: number,
  itemCount: number,
  item: *,
};

export type AnimatedCarouselItemProps = {
  itemIndex: number,
  currentIndex: number,
  render: Animated.Value =>
    | Array<React$Element<*> | boolean>
    | React$Element<*>
    | null,
  duration?: number,
  easing?: Function,
  useNativeDriver?: boolean,
};
