/* @flow */
import React, { Component } from 'react';
import { Dimensions, FlatList, PanResponder, Platform } from 'react-native';

import type { CarouselProps, GestureEvent, GestureState } from '../types';

type State = {
  currentIndex: number,
};

const { width: screenWidth } = Dimensions.get('window');

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
    extractKey: (item: *, index: number) => `sideswipe-carousel-item-${index}`,
  };

  state = {
    currentIndex: this.props.index || 0,
  };

  componentWillMount = (): void => {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this.handleGestureCapture,
      onPanResponderMove: this.handleGestureMove,
      onPanResponderRelease: this.handleGestureRelease,
    });
  };

  componentDidUpdate = () => {
    setTimeout(
      () =>
        this.list.scrollToIndex({
          index: this.state.currentIndex,
          animated: false,
          viewOffset: this.props.contentOffset,
        }),
      300
    );
  };

  componentWillReceiveProps = (nextProps: CarouselProps) => {
    if (nextProps.index && nextProps.index !== this.state.currentIndex) {
      this.setState(() => ({ currentIndex: nextProps.index }));
    }
  };

  render = () => {
    const { style, data, contentOffset, extractKey, renderItem } = this.props;
    const { currentIndex } = this.state;
    const dataLength = data.length;

    return (
      <FlatList
        {...this.panResponder.panHandlers}
        keyExtractor={extractKey}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={data}
        style={[{ width: screenWidth }, style]}
        contentContainerStyle={{ paddingHorizontal: contentOffset }}
        getItemLayout={this.getItemLayout}
        ref={ref => {
          this.list = ref;
        }}
        renderItem={({ item, index }) =>
          renderItem({
            item,
            currentIndex,
            itemIndex: index,
            itemCount: dataLength,
          })
        }
      />
    );
  };

  getItemLayout = (data: Array<*>, index: number) => ({
    offset: this.props.itemWidth * index + this.props.contentOffset,
    length: this.props.itemWidth,
    index,
  });

  handleGestureCapture = (e: GestureEvent, s: GestureState) =>
    this.props.shouldCapture(s);

  handleGestureMove = (e: GestureEvent, { dx, vx }: GestureState) => {
    const currentOffset = this.state.currentIndex * this.props.itemWidth;
    const offsetWithVelocity = Math.round(dx + vx);
    const resolvedOffset = currentOffset - offsetWithVelocity;

    this.list.scrollToOffset({
      offset: resolvedOffset,
      animated: false,
    });
  };

  handleGestureRelease = (e: GestureEvent, { dx }: GestureState) => {
    const currentOffset = this.state.currentIndex * this.props.itemWidth;
    const resolvedIndex = Math.round(
      (currentOffset -
        dx +
        (dx > 0 ? -this.props.threshold : this.props.threshold)) /
        this.props.itemWidth
    );

    const newIndex =
      dx > 0
        ? Math.max(resolvedIndex, 0)
        : Math.min(resolvedIndex, this.props.data.length - 1);

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
