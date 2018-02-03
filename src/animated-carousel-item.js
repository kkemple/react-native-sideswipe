/* @flow */
import { Component } from 'react';
import { Animated, Easing } from 'react-native';

import type { AnimatedCarouselItemProps } from './types';

export default class AnimatedCarouselItem extends Component<
  AnimatedCarouselItemProps,
  *
> {
  static defaultProps = {
    duration: 150,
    easing: Easing.linear,
    render: () => null,
    useNativeDriver: false,
  };

  animatedValue: Animated.Value = new Animated.Value(
    this.props.itemIndex === this.props.currentIndex ? 1 : 0
  );

  componentWillUnmount = () => {
    this.animatedValue.stopAnimation();
  };

  componentDidUpdate = () => {
    const {
      itemIndex,
      currentIndex,
      duration,
      easing,
      useNativeDriver,
    } = this.props;

    Animated.timing(this.animatedValue, {
      duration,
      useNativeDriver,
      easing,
      toValue: itemIndex === currentIndex ? 1 : 0,
    }).start();
  };

  render() {
    return this.props.render(this.animatedValue);
  }
}
