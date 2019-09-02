[中文](./README.md)

<h1 align="center">DataV</h1>

<p align="center">
    <a href="https://github.com/jiaming743/datav/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/jiaming743/datav.svg" alt="LICENSE" />
    </a>
    <a href="https://www.npmjs.com/package/@jiaminghi/data-view">
      <img src="https://img.shields.io/npm/v/@jiaminghi/data-view.svg" alt="LICENSE" />
    </a>
</p>

## What is DataV?

* DataV is a data **visualization** components library based on **Vue**.
* Provide cool **SVG** borders and decorations.
* Provide common **charts** such as line chart, etc..
* flying line chart, carousel table and etc.

### Install with npm

```shell
$ npm install @jiaminghi/data-view
```

### use

```js
import Vue from 'vue'
import DataV from '@jiaminghi/data-view'

Vue.use(DataV)

// Introduced on demand
import { borderBox1 } from '@jiaminghi/data-view'
Vue.use(borderBox1)
```

Detailed documents and examples can be viewed on the [HomePage](http://datav.jiaminghi.com).

### TODO

* Add color and other necessary configuration to the **borderBox** and **decoration** to enhance configurability and flexibility.

### Demo

The Demo page uses the full-screen component, please view it after F11 full screen.

* [Construction Data](http://datav.jiaminghi.com/demo/construction-data/index.html)

![construction-data](./demoImg/construction-data.jpg)

* [Manage-Desk](http://datav.jiaminghi.com/demo/manage-desk/index.html)

![manage-desk](./demoImg/manage-desk.jpg)

* [Electronic-File](http://datav.jiaminghi.com/demo/electronic-file/index.html)

![electronic-file](./demoImg/electronic-file.jpg)