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

type CarouselDefaultProps = {
  renderItem: CarouselRenderProps =>
    | Array<React$Element<*> | boolean>
    | React$Element<*>
    | null,
  itemWidth: number,
  contentOffset: number,
  threshold: number,
  extractKey: (item: *, index: number) => string,
  shouldCapture: GestureState => boolean,
  onIndexChange: number => void,
};

export type CarouselProps = CarouselDefaultProps & {
  data: Array<*>,
  index?: number,
  style?: Styles,
};

export type CarouselRenderProps = {
  itemIndex: number,
  currentIndex: number,
  itemCount: number,
  item: *,
};

type AnimatedCarouselItemDefaultProps = {
  render: Animated.Value =>
    | Array<React$Element<*> | boolean>
    | React$Element<*>
    | null,
  duration: number,
  easing: Function,
  useNativeDriver: boolean,
}

export type AnimatedCarouselItemProps = AnimatedCarouselItemDefaultProps & {
  itemIndex: number,
  currentIndex: number,
};
