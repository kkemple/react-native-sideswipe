/* @flow */
import React, { Component } from 'react';
import { Animated, Dimensions, FlatList, PanResponder } from 'react-native';

import type {
  CarouselProps,
  GestureEvent,
  GestureState,
  ScrollEvent,
} from '../types';

const { width: screenWidth } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type State = {
  currentIndex: number,
  animatedValue: Animated.Value,
};

export default class SideSwipe extends Component<CarouselProps, State> {
  panResponder: PanResponder;
  list: typeof FlatList;

  static defaultProps = {
    contentOffset: 0,
    itemWidth: screenWidth,
    threshold: 0,
    onIndexChange: () => {},
    renderItem: () => null,
    shouldCapture: ({ dx }: GestureState) => Math.abs(dx) > 1,
    shouldRelease: () => false,
    extractKey: (item: *, index: number) => `sideswipe-carousel-item-${index}`,
  };

  state = {
    currentIndex: this.props.index || 0,
    animatedValue: new Animated.Value(this.props.index || 0),
  };

  componentWillMount = (): void => {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this.handleGestureCapture,
      onPanResponderMove: this.handleGestureMove,
      onPanResponderRelease: this.handleGestureRelease,
      onPanResponderTerminationRequest: this.handleGestureTerminationRequest,
    });
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
    const { style, data, contentOffset, extractKey, renderItem } = this.props;
    const { currentIndex } = this.state;
    const dataLength = data.length;

    return (
      <AnimatedFlatList
        {...this.panResponder.panHandlers}
        keyExtractor={extractKey}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={data}
        style={[{ width: screenWidth }, style]}
        contentContainerStyle={{ paddingHorizontal: contentOffset }}
        getItemLayout={this.getItemLayout}
        ref={this.getRef}
        scrollEventThrottle={1}
        onScroll={this.onScroll}
        renderItem={({ item, index }) =>
          renderItem({
            item,
            currentIndex,
            itemIndex: index,
            itemCount: dataLength,
            animatedValue: this.state.animatedValue,
          })
        }
      />
    );
  };

  onScroll = ({ nativeEvent: { contentOffset: { x } } }: ScrollEvent) => {
    this.state.animatedValue.setValue(x / this.props.itemWidth);
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
