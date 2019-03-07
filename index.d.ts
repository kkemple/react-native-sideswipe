declare module 'react-native-sideswipe' {
    import {Animated, FlatListProps, StyleProp, ViewStyle} from 'react-native';
    import React from 'react';
  
    interface GestureState {
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
    }
  
    interface SideSwipeRenderItemInfo<TItem> {
      itemIndex: number;
      currentIndex: number;
      itemCount: number;
      item: TItem;
      animatedValue: Animated.Value;
    }
  
    interface SideSwipeProps<TItem> {
      style?: StyleProp<ViewStyle>;
      flatListStyle?: StyleProp<ViewStyle>;
      contentContainerStyle?: StyleProp<ViewStyle>;
      itemWidth?: number;
      contentOffset?: number;
      threshold?: number;
      useVelocityForIndex?: boolean;
      useNativeDriver?: boolean;
      shouldCapture?: (gestureState: GestureState) => boolean;
      shouldRelease?: (gestureState: GestureState) => boolean;
      data: FlatListProps<TItem>['data'];
      extractKey?: FlatListProps<TItem>['keyExtractor'];
      renderItem?: (
        info: SideSwipeRenderItemInfo<TItem>,
      ) => React.ReactElement<any> | null;
      index?: number;
      onIndexChange?: (index: number) => any;
      onEndReached?: FlatListProps<TItem>['onEndReached'];
      onEndReachedThreshold?: FlatListProps<TItem>['onEndReachedThreshold'];
      onGestureStart?: (gestureState: GestureState) => any,
      onGestureRelease?: (gestureState: GestureState) => any,
      refreshControl?: FlatListProps<TItem>['refreshControl'];
    }
  
    class SideSwipe<TItem> extends React.Component<SideSwipeProps<TItem>> {}
  
    export default SideSwipe;
    export {SideSwipeRenderItemInfo, SideSwipeProps};
  }
  