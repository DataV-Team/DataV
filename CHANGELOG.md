# 2.10.0-alpha (2020-09-09)

### New

- **decoration12:** New decoration(Radar scan).

### Optmization

- **decoration** add `dur` configuration.
- **activeRingChart** add `digitalFlopUnit` configuration.

# 2.9.9-alpha (2020-08-25)

### Optmization

- **borderBox:** Canonical class name.
- **autoResize(mixin):** Add exception prompt.

# 2.9.8-alpha (2020-08-20)

### Optmization

- **scrollRankingBoard:** Add value formatter.

# 2.9.7-alpha (2020-08-19)

### Optmization

- **scrollBoard:** Optimize the update effect of updateRows.

# 2.9.6-alpha (2020-08-05)

### Bug Fixes

- **scrollBoard:** Carousel is abnormal when carousel is page.
- **scrollRankingBoard:** Carousel is abnormal when carousel is page.

# 2.9.5-alpha (2020-08-05)

### Optmization

- **scrollBoard:** Reduce redundant node rendering.
- **scrollRankingBoard:** Reduce redundant node rendering.
- **scrollBoard:** Add api to update row data.

# 2.9.4-alpha (2020-07-03)

### Optmization

- **scrollBoard:** Optimize key value [(#8)](https://github.com/DataV-Team/DataV-React/issues/8).

# 2.9.3-alpha (2020-07-02)

### Perfect

- **uuid:** Optimization of `-` in uuid will cause abnormal svg animation [(#108)](https://github.com/DataV-Team/DataV/issues/108).

# 2.9.2-alpha (2020-06-16)

### Bug Fixes

- **scrollBoard:** reset animationIndex when config upate.

# 2.9.1-alpha (2020-06-16)

### Bug Fixes

- **scrollRankingBoard:** Calculation optimization of negative values [(#101)](https://github.com/DataV-Team/DataV/pull/101).

### Perfect

- **digitalFlop:** add number formatter.

# 2.9.0-alpha (2020-06-10)

### ScrollBoard

- **hoverPause:** add `hoverPause` configuration [(#96)](https://github.com/DataV-Team/DataV/pull/96).
- **mouseover:** add `mouseover` event [(#96)](https://github.com/DataV-Team/DataV/pull/96).

# 2.8.4-alpha (2020-05-25)

### Perfect

- **uuid:** Use uuid to produce unique id.

# 2.8.3-alpha (2020-05-06)

### Perfect

- **activeRingChart:** add `showOriginValue` configuration.
- **capsuleChart:** add `showValue` configuration.

# 2.8.2-alpha (2020-05-06)

### Perfect

- **borderBox8:** add `reverse` configuration.

# 2.8.1-alpha (2020-05-03)

### Perfect

- **digitalFlop:** Use `\n` to start a newline.
- **digitalFlop:** `rowGap` configuration.

# 2.7.4-alpha (2020-04-15)

### Bug Fixes

- **capsuleChart:** Calculate exception when min value is less 5 [(#59)](https://github.com/DataV-Team/DataV/pull/59).

# 2.7.3-alpha (2020-01-16)

### Bug Fixes

- **activeRingChart:** `parseInt` precision lost.

# 2.7.2-alpha (2020-01-10)

### Perfect

- **ativeRingChart:** Add digitalFlopToFixed configuration.

# 2.7.1-alpha (2020-01-08)

### Bug Fixes

- **flylineChartEnhanced:** Exception when relative is false.

# 2.7.0-alpha (2020-01-05)

### New

- **flylineChartEnhanced:** Enhanced flylineChart [(#12)](https://github.com/DataV-Team/DataV/issues/12).

# 2.6.0-alpha (2019-12-25)

### Perfect

- **scrollRankingBoard:** Configurable auto-sequencing [(#35)](https://github.com/DataV-Team/DataV/pull/35).
- **scrollRankingBoard:** Render name using `v-html` [(#36)](https://github.com/DataV-Team/DataV/pull/36).

# 2.5.0-alpha (2019-12-06)

### Feature

- **borderBox & decoration:** **Configurable** colors.
  ```html
  <!-- Example -->
  <dv-border-box-1 :color="['red', 'green']" />
  <dv-decoration-1 :color="['red', 'green']" />
  ```
- **scrollBoard:** Configurable index header [(#33)](https://github.com/DataV-Team/DataV/pull/33). 

### New

- **borderBox11**
- **borderBox12**
- **borderBox13**
- **decoration11**

# 2.4.8-alpha (2019-11-12)

### Bug Fixes

- **scrollBoard:** After updating props, the carousel speed is abnormal [(#25)](https://github.com/jiaming743/DataV/issues/16),[(#20)](https://github.com/jiaming743/DataV/issues/25).
- **scrollRankingBorad:** After updating props, the carousel speed is abnormal[(#25)](https://github.com/jiaming743/DataV/issues/16),[(#20)](https://github.com/jiaming743/DataV/issues/25).

# 2.4.7-alpha (2019-10-24)

### Perfect

- **charts:** Optimize memory leaks.
- **digitalFlop:** Optimize memory leaks.

# 2.4.6-alpha (2019-10-24)

### Bug Fixes

- **activeRingChart:** Optimize memory leaks [(#16)](https://github.com/jiaming743/DataV/issues/16),[(#20)](https://github.com/jiaming743/DataV/issues/20).

# 2.4.5-alpha (2019-09-24)

### Bug Fixes

- **activeRingChart:** Calculation exception due to data value being 0 [(#17)](https://github.com/jiaming743/DataV/issues/17).

# 2.4.4-alpha (2019-09-05)

### Bug Fixes

- **scrollBoard:** Header column width is abnormal when row data is empty.

# 2.4.3-alpha (2019-09-04)

### Perfect

- **scrollRankingBoard:** Add a unit configuration item.

# 2.4.2-alpha (2019-08-30)

### Perfect

- **capsuleChart:** Class name compatibility optimization.

# 2.4.1-alpha (2019-08-29)

### Perfect

- **capsuleChart:** Adaptive display unit.

# 2.4.0-alpha (2019-08-29)

### New

- **borderBox10**
- **capsuleChart**

# 2.3.9-alpha (2019-08-27)

### Perfect

- **percentPond:** Compatibility enhancement. 

# 2.3.8-alpha (2019-08-27)

### Bug Fixes

- **percentPond:** Style compatibility and gradient exceptions. 

# 2.3.7-alpha (2019-08-26)

### Bug Fixes

- **borderBox1:** Parent container setting `text-align: center` to cause display exception [(#6)](https://github.com/jiaming743/DataV/issues/6). 

# 2.3.6-alpha (2019-08-24)

### Bug Fixes

- **borderBox1:** Animation exception caused by incompatible syntax and spelling mistake [(#4)](https://github.com/jiaming743/DataV/issues/4)[(#5)](https://github.com/jiaming743/DataV/pull/5). 

### Perfect

- **svg:** Svg animation compatibility enhancement.

# 2.3.5-alpha (2019-08-22)

### Bug Fixes

- **activeRingChart:** Color configuration does not take effect [(#3)](https://github.com/jiaming743/DataV/pull/3). 

# 2.3.4-alpha (2019-08-15)

### Bug Fixes

- **package.json:** Import exception caused by incorrect entry path configuration.

# 2.3.3-alpha (2019-07-22)

### Bug Fixes

- **waterPondLevel:** Potential namespace conflict.
- **digitalFlop:** Potential namespace conflict.

# 2.3.2-alpha (2019-07-05)

### Perfect

- **decoration:** Explicitly set the SVG width and height to enhance stability.
- **Introduced on demand**

  ```js
  import { borderBox1 } from '@jiaminghi/data-view'

  Vue.use(borderBox1)
  ```

# 2.3.1-alpha (2019-07-04)

### Perfect

- **charts:** Enhanced style compatibility.
- **scrollBoard:** Enhanced style compatibility.
- **fullScreenContainer:** Fix potential rendering exceptions.
- **mixin:** Strengthen `autoResize` stability.

# 2.3.0-alpha (2019-07-04)

### Directory Structure Change

* **before**

  ```
  .
  ├── components
  │   ├── borderBox1
  │   │   └── index.vue
  │   ├── borderBox2
  │   │   └── index.vue
  │   ├── etc.
  │   └── index.js
  ├── mixins
  │   └── autoResize.js
  ├── util
  │   └── index.js
  │
  ├── index.js
  │
  ├── package.json // main: 'index.js'
  └── etc.
  ```

* **after**

  ```
  .
  ├── lib // After compilation
  │   ├── components
  │   │   ├── borderBox1
  │   │   |   ├── src
  │   │   |   |   ├── main.vue
  │   │   |   |   └── main.css
  │   │   |   └── index.js
  │   │   ├── etc.
  │   │   └── index.js
  │   ├── mixin
  │   │   └── autoResize.js
  │   ├── util
  │   │   └── index.js
  │   └── index.js
  │
  ├── publish // For pre-publish process
  │
  ├── src // For development environments
  │   ├── components
  │   │   ├── borderBox1
  │   │   |   ├── src
  │   │   |   |   └── main.vue
  │   │   |   └── index.js
  │   │   ├── etc.
  │   │   └── index.js
  │   ├── mixin
  │   │   └── autoResize.js
  │   ├── util
  │   │   └── index.js
  │   └── index.js
  │
  ├── package.json // main: '/lib/index.js'
  ├── publish.js
  └── etc.
  ```

- **Introduced on demand**

  ```js
  import borderBox1 from '@jiaminghi/data-view/lib/components/borderBox1'
  
  Vue.use(borderBox1)
  ```

# 2.2.0-alpha (2019-06-29)

### New

- **borderBox**
- **decoration**

# 2.1.1-alpha (2019-06-28)

### Bug Fixes

- **autoResize:** Exception caused by `autoResize` mixin.
- **charts:** `Legend` is blocked by slot and can't click.

# 2.1.0-alpha (2019-06-27)

### New

- **conicalColumnChart**
- **scrollRankingBoard**

# 2.0.0-alpha (2019-06-26)

### Perfect

- **SVG:** Refactoring **borderbox** and **decoration** components with SVG (Volume dropped to 6%).
- **charts:** New charting component that supports **animation**.
- **compatibility:** Better data compatibility.

### New

- **digitalFlop**
- **flylineChart**
- **borderBox**
- **decoration**

### Components

- **prefix:** Components add **dv** prefix to prevent conflicts.

```html
<!-- v 1.x.x -->
<decoration-1 />

<!-- v 2.x.x -->
<dv-decoration-1 />
```
