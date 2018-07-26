import { Component, ReactNode } from 'react';
import { StyleProp, ViewStyle, Animated } from 'react-native';

declare type CarouselGestureState = {
  stateID: number;
  moveX: number;
  moveY: number;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  numberActiveTouches: number;
};

declare type CarouselRenderProps<T> = {
  /**
   * index of item in data collection.
   */
  itemIndex: number;

  /**
   * active index of the carousel.
   */
  currentIndex: number;

  /**
   * total count of items in data collection.
   */
  itemCount: number;

  /**
   * item passed from FlatList.
   */
  item: T;

  /**
   * animated value tracking current index.
   */
  animatedValue: Animated.Value;
};

declare type CarouselProps<T> = {
  /**
   * applied to the content container within FlatList.
   * ```
   * |------------ [ style ]--------------------------|
   * | |---------- [ flatListStyle ] ---------------| |
   * | | |-------- [ contentContainerStyle ] -----| | |
   * ```
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * This will equal the padding added to both left and right of itemWidth.
   * ```js
   * const contentOffset = (viewport.width - itemWidth) / 2
   * ```
   */
  contentOffset?: number;

  /**
   * data for FlatList
   */
  data: Array<T>;

  /**
   * used to set the unique key of each item in the carousel.
   */
  extractKey?: (item: T, index: number) => string;

  /**
   * applied to the content container within the content container.
   * ```
   * |------------ [ style ]--------------------------|
   * | |---------- [ flatListStyle ] ---------------| |
   * | | |-------- [ contentContainerStyle ] -----| | |
   * ```
   */
  flatListStyle?: StyleProp<ViewStyle>;

  /**
   * active index of the carousel.
   */
  index?: number;

  /**
   * This is the total width of everything that should be centered when in view.
   * tip: be sure to include any margin added to the left and right of the item.
   */
  itemWidth?: number;

  /**
   * function called when the end of the carousel is reached.
   */
  onEndReached?: () => void;

  /**
   * number between 0 - 1 used to determine when to call onEndReached.
   */
  onEndReachedThreshold?: number;

  /**
   * fired when the active index for the carousel changes.
   */
  onIndexChange?: (index: number) => void;

  /**
   * offset from center of carousel item used for determining index.
   * drag distance examples with different thresholds
   * ```
   * with item width of 200 and no threshold
   * ---------------> <-----------------
   * 0 ------- -index/+index ------- 200
   *
   * with item width of 200 and 50 threshold
   * ---------->           <------------
   * 0 -- -index -- 100 -- +index -- 200
   *
   * with item width of 200 and 75 threshold
   * -------->               <----------
   * 0 - -index --- 100 --- +index - 200
   *
   * with item width of 200 and 90 threshold
   * ----->                      <------
   * 0 -index ----- 100 ----- +index 200
   * ```
   */
  threshold?: number;

  /**
   * to determine the index use the velocity of the gesture.
   */
  useVelocityForIndex?: boolean;

  /**
   * render item method, similar to FlatList with some enhancements.
   */
  renderItem: (props: CarouselRenderProps<T>) => ReactNode;

  /**
   * should we capture touch event.
   */
  shouldCapture?: (state: CarouselGestureState) => boolean;

  /**
   * should we release touch event to another view.
   */
  shouldRelease?: (state: CarouselGestureState) => boolean;

  /**
   * style for the FlatList wrapper View
   * ```
   * |------------ [ style ]--------------------------|
   * | |---------- [ flatListStyle ] ---------------| |
   * | | |-------- [ contentContainerStyle ] -----| | |
   * ```
   */
  style?: StyleProp<ViewStyle>;

  /**
   * should we use native driver for animation.
   */
  useNativeDriver?: boolean;
};

declare class Carousel<T> extends Component<CarouselProps<T>> {}

export { CarouselGestureState, CarouselRenderProps, CarouselProps };

export default Carousel;
