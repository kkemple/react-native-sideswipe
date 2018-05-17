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
  // applied to the content container within FlatList
  // |------------ [ style ]--------------------------|
  // | |---------- [ flatListStyle ] ---------------| |
  // | | |-------- [ contentContainerStyle ] -----| | |

  contentContainerStyle?: Styles,

  // This will equal the padding added to both left and right of itemWidth
  // e.g. const contentOffset = (viewport.width - itemWidth) / 2
  contentOffset?: number,

  // data for FlatList
  data: Array<*>,

  // used to set the unique key of each item in the carousel
  extractKey?: (item: *, index: number) => string,


  // applied to the content container within the content container
  // |------------ [ style ]--------------------------|
  // | |---------- [ flatListStyle ] ---------------| |
  // | | |-------- [ contentContainerStyle ] -----| | |
  flatListStyle?: Styles,

  // active index of the carousel
  index?: number,

  // This is the total width of everything that should be centered when in view
  // tip: be sure to include any margin added to the left and right of the item
  itemWidth?: number,

  // function called when the end of the carousel is reached
  onEndReached: () => void,

  // number between 0 - 1 used to determine when to call onEndReached
  onEndReachedThreshold: number,

  // fired when the active index for the carousel changes
  onIndexChange?: number => void,

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

  // to determine the index use the velocity of the gesture.
  useVelocityForIndex?: boolean,

  // render item method, similar to FlatList with some enhancements
  renderItem: CarouselRenderProps =>
    | Array<React$Element<*> | boolean>
    | React$Element<*>
    | null,

  // should we capture touch event
  shouldCapture?: GestureState => boolean,

  // should we release touch event to another view
  shouldRelease?: GestureState => boolean,

  // style for the FlatList wrapper View
  // |------------ [ style ]--------------------------|
  // | |---------- [ flatListStyle ] ---------------| |
  // | | |-------- [ contentContainerStyle ] -----| | |
  style?: Styles,

  // should we use native driver for animation
  useNativeDriver?: boolean,
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
| [<img src="https://avatars3.githubusercontent.com/u/3629876?v=4" width="100px;"/><br /><sub><b>Kurtis Kemple</b></sub>](https://twitter.com/kurtiskemple)<br />[💻](https://github.com/kkemple/react-native-sideswipe/commits?author=kkemple "Code") [📖](https://github.com/kkemple/react-native-sideswipe/commits?author=kkemple "Documentation") [📝](#blog-kkemple "Blogposts") | [<img src="https://avatars1.githubusercontent.com/u/1714673?v=4" width="100px;"/><br /><sub><b>Jason Brown</b></sub>](http://browniefed.com)<br />[💻](https://github.com/kkemple/react-native-sideswipe/commits?author=browniefed "Code") [🤔](#ideas-browniefed "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/16436270?v=4" width="100px;"/><br /><sub><b>Akshay Kadam</b></sub>](https://twitter.com/deadcoder0904)<br />[📖](https://github.com/kkemple/react-native-sideswipe/commits?author=deadcoder0904 "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/4272832?v=4" width="100px;"/><br /><sub><b>Santosh Venkatraman</b></sub>](https://github.com/onstash)<br />[💻](https://github.com/kkemple/react-native-sideswipe/commits?author=onstash "Code") | [<img src="https://avatars3.githubusercontent.com/u/3153663?v=4" width="100px;"/><br /><sub><b>Narendra N Shetty</b></sub>](https://twitter.com/narendra_shetty)<br />[🤔](#ideas-narendrashetty "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/10658888?v=4" width="100px;"/><br /><sub><b>Zachary Gibson</b></sub>](https://twitter.com/zacharykeith_)<br />[🤔](#ideas-zachgibson "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/1640318?v=4" width="100px;"/><br /><sub><b>Chris Geirman</b></sub>](http://www.frogquest.com)<br />[🐛](https://github.com/kkemple/react-native-sideswipe/issues?q=author%3Ageirman "Bug reports") [📖](https://github.com/kkemple/react-native-sideswipe/commits?author=geirman "Documentation") [🤔](#ideas-geirman "Ideas, Planning, & Feedback") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/3743054?v=4" width="100px;"/><br /><sub><b>Dan Sipple</b></sub>](https://github.com/sipplified)<br />[🐛](https://github.com/kkemple/react-native-sideswipe/issues?q=author%3Asipplified "Bug reports") [💻](https://github.com/kkemple/react-native-sideswipe/commits?author=sipplified "Code") | [<img src="https://avatars3.githubusercontent.com/u/337798?v=4" width="100px;"/><br /><sub><b>Brian B. Canin</b></sub>](http://www.briancanin.com)<br />[💻](https://github.com/kkemple/react-native-sideswipe/commits?author=cyphire "Code") [👀](#review-cyphire "Reviewed Pull Requests") | [<img src="https://avatars2.githubusercontent.com/u/1041237?v=4" width="100px;"/><br /><sub><b>Michael Sevestre</b></sub>](http://www.design2code.ca)<br />[🐛](https://github.com/kkemple/react-native-sideswipe/issues?q=author%3Amsevestre "Bug reports") [🤔](#ideas-msevestre "Ideas, Planning, & Feedback") [⚠️](https://github.com/kkemple/react-native-sideswipe/commits?author=msevestre "Tests") | [<img src="https://avatars2.githubusercontent.com/u/650099?v=4" width="100px;"/><br /><sub><b>Soheil Jadidian</b></sub>](https://github.com/jadidian)<br />[🐛](https://github.com/kkemple/react-native-sideswipe/issues?q=author%3Ajadidian "Bug reports") [🤔](#ideas-jadidian "Ideas, Planning, & Feedback") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

___

## License
MIT
