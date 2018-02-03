/* @flow */
import { Component } from 'react';
import { Animated, Easing } from 'react-native';

import type { AnimatedCarouselItemProps } from './types';

type State = {
  animatedValue: Animated.Value,
};

export default class AnimatedCarouselItem extends Component<
  AnimatedCarouselItemProps,
  State
> {
  static defaultProps = {
    duration: 150,
    easing: Easing.linear,
    render: () => null,
    useNativeDriver: false,
  };

  state = {
    animatedValue: new Animated.Value(0),
  };

  componentDidMount = () => {
    const { itemIndex, currentIndex } = this.props;

    if (itemIndex === currentIndex) {
      this.state.animatedValue.setValue(1);
    }
  };

  componentWillUnmount = () => {
    this.state.animatedValue.stopAnimation();
  };

  componentWillReceiveProps = (nextProps: AnimatedCarouselItemProps) => {
    const {
      itemIndex,
      currentIndex,
      duration,
      easing,
      useNativeDriver,
    } = nextProps;

    const {
      itemIndex: prevItemIndex,
      currentIndex: prevCurrentIndex,
    } = this.props;

    if (prevItemIndex === itemIndex && prevCurrentIndex === currentIndex)
      return;

    Animated.timing(this.state.animatedValue, {
      duration,
      useNativeDriver,
      easing,
      toValue: itemIndex === currentIndex ? 1 : 0,
    }).start();
  };

  render() {
    return this.props.render(this.state.animatedValue);
  }
}
