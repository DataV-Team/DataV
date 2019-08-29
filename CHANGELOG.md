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
