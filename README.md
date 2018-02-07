# Sideswipe
A simple, cross-platform React Native swipeable carousel with sensible defaults

![demo1](./example-assets/sideswipe.gif)

![demo2](./example-assets/spaced-tesla.gif)

## Why Another Carousel?
Most solutions I found were very focused on mobile and adopt a paging pattern which limits what you can do on tablet and when you want the child to page when its smaller than the viewport.

On top of that most solutions were either one-size-fits-all or not really polished.

## What Makes Your Solution So Special?
Nothing. It's just a tiny simple carousel with a pretty flexible API. If you need more check out another solution, if you need less you might not need a carousel because this whole thing is ~200 lines. 😎

___

## API

### `<Carousel />`
Carousel component used to render carousel items via `renderItem` prop.

```js
type CarouselProps = {
  // data for FlatList
  data: Array<*>,

  // render item method, similar to FlatList with some enhancments
  renderItem: CarouselRenderProps =>
    | Array<React$Element<*> | boolean>
    | React$Element<*>
    | null,

  // active index of the carousel
  index?: number,

  // width of each child
  itemWidth?: number,

  // offset from center of carousel item used for determining index
  threshold?: number,

  /**
   * drag distance examples with different thresholds
   * 
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
   */

  // should we use native driver for animation
  useNativeDriver?: boolean,

  // should we capture touch event
  shouldCapture?: GestureState => boolean,

  // should we release touch event to another view
  shouldRelease?: GestureState => boolean,

  // fired when the active index for the carousel changes
  onIndexChange?: number => void,

  // used to set the unique key of each item in the carousel
  extractKey?: (item: *, index: number) => string,

  // style for the FlatList element
  style?: Styles,
  
  // style for the FlatList element
  flatListStyle?: Styles,
  
  // style for the FlatList element
  contentContainerStyle?: Styles,

  // offset from start/end edges of carousel
  contentOffset?: number,
}
```

```js
type CarouselRenderProps = {
  // index of item in data collection
  itemIndex: number,

  // active index of the carousel
  currentIndex: number,

  // total count of items in data collection
  itemCount: number,

  // item passed from FlatList
  item: *,

  // animated value tracking current index
  animatedValue: Animated.Value
}

```

___

## Usage:

```bash
yarn add react-native-sideswipe
```

```js
import { Dimensions } from 'react-native';
import SideSwipe from 'react-native-sideswipe';

import CustomComponent from '...'
import data from '...'

export default class SweetCarousel extends Component {
  state = {
    currentIndex: 0,
  };

  render = () => {
    // center items on screen
    const { width } = Dimensions.get('window');
    const contentOffset = (width - CustomComponent.WIDTH) / 2;

    return (
      <SideSwipe
        index={this.state.currentIndex}
        itemWidth={CustomComponent.WIDTH}
        style={{ width }}
        data={data}
        contentOffset={contentOffset}
        onIndexChange={index =>
          this.setState(() => ({ currentIndex: index }))
        }
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
         <CustomComponent
            {...item}
            index={itemIndex}
            currentIndex={currentIndex}
            animatedValue={animatedValue}
          />
        )}
      />
    );
  };
}
```

___

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/3629876?v=4" width="100px;"/><br /><sub><b>Kurtis Kemple</b></sub>](https://twitter.com/kurtiskemple)<br />[💻](https://github.com/kkemple/react-native-sideswipe/commits?author=kkemple "Code") [📖](https://github.com/kkemple/react-native-sideswipe/commits?author=kkemple "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/1714673?v=4" width="100px;"/><br /><sub><b>Jason Brown</b></sub>](http://browniefed.com)<br />[💻](https://github.com/kkemple/react-native-sideswipe/commits?author=browniefed "Code") [🤔](#ideas-browniefed "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/16436270?v=4" width="100px;"/><br /><sub><b>Akshay Kadam</b></sub>](https://twitter.com/deadcoder0904)<br />[📖](https://github.com/kkemple/react-native-sideswipe/commits?author=deadcoder0904 "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/4272832?v=4" width="100px;"/><br /><sub><b>Santosh Venkatraman</b></sub>](https://github.com/onstash)<br />[💻](https://github.com/kkemple/react-native-sideswipe/commits?author=onstash "Code") | [<img src="https://avatars3.githubusercontent.com/u/3153663?v=4" width="100px;"/><br /><sub><b>Narendra N Shetty</b></sub>](https://twitter.com/narendra_shetty)<br />[🤔](#ideas-narendrashetty "Ideas, Planning, & Feedback") |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

___

## License
MIT
