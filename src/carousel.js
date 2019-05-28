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
    data: [],
    extractKey: (item: *, index: number) => `sideswipe-carousel-item-${index}`,
    itemWidth: screenWidth,
    onEndReached: () => {},
    onEndReachedThreshold: 0.9,
    onGestureStart: () => {},
    onGestureRelease: () => {},
    onIndexChange: () => {},
    renderItem: () => null,
    shouldCapture: ({ dx }: GestureState) => (dx * dx) > 1,
    shouldRelease: () => false,
    threshold: 0,
    useVelocityForIndex: true,
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

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: this.handleGestureCapture,
      onPanResponderGrant: this.handleGestureStart,
      onPanResponderMove: this.handleGestureMove,
      onPanResponderRelease: this.handleGestureRelease,
      onPanResponderTerminationRequest: this.handleGestureTerminationRequest,
    });
  }

  componentDidUpdate = (prevProps: CarouselProps) => {
    const { contentOffset, index, itemWidth } = this.props;

    if (prevProps.itemWidth !== itemWidth) {
      this.state.itemWidthAnim.setValue(itemWidth);
    }

    if (Number.isInteger(index) && index !== prevProps.index) {
      this.setState(
        () => ({ currentIndex: index }),
        () => {
          setTimeout(() =>
            this.list.scrollToIndex({
              animated: true,
              index: this.state.currentIndex,
              viewOffset: contentOffset,
            })
          );
        }
      );
    }
  };

  render = () => {
    const {
      contentContainerStyle,
      contentOffset,
      data,
      extractKey,
      flatListStyle,
      renderItem,
      style,
    } = this.props;
    const { animatedValue, currentIndex, scrollPosAnim } = this.state;
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
          initialScrollIndex={currentIndex}
          ref={this.getRef}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={[styles.flatList, flatListStyle]}
          onEndReached={this.props.onEndReached}
          onEndReachedThreshold={this.props.onEndReachedThreshold}
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

  handleGestureStart = (e: GestureEvent, s: GestureState) =>
    this.props.onGestureStart(s);

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

    let newIndex: number;
    if (this.props.useVelocityForIndex) {
      const absoluteVelocity: number = Math.round(Math.abs(vx));
      const velocityDifference: number =
        absoluteVelocity < 1 ? 0 : absoluteVelocity - 1;

      newIndex =
        dx > 0
          ? Math.max(resolvedIndex - velocityDifference, 0)
          : Math.min(
              resolvedIndex + velocityDifference,
              this.props.data.length - 1
            );
    } else {
      newIndex =
        dx > 0
          ? Math.max(resolvedIndex, 0)
          : Math.min(resolvedIndex, this.props.data.length - 1);
    }

    this.list.scrollToIndex({
      index: newIndex,
      animated: true,
      viewOffset: this.props.contentOffset,
    });

    this.setState(
      () => ({ currentIndex: newIndex }),
      () => {
        this.props.onIndexChange(newIndex);
        this.props.onGestureRelease();
      },
    );
  };
}

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 1,
  },
});
