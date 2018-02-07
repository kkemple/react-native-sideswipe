/* @flow */
import React, { Component } from 'react';
import {
  View,
  Animated,
  Dimensions,
  FlatList,
  PanResponder,
  StyleSheet,
} from 'react-native';

import type {
  CarouselProps,
  GestureEvent,
  GestureState,
  ScrollEvent,
} from '../types';

const { width: screenWidth } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type State = {
  animatedValue: Animated.Value,
  currentIndex: number,
  itemWidthAnim: Animated.Value,
  scrollPosAnim: Animated.Value,
};

export default class SideSwipe extends Component<CarouselProps, State> {
  panResponder: PanResponder;
  list: typeof FlatList;

  static defaultProps = {
    contentOffset: 0,
    extractKey: (item: *, index: number) => `sideswipe-carousel-item-${index}`,
    itemWidth: screenWidth,
    onIndexChange: () => {},
    renderItem: () => null,
    shouldCapture: ({ dx }: GestureState) => Math.abs(dx) > 1,
    shouldRelease: () => false,
    threshold: 0,
    useNativeDriver: true,
  };

  constructor(props: CarouselProps) {
    super(props);

    const currentIndex: number = props.index || 0;
    const initialOffset: number = currentIndex * props.itemWidth;
    const scrollPosAnim: Animated.Value = new Animated.Value(initialOffset);
    const itemWidthAnim: Animated.Value = new Animated.Value(props.itemWidth);
    const animatedValue: Animated.Value = Animated.divide(
      scrollPosAnim,
      itemWidthAnim
    );

    this.state = {
      animatedValue,
      currentIndex,
      itemWidthAnim,
      scrollPosAnim,
    };
  }

  componentWillMount = (): void => {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.handleGestureCapture,
      onPanResponderMove: this.handleGestureMove,
      onPanResponderRelease: this.handleGestureRelease,
      onPanResponderTerminationRequest: this.handleGestureTerminationRequest,
    });
  };

  componentDidUpdate = (prevProps: CarouselProps) => {
    if (prevProps.itemWidth !== this.props.itemWidth) {
      this.state.itemWidthAnim.setValue(this.props.itemWidth);
    }
  };

  componentWillReceiveProps = (nextProps: CarouselProps) => {
    if (nextProps.index && nextProps.index !== this.state.currentIndex) {
      this.setState(
        () => ({ currentIndex: nextProps.index }),
        () => {
          setTimeout(
            () =>
              this.list.scrollToIndex({
                index: this.state.currentIndex,
                animated: true,
                viewOffset: this.props.contentOffset,
              }),
            200
          );
        }
      );
    }
  };

  render = () => {
    const {
      style,
      flatListStyle,
      contentContainerStyle,
      data,
      contentOffset,
      extractKey,
      renderItem,
    } = this.props;
    const { currentIndex, scrollPosAnim, animatedValue } = this.state;

    const dataLength = data.length;

    return (
      <View
        style={[{ width: screenWidth }, style]}
        {...this.panResponder.panHandlers}
      >
        <AnimatedFlatList
          horizontal
          contentContainerStyle={[
            { paddingHorizontal: contentOffset },
            contentContainerStyle,
          ]}
          data={data}
          getItemLayout={this.getItemLayout}
          keyExtractor={extractKey}
          ref={this.getRef}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={[styles.flatList, flatListStyle]}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollPosAnim } } }],
            { useNativeDriver: this.props.useNativeDriver }
          )}
          renderItem={({ item, index }) =>
            renderItem({
              item,
              currentIndex,
              itemIndex: index,
              itemCount: dataLength,
              animatedValue: animatedValue,
            })
          }
        />
      </View>
    );
  };

  getRef = (ref: *) => {
    if (ref) {
      this.list = ref._component ? ref._component : ref;
    }
  };

  getItemLayout = (data: Array<*>, index: number) => ({
    offset: this.props.itemWidth * index + this.props.contentOffset,
    length: this.props.itemWidth,
    index,
  });

  handleGestureTerminationRequest = (e: GestureEvent, s: GestureState) =>
    this.props.shouldRelease(s);

  handleGestureCapture = (e: GestureEvent, s: GestureState) =>
    this.props.shouldCapture(s);

  handleGestureMove = (e: GestureEvent, { dx }: GestureState) => {
    const currentOffset: number =
      this.state.currentIndex * this.props.itemWidth;
    const resolvedOffset: number = currentOffset - dx;

    this.list.scrollToOffset({
      offset: resolvedOffset,
      animated: false,
    });
  };

  handleGestureRelease = (e: GestureEvent, { dx, vx }: GestureState) => {
    const currentOffset: number =
      this.state.currentIndex * this.props.itemWidth;
    const resolvedOffset: number = currentOffset - dx;
    const resolvedIndex: number = Math.round(
      (resolvedOffset +
        (dx > 0 ? -this.props.threshold : this.props.threshold)) /
        this.props.itemWidth
    );

    const absoluteVelocity: number = Math.round(Math.abs(vx));
    const velocityDifference: number =
      absoluteVelocity < 1 ? 0 : absoluteVelocity - 1;

    const newIndex: number =
      dx > 0
        ? Math.max(resolvedIndex - velocityDifference, 0)
        : Math.min(
            resolvedIndex + velocityDifference,
            this.props.data.length - 1
          );

    this.list.scrollToIndex({
      index: newIndex,
      animated: true,
      viewOffset: this.props.contentOffset,
    });

    this.setState(
      () => ({ currentIndex: newIndex }),
      () => this.props.onIndexChange(newIndex)
    );
  };
}

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 1,
  },
});
