(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('vue')) :
  typeof define === 'function' && define.amd ? define(['vue'], factory) :
  (global = global || self, factory(global.Vue));
}(this, function (Vue) { 'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

  function randomExtend(minNum, maxNum) {
    if (arguments.length === 1) {
      return parseInt(Math.random() * minNum + 1, 10);
    } else {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
  }
  function debounce(delay, callback) {
    let lastTime;
    return function () {
      clearTimeout(lastTime);
      const [that, args] = [this, arguments];
      lastTime = setTimeout(() => {
        callback.apply(that, args);
      }, delay);
    };
  }
  function observerDomResize(dom, callback) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const observer = new MutationObserver(callback);
    observer.observe(dom, {
      attributes: true,
      attributeFilter: ['style'],
      attributeOldValue: true
    });
    return observer;
  }
  function getPointDistance(pointOne, pointTwo) {
    const minusX = Math.abs(pointOne[0] - pointTwo[0]);
    const minusY = Math.abs(pointOne[1] - pointTwo[1]);
    return Math.sqrt(minusX * minusX + minusY * minusY);
  }

  var autoResize = {
    data() {
      return {
        dom: '',
        width: 0,
        height: 0,
        debounceInitWHFun: '',
        domObserver: ''
      };
    },

    methods: {
      async autoResizeMixinInit() {
        const {
          initWH,
          getDebounceInitWHFun,
          bindDomResizeCallback,
          afterAutoResizeMixinInit
        } = this;
        await initWH(false);
        getDebounceInitWHFun();
        bindDomResizeCallback();
        if (typeof afterAutoResizeMixinInit === 'function') afterAutoResizeMixinInit();
      },

      initWH(resize = true) {
        const {
          $nextTick,
          $refs,
          ref,
          onResize
        } = this;
        return new Promise(resolve => {
          $nextTick(e => {
            const dom = this.dom = $refs[ref];
            this.width = dom.clientWidth;
            this.height = dom.clientHeight;
            if (typeof onResize === 'function' && resize) onResize();
            resolve();
          });
        });
      },

      getDebounceInitWHFun() {
        const {
          initWH
        } = this;
        this.debounceInitWHFun = debounce(100, initWH);
      },

      bindDomResizeCallback() {
        const {
          dom,
          debounceInitWHFun
        } = this;
        this.domObserver = observerDomResize(dom, debounceInitWHFun);
        window.addEventListener('resize', debounceInitWHFun);
      },

      unbindDomResizeCallback() {
        let {
          domObserver,
          debounceInitWHFun
        } = this;
        domObserver.disconnect();
        domObserver.takeRecords();
        domObserver = null;
        window.removeEventListener('resize', debounceInitWHFun);
      }

    },

    mounted() {
      const {
        autoResizeMixinInit
      } = this;
      autoResizeMixinInit();
    },

    beforeDestroy() {
      const {
        unbindDomResizeCallback
      } = this;
      unbindDomResizeCallback();
    }

  };

  //
  var script = {
    name: 'DvFullScreenContainer',
    mixins: [autoResize],

    data() {
      return {
        ref: 'full-screen-container',
        allWidth: 0,
        scale: 0,
        datavRoot: '',
        ready: false
      };
    },

    methods: {
      afterAutoResizeMixinInit() {
        const {
          initConfig,
          setAppScale
        } = this;
        initConfig();
        setAppScale();
        this.ready = true;
      },

      initConfig() {
        const {
          dom
        } = this;
        const {
          width,
          height
        } = screen;
        this.allWidth = width;
        dom.style.width = `${width}px`;
        dom.style.height = `${height}px`;
      },

      setAppScale() {
        const {
          allWidth,
          dom
        } = this;
        const currentWidth = document.body.clientWidth;
        dom.style.transform = `scale(${currentWidth / allWidth})`;
      },

      onResize() {
        const {
          setAppScale
        } = this;
        setAppScale();
      }

    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD;
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  var browser = createInjector;

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: _vm.ref, attrs: { id: "dv-full-screen-container" } },
      [_vm.ready ? [_vm._t("default")] : _vm._e()],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-39d8efee_0", { source: "#dv-full-screen-container {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  overflow: hidden;\n  transform-origin: left top;\n  z-index: 999;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,QAAQ;EACR,SAAS;EACT,gBAAgB;EAChB,0BAA0B;EAC1B,YAAY;AACd","file":"main.vue","sourcesContent":["#dv-full-screen-container {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  overflow: hidden;\n  transform-origin: left top;\n  z-index: 999;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var FullScreenContainer = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  function fullScreenContainer (Vue) {
    Vue.component(FullScreenContainer.name, FullScreenContainer);
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$1 = {
    name: 'DvLoading'
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "dv-loading" }, [
      _c("svg", { attrs: { width: "50px", height: "50px" } }, [
        _c(
          "circle",
          {
            attrs: {
              cx: "25",
              cy: "25",
              r: "20",
              fill: "transparent",
              "stroke-width": "3",
              "stroke-dasharray": "31.415, 31.415",
              stroke: "#02bcfe",
              "stroke-linecap": "round"
            }
          },
          [
            _c("animateTransform", {
              attrs: {
                attributeName: "transform",
                type: "rotate",
                values: "0, 25 25;360, 25 25",
                dur: "1.5s",
                repeatCount: "indefinite"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke",
                values: "#02bcfe;#3be6cb;#02bcfe",
                dur: "3s",
                repeatCount: "indefinite"
              }
            })
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: "25",
              cy: "25",
              r: "10",
              fill: "transparent",
              "stroke-width": "3",
              "stroke-dasharray": "15.7, 15.7",
              stroke: "#3be6cb",
              "stroke-linecap": "round"
            }
          },
          [
            _c("animateTransform", {
              attrs: {
                attributeName: "transform",
                type: "rotate",
                values: "360, 25 25;0, 25 25",
                dur: "1.5s",
                repeatCount: "indefinite"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke",
                values: "#3be6cb;#02bcfe;#3be6cb",
                dur: "3s",
                repeatCount: "indefinite"
              }
            })
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "loading-tip" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-b0e29178_0", { source: ".dv-loading {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-loading .loading-tip {\n  font-size: 15px;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;EACZ,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;AACrB;AACA;EACE,eAAe;AACjB","file":"main.vue","sourcesContent":[".dv-loading {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-loading .loading-tip {\n  font-size: 15px;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    

    
    var Loading = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      browser,
      undefined
    );

  function loading (Vue) {
    Vue.component(Loading.name, Loading);
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$2 = {
    name: 'DvBorderBox1',

    data() {
      return {
        border: ['left-top', 'right-top', 'left-bottom', 'right-bottom']
      };
    }

  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "dv-border-box-1" },
      [
        _vm._l(_vm.border, function(item) {
          return _c(
            "svg",
            {
              key: item,
              class: item + " border",
              attrs: { width: "150px", height: "150px" }
            },
            [
              _c(
                "polygon",
                {
                  attrs: {
                    fill: "#4fd2dd",
                    points:
                      "6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63"
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "fill",
                      values: "#4fd2dd;#235fa7;#4fd2dd",
                      dur: "0.5s",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              ),
              _vm._v(" "),
              _c(
                "polygon",
                {
                  attrs: {
                    fill: "#235fa7",
                    points:
                      "27.599999999999998,4.8 38.4,4.8 35.4,7.8 30.599999999999998,7.8"
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "fill",
                      values: "#235fa7;#4fd2dd;#235fa7",
                      dur: "0.5s",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              ),
              _vm._v(" "),
              _c(
                "polygon",
                {
                  attrs: {
                    fill: "#4fd2dd",
                    points:
                      "9,54 9,63 7.199999999999999,66 7.199999999999999,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54"
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "fill",
                      values: "#4fd2dd;#235fa7;transparent",
                      dur: "1s",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              )
            ]
          )
        }),
        _vm._v(" "),
        _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
      ],
      2
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-53e01884_0", { source: ".dv-border-box-1 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-1 .border {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-1 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-1 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-1 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-1 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,cAAc;AAChB;AACA;EACE,UAAU;EACV,0BAA0B;AAC5B;AACA;EACE,WAAW;EACX,0BAA0B;AAC5B;AACA;EACE,UAAU;EACV,WAAW;EACX,0CAA0C;AAC5C;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-1 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-1 .border {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-1 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-1 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-1 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-1 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    

    
    var BorderBox1 = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      browser,
      undefined
    );

  function borderBox1 (Vue) {
    Vue.component(BorderBox1.name, BorderBox1);
  }

  //
  var script$3 = {
    name: 'DvBorderBox2',
    mixins: [autoResize],

    data() {
      return {
        ref: 'border-box-2'
      };
    }

  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-2" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polyline", {
            staticClass: "dv-bb2-line1",
            attrs: {
              points:
                "2, 2 " +
                (_vm.width - 2) +
                " ,2 " +
                (_vm.width - 2) +
                ", " +
                (_vm.height - 2) +
                " 2, " +
                (_vm.height - 2) +
                " 2, 2"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb2-line2",
            attrs: {
              points:
                "6, 6 " +
                (_vm.width - 6) +
                ", 6 " +
                (_vm.width - 6) +
                ", " +
                (_vm.height - 6) +
                " 6, " +
                (_vm.height - 6) +
                " 6, 6"
            }
          }),
          _vm._v(" "),
          _c("circle", { attrs: { cx: "11", cy: "11", r: "1" } }),
          _vm._v(" "),
          _c("circle", { attrs: { cx: _vm.width - 11, cy: "11", r: "1" } }),
          _vm._v(" "),
          _c("circle", {
            attrs: { cx: _vm.width - 11, cy: _vm.height - 11, r: "1" }
          }),
          _vm._v(" "),
          _c("circle", { attrs: { cx: "11", cy: _vm.height - 11, r: "1" } })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = function (inject) {
      if (!inject) return
      inject("data-v-2c14f4ac_0", { source: ".dv-border-box-2 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-2 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-2 .dv-border-svg-container polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-2 .dv-border-svg-container circle {\n  fill: #fff;\n}\n.dv-border-box-2 .dv-bb2-line1 {\n  stroke: #fff;\n}\n.dv-border-box-2 .dv-bb2-line2 {\n  stroke: rgba(255, 255, 255, 0.6);\n}\n.dv-border-box-2 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,UAAU;EACV,eAAe;AACjB;AACA;EACE,UAAU;AACZ;AACA;EACE,YAAY;AACd;AACA;EACE,gCAAgC;AAClC;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-2 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-2 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-2 .dv-border-svg-container polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-2 .dv-border-svg-container circle {\n  fill: #fff;\n}\n.dv-border-box-2 .dv-bb2-line1 {\n  stroke: #fff;\n}\n.dv-border-box-2 .dv-bb2-line2 {\n  stroke: rgba(255, 255, 255, 0.6);\n}\n.dv-border-box-2 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    

    
    var BorderBox2 = normalizeComponent_1(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      browser,
      undefined
    );

  function borderBox2 (Vue) {
    Vue.component(BorderBox2.name, BorderBox2);
  }

  //
  var script$4 = {
    name: 'DvBorderBox3',
    mixins: [autoResize],

    data() {
      return {
        ref: 'border-box-3'
      };
    }

  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-3" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polyline", {
            staticClass: "dv-bb3-line1",
            attrs: {
              points:
                "4, 4 " +
                (_vm.width - 22) +
                " ,4 " +
                (_vm.width - 22) +
                ", " +
                (_vm.height - 22) +
                " 4, " +
                (_vm.height - 22) +
                " 4, 4"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb3-line2",
            attrs: {
              points:
                "10, 10 " +
                (_vm.width - 16) +
                ", 10 " +
                (_vm.width - 16) +
                ", " +
                (_vm.height - 16) +
                " 10, " +
                (_vm.height - 16) +
                " 10, 10"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb3-line2",
            attrs: {
              points:
                "16, 16 " +
                (_vm.width - 10) +
                ", 16 " +
                (_vm.width - 10) +
                ", " +
                (_vm.height - 10) +
                " 16, " +
                (_vm.height - 10) +
                " 16, 16"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb3-line2",
            attrs: {
              points:
                "22, 22 " +
                (_vm.width - 4) +
                ", 22 " +
                (_vm.width - 4) +
                ", " +
                (_vm.height - 4) +
                " 22, " +
                (_vm.height - 4) +
                " 22, 22"
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-f2ff245a_0", { source: ".dv-border-box-3 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-3 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-3 .dv-border-svg-container polyline {\n  fill: none;\n  stroke: #2862b7;\n}\n.dv-border-box-3 .dv-bb3-line1 {\n  stroke-width: 3;\n}\n.dv-border-box-3 .dv-bb3-line2 {\n  stroke-width: 1;\n}\n.dv-border-box-3 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,UAAU;EACV,eAAe;AACjB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-3 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-3 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-3 .dv-border-svg-container polyline {\n  fill: none;\n  stroke: #2862b7;\n}\n.dv-border-box-3 .dv-bb3-line1 {\n  stroke-width: 3;\n}\n.dv-border-box-3 .dv-bb3-line2 {\n  stroke-width: 1;\n}\n.dv-border-box-3 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    

    
    var BorderBox3 = normalizeComponent_1(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      browser,
      undefined
    );

  function borderBox3 (Vue) {
    Vue.component(BorderBox3.name, BorderBox3);
  }

  //
  var script$5 = {
    name: 'DvBorderBox4',
    mixins: [autoResize],

    data() {
      return {
        ref: 'border-box-4'
      };
    },

    props: {
      reverse: {
        type: Boolean,
        default: false
      }
    }
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-4" }, [
      _c(
        "svg",
        {
          class: "dv-border-svg-container " + (_vm.reverse && "dv-reverse"),
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polyline", {
            staticClass: "dv-bb4-line-1",
            attrs: {
              points:
                "145, " +
                (_vm.height - 5) +
                " 40, " +
                (_vm.height - 5) +
                " 10, " +
                (_vm.height - 35) +
                "\n      10, 40 40, 5 150, 5 170, 20 " +
                (_vm.width - 15) +
                ", 20"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-2",
            attrs: {
              points:
                "245, " +
                (_vm.height - 1) +
                " 36, " +
                (_vm.height - 1) +
                " 14, " +
                (_vm.height - 23) +
                "\n      14, " +
                (_vm.height - 100)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-3",
            attrs: {
              points: "7, " + (_vm.height - 40) + " 7, " + (_vm.height - 75)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-4",
            attrs: { points: "28, 24 13, 41 13, 64" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-5",
            attrs: { points: "5, 45 5, 140" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-6",
            attrs: { points: "14, 75 14, 180" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-7",
            attrs: { points: "55, 11 147, 11 167, 26 250, 26" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-8",
            attrs: { points: "158, 5 173, 16" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-9",
            attrs: { points: "200, 17 " + (_vm.width - 10) + ", 17" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-10",
            attrs: { points: "385, 17 " + (_vm.width - 10) + ", 17" }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-3e5643ee_0", { source: ".dv-border-box-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-4 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-4 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-4 .dv-border-svg-container polyline {\n  fill: none;\n}\n.dv-border-box-4 .sred {\n  stroke: red;\n}\n.dv-border-box-4 .sblue {\n  stroke: rgba(0, 0, 255, 0.8);\n}\n.dv-border-box-4 .sw1 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .sw3 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-1 {\n  stroke: red;\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-2 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-3 {\n  stroke: red;\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-4 {\n  stroke: red;\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-5 {\n  stroke: red;\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-6 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-7 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-8 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-9 {\n  stroke: red;\n  stroke-width: 3px;\n  stroke-linecap: round;\n  stroke-dasharray: 100 250;\n}\n.dv-border-box-4 .dv-bb4-line-10 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 1;\n  stroke-dasharray: 80 270;\n}\n.dv-border-box-4 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue","E:\\Project\\A_MIT_LICENSE\\DataV\\src\\components\\borderBox4\\src\\main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,UAAU;AACZ;AACA;EACE,WAAW;AACb;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,eAAe;AACjB;AACA;EACE,iBAAiB;EACjB,qBAAqB;AACvB;AACA;EACE,WAAW;EACX,eAAe;AACjB;AACA;EACE,4BAA4B;EAC5B,eAAe;AACjB;AACA;EACE,WAAW;EACX,iBAAiB;EACjB,qBAAqB;AACvB;ACCA;EACA,WAAA;EACA,iBAAA;EACA,qBAAA;ADCA;ACCA;EACA,WAAA;EACA,eAAA;ADCA;ACCA;EACA,4BAAA;EACA,eAAA;AACA;AACA;EACA,4BAAA;EDCE,eAAe;ACCjB;AACA;EACA,4BAAA;EACA,iBAAA;EDCE,qBAAqB;ACCvB;AACA;EACA,WAAA;EDCE,iBAAiB;ECCnB,qBAAA;EACA,yBAAA;AACA;ADCA;ECCA,4BAAA;EACA,eAAA;EACA,wBAAA;ADCA;ACCA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;ADCA","file":"main.vue","sourcesContent":[".dv-border-box-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-4 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-4 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-4 .dv-border-svg-container polyline {\n  fill: none;\n}\n.dv-border-box-4 .sred {\n  stroke: red;\n}\n.dv-border-box-4 .sblue {\n  stroke: rgba(0, 0, 255, 0.8);\n}\n.dv-border-box-4 .sw1 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .sw3 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-1 {\n  stroke: red;\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-2 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-3 {\n  stroke: red;\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-4 {\n  stroke: red;\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-5 {\n  stroke: red;\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-6 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-7 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-8 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-9 {\n  stroke: red;\n  stroke-width: 3px;\n  stroke-linecap: round;\n  stroke-dasharray: 100 250;\n}\n.dv-border-box-4 .dv-bb4-line-10 {\n  stroke: rgba(0, 0, 255, 0.8);\n  stroke-width: 1;\n  stroke-dasharray: 80 270;\n}\n.dv-border-box-4 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n","<template>\r\n  <div class=\"dv-border-box-4\" :ref=\"ref\">\r\n    <svg :class=\"`dv-border-svg-container ${reverse && 'dv-reverse'}`\" :width=\"width\" :height=\"height\">\r\n      <polyline class=\"dv-bb4-line-1\" :points=\"`145, ${height - 5} 40, ${height - 5} 10, ${height - 35}\r\n        10, 40 40, 5 150, 5 170, 20 ${width - 15}, 20`\"/>\r\n      <polyline class=\"dv-bb4-line-2\" :points=\"`245, ${height - 1} 36, ${height - 1} 14, ${height - 23}\r\n        14, ${height - 100}`\" />\r\n      <polyline class=\"dv-bb4-line-3\" :points=\"`7, ${height - 40} 7, ${height - 75}`\" />\r\n      <polyline class=\"dv-bb4-line-4\" :points=\"`28, 24 13, 41 13, 64`\" />\r\n      <polyline class=\"dv-bb4-line-5\" :points=\"`5, 45 5, 140`\" />\r\n      <polyline class=\"dv-bb4-line-6\" :points=\"`14, 75 14, 180`\" />\r\n      <polyline class=\"dv-bb4-line-7\" :points=\"`55, 11 147, 11 167, 26 250, 26`\" />\r\n      <polyline class=\"dv-bb4-line-8\" :points=\"`158, 5 173, 16`\" />\r\n      <polyline class=\"dv-bb4-line-9\" :points=\"`200, 17 ${width - 10}, 17`\" />\r\n      <polyline class=\"dv-bb4-line-10\" :points=\"`385, 17 ${width - 10}, 17`\" />\r\n    </svg>\r\n\r\n    <div class=\"border-box-content\">\r\n      <slot></slot>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport autoResize from '../../../mixin/autoResize'\r\n\r\nexport default {\r\n  name: 'DvBorderBox4',\r\n  mixins: [autoResize],\r\n  data () {\r\n    return {\r\n      ref: 'border-box-4'\r\n    }\r\n  },\r\n  props: {\r\n    reverse: {\r\n      type: Boolean,\r\n      default: false\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style lang=\"less\">\r\n.dv-border-box-4 {\r\n  position: relative;\r\n  width: 100%;\r\n  height: 100%;\r\n\r\n  .dv-reverse {\r\n    transform: rotate(180deg);\r\n  }\r\n\r\n  .dv-border-svg-container {\r\n    position: absolute;\r\n    width: 100%;\r\n    height: 100%;\r\n    top: 0px;\r\n    left: 0px;\r\n\r\n    polyline {\r\n      fill: none;\r\n    }\r\n  }\r\n\r\n  .sred {\r\n    stroke: red;\r\n  }\r\n\r\n  .sblue {\r\n    stroke: fade(blue, 80);\r\n  }\r\n\r\n  .sw1 {\r\n    stroke-width: 1;\r\n  }\r\n\r\n  .sw3 {\r\n    stroke-width: 3px;\r\n    stroke-linecap: round;\r\n  }\r\n\r\n  .dv-bb4-line-1 {\r\n    .sred;\r\n    .sw1;\r\n  }\r\n\r\n  .dv-bb4-line-2 {\r\n    .sblue;\r\n    .sw1;\r\n  }\r\n\r\n  .dv-bb4-line-3 {\r\n    .sred;\r\n    .sw3;\r\n  }\r\n\r\n  .dv-bb4-line-4 {\r\n    .sred;\r\n    .sw3;\r\n  }\r\n\r\n  .dv-bb4-line-5 {\r\n    .sred;\r\n    .sw1;\r\n  }\r\n\r\n  .dv-bb4-line-6 {\r\n    .sblue;\r\n    .sw1;\r\n  }\r\n\r\n  .dv-bb4-line-7 {\r\n    .sblue;\r\n    .sw1;\r\n  }\r\n\r\n  .dv-bb4-line-8 {\r\n    .sblue;\r\n    .sw3;\r\n  }\r\n\r\n  .dv-bb4-line-9 {\r\n    .sred;\r\n    .sw3;\r\n    stroke-dasharray: 100 250;\r\n  }\r\n\r\n  .dv-bb4-line-10 {\r\n    .sblue;\r\n    .sw1;\r\n    stroke-dasharray: 80 270;\r\n  }\r\n\r\n  .border-box-content {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 100%;\r\n  }\r\n}\r\n</style>\r\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = undefined;
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    

    
    var BorderBox4 = normalizeComponent_1(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      browser,
      undefined
    );

  function borderBox4 (Vue) {
    Vue.component(BorderBox4.name, BorderBox4);
  }

  //
  var script$6 = {
    name: 'DvBorderBox5',
    mixins: [autoResize],

    data() {
      return {
        ref: 'border-box-5'
      };
    },

    props: {
      reverse: {
        type: Boolean,
        default: false
      }
    }
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-5" }, [
      _c(
        "svg",
        {
          class: "dv-svg-container  " + (_vm.reverse && "dv-reverse"),
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polyline", {
            staticClass: "dv-bb5-line-1",
            attrs: {
              points:
                "8, 5 " +
                (_vm.width - 5) +
                ", 5 " +
                (_vm.width - 5) +
                ", " +
                (_vm.height - 100) +
                "\n      " +
                (_vm.width - 100) +
                ", " +
                (_vm.height - 5) +
                " 8, " +
                (_vm.height - 5) +
                " 8, 5"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-2",
            attrs: {
              points:
                "3, 5 " +
                (_vm.width - 20) +
                ", 5 " +
                (_vm.width - 20) +
                ", " +
                (_vm.height - 60) +
                "\n      " +
                (_vm.width - 74) +
                ", " +
                (_vm.height - 5) +
                " 3, " +
                (_vm.height - 5) +
                " 3, 5"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-3",
            attrs: { points: "50, 13 " + (_vm.width - 35) + ", 13" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-4",
            attrs: { points: "15, 20 " + (_vm.width - 35) + ", 20" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-5",
            attrs: {
              points:
                "15, " +
                (_vm.height - 20) +
                " " +
                (_vm.width - 110) +
                ", " +
                (_vm.height - 20)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-6",
            attrs: {
              points:
                "15, " +
                (_vm.height - 13) +
                " " +
                (_vm.width - 110) +
                ", " +
                (_vm.height - 13)
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-775fac1b_0", { source: ".dv-border-box-5 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-5 .dv-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-svg-container polyline {\n  fill: none;\n}\n.dv-border-box-5 .dv-bb5-line-1 {\n  stroke-width: 1;\n  stroke: rgba(255, 255, 255, 0.35);\n}\n.dv-border-box-5 .dv-bb5-line-2 {\n  stroke: rgba(255, 255, 255, 0.2);\n}\n.dv-border-box-5 .dv-bb5-line-3,\n.dv-border-box-5 .dv-bb5-line-6 {\n  stroke-width: 5;\n  stroke: rgba(255, 255, 255, 0.15);\n}\n.dv-border-box-5 .dv-bb5-line-4,\n.dv-border-box-5 .dv-bb5-line-5 {\n  stroke-width: 2;\n  stroke: rgba(255, 255, 255, 0.15);\n}\n.dv-border-box-5 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;AACd;AACA;EACE,UAAU;AACZ;AACA;EACE,eAAe;EACf,iCAAiC;AACnC;AACA;EACE,gCAAgC;AAClC;AACA;;EAEE,eAAe;EACf,iCAAiC;AACnC;AACA;;EAEE,eAAe;EACf,iCAAiC;AACnC;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-5 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-5 .dv-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-svg-container polyline {\n  fill: none;\n}\n.dv-border-box-5 .dv-bb5-line-1 {\n  stroke-width: 1;\n  stroke: rgba(255, 255, 255, 0.35);\n}\n.dv-border-box-5 .dv-bb5-line-2 {\n  stroke: rgba(255, 255, 255, 0.2);\n}\n.dv-border-box-5 .dv-bb5-line-3,\n.dv-border-box-5 .dv-bb5-line-6 {\n  stroke-width: 5;\n  stroke: rgba(255, 255, 255, 0.15);\n}\n.dv-border-box-5 .dv-bb5-line-4,\n.dv-border-box-5 .dv-bb5-line-5 {\n  stroke-width: 2;\n  stroke: rgba(255, 255, 255, 0.15);\n}\n.dv-border-box-5 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    

    
    var BorderBox5 = normalizeComponent_1(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      browser,
      undefined
    );

  function borderBox5 (Vue) {
    Vue.component(BorderBox5.name, BorderBox5);
  }

  //
  var script$7 = {
    name: 'DvBorderBox6',
    mixins: [autoResize],

    data() {
      return {
        ref: 'border-box-6'
      };
    }

  };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$7 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-6" }, [
      _c(
        "svg",
        {
          staticClass: "dv-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("circle", { attrs: { cx: "5", cy: "5", r: "2" } }),
          _vm._v(" "),
          _c("circle", { attrs: { cx: _vm.width - 5, cy: "5", r: "2" } }),
          _vm._v(" "),
          _c("circle", {
            attrs: { cx: _vm.width - 5, cy: _vm.height - 5, r: "2" }
          }),
          _vm._v(" "),
          _c("circle", { attrs: { cx: "5", cy: _vm.height - 5, r: "2" } }),
          _vm._v(" "),
          _c("polyline", {
            attrs: { points: "10, 4 " + (_vm.width - 10) + ", 4" }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              points:
                "10, " +
                (_vm.height - 4) +
                " " +
                (_vm.width - 10) +
                ", " +
                (_vm.height - 4)
            }
          }),
          _vm._v(" "),
          _c("polyline", { attrs: { points: "5, 70 5, " + (_vm.height - 70) } }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              points:
                _vm.width -
                5 +
                ", 70 " +
                (_vm.width - 5) +
                ", " +
                (_vm.height - 70)
            }
          }),
          _vm._v(" "),
          _c("polyline", { attrs: { points: "3, 10, 3, 50" } }),
          _vm._v(" "),
          _c("polyline", { attrs: { points: "7, 30 7, 80" } }),
          _vm._v(" "),
          _c("polyline", {
            attrs: { points: _vm.width - 3 + ", 10 " + (_vm.width - 3) + ", 50" }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: { points: _vm.width - 7 + ", 30 " + (_vm.width - 7) + ", 80" }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              points: "3, " + (_vm.height - 10) + " 3, " + (_vm.height - 50)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              points: "7, " + (_vm.height - 30) + " 7, " + (_vm.height - 80)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              points:
                _vm.width -
                3 +
                ", " +
                (_vm.height - 10) +
                " " +
                (_vm.width - 3) +
                ", " +
                (_vm.height - 50)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              points:
                _vm.width -
                7 +
                ", " +
                (_vm.height - 30) +
                " " +
                (_vm.width - 7) +
                ", " +
                (_vm.height - 80)
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

    /* style */
    const __vue_inject_styles__$7 = function (inject) {
      if (!inject) return
      inject("data-v-a61b75b4_0", { source: ".dv-border-box-6 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-svg-container circle {\n  fill: gray;\n}\n.dv-border-box-6 .dv-svg-container polyline {\n  fill: none;\n  stroke-width: 1;\n  stroke: rgba(255, 255, 255, 0.35);\n}\n.dv-border-box-6 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;AACd;AACA;EACE,UAAU;AACZ;AACA;EACE,UAAU;EACV,eAAe;EACf,iCAAiC;AACnC;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-6 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-svg-container circle {\n  fill: gray;\n}\n.dv-border-box-6 .dv-svg-container polyline {\n  fill: none;\n  stroke-width: 1;\n  stroke: rgba(255, 255, 255, 0.35);\n}\n.dv-border-box-6 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$7 = undefined;
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject SSR */
    

    
    var BorderBox6 = normalizeComponent_1(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      browser,
      undefined
    );

  function borderBox6 (Vue) {
    Vue.component(BorderBox6.name, BorderBox6);
  }

  //
  var script$8 = {
    name: 'DvBorderBox7',
    mixins: [autoResize],

    data() {
      return {
        ref: 'border-box-7'
      };
    }

  };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$8 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-7" }, [
      _c(
        "svg",
        {
          staticClass: "dv-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polyline", {
            staticClass: "dv-bb7-line-width-2",
            attrs: { points: "0, 25 0, 0 25, 0" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb7-line-width-2",
            attrs: {
              points:
                _vm.width - 25 + ", 0 " + _vm.width + ", 0 " + _vm.width + ", 25"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb7-line-width-2",
            attrs: {
              points:
                _vm.width -
                25 +
                ", " +
                _vm.height +
                " " +
                _vm.width +
                ", " +
                _vm.height +
                " " +
                _vm.width +
                ", " +
                (_vm.height - 25)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb7-line-width-2",
            attrs: {
              points:
                "0, " +
                (_vm.height - 25) +
                " 0, " +
                _vm.height +
                " 25, " +
                _vm.height
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb7-line-width-5",
            attrs: { points: "0, 10 0, 0 10, 0" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb7-line-width-5",
            attrs: {
              points:
                _vm.width - 10 + ", 0 " + _vm.width + ", 0 " + _vm.width + ", 10"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb7-line-width-5",
            attrs: {
              points:
                _vm.width -
                10 +
                ", " +
                _vm.height +
                " " +
                _vm.width +
                ", " +
                _vm.height +
                " " +
                _vm.width +
                ", " +
                (_vm.height - 10)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb7-line-width-5",
            attrs: {
              points:
                "0, " +
                (_vm.height - 10) +
                " 0, " +
                _vm.height +
                " 10, " +
                _vm.height
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$8 = [];
  __vue_render__$8._withStripped = true;

    /* style */
    const __vue_inject_styles__$8 = function (inject) {
      if (!inject) return
      inject("data-v-4407270e_0", { source: ".dv-border-box-7 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  box-shadow: inset 0 0 40px rgba(128, 128, 128, 0.3);\n  border: 1px solid rgba(128, 128, 128, 0.3);\n}\n.dv-border-box-7 .dv-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-7 .dv-svg-container polyline {\n  fill: none;\n  stroke-linecap: round;\n}\n.dv-border-box-7 .dv-bb7-line-width-2 {\n  stroke: rgba(128, 128, 128, 0.3);\n  stroke-width: 2;\n}\n.dv-border-box-7 .dv-bb7-line-width-5 {\n  stroke: rgba(128, 128, 128, 0.5);\n  stroke-width: 5;\n}\n.dv-border-box-7 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,mDAAmD;EACnD,0CAA0C;AAC5C;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;AACd;AACA;EACE,UAAU;EACV,qBAAqB;AACvB;AACA;EACE,gCAAgC;EAChC,eAAe;AACjB;AACA;EACE,gCAAgC;EAChC,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-7 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  box-shadow: inset 0 0 40px rgba(128, 128, 128, 0.3);\n  border: 1px solid rgba(128, 128, 128, 0.3);\n}\n.dv-border-box-7 .dv-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-7 .dv-svg-container polyline {\n  fill: none;\n  stroke-linecap: round;\n}\n.dv-border-box-7 .dv-bb7-line-width-2 {\n  stroke: rgba(128, 128, 128, 0.3);\n  stroke-width: 2;\n}\n.dv-border-box-7 .dv-bb7-line-width-5 {\n  stroke: rgba(128, 128, 128, 0.5);\n  stroke-width: 5;\n}\n.dv-border-box-7 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$8 = undefined;
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject SSR */
    

    
    var BorderBox7 = normalizeComponent_1(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$8,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      browser,
      undefined
    );

  function borderBox7 (Vue) {
    Vue.component(BorderBox7.name, BorderBox7);
  }

  //
  var script$9 = {
    name: 'DvBorderBox8',
    mixins: [autoResize],

    data() {
      return {
        ref: 'border-box-8',
        path: `border-box-8-path-${new Date().getTime()}`,
        gradient: `border-box-8-gradient-${new Date().getTime()}`,
        mask: `border-box-8-mask-${new Date().getTime()}`
      };
    },

    computed: {
      length() {
        const {
          width,
          height
        } = this;
        return (width + height - 5) * 2;
      }

    }
  };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */
  var __vue_render__$9 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-8" }, [
      _c(
        "svg",
        {
          staticClass: "dv-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c(
            "defs",
            [
              _c("path", {
                attrs: {
                  id: _vm.path,
                  d:
                    "M2.5, 2.5 L" +
                    (_vm.width - 2.5) +
                    ", 2.5 L" +
                    (_vm.width - 2.5) +
                    ", " +
                    (_vm.height - 2.5) +
                    " L2.5, " +
                    (_vm.height - 2.5) +
                    " L2.5, 2.5",
                  fill: "transparent"
                }
              }),
              _vm._v(" "),
              _c(
                "radialGradient",
                { attrs: { id: _vm.gradient, cx: "50%", cy: "50%", r: "50%" } },
                [
                  _c("stop", {
                    attrs: {
                      offset: "0%",
                      "stop-color": "#fff",
                      "stop-opacity": "1"
                    }
                  }),
                  _vm._v(" "),
                  _c("stop", {
                    attrs: {
                      offset: "100%",
                      "stop-color": "#fff",
                      "stop-opacity": "0"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("mask", { attrs: { id: _vm.mask } }, [
                _c(
                  "circle",
                  {
                    attrs: {
                      cx: "0",
                      cy: "0",
                      r: "150",
                      fill: "url(#" + _vm.gradient + ")"
                    }
                  },
                  [
                    _c("animateMotion", {
                      attrs: {
                        dur: "3s",
                        path:
                          "M2.5, 2.5 L" +
                          (_vm.width - 2.5) +
                          ", 2.5 L" +
                          (_vm.width - 2.5) +
                          ", " +
                          (_vm.height - 2.5) +
                          " L2.5, " +
                          (_vm.height - 2.5) +
                          " L2.5, 2.5",
                        rotate: "auto",
                        repeatCount: "indefinite"
                      }
                    })
                  ],
                  1
                )
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c("use", {
            attrs: {
              stroke: "#235fa7",
              "stroke-width": "1",
              "xlink:href": "#" + _vm.path
            }
          }),
          _vm._v(" "),
          _c(
            "use",
            {
              attrs: {
                stroke: "#4fd2dd",
                "stroke-width": "3",
                "xlink:href": "#" + _vm.path,
                mask: "url(#" + _vm.mask + ")"
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "stroke-dasharray",
                  from: "0, " + _vm.length,
                  to: _vm.length + ", 0",
                  dur: "3s",
                  repeatCount: "indefinite"
                }
              })
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$9 = [];
  __vue_render__$9._withStripped = true;

    /* style */
    const __vue_inject_styles__$9 = function (inject) {
      if (!inject) return
      inject("data-v-ab8dc534_0", { source: ".dv-border-box-8 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-8 svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-8 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,SAAS;EACT,QAAQ;AACV;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-8 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-8 svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-8 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$9 = undefined;
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = false;
    /* style inject SSR */
    

    
    var BorderBox8 = normalizeComponent_1(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$9,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      browser,
      undefined
    );

  function borderBox8 (Vue) {
    Vue.component(BorderBox8.name, BorderBox8);
  }

  //
  var script$a = {
    name: 'DvBorderBox9',
    mixins: [autoResize],

    data() {
      return {
        ref: 'border-box-9',
        gradientId: `border-box-9-gradient-${new Date().getTime()}`,
        maskId: `border-box-9-mask-${new Date().getTime()}`
      };
    }

  };

  /* script */
  const __vue_script__$a = script$a;

  /* template */
  var __vue_render__$a = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-9" }, [
      _c(
        "svg",
        {
          staticClass: "dv-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c(
            "defs",
            [
              _c(
                "linearGradient",
                {
                  attrs: {
                    id: _vm.gradientId,
                    x1: "0%",
                    y1: "0%",
                    x2: "100%",
                    y2: "100%"
                  }
                },
                [
                  _c("stop", {
                    attrs: { offset: "0%", "stop-color": "#11eefd" }
                  }),
                  _vm._v(" "),
                  _c("stop", {
                    attrs: { offset: "100%", "stop-color": "#0078d2" }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("mask", { attrs: { id: _vm.maskId } }, [
                _c("polyline", {
                  attrs: {
                    stroke: "#fff",
                    "stroke-width": "3",
                    fill: "transparent",
                    points:
                      "8, " +
                      _vm.height * 0.4 +
                      " 8, 3, " +
                      (_vm.width * 0.4 + 7) +
                      ", 3"
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "8, " +
                      _vm.height * 0.15 +
                      " 8, 3, " +
                      (_vm.width * 0.1 + 7) +
                      ", 3\n            " +
                      _vm.width * 0.1 +
                      ", 8 14, 8 14, " +
                      (_vm.height * 0.15 - 7) +
                      "\n          "
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    stroke: "#fff",
                    "stroke-width": "3",
                    fill: "transparent",
                    points:
                      _vm.width * 0.5 +
                      ", 3 " +
                      (_vm.width - 3) +
                      ", 3, " +
                      (_vm.width - 3) +
                      ", " +
                      _vm.height * 0.25
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "\n            " +
                      _vm.width * 0.52 +
                      ", 3 " +
                      _vm.width * 0.58 +
                      ", 3\n            " +
                      (_vm.width * 0.58 - 7) +
                      ", 9 " +
                      (_vm.width * 0.52 + 7) +
                      ", 9\n          "
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "\n            " +
                      _vm.width * 0.9 +
                      ", 3 " +
                      (_vm.width - 3) +
                      ", 3 " +
                      (_vm.width - 3) +
                      ", " +
                      _vm.height * 0.1 +
                      "\n            " +
                      (_vm.width - 9) +
                      ", " +
                      (_vm.height * 0.1 - 7) +
                      " " +
                      (_vm.width - 9) +
                      ", 9 " +
                      (_vm.width * 0.9 + 7) +
                      ", 9\n          "
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    stroke: "#fff",
                    "stroke-width": "3",
                    fill: "transparent",
                    points:
                      "8, " +
                      _vm.height * 0.5 +
                      " 8, " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width * 0.3 + 7) +
                      ", " +
                      (_vm.height - 3)
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "\n            8, " +
                      _vm.height * 0.55 +
                      " 8, " +
                      _vm.height * 0.7 +
                      "\n            2, " +
                      (_vm.height * 0.7 - 7) +
                      " 2, " +
                      (_vm.height * 0.55 + 7) +
                      "\n          "
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    stroke: "#fff",
                    "stroke-width": "3",
                    fill: "transparent",
                    points:
                      _vm.width * 0.35 +
                      ", " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width - 3) +
                      ", " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width - 3) +
                      ", " +
                      _vm.height * 0.35
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "\n            " +
                      _vm.width * 0.92 +
                      ", " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width - 3) +
                      ", " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width - 3) +
                      ", " +
                      _vm.height * 0.8 +
                      "\n            " +
                      (_vm.width - 9) +
                      ", " +
                      (_vm.height * 0.8 + 7) +
                      " " +
                      (_vm.width - 9) +
                      ", " +
                      (_vm.height - 9) +
                      " " +
                      (_vm.width * 0.92 + 7) +
                      ", " +
                      (_vm.height - 9) +
                      "\n          "
                  }
                })
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c("rect", {
            attrs: {
              x: "0",
              y: "0",
              width: _vm.width,
              height: _vm.height,
              fill: "url(#" + _vm.gradientId + ")",
              mask: "url(#" + _vm.maskId + ")"
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$a = [];
  __vue_render__$a._withStripped = true;

    /* style */
    const __vue_inject_styles__$a = function (inject) {
      if (!inject) return
      inject("data-v-3ccfbea8_0", { source: ".dv-border-box-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-9 svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-9 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,SAAS;EACT,QAAQ;AACV;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-9 svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-9 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$a = undefined;
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject SSR */
    

    
    var BorderBox9 = normalizeComponent_1(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$a,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      browser,
      undefined
    );

  function borderBox9 (Vue) {
    Vue.component(BorderBox9.name, BorderBox9);
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$b = {
    name: 'DvBorderBox10',

    data() {
      return {
        border: ['left-top', 'right-top', 'left-bottom', 'right-bottom']
      };
    }

  };

  /* script */
  const __vue_script__$b = script$b;

  /* template */
  var __vue_render__$b = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "dv-border-box-10" },
      [
        _vm._l(_vm.border, function(item) {
          return _c(
            "svg",
            {
              key: item,
              class: item + " border",
              attrs: { width: "150px", height: "150px" }
            },
            [
              _c("polygon", {
                attrs: {
                  fill: "#d3e1f8",
                  points: "40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
                }
              })
            ]
          )
        }),
        _vm._v(" "),
        _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
      ],
      2
    )
  };
  var __vue_staticRenderFns__$b = [];
  __vue_render__$b._withStripped = true;

    /* style */
    const __vue_inject_styles__$b = function (inject) {
      if (!inject) return
      inject("data-v-4ca6df50_0", { source: ".dv-border-box-10 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  box-shadow: inset 0 0 25px 3px #1d48c4;\n  border-radius: 6px;\n}\n.dv-border-box-10 .border {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-10 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-10 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-10 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-10 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,sCAAsC;EACtC,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,cAAc;AAChB;AACA;EACE,UAAU;EACV,0BAA0B;AAC5B;AACA;EACE,WAAW;EACX,0BAA0B;AAC5B;AACA;EACE,UAAU;EACV,WAAW;EACX,0CAA0C;AAC5C;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-10 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  box-shadow: inset 0 0 25px 3px #1d48c4;\n  border-radius: 6px;\n}\n.dv-border-box-10 .border {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-10 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-10 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-10 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-10 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$b = undefined;
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject SSR */
    

    
    var BorderBox10 = normalizeComponent_1(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$b,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      browser,
      undefined
    );

  function borderBox10 (Vue) {
    Vue.component(BorderBox10.name, BorderBox10);
  }

  //
  var script$c = {
    name: 'DvDecoration1',
    mixins: [autoResize],

    data() {
      const pointSideLength = 2.5;
      return {
        ref: 'decoration-1',
        svgWH: [200, 50],
        svgScale: [1, 1],
        rowNum: 4,
        rowPoints: 20,
        pointSideLength,
        halfPointSideLength: pointSideLength / 2,
        points: [],
        rects: []
      };
    },

    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          calcPointsPosition,
          calcRectsPosition,
          calcScale
        } = this;
        calcPointsPosition();
        calcRectsPosition();
        calcScale();
      },

      calcPointsPosition() {
        const {
          svgWH,
          rowNum,
          rowPoints
        } = this;
        const [w, h] = svgWH;
        const horizontalGap = w / (rowPoints + 1);
        const verticalGap = h / (rowNum + 1);
        let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
        this.points = points.reduce((all, item) => [...all, ...item], []);
      },

      calcRectsPosition() {
        const {
          points,
          rowPoints
        } = this;
        const rect1 = points[rowPoints * 2 - 1];
        const rect2 = points[rowPoints * 2 - 3];
        this.rects = [rect1, rect2];
      },

      calcScale() {
        const {
          width,
          height,
          svgWH
        } = this;
        const [w, h] = svgWH;
        this.svgScale = [width / w, height / h];
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      }

    }
  };

  /* script */
  const __vue_script__$c = script$c;

  /* template */
  var __vue_render__$c = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-1" }, [
      _c(
        "svg",
        {
          style:
            "transform:scale(" + _vm.svgScale[0] + "," + _vm.svgScale[1] + ");",
          attrs: { width: _vm.svgWH[0] + "px", height: _vm.svgWH[1] + "px" }
        },
        [
          _vm._l(_vm.points, function(point, i) {
            return [
              Math.random() > 0.6
                ? _c(
                    "rect",
                    {
                      key: i,
                      attrs: {
                        fill: "#fff",
                        x: point[0] - _vm.halfPointSideLength,
                        y: point[1] - _vm.halfPointSideLength,
                        width: _vm.pointSideLength,
                        height: _vm.pointSideLength
                      }
                    },
                    [
                      Math.random() > 0.6
                        ? _c("animate", {
                            attrs: {
                              attributeName: "fill",
                              values: "#fff;transparent",
                              dur: "1s",
                              begin: Math.random() * 2,
                              repeatCount: "indefinite"
                            }
                          })
                        : _vm._e()
                    ]
                  )
                : _vm._e()
            ]
          }),
          _vm._v(" "),
          _vm.rects[0]
            ? _c(
                "rect",
                {
                  attrs: {
                    fill: "#0de7c2",
                    x: _vm.rects[0][0] - _vm.pointSideLength,
                    y: _vm.rects[0][1] - _vm.pointSideLength,
                    width: _vm.pointSideLength * 2,
                    height: _vm.pointSideLength * 2
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "width",
                      values: "0;" + _vm.pointSideLength * 2,
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "height",
                      values: "0;" + _vm.pointSideLength * 2,
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "x",
                      values:
                        _vm.rects[0][0] +
                        ";" +
                        (_vm.rects[0][0] - _vm.pointSideLength),
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "y",
                      values:
                        _vm.rects[0][1] +
                        ";" +
                        (_vm.rects[0][1] - _vm.pointSideLength),
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.rects[1]
            ? _c(
                "rect",
                {
                  attrs: {
                    fill: "#0de7c2",
                    x: _vm.rects[1][0] - 40,
                    y: _vm.rects[1][1] - _vm.pointSideLength,
                    width: 40,
                    height: _vm.pointSideLength * 2
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "width",
                      values: "0;40;0",
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "x",
                      values:
                        _vm.rects[1][0] +
                        ";" +
                        (_vm.rects[1][0] - 40) +
                        ";" +
                        _vm.rects[1][0],
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              )
            : _vm._e()
        ],
        2
      )
    ])
  };
  var __vue_staticRenderFns__$c = [];
  __vue_render__$c._withStripped = true;

    /* style */
    const __vue_inject_styles__$c = function (inject) {
      if (!inject) return
      inject("data-v-37b4d8de_0", { source: ".dv-decoration-1 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-1 svg {\n  transform-origin: left top;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,0BAA0B;AAC5B","file":"main.vue","sourcesContent":[".dv-decoration-1 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-1 svg {\n  transform-origin: left top;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$c = undefined;
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject SSR */
    

    
    var Decoration1 = normalizeComponent_1(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$c,
      __vue_script__$c,
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      browser,
      undefined
    );

  function decoration1 (Vue) {
    Vue.component(Decoration1.name, Decoration1);
  }

  //
  var script$d = {
    name: 'DvDecoration2',
    mixins: [autoResize],
    props: {
      reverse: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        ref: 'decoration-2',
        x: 0,
        y: 0,
        w: 0,
        h: 0
      };
    },

    watch: {
      reverse() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          reverse,
          width,
          height
        } = this;

        if (reverse) {
          this.w = 1;
          this.h = height;
          this.x = width / 2;
          this.y = 0;
        } else {
          this.w = width;
          this.h = 1;
          this.x = 0;
          this.y = height / 2;
        }
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      }

    }
  };

  /* script */
  const __vue_script__$d = script$d;

  /* template */
  var __vue_render__$d = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-2" }, [
      _c(
        "svg",
        { attrs: { width: _vm.width + "px", height: _vm.height + "px" } },
        [
          _c(
            "rect",
            {
              attrs: {
                x: _vm.x,
                y: _vm.y,
                width: _vm.w,
                height: _vm.h,
                fill: "#3faacb"
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: _vm.reverse ? "height" : "width",
                  from: "0",
                  to: _vm.reverse ? _vm.height : _vm.width,
                  dur: "6s",
                  calcMode: "spline",
                  keyTimes: "0;1",
                  keySplines: ".42,0,.58,1",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "rect",
            {
              attrs: { x: _vm.x, y: _vm.y, width: "1", height: "1", fill: "#fff" }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: _vm.reverse ? "y" : "x",
                  from: "0",
                  to: _vm.reverse ? _vm.height : _vm.width,
                  dur: "6s",
                  calcMode: "spline",
                  keyTimes: "0;1",
                  keySplines: "0.42,0,0.58,1",
                  repeatCount: "indefinite"
                }
              })
            ]
          )
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$d = [];
  __vue_render__$d._withStripped = true;

    /* style */
    const __vue_inject_styles__$d = function (inject) {
      if (!inject) return
      inject("data-v-830db22e_0", { source: ".dv-decoration-2 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,mBAAmB;AACrB","file":"main.vue","sourcesContent":[".dv-decoration-2 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$d = undefined;
    /* module identifier */
    const __vue_module_identifier__$d = undefined;
    /* functional template */
    const __vue_is_functional_template__$d = false;
    /* style inject SSR */
    

    
    var Decoration2 = normalizeComponent_1(
      { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
      __vue_inject_styles__$d,
      __vue_script__$d,
      __vue_scope_id__$d,
      __vue_is_functional_template__$d,
      __vue_module_identifier__$d,
      browser,
      undefined
    );

  function decoration2 (Vue) {
    Vue.component(Decoration2.name, Decoration2);
  }

  //
  var script$e = {
    name: 'DvDecoration3',
    mixins: [autoResize],

    data() {
      const pointSideLength = 7;
      return {
        ref: 'decoration-3',
        svgWH: [300, 35],
        svgScale: [1, 1],
        rowNum: 2,
        rowPoints: 25,
        pointSideLength,
        halfPointSideLength: pointSideLength / 2,
        points: []
      };
    },

    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          calcPointsPosition,
          calcScale
        } = this;
        calcPointsPosition();
        calcScale();
      },

      calcPointsPosition() {
        const {
          svgWH,
          rowNum,
          rowPoints
        } = this;
        const [w, h] = svgWH;
        const horizontalGap = w / (rowPoints + 1);
        const verticalGap = h / (rowNum + 1);
        let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
        this.points = points.reduce((all, item) => [...all, ...item], []);
      },

      calcScale() {
        const {
          width,
          height,
          svgWH
        } = this;
        const [w, h] = svgWH;
        this.svgScale = [width / w, height / h];
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      }

    }
  };

  /* script */
  const __vue_script__$e = script$e;

  /* template */
  var __vue_render__$e = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-3" }, [
      _c(
        "svg",
        {
          style:
            "transform:scale(" + _vm.svgScale[0] + "," + _vm.svgScale[1] + ");",
          attrs: { width: _vm.svgWH[0] + "px", height: _vm.svgWH[1] + "px" }
        },
        [
          _vm._l(_vm.points, function(point, i) {
            return [
              _c(
                "rect",
                {
                  key: i,
                  attrs: {
                    fill: "#7acaec",
                    x: point[0] - _vm.halfPointSideLength,
                    y: point[1] - _vm.halfPointSideLength,
                    width: _vm.pointSideLength,
                    height: _vm.pointSideLength
                  }
                },
                [
                  Math.random() > 0.6
                    ? _c("animate", {
                        attrs: {
                          attributeName: "fill",
                          values: "#7acaec;transparent",
                          dur: Math.random() + 1 + "s",
                          begin: Math.random() * 2,
                          repeatCount: "indefinite"
                        }
                      })
                    : _vm._e()
                ]
              )
            ]
          })
        ],
        2
      )
    ])
  };
  var __vue_staticRenderFns__$e = [];
  __vue_render__$e._withStripped = true;

    /* style */
    const __vue_inject_styles__$e = function (inject) {
      if (!inject) return
      inject("data-v-557fdf18_0", { source: ".dv-decoration-3 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-3 svg {\n  transform-origin: left top;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,0BAA0B;AAC5B","file":"main.vue","sourcesContent":[".dv-decoration-3 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-3 svg {\n  transform-origin: left top;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$e = undefined;
    /* module identifier */
    const __vue_module_identifier__$e = undefined;
    /* functional template */
    const __vue_is_functional_template__$e = false;
    /* style inject SSR */
    

    
    var Decoration3 = normalizeComponent_1(
      { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
      __vue_inject_styles__$e,
      __vue_script__$e,
      __vue_scope_id__$e,
      __vue_is_functional_template__$e,
      __vue_module_identifier__$e,
      browser,
      undefined
    );

  function decoration3 (Vue) {
    Vue.component(Decoration3.name, Decoration3);
  }

  //
  var script$f = {
    name: 'DvDecoration4',
    mixins: [autoResize],
    props: ['reverse'],

    data() {
      return {
        ref: 'decoration-4'
      };
    }

  };

  /* script */
  const __vue_script__$f = script$f;

  /* template */
  var __vue_render__$f = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-4" }, [
      _c(
        "div",
        {
          class: "container " + (_vm.reverse ? "reverse" : "normal"),
          style: _vm.reverse
            ? "width:" + _vm.width + "px;height:5px"
            : "width:5px;height:" + _vm.height + "px;"
        },
        [
          _c(
            "svg",
            {
              attrs: {
                width: _vm.reverse ? _vm.width : 5,
                height: _vm.reverse ? 5 : _vm.height
              }
            },
            [
              _c("polyline", {
                attrs: {
                  stroke: "rgba(255, 255, 255, 0.3)",
                  points: _vm.reverse
                    ? "0, 2.5 " + _vm.width + ", 2.5"
                    : "2.5, 0 2.5, " + _vm.height
                }
              }),
              _vm._v(" "),
              _c("polyline", {
                staticClass: "bold-line",
                attrs: {
                  stroke: "rgba(255, 255, 255, 0.3)",
                  "stroke-width": "3",
                  "stroke-dasharray": "20, 80",
                  "stroke-dashoffset": "-30",
                  points: _vm.reverse
                    ? "0, 2.5 " + _vm.width + ", 2.5"
                    : "2.5, 0 2.5, " + _vm.height
                }
              })
            ]
          )
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$f = [];
  __vue_render__$f._withStripped = true;

    /* style */
    const __vue_inject_styles__$f = function (inject) {
      if (!inject) return
      inject("data-v-15cdd0b4_0", { source: ".dv-decoration-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-4 .container {\n  display: flex;\n  overflow: hidden;\n  position: absolute;\n}\n.dv-decoration-4 .normal {\n  height: 0% !important;\n  animation: ani-height 3s ease-in-out infinite;\n  left: 50%;\n  margin-left: -2px;\n}\n.dv-decoration-4 .reverse {\n  width: 0% !important;\n  animation: ani-width 3s ease-in-out infinite;\n  top: 50%;\n  margin-top: -2px;\n}\n@keyframes ani-height {\n70% {\n    height: 100%;\n}\n100% {\n    height: 100%;\n}\n}\n@keyframes ani-width {\n70% {\n    width: 100%;\n}\n100% {\n    width: 100%;\n}\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,kBAAkB;AACpB;AACA;EACE,qBAAqB;EACrB,6CAA6C;EAC7C,SAAS;EACT,iBAAiB;AACnB;AACA;EACE,oBAAoB;EACpB,4CAA4C;EAC5C,QAAQ;EACR,gBAAgB;AAClB;AACA;AACE;IACE,YAAY;AACd;AACA;IACE,YAAY;AACd;AACF;AACA;AACE;IACE,WAAW;AACb;AACA;IACE,WAAW;AACb;AACF","file":"main.vue","sourcesContent":[".dv-decoration-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-4 .container {\n  display: flex;\n  overflow: hidden;\n  position: absolute;\n}\n.dv-decoration-4 .normal {\n  height: 0% !important;\n  animation: ani-height 3s ease-in-out infinite;\n  left: 50%;\n  margin-left: -2px;\n}\n.dv-decoration-4 .reverse {\n  width: 0% !important;\n  animation: ani-width 3s ease-in-out infinite;\n  top: 50%;\n  margin-top: -2px;\n}\n@keyframes ani-height {\n  70% {\n    height: 100%;\n  }\n  100% {\n    height: 100%;\n  }\n}\n@keyframes ani-width {\n  70% {\n    width: 100%;\n  }\n  100% {\n    width: 100%;\n  }\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$f = undefined;
    /* module identifier */
    const __vue_module_identifier__$f = undefined;
    /* functional template */
    const __vue_is_functional_template__$f = false;
    /* style inject SSR */
    

    
    var Decoration4 = normalizeComponent_1(
      { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
      __vue_inject_styles__$f,
      __vue_script__$f,
      __vue_scope_id__$f,
      __vue_is_functional_template__$f,
      __vue_module_identifier__$f,
      browser,
      undefined
    );

  function decoration4 (Vue) {
    Vue.component(Decoration4.name, Decoration4);
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.6.9' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var _isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _anObject = function (it) {
    if (!_isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var document$1 = _global.document;
  // typeof document.createElement is 'object' in old IE
  var is = _isObject(document$1) && _isObject(document$1.createElement);
  var _domCreate = function (it) {
    return is ? document$1.createElement(it) : {};
  };

  var _ie8DomDefine = !_descriptors && !_fails(function () {
    return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive = function (it, S) {
    if (!_isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;

  var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject(O);
    P = _toPrimitive(P, true);
    _anObject(Attributes);
    if (_ie8DomDefine) try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp = {
  	f: f
  };

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var hasOwnProperty = {}.hasOwnProperty;
  var _has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var id = 0;
  var px = Math.random();
  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var _library = false;

  var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode:  'global',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  });

  var _functionToString = _shared('native-function-to-string', Function.toString);

  var _redefine = createCommonjsModule(function (module) {
  var SRC = _uid('src');

  var TO_STRING = 'toString';
  var TPL = ('' + _functionToString).split(TO_STRING);

  _core.inspectSource = function (it) {
    return _functionToString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === _global) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      _hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      _hide(O, key, val);
    }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || _functionToString.call(this);
  });
  });

  var _aFunction = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  // optional / simple context binding

  var _ctx = function (fn, that, length) {
    _aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
    var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      // export native or passed
      out = (own ? target : source)[key];
      // bind timers to global for call from export context
      exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
      // extend global
      if (target) _redefine(target, key, out, type & $export.U);
      // export
      if (exports[key] != out) _hide(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };
  _global.core = _core;
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  var _export = $export;

  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  _export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  // true  -> String#at
  // false -> String#codePointAt
  var _stringAt = function (TO_STRING) {
    return function (that, pos) {
      var s = String(_defined(that));
      var i = _toInteger(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var _iterators = {};

  var toString = {}.toString;

  var _cof = function (it) {
    return toString.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  // eslint-disable-next-line no-prototype-builtins
  var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return _cof(it) == 'String' ? it.split('') : Object(it);
  };

  // to indexed object, toObject with fallback for non-array-like ES3 strings


  var _toIobject = function (it) {
    return _iobject(_defined(it));
  };

  // 7.1.15 ToLength

  var min = Math.min;
  var _toLength = function (it) {
    return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;
  var _toAbsoluteIndex = function (index, length) {
    index = _toInteger(index);
    return index < 0 ? max(index + length, 0) : min$1(index, length);
  };

  // false -> Array#indexOf
  // true  -> Array#includes



  var _arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = _toIobject($this);
      var length = _toLength(O.length);
      var index = _toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var shared = _shared('keys');

  var _sharedKey = function (key) {
    return shared[key] || (shared[key] = _uid(key));
  };

  var arrayIndexOf = _arrayIncludes(false);
  var IE_PROTO = _sharedKey('IE_PROTO');

  var _objectKeysInternal = function (object, names) {
    var O = _toIobject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (_has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE 8- don't enum bug keys
  var _enumBugKeys = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var _objectKeys = Object.keys || function keys(O) {
    return _objectKeysInternal(O, _enumBugKeys);
  };

  var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    _anObject(O);
    var keys = _objectKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
    return O;
  };

  var document$2 = _global.document;
  var _html = document$2 && document$2.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



  var IE_PROTO$1 = _sharedKey('IE_PROTO');
  var Empty = function () { /* empty */ };
  var PROTOTYPE$1 = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = _domCreate('iframe');
    var i = _enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    _html.appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
    return createDict();
  };

  var _objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE$1] = _anObject(O);
      result = new Empty();
      Empty[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : _objectDps(result, Properties);
  };

  var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
  });

  var def = _objectDp.f;

  var TAG = _wks('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
  };

  var IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  _hide(IteratorPrototype, _wks('iterator'), function () { return this; });

  var _iterCreate = function (Constructor, NAME, next) {
    Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
    _setToStringTag(Constructor, NAME + ' Iterator');
  };

  // 7.1.13 ToObject(argument)

  var _toObject = function (it) {
    return Object(_defined(it));
  };

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$2 = _sharedKey('IE_PROTO');
  var ObjectProto = Object.prototype;

  var _objectGpo = Object.getPrototypeOf || function (O) {
    O = _toObject(O);
    if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  };

  var ITERATOR = _wks('iterator');
  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function () { return this; };

  var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    _iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS: return function keys() { return new Constructor(this, kind); };
        case VALUES: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = _objectGpo($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        _setToStringTag(IteratorPrototype, TAG, true);
        // fix for some old engines
        if ( typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if ( (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      _hide(proto, ITERATOR, $default);
    }
    // Plug for library
    _iterators[NAME] = $default;
    _iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) _redefine(proto, key, methods[key]);
      } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };

  var $at = _stringAt(true);

  // 21.1.3.27 String.prototype[@@iterator]()
  _iterDefine(String, 'String', function (iterated) {
    this._t = String(iterated); // target
    this._i = 0;                // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var index = this._i;
    var point;
    if (index >= O.length) return { value: undefined, done: true };
    point = $at(O, index);
    this._i += point.length;
    return { value: point, done: false };
  });

  // call something on iterator step with safe closing on error

  var _iterCall = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) _anObject(ret.call(iterator));
      throw e;
    }
  };

  // check on default Array iterator

  var ITERATOR$1 = _wks('iterator');
  var ArrayProto = Array.prototype;

  var _isArrayIter = function (it) {
    return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
  };

  var _createProperty = function (object, index, value) {
    if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
    else object[index] = value;
  };

  // getting tag from 19.1.3.6 Object.prototype.toString()

  var TAG$1 = _wks('toStringTag');
  // ES3 wrong here
  var ARG = _cof(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (e) { /* empty */ }
  };

  var _classof = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
      // builtinTag case
      : ARG ? _cof(O)
      // ES3 arguments fallback
      : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

  var ITERATOR$2 = _wks('iterator');

  var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$2]
      || it['@@iterator']
      || _iterators[_classof(it)];
  };

  var ITERATOR$3 = _wks('iterator');
  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$3]();
    riter['return'] = function () { SAFE_CLOSING = true; };
    // eslint-disable-next-line no-throw-literal
    Array.from(riter, function () { throw 2; });
  } catch (e) { /* empty */ }

  var _iterDetect = function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;
    try {
      var arr = [7];
      var iter = arr[ITERATOR$3]();
      iter.next = function () { return { done: safe = true }; };
      arr[ITERATOR$3] = function () { return iter; };
      exec(arr);
    } catch (e) { /* empty */ }
    return safe;
  };

  _export(_export.S + _export.F * !_iterDetect(function (iter) { Array.from(iter); }), 'Array', {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
      var O = _toObject(arrayLike);
      var C = typeof this == 'function' ? this : Array;
      var aLen = arguments.length;
      var mapfn = aLen > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      var index = 0;
      var iterFn = core_getIteratorMethod(O);
      var length, result, step, iterator;
      if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
      // if object isn't iterable or it's array with default iterator - use simple case
      if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
        for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
          _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
        }
      } else {
        length = _toLength(O.length);
        for (result = new C(length); length > index; index++) {
          _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
        }
      }
      result.length = index;
      return result;
    }
  });

  var f$1 = _wks;

  var _wksExt = {
  	f: f$1
  };

  var defineProperty = _objectDp.f;
  var _wksDefine = function (name) {
    var $Symbol = _core.Symbol || (_core.Symbol =  _global.Symbol || {});
    if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
  };

  _wksDefine('asyncIterator');

  var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');


  var setDesc = _objectDp.f;
  var id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function (it) {
    setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {}          // weak collections IDs
    } });
  };
  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
    // return object ID
    } return it[META].i;
  };
  var getWeak = function (it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
    // return hash weak collections IDs
    } return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
  });
  var _meta_1 = _meta.KEY;
  var _meta_2 = _meta.NEED;
  var _meta_3 = _meta.fastKey;
  var _meta_4 = _meta.getWeak;
  var _meta_5 = _meta.onFreeze;

  var f$2 = Object.getOwnPropertySymbols;

  var _objectGops = {
  	f: f$2
  };

  var f$3 = {}.propertyIsEnumerable;

  var _objectPie = {
  	f: f$3
  };

  // all enumerable object keys, includes symbols



  var _enumKeys = function (it) {
    var result = _objectKeys(it);
    var getSymbols = _objectGops.f;
    if (getSymbols) {
      var symbols = getSymbols(it);
      var isEnum = _objectPie.f;
      var i = 0;
      var key;
      while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
    } return result;
  };

  // 7.2.2 IsArray(argument)

  var _isArray = Array.isArray || function isArray(arg) {
    return _cof(arg) == 'Array';
  };

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

  var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return _objectKeysInternal(O, hiddenKeys);
  };

  var _objectGopn = {
  	f: f$4
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

  var gOPN = _objectGopn.f;
  var toString$1 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return gOPN(it);
    } catch (e) {
      return windowNames.slice();
    }
  };

  var f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
  };

  var _objectGopnExt = {
  	f: f$5
  };

  var gOPD = Object.getOwnPropertyDescriptor;

  var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
    O = _toIobject(O);
    P = _toPrimitive(P, true);
    if (_ie8DomDefine) try {
      return gOPD(O, P);
    } catch (e) { /* empty */ }
    if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
  };

  var _objectGopd = {
  	f: f$6
  };

  // ECMAScript 6 symbols shim





  var META = _meta.KEY;





















  var gOPD$1 = _objectGopd.f;
  var dP$1 = _objectDp.f;
  var gOPN$1 = _objectGopnExt.f;
  var $Symbol = _global.Symbol;
  var $JSON = _global.JSON;
  var _stringify = $JSON && $JSON.stringify;
  var PROTOTYPE$2 = 'prototype';
  var HIDDEN = _wks('_hidden');
  var TO_PRIMITIVE = _wks('toPrimitive');
  var isEnum = {}.propertyIsEnumerable;
  var SymbolRegistry = _shared('symbol-registry');
  var AllSymbols = _shared('symbols');
  var OPSymbols = _shared('op-symbols');
  var ObjectProto$1 = Object[PROTOTYPE$2];
  var USE_NATIVE = typeof $Symbol == 'function' && !!_objectGops.f;
  var QObject = _global.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDesc = _descriptors && _fails(function () {
    return _objectCreate(dP$1({}, 'a', {
      get: function () { return dP$1(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (it, key, D) {
    var protoDesc = gOPD$1(ObjectProto$1, key);
    if (protoDesc) delete ObjectProto$1[key];
    dP$1(it, key, D);
    if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
  } : dP$1;

  var wrap = function (tag) {
    var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
    sym._k = tag;
    return sym;
  };

  var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return it instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
    _anObject(it);
    key = _toPrimitive(key, true);
    _anObject(D);
    if (_has(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
        D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
      } return setSymbolDesc(it, key, D);
    } return dP$1(it, key, D);
  };
  var $defineProperties = function defineProperties(it, P) {
    _anObject(it);
    var keys = _enumKeys(P = _toIobject(P));
    var i = 0;
    var l = keys.length;
    var key;
    while (l > i) $defineProperty(it, key = keys[i++], P[key]);
    return it;
  };
  var $create = function create(it, P) {
    return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
  };
  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = isEnum.call(this, key = _toPrimitive(key, true));
    if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
    return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };
  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    it = _toIobject(it);
    key = _toPrimitive(key, true);
    if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
    var D = gOPD$1(it, key);
    if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
    return D;
  };
  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = gOPN$1(_toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
    } return result;
  };
  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectProto$1;
    var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
    } return result;
  };

  // 19.4.1.1 Symbol([description])
  if (!USE_NATIVE) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
      var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
      var $set = function (value) {
        if (this === ObjectProto$1) $set.call(OPSymbols, value);
        if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDesc(this, tag, _propertyDesc(1, value));
      };
      if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
      return wrap(tag);
    };
    _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
      return this._k;
    });

    _objectGopd.f = $getOwnPropertyDescriptor;
    _objectDp.f = $defineProperty;
    _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
    _objectPie.f = $propertyIsEnumerable;
    _objectGops.f = $getOwnPropertySymbols;

    if (_descriptors && !_library) {
      _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }

    _wksExt.f = function (name) {
      return wrap(_wks(name));
    };
  }

  _export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

  for (var es6Symbols = (
    // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

  for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

  _export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
    // 19.4.2.1 Symbol.for(key)
    'for': function (key) {
      return _has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = $Symbol(key);
    },
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
      for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
    },
    useSetter: function () { setter = true; },
    useSimple: function () { setter = false; }
  });

  _export(_export.S + _export.F * !USE_NATIVE, 'Object', {
    // 19.1.2.2 Object.create(O [, Properties])
    create: $create,
    // 19.1.2.4 Object.defineProperty(O, P, Attributes)
    defineProperty: $defineProperty,
    // 19.1.2.3 Object.defineProperties(O, Properties)
    defineProperties: $defineProperties,
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: $getOwnPropertyNames,
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  var FAILS_ON_PRIMITIVES = _fails(function () { _objectGops.f(1); });

  _export(_export.S + _export.F * FAILS_ON_PRIMITIVES, 'Object', {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      return _objectGops.f(_toObject(it));
    }
  });

  // 24.3.2 JSON.stringify(value [, replacer [, space]])
  $JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
    var S = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    // WebKit converts symbol values to JSON as null
    // V8 throws on boxed symbols
    return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
  })), 'JSON', {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;
      while (arguments.length > i) args.push(arguments[i++]);
      $replacer = replacer = args[1];
      if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!_isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return _stringify.apply($JSON, args);
    }
  });

  // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
  $Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
  // 19.4.3.5 Symbol.prototype[@@toStringTag]
  _setToStringTag($Symbol, 'Symbol');
  // 20.2.1.9 Math[@@toStringTag]
  _setToStringTag(Math, 'Math', true);
  // 24.3.3 JSON[@@toStringTag]
  _setToStringTag(_global.JSON, 'JSON', true);

  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = _wks('unscopables');
  var ArrayProto$1 = Array.prototype;
  if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});
  var _addToUnscopables = function (key) {
    ArrayProto$1[UNSCOPABLES][key] = true;
  };

  var _iterStep = function (done, value) {
    return { value: value, done: !!done };
  };

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
    this._t = _toIobject(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep(1);
    }
    if (kind == 'keys') return _iterStep(0, index);
    if (kind == 'values') return _iterStep(0, O[index]);
    return _iterStep(0, [index, O[index]]);
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  _iterators.Arguments = _iterators.Array;

  _addToUnscopables('keys');
  _addToUnscopables('values');
  _addToUnscopables('entries');

  var ITERATOR$4 = _wks('iterator');
  var TO_STRING_TAG = _wks('toStringTag');
  var ArrayValues = _iterators.Array;

  var DOMIterables = {
    CSSRuleList: true, // TODO: Not spec compliant, should be false.
    CSSStyleDeclaration: false,
    CSSValueList: false,
    ClientRectList: false,
    DOMRectList: false,
    DOMStringList: false,
    DOMTokenList: true,
    DataTransferItemList: false,
    FileList: false,
    HTMLAllCollection: false,
    HTMLCollection: false,
    HTMLFormElement: false,
    HTMLSelectElement: false,
    MediaList: true, // TODO: Not spec compliant, should be false.
    MimeTypeArray: false,
    NamedNodeMap: false,
    NodeList: true,
    PaintRequestList: false,
    Plugin: false,
    PluginArray: false,
    SVGLengthList: false,
    SVGNumberList: false,
    SVGPathSegList: false,
    SVGPointList: false,
    SVGStringList: false,
    SVGTransformList: false,
    SourceBufferList: false,
    StyleSheetList: true, // TODO: Not spec compliant, should be false.
    TextTrackCueList: false,
    TextTrackList: false,
    TouchList: false
  };

  for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
    var NAME = collections[i];
    var explicit = DOMIterables[NAME];
    var Collection = _global[NAME];
    var proto = Collection && Collection.prototype;
    var key;
    if (proto) {
      if (!proto[ITERATOR$4]) _hide(proto, ITERATOR$4, ArrayValues);
      if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
      _iterators[NAME] = ArrayValues;
      if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
    }
  }

  // 22.1.2.2 / 15.4.3.2 Array.isArray(arg)


  _export(_export.S, 'Array', { isArray: _isArray });

  var SPECIES = _wks('species');

  var _arraySpeciesConstructor = function (original) {
    var C;
    if (_isArray(original)) {
      C = original.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
      if (_isObject(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    } return C === undefined ? Array : C;
  };

  // 9.4.2.3 ArraySpeciesCreate(originalArray, length)


  var _arraySpeciesCreate = function (original, length) {
    return new (_arraySpeciesConstructor(original))(length);
  };

  // 0 -> Array#forEach
  // 1 -> Array#map
  // 2 -> Array#filter
  // 3 -> Array#some
  // 4 -> Array#every
  // 5 -> Array#find
  // 6 -> Array#findIndex





  var _arrayMethods = function (TYPE, $create) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    var create = $create || _arraySpeciesCreate;
    return function ($this, callbackfn, that) {
      var O = _toObject($this);
      var self = _iobject(O);
      var f = _ctx(callbackfn, that, 3);
      var length = _toLength(self.length);
      var index = 0;
      var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var val, res;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res;   // map
          else if (res) switch (TYPE) {
            case 3: return true;             // some
            case 5: return val;              // find
            case 6: return index;            // findIndex
            case 2: result.push(val);        // filter
          } else if (IS_EVERY) return false; // every
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
    };
  };

  var _strictMethod = function (method, arg) {
    return !!method && _fails(function () {
      // eslint-disable-next-line no-useless-call
      arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
    });
  };

  var $forEach = _arrayMethods(0);
  var STRICT = _strictMethod([].forEach, true);

  _export(_export.P + _export.F * !STRICT, 'Array', {
    // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
    forEach: function forEach(callbackfn /* , thisArg */) {
      return $forEach(this, callbackfn, arguments[1]);
    }
  });

  var _arrayFill = function fill(value /* , start = 0, end = @length */) {
    var O = _toObject(this);
    var length = _toLength(O.length);
    var aLen = arguments.length;
    var index = _toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
    var end = aLen > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : _toAbsoluteIndex(end, length);
    while (endPos > index) O[index++] = value;
    return O;
  };

  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


  _export(_export.P, 'Array', { fill: _arrayFill });

  _addToUnscopables('fill');

  var $map = _arrayMethods(1);

  _export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
    // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
    map: function map(callbackfn /* , thisArg */) {
      return $map(this, callbackfn, arguments[1]);
    }
  });

  // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

  var $find = _arrayMethods(6);
  var KEY = 'findIndex';
  var forced = true;
  // Shouldn't skip holes
  if (KEY in []) Array(1)[KEY](function () { forced = false; });
  _export(_export.P + _export.F * forced, 'Array', {
    findIndex: function findIndex(callbackfn /* , that = undefined */) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });
  _addToUnscopables(KEY);

  var _arrayReduce = function (that, callbackfn, aLen, memo, isRight) {
    _aFunction(callbackfn);
    var O = _toObject(that);
    var self = _iobject(O);
    var length = _toLength(O.length);
    var index = isRight ? length - 1 : 0;
    var i = isRight ? -1 : 1;
    if (aLen < 2) for (;;) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (isRight ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };

  _export(_export.P + _export.F * !_strictMethod([].reduce, true), 'Array', {
    // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
    reduce: function reduce(callbackfn /* , initialValue */) {
      return _arrayReduce(this, callbackfn, arguments.length, arguments[1], false);
    }
  });

  // 21.2.5.3 get RegExp.prototype.flags

  var _flags = function () {
    var that = _anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // 21.2.5.3 get RegExp.prototype.flags()
  if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
    configurable: true,
    get: _flags
  });

  var TO_STRING = 'toString';
  var $toString = /./[TO_STRING];

  var define = function (fn) {
    _redefine(RegExp.prototype, TO_STRING, fn, true);
  };

  // 21.2.5.14 RegExp.prototype.toString()
  if (_fails(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
    define(function toString() {
      var R = _anObject(this);
      return '/'.concat(R.source, '/',
        'flags' in R ? R.flags : !_descriptors && R instanceof RegExp ? _flags.call(R) : undefined);
    });
  // FF44- RegExp#toString has a wrong name
  } else if ($toString.name != TO_STRING) {
    define(function toString() {
      return $toString.call(this);
    });
  }

  var DateProto = Date.prototype;
  var INVALID_DATE = 'Invalid Date';
  var TO_STRING$1 = 'toString';
  var $toString$1 = DateProto[TO_STRING$1];
  var getTime = DateProto.getTime;
  if (new Date(NaN) + '' != INVALID_DATE) {
    _redefine(DateProto, TO_STRING$1, function toString() {
      var value = getTime.call(this);
      // eslint-disable-next-line no-self-compare
      return value === value ? $toString$1.call(this) : INVALID_DATE;
    });
  }

  // 19.1.3.6 Object.prototype.toString()

  var test = {};
  test[_wks('toStringTag')] = 'z';
  if (test + '' != '[object z]') {
    _redefine(Object.prototype, 'toString', function toString() {
      return '[object ' + _classof(this) + ']';
    }, true);
  }

  var $filter = _arrayMethods(2);

  _export(_export.P + _export.F * !_strictMethod([].filter, true), 'Array', {
    // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments[1]);
    }
  });

  var util = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.deepClone = deepClone;
  exports.eliminateBlur = eliminateBlur;
  exports.checkPointIsInCircle = checkPointIsInCircle;
  exports.getTwoPointDistance = getTwoPointDistance;
  exports.checkPointIsInPolygon = checkPointIsInPolygon;
  exports.checkPointIsInSector = checkPointIsInSector;
  exports.checkPointIsNearPolyline = checkPointIsNearPolyline;
  exports.checkPointIsInRect = checkPointIsInRect;
  exports.getRotatePointPos = getRotatePointPos;
  exports.getScalePointPos = getScalePointPos;
  exports.getTranslatePointPos = getTranslatePointPos;
  exports.getDistanceBetweenPointAndLine = getDistanceBetweenPointAndLine;
  exports.getCircleRadianPoint = getCircleRadianPoint;
  exports.getRegularPolygonPoints = getRegularPolygonPoints;
  exports.filterNull = filterNull;
  exports["default"] = void 0;

























  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var abs = Math.abs,
      sqrt = Math.sqrt,
      sin = Math.sin,
      cos = Math.cos,
      max = Math.max,
      min = Math.min,
      PI = Math.PI;
  /**
   * @description Clone an object or array
   * @param {Object|Array} object Cloned object
   * @param {Boolean} recursion   Whether to use recursive cloning
   * @return {Object|Array} Clone object
   */

  function deepClone(object) {
    var recursion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var parse = JSON.parse,
        stringify = JSON.stringify;
    if (!recursion) return parse(stringify(object));
    var clonedObj = object instanceof Array ? [] : {};

    if (object && _typeof(object) === 'object') {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          if (object[key] && _typeof(object[key]) === 'object') {
            clonedObj[key] = deepClone(object[key], true);
          } else {
            clonedObj[key] = object[key];
          }
        }
      }
    }

    return clonedObj;
  }
  /**
   * @description Eliminate line blur due to 1px line width
   * @param {Array} points Line points
   * @return {Array} Line points after processed
   */


  function eliminateBlur(points) {
    return points.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      return [parseInt(x) + 0.5, parseInt(y) + 0.5];
    });
  }
  /**
   * @description Check if the point is inside the circle
   * @param {Array} point Postion of point
   * @param {Number} rx   Circle x coordinate
   * @param {Number} ry   Circle y coordinate
   * @param {Number} r    Circle radius
   * @return {Boolean} Result of check
   */


  function checkPointIsInCircle(point, rx, ry, r) {
    return getTwoPointDistance(point, [rx, ry]) <= r;
  }
  /**
   * @description Get the distance between two points
   * @param {Array} point1 point1
   * @param {Array} point2 point2
   * @return {Number} Distance between two points
   */


  function getTwoPointDistance(_ref3, _ref4) {
    var _ref5 = _slicedToArray(_ref3, 2),
        xa = _ref5[0],
        ya = _ref5[1];

    var _ref6 = _slicedToArray(_ref4, 2),
        xb = _ref6[0],
        yb = _ref6[1];

    var minusX = abs(xa - xb);
    var minusY = abs(ya - yb);
    return sqrt(minusX * minusX + minusY * minusY);
  }
  /**
   * @description Check if the point is inside the polygon
   * @param {Array} point  Postion of point
   * @param {Array} points The points that makes up a polyline
   * @return {Boolean} Result of check
   */


  function checkPointIsInPolygon(point, polygon) {
    var counter = 0;

    var _point = _slicedToArray(point, 2),
        x = _point[0],
        y = _point[1];

    var pointNum = polygon.length;

    for (var i = 1, p1 = polygon[0]; i <= pointNum; i++) {
      var p2 = polygon[i % pointNum];

      if (x > min(p1[0], p2[0]) && x <= max(p1[0], p2[0])) {
        if (y <= max(p1[1], p2[1])) {
          if (p1[0] !== p2[0]) {
            var xinters = (x - p1[0]) * (p2[1] - p1[1]) / (p2[0] - p1[0]) + p1[1];

            if (p1[1] === p2[1] || y <= xinters) {
              counter++;
            }
          }
        }
      }

      p1 = p2;
    }

    return counter % 2 === 1;
  }
  /**
   * @description Check if the point is inside the sector
   * @param {Array} point       Postion of point
   * @param {Number} rx         Sector x coordinate
   * @param {Number} ry         Sector y coordinate
   * @param {Number} r          Sector radius
   * @param {Number} startAngle Sector start angle
   * @param {Number} endAngle   Sector end angle
   * @param {Boolean} clockWise Whether the sector angle is clockwise
   * @return {Boolean} Result of check
   */


  function checkPointIsInSector(point, rx, ry, r, startAngle, endAngle, clockWise) {
    if (!point) return false;
    if (getTwoPointDistance(point, [rx, ry]) > r) return false;

    if (!clockWise) {
      var _deepClone = deepClone([endAngle, startAngle]);

      var _deepClone2 = _slicedToArray(_deepClone, 2);

      startAngle = _deepClone2[0];
      endAngle = _deepClone2[1];
    }

    var reverseBE = startAngle > endAngle;

    if (reverseBE) {
      var _ref7 = [endAngle, startAngle];
      startAngle = _ref7[0];
      endAngle = _ref7[1];
    }

    var minus = endAngle - startAngle;
    if (minus >= PI * 2) return true;

    var _point2 = _slicedToArray(point, 2),
        x = _point2[0],
        y = _point2[1];

    var _getCircleRadianPoint = getCircleRadianPoint(rx, ry, r, startAngle),
        _getCircleRadianPoint2 = _slicedToArray(_getCircleRadianPoint, 2),
        bx = _getCircleRadianPoint2[0],
        by = _getCircleRadianPoint2[1];

    var _getCircleRadianPoint3 = getCircleRadianPoint(rx, ry, r, endAngle),
        _getCircleRadianPoint4 = _slicedToArray(_getCircleRadianPoint3, 2),
        ex = _getCircleRadianPoint4[0],
        ey = _getCircleRadianPoint4[1];

    var vPoint = [x - rx, y - ry];
    var vBArm = [bx - rx, by - ry];
    var vEArm = [ex - rx, ey - ry];
    var reverse = minus > PI;

    if (reverse) {
      var _deepClone3 = deepClone([vEArm, vBArm]);

      var _deepClone4 = _slicedToArray(_deepClone3, 2);

      vBArm = _deepClone4[0];
      vEArm = _deepClone4[1];
    }

    var inSector = isClockWise(vBArm, vPoint) && !isClockWise(vEArm, vPoint);
    if (reverse) inSector = !inSector;
    if (reverseBE) inSector = !inSector;
    return inSector;
  }
  /**
   * @description Determine if the point is in the clockwise direction of the vector
   * @param {Array} vArm   Vector
   * @param {Array} vPoint Point
   * @return {Boolean} Result of check
   */


  function isClockWise(vArm, vPoint) {
    var _vArm = _slicedToArray(vArm, 2),
        ax = _vArm[0],
        ay = _vArm[1];

    var _vPoint = _slicedToArray(vPoint, 2),
        px = _vPoint[0],
        py = _vPoint[1];

    return -ay * px + ax * py > 0;
  }
  /**
   * @description Check if the point is inside the polyline
   * @param {Array} point      Postion of point
   * @param {Array} polyline   The points that makes up a polyline
   * @param {Number} lineWidth Polyline linewidth
   * @return {Boolean} Result of check
   */


  function checkPointIsNearPolyline(point, polyline, lineWidth) {
    var halfLineWidth = lineWidth / 2;
    var moveUpPolyline = polyline.map(function (_ref8) {
      var _ref9 = _slicedToArray(_ref8, 2),
          x = _ref9[0],
          y = _ref9[1];

      return [x, y - halfLineWidth];
    });
    var moveDownPolyline = polyline.map(function (_ref10) {
      var _ref11 = _slicedToArray(_ref10, 2),
          x = _ref11[0],
          y = _ref11[1];

      return [x, y + halfLineWidth];
    });
    var polygon = [].concat(_toConsumableArray(moveUpPolyline), _toConsumableArray(moveDownPolyline.reverse()));
    return checkPointIsInPolygon(point, polygon);
  }
  /**
   * @description Check if the point is inside the rect
   * @param {Array} point   Postion of point
   * @param {Number} x      Rect start x coordinate
   * @param {Number} y      Rect start y coordinate
   * @param {Number} width  Rect width
   * @param {Number} height Rect height
   * @return {Boolean} Result of check
   */


  function checkPointIsInRect(_ref12, x, y, width, height) {
    var _ref13 = _slicedToArray(_ref12, 2),
        px = _ref13[0],
        py = _ref13[1];

    if (px < x) return false;
    if (py < y) return false;
    if (px > x + width) return false;
    if (py > y + height) return false;
    return true;
  }
  /**
   * @description Get the coordinates of the rotated point
   * @param {Number} rotate Degree of rotation
   * @param {Array} point   Postion of point
   * @param {Array} origin  Rotation center
   * @param {Array} origin  Rotation center
   * @return {Number} Coordinates after rotation
   */


  function getRotatePointPos() {
    var rotate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var point = arguments.length > 1 ? arguments[1] : undefined;
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    if (!point) return false;
    if (rotate % 360 === 0) return point;

    var _point3 = _slicedToArray(point, 2),
        x = _point3[0],
        y = _point3[1];

    var _origin = _slicedToArray(origin, 2),
        ox = _origin[0],
        oy = _origin[1];

    rotate *= PI / 180;
    return [(x - ox) * cos(rotate) - (y - oy) * sin(rotate) + ox, (x - ox) * sin(rotate) + (y - oy) * cos(rotate) + oy];
  }
  /**
   * @description Get the coordinates of the scaled point
   * @param {Array} scale  Scale factor
   * @param {Array} point  Postion of point
   * @param {Array} origin Scale center
   * @return {Number} Coordinates after scale
   */


  function getScalePointPos() {
    var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 1];
    var point = arguments.length > 1 ? arguments[1] : undefined;
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    if (!point) return false;
    if (scale === 1) return point;

    var _point4 = _slicedToArray(point, 2),
        x = _point4[0],
        y = _point4[1];

    var _origin2 = _slicedToArray(origin, 2),
        ox = _origin2[0],
        oy = _origin2[1];

    var _scale = _slicedToArray(scale, 2),
        xs = _scale[0],
        ys = _scale[1];

    var relativePosX = x - ox;
    var relativePosY = y - oy;
    return [relativePosX * xs + ox, relativePosY * ys + oy];
  }
  /**
   * @description Get the coordinates of the scaled point
   * @param {Array} translate Translation distance
   * @param {Array} point     Postion of point
   * @return {Number} Coordinates after translation
   */


  function getTranslatePointPos(translate, point) {
    if (!translate || !point) return false;

    var _point5 = _slicedToArray(point, 2),
        x = _point5[0],
        y = _point5[1];

    var _translate = _slicedToArray(translate, 2),
        tx = _translate[0],
        ty = _translate[1];

    return [x + tx, y + ty];
  }
  /**
   * @description Get the distance from the point to the line
   * @param {Array} point     Postion of point
   * @param {Array} lineBegin Line start position
   * @param {Array} lineEnd   Line end position
   * @return {Number} Distance between point and line
   */


  function getDistanceBetweenPointAndLine(point, lineBegin, lineEnd) {
    if (!point || !lineBegin || !lineEnd) return false;

    var _point6 = _slicedToArray(point, 2),
        x = _point6[0],
        y = _point6[1];

    var _lineBegin = _slicedToArray(lineBegin, 2),
        x1 = _lineBegin[0],
        y1 = _lineBegin[1];

    var _lineEnd = _slicedToArray(lineEnd, 2),
        x2 = _lineEnd[0],
        y2 = _lineEnd[1];

    var a = y2 - y1;
    var b = x1 - x2;
    var c = y1 * (x2 - x1) - x1 * (y2 - y1);
    var molecule = abs(a * x + b * y + c);
    var denominator = sqrt(a * a + b * b);
    return molecule / denominator;
  }
  /**
   * @description Get the coordinates of the specified radian on the circle
   * @param {Number} x      Circle x coordinate
   * @param {Number} y      Circle y coordinate
   * @param {Number} radius Circle radius
   * @param {Number} radian Specfied radian
   * @return {Array} Postion of point
   */


  function getCircleRadianPoint(x, y, radius, radian) {
    return [x + cos(radian) * radius, y + sin(radian) * radius];
  }
  /**
   * @description Get the points that make up a regular polygon
   * @param {Number} x     X coordinate of the polygon inscribed circle
   * @param {Number} y     Y coordinate of the polygon inscribed circle
   * @param {Number} r     Radius of the polygon inscribed circle
   * @param {Number} side  Side number
   * @param {Number} minus Radian offset
   * @return {Array} Points that make up a regular polygon
   */


  function getRegularPolygonPoints(rx, ry, r, side) {
    var minus = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PI * -0.5;
    var radianGap = PI * 2 / side;
    var radians = new Array(side).fill('').map(function (t, i) {
      return i * radianGap + minus;
    });
    return radians.map(function (radian) {
      return getCircleRadianPoint(rx, ry, r, radian);
    });
  }
  /**
   * @description Filter array nulls (''|false|null|undefined)
   * @param {Array} arr The array to be filtered
   * @return {Array} Filtered array
   */


  function filterNull(arr) {
    return arr.filter(function (v) {
      return v || v === 0;
    });
  }

  var _default = {
    deepClone: deepClone,
    eliminateBlur: eliminateBlur,
    checkPointIsInCircle: checkPointIsInCircle,
    checkPointIsInPolygon: checkPointIsInPolygon,
    checkPointIsInSector: checkPointIsInSector,
    checkPointIsNearPolyline: checkPointIsNearPolyline,
    getTwoPointDistance: getTwoPointDistance,
    getRotatePointPos: getRotatePointPos,
    getScalePointPos: getScalePointPos,
    getTranslatePointPos: getTranslatePointPos,
    getCircleRadianPoint: getCircleRadianPoint,
    getRegularPolygonPoints: getRegularPolygonPoints,
    getDistanceBetweenPointAndLine: getDistanceBetweenPointAndLine
  };
  exports["default"] = _default;
  });

  unwrapExports(util);
  var util_1 = util.deepClone;
  var util_2 = util.eliminateBlur;
  var util_3 = util.checkPointIsInCircle;
  var util_4 = util.getTwoPointDistance;
  var util_5 = util.checkPointIsInPolygon;
  var util_6 = util.checkPointIsInSector;
  var util_7 = util.checkPointIsNearPolyline;
  var util_8 = util.checkPointIsInRect;
  var util_9 = util.getRotatePointPos;
  var util_10 = util.getScalePointPos;
  var util_11 = util.getTranslatePointPos;
  var util_12 = util.getDistanceBetweenPointAndLine;
  var util_13 = util.getCircleRadianPoint;
  var util_14 = util.getRegularPolygonPoints;
  var util_15 = util.filterNull;

  var util$1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.filterNonNumber = filterNonNumber;
  exports.deepMerge = deepMerge;
  exports.mulAdd = mulAdd;
  exports.mergeSameStackData = mergeSameStackData;
  exports.getTwoPointDistance = getTwoPointDistance;
  exports.getLinearGradientColor = getLinearGradientColor;
  exports.getPolylineLength = getPolylineLength;
  exports.getPointToLineDistance = getPointToLineDistance;
  exports.initNeedSeries = initNeedSeries;
  exports.radianToAngle = radianToAngle;

































  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function filterNonNumber(array) {
    return array.filter(function (n) {
      return typeof n === 'number';
    });
  }

  function deepMerge(target, merged) {
    for (var key in merged) {
      target[key] = target[key] && target[key].toString() === "[object Object]" ? deepMerge(target[key], merged[key]) : target[key] = merged[key];
    }

    return target;
  }

  function mulAdd(nums) {
    nums = filterNonNumber(nums);
    return nums.reduce(function (all, num) {
      return all + num;
    }, 0);
  }

  function mergeSameStackData(item, series) {
    var stack = item.stack;
    if (!stack) return _toConsumableArray(item.data);
    var stacks = series.filter(function (_ref) {
      var s = _ref.stack;
      return s === stack;
    });
    var index = stacks.findIndex(function (_ref2) {
      var d = _ref2.data;
      return d === item.data;
    });
    var datas = stacks.splice(0, index + 1).map(function (_ref3) {
      var data = _ref3.data;
      return data;
    });
    var dataLength = datas[0].length;
    return new Array(dataLength).fill(0).map(function (foo, i) {
      return mulAdd(datas.map(function (d) {
        return d[i];
      }));
    });
  }

  function getTwoPointDistance(pointOne, pointTwo) {
    var minusX = Math.abs(pointOne[0] - pointTwo[0]);
    var minusY = Math.abs(pointOne[1] - pointTwo[1]);
    return Math.sqrt(minusX * minusX + minusY * minusY);
  }

  function getLinearGradientColor(ctx, begin, end, color) {
    if (!ctx || !begin || !end || !color.length) return;
    var colors = color;
    typeof colors === 'string' && (colors = [color, color]);
    var linearGradientColor = ctx.createLinearGradient.apply(ctx, _toConsumableArray(begin).concat(_toConsumableArray(end)));
    var colorGap = 1 / (colors.length - 1);
    colors.forEach(function (c, i) {
      return linearGradientColor.addColorStop(colorGap * i, c);
    });
    return linearGradientColor;
  }

  function getPolylineLength(points) {
    var lineSegments = new Array(points.length - 1).fill(0).map(function (foo, i) {
      return [points[i], points[i + 1]];
    });
    var lengths = lineSegments.map(function (item) {
      return getTwoPointDistance.apply(void 0, _toConsumableArray(item));
    });
    return mulAdd(lengths);
  }

  function getPointToLineDistance(point, linePointOne, linePointTwo) {
    var a = getTwoPointDistance(point, linePointOne);
    var b = getTwoPointDistance(point, linePointTwo);
    var c = getTwoPointDistance(linePointOne, linePointTwo);
    return 0.5 * Math.sqrt((a + b + c) * (a + b - c) * (a + c - b) * (b + c - a)) / c;
  }

  function initNeedSeries(series, config, type) {
    series = series.filter(function (_ref4) {
      var st = _ref4.type;
      return st === type;
    });
    series = series.map(function (item) {
      return deepMerge((0, util.deepClone)(config, true), item);
    });
    return series.filter(function (_ref5) {
      var show = _ref5.show;
      return show;
    });
  }

  function radianToAngle(radian) {
    return radian / Math.PI * 180;
  }
  });

  unwrapExports(util$1);
  var util_1$1 = util$1.filterNonNumber;
  var util_2$1 = util$1.deepMerge;
  var util_3$1 = util$1.mulAdd;
  var util_4$1 = util$1.mergeSameStackData;
  var util_5$1 = util$1.getTwoPointDistance;
  var util_6$1 = util$1.getLinearGradientColor;
  var util_7$1 = util$1.getPolylineLength;
  var util_8$1 = util$1.getPointToLineDistance;
  var util_9$1 = util$1.initNeedSeries;
  var util_10$1 = util$1.radianToAngle;

  //
  var script$g = {
    name: 'DvDecoration5',
    mixins: [autoResize],

    data() {
      return {
        ref: 'decoration-5',
        line1Points: '',
        line2Points: '',
        line1Length: 0,
        line2Length: 0
      };
    },

    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          width,
          height
        } = this;
        let line1Points = [[0, height * 0.2], [width * 0.18, height * 0.2], [width * 0.2, height * 0.4], [width * 0.25, height * 0.4], [width * 0.27, height * 0.6], [width * 0.72, height * 0.6], [width * 0.75, height * 0.4], [width * 0.8, height * 0.4], [width * 0.82, height * 0.2], [width, height * 0.2]];
        let line2Points = [[width * 0.3, height * 0.8], [width * 0.7, height * 0.8]];
        const line1Length = util_7$1(line1Points);
        const line2Length = util_7$1(line2Points);
        line1Points = line1Points.map(point => point.join(',')).join(' ');
        line2Points = line2Points.map(point => point.join(',')).join(' ');
        this.line1Points = line1Points;
        this.line2Points = line2Points;
        this.line1Length = line1Length;
        this.line2Length = line2Length;
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      }

    }
  };

  /* script */
  const __vue_script__$g = script$g;

  /* template */
  var __vue_render__$g = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-5" }, [
      _c("svg", { attrs: { width: _vm.width, height: _vm.height } }, [
        _c(
          "polyline",
          {
            attrs: {
              fill: "transparent",
              stroke: "#3f96a5",
              "stroke-width": "3",
              points: _vm.line1Points
            }
          },
          [
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                attributeType: "XML",
                from: "0, " + _vm.line1Length / 2 + ", 0, " + _vm.line1Length / 2,
                to: "0, 0, " + _vm.line1Length + ", 0",
                dur: "1.2s",
                begin: "0s",
                calcMode: "spline",
                keyTimes: "0;1",
                keySplines: "0.4,1,0.49,0.98",
                repeatCount: "indefinite"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "polyline",
          {
            attrs: {
              fill: "transparent",
              stroke: "#3f96a5",
              "stroke-width": "2",
              points: _vm.line2Points
            }
          },
          [
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                attributeType: "XML",
                from: "0, " + _vm.line2Length / 2 + ", 0, " + _vm.line2Length / 2,
                to: "0, 0, " + _vm.line2Length + ", 0",
                dur: "1.2s",
                begin: "0s",
                calcMode: "spline",
                keyTimes: "0;1",
                keySplines: ".4,1,.49,.98",
                repeatCount: "indefinite"
              }
            })
          ]
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$g = [];
  __vue_render__$g._withStripped = true;

    /* style */
    const __vue_inject_styles__$g = function (inject) {
      if (!inject) return
      inject("data-v-77cc82b8_0", { source: ".dv-decoration-5 {\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-decoration-5 {\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$g = undefined;
    /* module identifier */
    const __vue_module_identifier__$g = undefined;
    /* functional template */
    const __vue_is_functional_template__$g = false;
    /* style inject SSR */
    

    
    var Decoration5 = normalizeComponent_1(
      { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
      __vue_inject_styles__$g,
      __vue_script__$g,
      __vue_scope_id__$g,
      __vue_is_functional_template__$g,
      __vue_module_identifier__$g,
      browser,
      undefined
    );

  function decoration5 (Vue) {
    Vue.component(Decoration5.name, Decoration5);
  }

  //
  var script$h = {
    name: 'DvDecoration6',
    mixins: [autoResize],

    data() {
      const rectWidth = 7;
      return {
        ref: 'decoration-6',
        svgWH: [300, 35],
        svgScale: [1, 1],
        rowNum: 1,
        rowPoints: 40,
        rectWidth,
        halfRectWidth: rectWidth / 2,
        points: [],
        heights: [],
        minHeights: [],
        randoms: []
      };
    },

    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          calcPointsPosition,
          calcScale
        } = this;
        calcPointsPosition();
        calcScale();
      },

      calcPointsPosition() {
        const {
          svgWH,
          rowNum,
          rowPoints
        } = this;
        const [w, h] = svgWH;
        const horizontalGap = w / (rowPoints + 1);
        const verticalGap = h / (rowNum + 1);
        let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
        this.points = points.reduce((all, item) => [...all, ...item], []);
        const heights = this.heights = new Array(rowNum * rowPoints).fill(0).map(foo => Math.random() > 0.8 ? randomExtend(0.7 * h, h) : randomExtend(0.2 * h, 0.5 * h));
        this.minHeights = new Array(rowNum * rowPoints).fill(0).map((foo, i) => heights[i] * Math.random());
        this.randoms = new Array(rowNum * rowPoints).fill(0).map(foo => Math.random() + 1.5);
      },

      calcScale() {
        const {
          width,
          height,
          svgWH
        } = this;
        const [w, h] = svgWH;
        this.svgScale = [width / w, height / h];
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      }

    }
  };

  /* script */
  const __vue_script__$h = script$h;

  /* template */
  var __vue_render__$h = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-6" }, [
      _c(
        "svg",
        {
          style:
            "transform:scale(" + _vm.svgScale[0] + "," + _vm.svgScale[1] + ");",
          attrs: { width: _vm.svgWH[0] + "px", height: _vm.svgWH[1] + "px" }
        },
        [
          _vm._l(_vm.points, function(point, i) {
            return [
              _c(
                "rect",
                {
                  key: i,
                  attrs: {
                    fill: "#7acaec",
                    x: point[0] - _vm.halfRectWidth,
                    y: point[1] - _vm.heights[i] / 2,
                    width: _vm.rectWidth,
                    height: _vm.heights[i]
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "y",
                      values:
                        point[1] -
                        _vm.minHeights[i] / 2 +
                        ";" +
                        (point[1] - _vm.heights[i] / 2) +
                        ";" +
                        (point[1] - _vm.minHeights[i] / 2),
                      dur: _vm.randoms[i] + "s",
                      keyTimes: "0;0.5;1",
                      calcMode: "spline",
                      keySplines: "0.42,0,0.58,1;0.42,0,0.58,1",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "height",
                      values:
                        _vm.minHeights[i] +
                        ";" +
                        _vm.heights[i] +
                        ";" +
                        _vm.minHeights[i],
                      dur: _vm.randoms[i] + "s",
                      keyTimes: "0;0.5;1",
                      calcMode: "spline",
                      keySplines: "0.42,0,0.58,1;0.42,0,0.58,1",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              )
            ]
          })
        ],
        2
      )
    ])
  };
  var __vue_staticRenderFns__$h = [];
  __vue_render__$h._withStripped = true;

    /* style */
    const __vue_inject_styles__$h = function (inject) {
      if (!inject) return
      inject("data-v-0c456aa4_0", { source: ".dv-decoration-6 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-6 svg {\n  transform-origin: left top;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,0BAA0B;AAC5B","file":"main.vue","sourcesContent":[".dv-decoration-6 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-6 svg {\n  transform-origin: left top;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$h = undefined;
    /* module identifier */
    const __vue_module_identifier__$h = undefined;
    /* functional template */
    const __vue_is_functional_template__$h = false;
    /* style inject SSR */
    

    
    var Decoration6 = normalizeComponent_1(
      { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
      __vue_inject_styles__$h,
      __vue_script__$h,
      __vue_scope_id__$h,
      __vue_is_functional_template__$h,
      __vue_module_identifier__$h,
      browser,
      undefined
    );

  function decoration6 (Vue) {
    Vue.component(Decoration6.name, Decoration6);
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$i = {
    name: 'DvDecoration7'
  };

  /* script */
  const __vue_script__$i = script$i;

  /* template */
  var __vue_render__$i = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "dv-decoration-7" },
      [
        _c("svg", { attrs: { width: "21px", height: "20px" } }, [
          _c("polyline", {
            attrs: {
              "stroke-width": "4",
              fill: "transparent",
              stroke: "#1dc1f5",
              points: "10, 0 19, 10 10, 20"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              "stroke-width": "2",
              fill: "transparent",
              stroke: "#1dc1f5",
              points: "2, 0 11, 10 2, 20"
            }
          })
        ]),
        _vm._v(" "),
        _vm._t("default"),
        _vm._v(" "),
        _c("svg", { attrs: { width: "21px", height: "20px" } }, [
          _c("polyline", {
            attrs: {
              "stroke-width": "4",
              fill: "transparent",
              stroke: "#1dc1f5",
              points: "11, 0 2, 10 11, 20"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              "stroke-width": "2",
              fill: "transparent",
              stroke: "#1dc1f5",
              points: "19, 0 10, 10 19, 20"
            }
          })
        ])
      ],
      2
    )
  };
  var __vue_staticRenderFns__$i = [];
  __vue_render__$i._withStripped = true;

    /* style */
    const __vue_inject_styles__$i = function (inject) {
      if (!inject) return
      inject("data-v-284b76c6_0", { source: ".dv-decoration-7 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,mBAAmB;AACrB","file":"main.vue","sourcesContent":[".dv-decoration-7 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$i = undefined;
    /* module identifier */
    const __vue_module_identifier__$i = undefined;
    /* functional template */
    const __vue_is_functional_template__$i = false;
    /* style inject SSR */
    

    
    var Decoration7 = normalizeComponent_1(
      { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
      __vue_inject_styles__$i,
      __vue_script__$i,
      __vue_scope_id__$i,
      __vue_is_functional_template__$i,
      __vue_module_identifier__$i,
      browser,
      undefined
    );

  function decoration7 (Vue) {
    Vue.component(Decoration7.name, Decoration7);
  }

  //
  var script$j = {
    name: 'DvDecoration8',
    mixins: [autoResize],
    props: {
      reverse: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        ref: 'decoration-8'
      };
    },

    methods: {
      xPos(pos) {
        const {
          reverse,
          width
        } = this;
        if (!reverse) return pos;
        return width - pos;
      }

    }
  };

  /* script */
  const __vue_script__$j = script$j;

  /* template */
  var __vue_render__$j = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-8" }, [
      _c("svg", { attrs: { width: _vm.width, height: _vm.height } }, [
        _c("polyline", {
          attrs: {
            stroke: "#3f96a5",
            "stroke-width": "2",
            fill: "transparent",
            points: _vm.xPos(0) + ", 0 " + _vm.xPos(30) + ", " + _vm.height / 2
          }
        }),
        _vm._v(" "),
        _c("polyline", {
          attrs: {
            stroke: "#3f96a5",
            "stroke-width": "2",
            fill: "transparent",
            points:
              _vm.xPos(20) +
              ", 0 " +
              _vm.xPos(50) +
              ", " +
              _vm.height / 2 +
              " " +
              _vm.xPos(_vm.width) +
              ", " +
              _vm.height / 2
          }
        }),
        _vm._v(" "),
        _c("polyline", {
          attrs: {
            stroke: "#3f96a5",
            fill: "transparent",
            "stroke-width": "3",
            points:
              _vm.xPos(0) +
              ", " +
              (_vm.height - 3) +
              ", " +
              _vm.xPos(200) +
              ", " +
              (_vm.height - 3)
          }
        })
      ])
    ])
  };
  var __vue_staticRenderFns__$j = [];
  __vue_render__$j._withStripped = true;

    /* style */
    const __vue_inject_styles__$j = function (inject) {
      if (!inject) return
      inject("data-v-75375dbc_0", { source: ".dv-decoration-8 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-decoration-8 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$j = undefined;
    /* module identifier */
    const __vue_module_identifier__$j = undefined;
    /* functional template */
    const __vue_is_functional_template__$j = false;
    /* style inject SSR */
    

    
    var Decoration8 = normalizeComponent_1(
      { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
      __vue_inject_styles__$j,
      __vue_script__$j,
      __vue_scope_id__$j,
      __vue_is_functional_template__$j,
      __vue_module_identifier__$j,
      browser,
      undefined
    );

  function decoration8 (Vue) {
    Vue.component(Decoration8.name, Decoration8);
  }

  //
  var script$k = {
    name: 'DvDecoration9',
    mixins: [autoResize],

    data() {
      return {
        ref: 'decoration-9',
        polygonId: `decoration-9-polygon-${new Date().getTime()}`,
        svgWH: [100, 100],
        svgScale: [1, 1]
      };
    },

    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcScale
        } = this;
        calcScale();
      },

      calcScale() {
        const {
          width,
          height,
          svgWH
        } = this;
        const [w, h] = svgWH;
        this.svgScale = [width / w, height / h];
      },

      onResize() {
        const {
          calcScale
        } = this;
        calcScale();
      }

    }
  };

  /* script */
  const __vue_script__$k = script$k;

  /* template */
  var __vue_render__$k = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: _vm.ref, staticClass: "dv-decoration-9" },
      [
        _c(
          "svg",
          {
            style:
              "transform:scale(" + _vm.svgScale[0] + "," + _vm.svgScale[1] + ");",
            attrs: { width: _vm.svgWH[0] + "px", height: _vm.svgWH[1] + "px" }
          },
          [
            _c("defs", [
              _c("polygon", {
                attrs: {
                  id: _vm.polygonId,
                  points: "15, 46.5, 21, 47.5, 21, 52.5, 15, 53.5"
                }
              })
            ]),
            _vm._v(" "),
            _c(
              "circle",
              {
                attrs: {
                  cx: "50",
                  cy: "50",
                  r: "45",
                  fill: "transparent",
                  stroke: "rgba(3, 166, 224, 0.5)",
                  "stroke-width": "10",
                  "stroke-dasharray": "80, 100, 30, 100"
                }
              },
              [
                _c("animateTransform", {
                  attrs: {
                    attributeName: "transform",
                    type: "rotate",
                    values: "0 50 50;360 50 50",
                    dur: "3s",
                    repeatCount: "indefinite"
                  }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "circle",
              {
                attrs: {
                  cx: "50",
                  cy: "50",
                  r: "45",
                  fill: "transparent",
                  stroke: "rgba(3, 166, 224, 0.8)",
                  "stroke-width": "6",
                  "stroke-dasharray": "50, 66, 100, 66"
                }
              },
              [
                _c("animateTransform", {
                  attrs: {
                    attributeName: "transform",
                    type: "rotate",
                    values: "0 50 50;-360 50 50",
                    dur: "3s",
                    repeatCount: "indefinite"
                  }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c("circle", {
              attrs: {
                cx: "50",
                cy: "50",
                r: "38",
                fill: "transparent",
                stroke: "rgba(3, 166, 224, 0.2)",
                "stroke-width": "1",
                "stroke-dasharray": "5, 1"
              }
            }),
            _vm._v(" "),
            _vm._l(new Array(20).fill(0), function(foo, i) {
              return _c(
                "use",
                {
                  key: i,
                  attrs: {
                    "xlink:href": "#" + _vm.polygonId,
                    stroke: "rgba(3, 166, 224, 0.6)",
                    fill:
                      Math.random() > 0.4
                        ? "transparent"
                        : "rgba(3, 166, 224, 0.8)"
                  }
                },
                [
                  _c("animateTransform", {
                    attrs: {
                      attributeName: "transform",
                      type: "rotate",
                      values: "0 50 50;360 50 50",
                      dur: "3s",
                      begin: i * 0.15 + "s",
                      repeatCount: "indefinite"
                    }
                  })
                ],
                1
              )
            }),
            _vm._v(" "),
            _c("circle", {
              attrs: {
                cx: "50",
                cy: "50",
                r: "26",
                fill: "transparent",
                stroke: "rgba(3, 166, 224, 0.2)",
                "stroke-width": "1",
                "stroke-dasharray": "5, 1"
              }
            })
          ],
          2
        ),
        _vm._v(" "),
        _vm._t("default")
      ],
      2
    )
  };
  var __vue_staticRenderFns__$k = [];
  __vue_render__$k._withStripped = true;

    /* style */
    const __vue_inject_styles__$k = function (inject) {
      if (!inject) return
      inject("data-v-fd6bf3c2_0", { source: ".dv-decoration-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.dv-decoration-9 svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  transform-origin: left top;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,0BAA0B;AAC5B","file":"main.vue","sourcesContent":[".dv-decoration-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.dv-decoration-9 svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  transform-origin: left top;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$k = undefined;
    /* module identifier */
    const __vue_module_identifier__$k = undefined;
    /* functional template */
    const __vue_is_functional_template__$k = false;
    /* style inject SSR */
    

    
    var Decoration9 = normalizeComponent_1(
      { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
      __vue_inject_styles__$k,
      __vue_script__$k,
      __vue_scope_id__$k,
      __vue_is_functional_template__$k,
      __vue_module_identifier__$k,
      browser,
      undefined
    );

  function decoration9 (Vue) {
    Vue.component(Decoration9.name, Decoration9);
  }

  //
  var script$l = {
    name: 'DvDecoration10',
    mixins: [autoResize],

    data() {
      return {
        ref: 'decoration-10',
        animationId1: `d10ani1${new Date().getTime()}`,
        animationId2: `d10ani2${new Date().getTime()}`,
        animationId3: `d10ani3${new Date().getTime()}`,
        animationId4: `d10ani4${new Date().getTime()}`,
        animationId5: `d10ani5${new Date().getTime()}`,
        animationId6: `d10ani6${new Date().getTime()}`,
        animationId7: `d10ani7${new Date().getTime()}`
      };
    }

  };

  /* script */
  const __vue_script__$l = script$l;

  /* template */
  var __vue_render__$l = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-10" }, [
      _c("svg", { attrs: { width: _vm.width, height: _vm.height } }, [
        _c("polyline", {
          attrs: {
            stroke: "rgba(0, 194, 255, 0.3)",
            "stroke-width": "2",
            points:
              "0, " + _vm.height / 2 + " " + _vm.width + ", " + _vm.height / 2
          }
        }),
        _vm._v(" "),
        _c(
          "polyline",
          {
            attrs: {
              stroke: "rgba(0, 194, 255, 1)",
              "stroke-width": "2",
              points:
                "5, " +
                _vm.height / 2 +
                " " +
                (_vm.width * 0.2 - 3) +
                ", " +
                _vm.height / 2,
              "stroke-dasharray": "0, " + _vm.width * 0.2,
              fill: "freeze"
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId2,
                attributeName: "stroke-dasharray",
                values: "0, " + _vm.width * 0.2 + ";" + _vm.width * 0.2 + ", 0;",
                dur: "3s",
                begin: _vm.animationId1 + ".end",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                values: _vm.width * 0.2 + ", 0;0, " + _vm.width * 0.2,
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "polyline",
          {
            attrs: {
              stroke: "rgba(0, 194, 255, 1)",
              "stroke-width": "2",
              points:
                _vm.width * 0.2 +
                3 +
                ", " +
                _vm.height / 2 +
                " " +
                (_vm.width * 0.8 - 3) +
                ", " +
                _vm.height / 2,
              "stroke-dasharray": "0, " + _vm.width * 0.6
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId4,
                attributeName: "stroke-dasharray",
                values: "0, " + _vm.width * 0.6 + ";" + _vm.width * 0.6 + ", 0",
                dur: "3s",
                begin: _vm.animationId3 + ".end + 1s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                values: _vm.width * 0.6 + ", 0;0, " + _vm.width * 0.6,
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "polyline",
          {
            attrs: {
              stroke: "rgba(0, 194, 255, 1)",
              "stroke-width": "2",
              points:
                _vm.width * 0.8 +
                3 +
                ", " +
                _vm.height / 2 +
                " " +
                (_vm.width - 5) +
                ", " +
                _vm.height / 2,
              "stroke-dasharray": "0, " + _vm.width * 0.2
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId6,
                attributeName: "stroke-dasharray",
                values: "0, " + _vm.width * 0.2 + ";" + _vm.width * 0.2 + ", 0",
                dur: "3s",
                begin: _vm.animationId5 + ".end + 1s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                values: _vm.width * 0.2 + ", 0;0, " + _vm.width * 0.3,
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "circle",
          { attrs: { cx: "2", cy: _vm.height / 2, r: "2", fill: "#03709f" } },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId1,
                attributeName: "fill",
                values: "#03709f;#00c2ff",
                begin: "0s;" + _vm.animationId7 + ".end",
                dur: "0.3s",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: _vm.width * 0.2,
              cy: _vm.height / 2,
              r: "2",
              fill: "#03709f"
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId3,
                attributeName: "fill",
                values: "#03709f;#00c2ff",
                begin: _vm.animationId2 + ".end",
                dur: "0.3s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "fill",
                values: "#03709f;#03709f",
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: _vm.width * 0.8,
              cy: _vm.height / 2,
              r: "2",
              fill: "#03709f"
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId5,
                attributeName: "fill",
                values: "#03709f;#00c2ff",
                begin: _vm.animationId4 + ".end",
                dur: "0.3s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "fill",
                values: "#03709f;#03709f",
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: _vm.width - 2,
              cy: _vm.height / 2,
              r: "2",
              fill: "#03709f"
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId7,
                attributeName: "fill",
                values: "#03709f;#00c2ff",
                begin: _vm.animationId6 + ".end",
                dur: "0.3s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "fill",
                values: "#03709f;#03709f",
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$l = [];
  __vue_render__$l._withStripped = true;

    /* style */
    const __vue_inject_styles__$l = function (inject) {
      if (!inject) return
      inject("data-v-223a3e5b_0", { source: ".dv-decoration-10 {\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;EACZ,aAAa;AACf","file":"main.vue","sourcesContent":[".dv-decoration-10 {\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$l = undefined;
    /* module identifier */
    const __vue_module_identifier__$l = undefined;
    /* functional template */
    const __vue_is_functional_template__$l = false;
    /* style inject SSR */
    

    
    var Decoration10 = normalizeComponent_1(
      { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
      __vue_inject_styles__$l,
      __vue_script__$l,
      __vue_scope_id__$l,
      __vue_is_functional_template__$l,
      __vue_module_identifier__$l,
      browser,
      undefined
    );

  function decoration10 (Vue) {
    Vue.component(Decoration10.name, Decoration10);
  }

  // 19.1.2.1 Object.assign(target, source, ...)






  var $assign = Object.assign;

  // should work with symbols and should have deterministic property order (V8 bug)
  var _objectAssign = !$assign || _fails(function () {
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var S = Symbol();
    var K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function (k) { B[k] = k; });
    return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
    var T = _toObject(target);
    var aLen = arguments.length;
    var index = 1;
    var getSymbols = _objectGops.f;
    var isEnum = _objectPie.f;
    while (aLen > index) {
      var S = _iobject(arguments[index++]);
      var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!_descriptors || isEnum.call(S, key)) T[key] = S[key];
      }
    } return T;
  } : $assign;

  // 19.1.3.1 Object.assign(target, source)


  _export(_export.S + _export.F, 'Object', { assign: _objectAssign });

  // 7.2.8 IsRegExp(argument)


  var MATCH = _wks('match');
  var _isRegexp = function (it) {
    var isRegExp;
    return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
  };

  // 7.3.20 SpeciesConstructor(O, defaultConstructor)


  var SPECIES$1 = _wks('species');
  var _speciesConstructor = function (O, D) {
    var C = _anObject(O).constructor;
    var S;
    return C === undefined || (S = _anObject(C)[SPECIES$1]) == undefined ? D : _aFunction(S);
  };

  var at = _stringAt(true);

   // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex
  var _advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? at(S, index).length : 1);
  };

  var builtinExec = RegExp.prototype.exec;

   // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var _regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw new TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }
    if (_classof(R) !== 'RegExp') {
      throw new TypeError('RegExp#exec called on incompatible receiver');
    }
    return builtinExec.call(R, S);
  };

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var LAST_INDEX = 'lastIndex';

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/,
        re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
  })();

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

      match = nativeExec.call(re, str);

      if (UPDATES_LAST_INDEX_WRONG && match) {
        re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        // eslint-disable-next-line no-loop-func
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var _regexpExec = patchedExec;

  _export({
    target: 'RegExp',
    proto: true,
    forced: _regexpExec !== /./.exec
  }, {
    exec: _regexpExec
  });

  var SPECIES$2 = _wks('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
    // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length === 2 && result[0] === 'a' && result[1] === 'b';
  })();

  var _fixReWks = function (KEY, length, exec) {
    var SYMBOL = _wks(KEY);

    var DELEGATES_TO_SYMBOL = !_fails(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;
      re.exec = function () { execCalled = true; return null; };
      if (KEY === 'split') {
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$2] = function () { return re; };
      }
      re[SYMBOL]('');
      return !execCalled;
    }) : undefined;

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var fns = exec(
        _defined,
        SYMBOL,
        ''[KEY],
        function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
          if (regexp.exec === _regexpExec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
            }
            return { done: true, value: nativeMethod.call(str, regexp, arg2) };
          }
          return { done: false };
        }
      );
      var strfn = fns[0];
      var rxfn = fns[1];

      _redefine(String.prototype, KEY, strfn);
      _hide(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return rxfn.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return rxfn.call(string, this); }
      );
    }
  };

  var $min = Math.min;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX$1 = 'lastIndex';
  var MAX_UINT32 = 0xffffffff;

  // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
  var SUPPORTS_Y = !_fails(function () { RegExp(MAX_UINT32, 'y'); });

  // @@split logic
  _fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
      'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
      'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
      '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
      '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
      ''[$SPLIT](/.?/)[LENGTH]
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(this);
        if (separator === undefined && limit === 0) return [];
        // If `separator` is not a regex, use native split
        if (!_isRegexp(separator)) return $split.call(string, separator, limit);
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = _regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy[LAST_INDEX$1];
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
            lastLength = match[0][LENGTH];
            lastLastIndex = lastIndex;
            if (output[LENGTH] >= splitLimit) break;
          }
          if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
        }
        if (lastLastIndex === string[LENGTH]) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
      };
    // Chakra, V8
    } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
      };
    } else {
      internalSplit = $split;
    }

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = defined(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
        if (res.done) return res.value;

        var rx = _anObject(regexp);
        var S = String(this);
        var C = _speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = $min(_toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = _advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  });

  // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

  var $find$1 = _arrayMethods(5);
  var KEY$1 = 'find';
  var forced$1 = true;
  // Shouldn't skip holes
  if (KEY$1 in []) Array(1)[KEY$1](function () { forced$1 = false; });
  _export(_export.P + _export.F * forced$1, 'Array', {
    find: function find(callbackfn /* , that = undefined */) {
      return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });
  _addToUnscopables(KEY$1);

  // most Object methods by ES6 should accept primitives



  var _objectSap = function (KEY, exec) {
    var fn = (_core.Object || {})[KEY] || Object[KEY];
    var exp = {};
    exp[KEY] = exec(fn);
    _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
  };

  // 19.1.2.14 Object.keys(O)



  _objectSap('keys', function () {
    return function keys(it) {
      return _objectKeys(_toObject(it));
    };
  });

  // 20.3.3.1 / 15.9.4.4 Date.now()


  _export(_export.S, 'Date', { now: function () { return new Date().getTime(); } });

  var _anInstance = function (it, Constructor, name, forbiddenField) {
    if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
      throw TypeError(name + ': incorrect invocation!');
    } return it;
  };

  var _forOf = createCommonjsModule(function (module) {
  var BREAK = {};
  var RETURN = {};
  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
    var f = _ctx(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
    // fast case for arrays with default iterator
    if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
      result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      if (result === BREAK || result === RETURN) return result;
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      result = _iterCall(iterator, f, step.value, entries);
      if (result === BREAK || result === RETURN) return result;
    }
  };
  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
  });

  // fast apply, http://jsperf.lnkit.com/fast-apply/5
  var _invoke = function (fn, args, that) {
    var un = that === undefined;
    switch (args.length) {
      case 0: return un ? fn()
                        : fn.call(that);
      case 1: return un ? fn(args[0])
                        : fn.call(that, args[0]);
      case 2: return un ? fn(args[0], args[1])
                        : fn.call(that, args[0], args[1]);
      case 3: return un ? fn(args[0], args[1], args[2])
                        : fn.call(that, args[0], args[1], args[2]);
      case 4: return un ? fn(args[0], args[1], args[2], args[3])
                        : fn.call(that, args[0], args[1], args[2], args[3]);
    } return fn.apply(that, args);
  };

  var process = _global.process;
  var setTask = _global.setImmediate;
  var clearTask = _global.clearImmediate;
  var MessageChannel = _global.MessageChannel;
  var Dispatch = _global.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;
  var run = function () {
    var id = +this;
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };
  var listener = function (event) {
    run.call(event.data);
  };
  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!setTask || !clearTask) {
    setTask = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        _invoke(typeof fn == 'function' ? fn : Function(fn), args);
      };
      defer(counter);
      return counter;
    };
    clearTask = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (_cof(process) == 'process') {
      defer = function (id) {
        process.nextTick(_ctx(run, id, 1));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(_ctx(run, id, 1));
      };
    // Browsers with MessageChannel, includes WebWorkers
    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = _ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
      defer = function (id) {
        _global.postMessage(id + '', '*');
      };
      _global.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in _domCreate('script')) {
      defer = function (id) {
        _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
          _html.removeChild(this);
          run.call(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(_ctx(run, id, 1), 0);
      };
    }
  }
  var _task = {
    set: setTask,
    clear: clearTask
  };

  var macrotask = _task.set;
  var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
  var process$1 = _global.process;
  var Promise$1 = _global.Promise;
  var isNode = _cof(process$1) == 'process';

  var _microtask = function () {
    var head, last, notify;

    var flush = function () {
      var parent, fn;
      if (isNode && (parent = process$1.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (e) {
          if (head) notify();
          else last = undefined;
          throw e;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // Node.js
    if (isNode) {
      notify = function () {
        process$1.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
    } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
      var toggle = true;
      var node = document.createTextNode('');
      new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      var promise = Promise$1.resolve(undefined);
      notify = function () {
        promise.then(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(_global, flush);
      };
    }

    return function (fn) {
      var task = { fn: fn, next: undefined };
      if (last) last.next = task;
      if (!head) {
        head = task;
        notify();
      } last = task;
    };
  };

  // 25.4.1.5 NewPromiseCapability(C)


  function PromiseCapability(C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = _aFunction(resolve);
    this.reject = _aFunction(reject);
  }

  var f$7 = function (C) {
    return new PromiseCapability(C);
  };

  var _newPromiseCapability = {
  	f: f$7
  };

  var _perform = function (exec) {
    try {
      return { e: false, v: exec() };
    } catch (e) {
      return { e: true, v: e };
    }
  };

  var navigator$1 = _global.navigator;

  var _userAgent = navigator$1 && navigator$1.userAgent || '';

  var _promiseResolve = function (C, x) {
    _anObject(C);
    if (_isObject(x) && x.constructor === C) return x;
    var promiseCapability = _newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var _redefineAll = function (target, src, safe) {
    for (var key in src) _redefine(target, key, src[key], safe);
    return target;
  };

  var SPECIES$3 = _wks('species');

  var _setSpecies = function (KEY) {
    var C = _global[KEY];
    if (_descriptors && C && !C[SPECIES$3]) _objectDp.f(C, SPECIES$3, {
      configurable: true,
      get: function () { return this; }
    });
  };

  var task = _task.set;
  var microtask = _microtask();




  var PROMISE = 'Promise';
  var TypeError$1 = _global.TypeError;
  var process$2 = _global.process;
  var versions = process$2 && process$2.versions;
  var v8 = versions && versions.v8 || '';
  var $Promise = _global[PROMISE];
  var isNode$1 = _classof(process$2) == 'process';
  var empty = function () { /* empty */ };
  var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
  var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

  var USE_NATIVE$1 = !!function () {
    try {
      // correct subclassing with @@species support
      var promise = $Promise.resolve(1);
      var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
        exec(empty, empty);
      };
      // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      return (isNode$1 || typeof PromiseRejectionEvent == 'function')
        && promise.then(empty) instanceof FakePromise
        // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
        // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
        // we can't detect it synchronously, so just check versions
        && v8.indexOf('6.6') !== 0
        && _userAgent.indexOf('Chrome/66') === -1;
    } catch (e) { /* empty */ }
  }();

  // helpers
  var isThenable = function (it) {
    var then;
    return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };
  var notify = function (promise, isReject) {
    if (promise._n) return;
    promise._n = true;
    var chain = promise._c;
    microtask(function () {
      var value = promise._v;
      var ok = promise._s == 1;
      var i = 0;
      var run = function (reaction) {
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (promise._h == 2) onHandleUnhandled(promise);
              promise._h = 1;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // may throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (e) {
          if (domain && !exited) domain.exit();
          reject(e);
        }
      };
      while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
      promise._c = [];
      promise._n = false;
      if (isReject && !promise._h) onUnhandled(promise);
    });
  };
  var onUnhandled = function (promise) {
    task.call(_global, function () {
      var value = promise._v;
      var unhandled = isUnhandled(promise);
      var result, handler, console;
      if (unhandled) {
        result = _perform(function () {
          if (isNode$1) {
            process$2.emit('unhandledRejection', value, promise);
          } else if (handler = _global.onunhandledrejection) {
            handler({ promise: promise, reason: value });
          } else if ((console = _global.console) && console.error) {
            console.error('Unhandled promise rejection', value);
          }
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
      } promise._a = undefined;
      if (unhandled && result.e) throw result.v;
    });
  };
  var isUnhandled = function (promise) {
    return promise._h !== 1 && (promise._a || promise._c).length === 0;
  };
  var onHandleUnhandled = function (promise) {
    task.call(_global, function () {
      var handler;
      if (isNode$1) {
        process$2.emit('rejectionHandled', promise);
      } else if (handler = _global.onrejectionhandled) {
        handler({ promise: promise, reason: promise._v });
      }
    });
  };
  var $reject = function (value) {
    var promise = this;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap
    promise._v = value;
    promise._s = 2;
    if (!promise._a) promise._a = promise._c.slice();
    notify(promise, true);
  };
  var $resolve = function (value) {
    var promise = this;
    var then;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap
    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      if (then = isThenable(value)) {
        microtask(function () {
          var wrapper = { _w: promise, _d: false }; // wrap
          try {
            then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
          } catch (e) {
            $reject.call(wrapper, e);
          }
        });
      } else {
        promise._v = value;
        promise._s = 1;
        notify(promise, false);
      }
    } catch (e) {
      $reject.call({ _w: promise, _d: false }, e); // wrap
    }
  };

  // constructor polyfill
  if (!USE_NATIVE$1) {
    // 25.4.3.1 Promise(executor)
    $Promise = function Promise(executor) {
      _anInstance(this, $Promise, PROMISE, '_h');
      _aFunction(executor);
      Internal.call(this);
      try {
        executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
      } catch (err) {
        $reject.call(this, err);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      this._c = [];             // <- awaiting reactions
      this._a = undefined;      // <- checked in isUnhandled reactions
      this._s = 0;              // <- state
      this._d = false;          // <- done
      this._v = undefined;      // <- value
      this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
      this._n = false;          // <- notify
    };
    Internal.prototype = _redefineAll($Promise.prototype, {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function then(onFulfilled, onRejected) {
        var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = isNode$1 ? process$2.domain : undefined;
        this._c.push(reaction);
        if (this._a) this._a.push(reaction);
        if (this._s) notify(this, false);
        return reaction.promise;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      this.promise = promise;
      this.resolve = _ctx($resolve, promise, 1);
      this.reject = _ctx($reject, promise, 1);
    };
    _newPromiseCapability.f = newPromiseCapability = function (C) {
      return C === $Promise || C === Wrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };
  }

  _export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });
  _setToStringTag($Promise, PROMISE);
  _setSpecies(PROMISE);
  Wrapper = _core[PROMISE];

  // statics
  _export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
    // 25.4.4.5 Promise.reject(r)
    reject: function reject(r) {
      var capability = newPromiseCapability(this);
      var $$reject = capability.reject;
      $$reject(r);
      return capability.promise;
    }
  });
  _export(_export.S + _export.F * ( !USE_NATIVE$1), PROMISE, {
    // 25.4.4.6 Promise.resolve(x)
    resolve: function resolve(x) {
      return _promiseResolve( this, x);
    }
  });
  _export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
    $Promise.all(iter)['catch'](empty);
  })), PROMISE, {
    // 25.4.4.1 Promise.all(iterable)
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = _perform(function () {
        var values = [];
        var index = 0;
        var remaining = 1;
        _forOf(iterable, false, function (promise) {
          var $index = index++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[$index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.e) reject(result.v);
      return capability.promise;
    },
    // 25.4.4.4 Promise.race(iterable)
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = _perform(function () {
        _forOf(iterable, false, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.e) reject(result.v);
      return capability.promise;
    }
  });

  var $sort = [].sort;
  var test$1 = [1, 2, 3];

  _export(_export.P + _export.F * (_fails(function () {
    // IE8-
    test$1.sort(undefined);
  }) || !_fails(function () {
    // V8 bug
    test$1.sort(null);
    // Old WebKit
  }) || !_strictMethod($sort)), 'Array', {
    // 22.1.3.25 Array.prototype.sort(comparefn)
    sort: function sort(comparefn) {
      return comparefn === undefined
        ? $sort.call(_toObject(this))
        : $sort.call(_toObject(this), _aFunction(comparefn));
    }
  });

  var dP$2 = _objectDp.f;
  var FProto = Function.prototype;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME$1 = 'name';

  // 19.2.4.2 name
  NAME$1 in FProto || _descriptors && dP$2(FProto, NAME$1, {
    configurable: true,
    get: function () {
      try {
        return ('' + this).match(nameRE)[1];
      } catch (e) {
        return '';
      }
    }
  });

  var arraySlice = [].slice;
  var factories = {};

  var construct = function (F, len, args) {
    if (!(len in factories)) {
      for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
      // eslint-disable-next-line no-new-func
      factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
    } return factories[len](F, args);
  };

  var _bind = Function.bind || function bind(that /* , ...args */) {
    var fn = _aFunction(this);
    var partArgs = arraySlice.call(arguments, 1);
    var bound = function (/* args... */) {
      var args = partArgs.concat(arraySlice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : _invoke(fn, args, that);
    };
    if (_isObject(fn.prototype)) bound.prototype = fn.prototype;
    return bound;
  };

  // 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)


  _export(_export.P, 'Function', { bind: _bind });

  var interopRequireDefault = createCommonjsModule(function (module) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  module.exports = _interopRequireDefault;
  });

  unwrapExports(interopRequireDefault);

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  var keywords = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _default = new Map([['transparent', 'rgba(0,0,0,0)'], ['black', '#000000'], ['silver', '#C0C0C0'], ['gray', '#808080'], ['white', '#FFFFFF'], ['maroon', '#800000'], ['red', '#FF0000'], ['purple', '#800080'], ['fuchsia', '#FF00FF'], ['green', '#008000'], ['lime', '#00FF00'], ['olive', '#808000'], ['yellow', '#FFFF00'], ['navy', '#000080'], ['blue', '#0000FF'], ['teal', '#008080'], ['aqua', '#00FFFF'], ['aliceblue', '#f0f8ff'], ['antiquewhite', '#faebd7'], ['aquamarine', '#7fffd4'], ['azure', '#f0ffff'], ['beige', '#f5f5dc'], ['bisque', '#ffe4c4'], ['blanchedalmond', '#ffebcd'], ['blueviolet', '#8a2be2'], ['brown', '#a52a2a'], ['burlywood', '#deb887'], ['cadetblue', '#5f9ea0'], ['chartreuse', '#7fff00'], ['chocolate', '#d2691e'], ['coral', '#ff7f50'], ['cornflowerblue', '#6495ed'], ['cornsilk', '#fff8dc'], ['crimson', '#dc143c'], ['cyan', '#00ffff'], ['darkblue', '#00008b'], ['darkcyan', '#008b8b'], ['darkgoldenrod', '#b8860b'], ['darkgray', '#a9a9a9'], ['darkgreen', '#006400'], ['darkgrey', '#a9a9a9'], ['darkkhaki', '#bdb76b'], ['darkmagenta', '#8b008b'], ['darkolivegreen', '#556b2f'], ['darkorange', '#ff8c00'], ['darkorchid', '#9932cc'], ['darkred', '#8b0000'], ['darksalmon', '#e9967a'], ['darkseagreen', '#8fbc8f'], ['darkslateblue', '#483d8b'], ['darkslategray', '#2f4f4f'], ['darkslategrey', '#2f4f4f'], ['darkturquoise', '#00ced1'], ['darkviolet', '#9400d3'], ['deeppink', '#ff1493'], ['deepskyblue', '#00bfff'], ['dimgray', '#696969'], ['dimgrey', '#696969'], ['dodgerblue', '#1e90ff'], ['firebrick', '#b22222'], ['floralwhite', '#fffaf0'], ['forestgreen', '#228b22'], ['gainsboro', '#dcdcdc'], ['ghostwhite', '#f8f8ff'], ['gold', '#ffd700'], ['goldenrod', '#daa520'], ['greenyellow', '#adff2f'], ['grey', '#808080'], ['honeydew', '#f0fff0'], ['hotpink', '#ff69b4'], ['indianred', '#cd5c5c'], ['indigo', '#4b0082'], ['ivory', '#fffff0'], ['khaki', '#f0e68c'], ['lavender', '#e6e6fa'], ['lavenderblush', '#fff0f5'], ['lawngreen', '#7cfc00'], ['lemonchiffon', '#fffacd'], ['lightblue', '#add8e6'], ['lightcoral', '#f08080'], ['lightcyan', '#e0ffff'], ['lightgoldenrodyellow', '#fafad2'], ['lightgray', '#d3d3d3'], ['lightgreen', '#90ee90'], ['lightgrey', '#d3d3d3'], ['lightpink', '#ffb6c1'], ['lightsalmon', '#ffa07a'], ['lightseagreen', '#20b2aa'], ['lightskyblue', '#87cefa'], ['lightslategray', '#778899'], ['lightslategrey', '#778899'], ['lightsteelblue', '#b0c4de'], ['lightyellow', '#ffffe0'], ['limegreen', '#32cd32'], ['linen', '#faf0e6'], ['magenta', '#ff00ff'], ['mediumaquamarine', '#66cdaa'], ['mediumblue', '#0000cd'], ['mediumorchid', '#ba55d3'], ['mediumpurple', '#9370db'], ['mediumseagreen', '#3cb371'], ['mediumslateblue', '#7b68ee'], ['mediumspringgreen', '#00fa9a'], ['mediumturquoise', '#48d1cc'], ['mediumvioletred', '#c71585'], ['midnightblue', '#191970'], ['mintcream', '#f5fffa'], ['mistyrose', '#ffe4e1'], ['moccasin', '#ffe4b5'], ['navajowhite', '#ffdead'], ['oldlace', '#fdf5e6'], ['olivedrab', '#6b8e23'], ['orange', '#ffa500'], ['orangered', '#ff4500'], ['orchid', '#da70d6'], ['palegoldenrod', '#eee8aa'], ['palegreen', '#98fb98'], ['paleturquoise', '#afeeee'], ['palevioletred', '#db7093'], ['papayawhip', '#ffefd5'], ['peachpuff', '#ffdab9'], ['peru', '#cd853f'], ['pink', '#ffc0cb'], ['plum', '#dda0dd'], ['powderblue', '#b0e0e6'], ['rosybrown', '#bc8f8f'], ['royalblue', '#4169e1'], ['saddlebrown', '#8b4513'], ['salmon', '#fa8072'], ['sandybrown', '#f4a460'], ['seagreen', '#2e8b57'], ['seashell', '#fff5ee'], ['sienna', '#a0522d'], ['skyblue', '#87ceeb'], ['slateblue', '#6a5acd'], ['slategray', '#708090'], ['slategrey', '#708090'], ['snow', '#fffafa'], ['springgreen', '#00ff7f'], ['steelblue', '#4682b4'], ['tan', '#d2b48c'], ['thistle', '#d8bfd8'], ['tomato', '#ff6347'], ['turquoise', '#40e0d0'], ['violet', '#ee82ee'], ['wheat', '#f5deb3'], ['whitesmoke', '#f5f5f5'], ['yellowgreen', '#9acd32']]);

  exports["default"] = _default;
  });

  unwrapExports(keywords);

  var lib = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getRgbValue = getRgbValue;
  exports.getRgbaValue = getRgbaValue;
  exports.getOpacity = getOpacity;
  exports.toRgb = toRgb;
  exports.toHex = toHex;
  exports.getColorFromRgbValue = getColorFromRgbValue;
  exports.darken = darken;
  exports.lighten = lighten;
  exports.fade = fade;
  exports["default"] = void 0;

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var _keywords = interopRequireDefault(keywords);

  var hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  var rgbReg = /^(rgb|rgba|RGB|RGBA)/;
  var rgbaReg = /^(rgba|RGBA)/;
  /**
   * @description Color validator
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {String|Boolean} Valid color Or false
   */

  function validator(color) {
    var isHex = hexReg.test(color);
    var isRgb = rgbReg.test(color);
    if (isHex || isRgb) return color;
    color = getColorByKeyword(color);

    if (!color) {
      console.error('Color: Invalid color!');
      return false;
    }

    return color;
  }
  /**
   * @description Get color by keyword
   * @param {String} keyword Color keyword like red, green and etc.
   * @return {String|Boolean} Hex or rgba color (Invalid keyword will return false)
   */


  function getColorByKeyword(keyword) {
    if (!keyword) {
      console.error('getColorByKeywords: Missing parameters!');
      return false;
    }

    if (!_keywords["default"].has(keyword)) return false;
    return _keywords["default"].get(keyword);
  }
  /**
   * @description Get the Rgb value of the color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Array<Number>|Boolean} Rgb value of the color (Invalid input will return false)
   */


  function getRgbValue(color) {
    if (!color) {
      console.error('getRgbValue: Missing parameters!');
      return false;
    }

    color = validator(color);
    if (!color) return false;
    var isHex = hexReg.test(color);
    var isRgb = rgbReg.test(color);
    var lowerColor = color.toLowerCase();
    if (isHex) return getRgbValueFromHex(lowerColor);
    if (isRgb) return getRgbValueFromRgb(lowerColor);
  }
  /**
   * @description Get the rgb value of the hex color
   * @param {String} color Hex color
   * @return {Array<Number>} Rgb value of the color
   */


  function getRgbValueFromHex(color) {
    color = color.replace('#', '');
    if (color.length === 3) color = Array.from(color).map(function (hexNum) {
      return hexNum + hexNum;
    }).join('');
    color = color.split('');
    return new Array(3).fill(0).map(function (t, i) {
      return parseInt("0x".concat(color[i * 2]).concat(color[i * 2 + 1]));
    });
  }
  /**
   * @description Get the rgb value of the rgb/rgba color
   * @param {String} color Hex color
   * @return {Array} Rgb value of the color
   */


  function getRgbValueFromRgb(color) {
    return color.replace(/rgb\(|rgba\(|\)/g, '').split(',').slice(0, 3).map(function (n) {
      return parseInt(n);
    });
  }
  /**
   * @description Get the Rgba value of the color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Array<Number>|Boolean} Rgba value of the color (Invalid input will return false)
   */


  function getRgbaValue(color) {
    if (!color) {
      console.error('getRgbaValue: Missing parameters!');
      return false;
    }

    var colorValue = getRgbValue(color);
    if (!colorValue) return false;
    colorValue.push(getOpacity(color));
    return colorValue;
  }
  /**
   * @description Get the opacity of color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Number|Boolean} Color opacity (Invalid input will return false)
   */


  function getOpacity(color) {
    if (!color) {
      console.error('getOpacity: Missing parameters!');
      return false;
    }

    color = validator(color);
    if (!color) return false;
    var isRgba = rgbaReg.test(color);
    if (!isRgba) return 1;
    color = color.toLowerCase();
    return Number(color.split(',').slice(-1)[0].replace(/[)|\s]/g, ''));
  }
  /**
   * @description Convert color to Rgb|Rgba color
   * @param {String} color   Hex|Rgb|Rgba color or color keyword
   * @param {Number} opacity The opacity of color
   * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
   */


  function toRgb(color, opacity) {
    if (!color) {
      console.error('toRgb: Missing parameters!');
      return false;
    }

    var rgbValue = getRgbValue(color);
    if (!rgbValue) return false;
    var addOpacity = typeof opacity === 'number';
    if (addOpacity) return 'rgba(' + rgbValue.join(',') + ",".concat(opacity, ")");
    return 'rgb(' + rgbValue.join(',') + ')';
  }
  /**
   * @description Convert color to Hex color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {String|Boolean} Hex color (Invalid input will return false)
   */


  function toHex(color) {
    if (!color) {
      console.error('toHex: Missing parameters!');
      return false;
    }

    if (hexReg.test(color)) return color;
    color = getRgbValue(color);
    if (!color) return false;
    return '#' + color.map(function (n) {
      return Number(n).toString(16);
    }).map(function (n) {
      return n === '0' ? '00' : n;
    }).join('');
  }
  /**
   * @description Get Color from Rgb|Rgba value
   * @param {Array<Number>} value Rgb|Rgba color value
   * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
   */


  function getColorFromRgbValue(value) {
    if (!value) {
      console.error('getColorFromRgbValue: Missing parameters!');
      return false;
    }

    var valueLength = value.length;

    if (valueLength !== 3 && valueLength !== 4) {
      console.error('getColorFromRgbValue: Value is illegal!');
      return false;
    }

    var color = valueLength === 3 ? 'rgb(' : 'rgba(';
    color += value.join(',') + ')';
    return color;
  }
  /**
   * @description Deepen color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Number} Percent of Deepen (1-100)
   * @return {String|Boolean} Rgba color (Invalid input will return false)
   */


  function darken(color) {
    var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!color) {
      console.error('darken: Missing parameters!');
      return false;
    }

    var rgbaValue = getRgbaValue(color);
    if (!rgbaValue) return false;
    rgbaValue = rgbaValue.map(function (v, i) {
      return i === 3 ? v : v - Math.ceil(2.55 * percent);
    }).map(function (v) {
      return v < 0 ? 0 : v;
    });
    return getColorFromRgbValue(rgbaValue);
  }
  /**
   * @description Brighten color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Number} Percent of brighten (1-100)
   * @return {String|Boolean} Rgba color (Invalid input will return false)
   */


  function lighten(color) {
    var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!color) {
      console.error('lighten: Missing parameters!');
      return false;
    }

    var rgbaValue = getRgbaValue(color);
    if (!rgbaValue) return false;
    rgbaValue = rgbaValue.map(function (v, i) {
      return i === 3 ? v : v + Math.ceil(2.55 * percent);
    }).map(function (v) {
      return v > 255 ? 255 : v;
    });
    return getColorFromRgbValue(rgbaValue);
  }
  /**
   * @description Adjust color opacity
   * @param {String} color   Hex|Rgb|Rgba color or color keyword
   * @param {Number} Percent of opacity
   * @return {String|Boolean} Rgba color (Invalid input will return false)
   */


  function fade(color) {
    var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

    if (!color) {
      console.error('fade: Missing parameters!');
      return false;
    }

    var rgbValue = getRgbValue(color);
    if (!rgbValue) return false;
    var rgbaValue = [].concat((0, _toConsumableArray2["default"])(rgbValue), [percent / 100]);
    return getColorFromRgbValue(rgbaValue);
  }

  var _default = {
    fade: fade,
    toHex: toHex,
    toRgb: toRgb,
    darken: darken,
    lighten: lighten,
    getOpacity: getOpacity,
    getRgbValue: getRgbValue,
    getRgbaValue: getRgbaValue,
    getColorFromRgbValue: getColorFromRgbValue
  };
  exports["default"] = _default;
  });

  unwrapExports(lib);
  var lib_1 = lib.getRgbValue;
  var lib_2 = lib.getRgbaValue;
  var lib_3 = lib.getOpacity;
  var lib_4 = lib.toRgb;
  var lib_5 = lib.toHex;
  var lib_6 = lib.getColorFromRgbValue;
  var lib_7 = lib.darken;
  var lib_8 = lib.lighten;
  var lib_9 = lib.fade;

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
  }

  var slicedToArray = _slicedToArray;

  var bezierCurveToPolyline_1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.bezierCurveToPolyline = bezierCurveToPolyline;
  exports.getBezierCurveLength = getBezierCurveLength;
  exports["default"] = void 0;

  var _slicedToArray2 = interopRequireDefault(slicedToArray);

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var sqrt = Math.sqrt,
      pow = Math.pow,
      ceil = Math.ceil,
      abs = Math.abs; // Initialize the number of points per curve

  var defaultSegmentPointsNum = 50;
  /**
   * @example data structure of bezierCurve
   * bezierCurve = [
   *  // Starting point of the curve
   *  [10, 10],
   *  // BezierCurve segment data (controlPoint1, controlPoint2, endPoint)
   *  [
   *    [20, 20], [40, 20], [50, 10]
   *  ],
   *  ...
   * ]
   */

  /**
   * @description               Abstract the curve as a polyline consisting of N points
   * @param {Array} bezierCurve bezierCurve data
   * @param {Number} precision  calculation accuracy. Recommended for 1-20. Default = 5
   * @return {Object}           Calculation results and related data
   * @return {Array}            Option.segmentPoints Point data that constitutes a polyline after calculation
   * @return {Number}           Option.cycles Number of iterations
   * @return {Number}           Option.rounds The number of recursions for the last iteration
   */

  function abstractBezierCurveToPolyline(bezierCurve) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    var segmentsNum = bezierCurve.length - 1;
    var startPoint = bezierCurve[0];
    var endPoint = bezierCurve[segmentsNum][2];
    var segments = bezierCurve.slice(1);
    var getSegmentTPointFuns = segments.map(function (seg, i) {
      var beginPoint = i === 0 ? startPoint : segments[i - 1][2];
      return createGetBezierCurveTPointFun.apply(void 0, [beginPoint].concat((0, _toConsumableArray2["default"])(seg)));
    }); // Initialize the curve to a polyline

    var segmentPointsNum = new Array(segmentsNum).fill(defaultSegmentPointsNum);
    var segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum); // Calculate uniformly distributed points by iteratively

    var result = calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision);
    result.segmentPoints.push(endPoint);
    return result;
  }
  /**
   * @description  Generate a method for obtaining corresponding point by t according to curve data
   * @param {Array} beginPoint    BezierCurve begin point. [x, y]
   * @param {Array} controlPoint1 BezierCurve controlPoint1. [x, y]
   * @param {Array} controlPoint2 BezierCurve controlPoint2. [x, y]
   * @param {Array} endPoint      BezierCurve end point. [x, y]
   * @return {Function} Expected function
   */


  function createGetBezierCurveTPointFun(beginPoint, controlPoint1, controlPoint2, endPoint) {
    return function (t) {
      var tSubed1 = 1 - t;
      var tSubed1Pow3 = pow(tSubed1, 3);
      var tSubed1Pow2 = pow(tSubed1, 2);
      var tPow3 = pow(t, 3);
      var tPow2 = pow(t, 2);
      return [beginPoint[0] * tSubed1Pow3 + 3 * controlPoint1[0] * t * tSubed1Pow2 + 3 * controlPoint2[0] * tPow2 * tSubed1 + endPoint[0] * tPow3, beginPoint[1] * tSubed1Pow3 + 3 * controlPoint1[1] * t * tSubed1Pow2 + 3 * controlPoint2[1] * tPow2 * tSubed1 + endPoint[1] * tPow3];
    };
  }
  /**
   * @description Get the distance between two points
   * @param {Array} point1 BezierCurve begin point. [x, y]
   * @param {Array} point2 BezierCurve controlPoint1. [x, y]
   * @return {Number} Expected distance
   */


  function getTwoPointDistance(_ref, _ref2) {
    var _ref3 = (0, _slicedToArray2["default"])(_ref, 2),
        ax = _ref3[0],
        ay = _ref3[1];

    var _ref4 = (0, _slicedToArray2["default"])(_ref2, 2),
        bx = _ref4[0],
        by = _ref4[1];

    return sqrt(pow(ax - bx, 2) + pow(ay - by, 2));
  }
  /**
   * @description Get the sum of the array of numbers
   * @param {Array} nums An array of numbers
   * @return {Number} Expected sum
   */


  function getNumsSum(nums) {
    return nums.reduce(function (sum, num) {
      return sum + num;
    }, 0);
  }
  /**
   * @description Get the distance of multiple sets of points
   * @param {Array} segmentPoints Multiple sets of point data
   * @return {Array} Distance of multiple sets of point data
   */


  function getSegmentPointsDistance(segmentPoints) {
    return segmentPoints.map(function (points, i) {
      return new Array(points.length - 1).fill(0).map(function (temp, j) {
        return getTwoPointDistance(points[j], points[j + 1]);
      });
    });
  }
  /**
   * @description Get the distance of multiple sets of points
   * @param {Array} segmentPoints Multiple sets of point data
   * @return {Array} Distance of multiple sets of point data
   */


  function getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum) {
    return getSegmentTPointFuns.map(function (getSegmentTPointFun, i) {
      var tGap = 1 / segmentPointsNum[i];
      return new Array(segmentPointsNum[i]).fill('').map(function (foo, j) {
        return getSegmentTPointFun(j * tGap);
      });
    });
  }
  /**
   * @description Get the sum of deviations between line segment and the average length
   * @param {Array} segmentPointsDistance Segment length of polyline
   * @param {Number} avgLength            Average length of the line segment
   * @return {Number} Deviations
   */


  function getAllDeviations(segmentPointsDistance, avgLength) {
    return segmentPointsDistance.map(function (seg) {
      return seg.map(function (s) {
        return abs(s - avgLength);
      });
    }).map(function (seg) {
      return getNumsSum(seg);
    }).reduce(function (total, v) {
      return total + v;
    }, 0);
  }
  /**
   * @description Calculate uniformly distributed points by iteratively
   * @param {Array} segmentPoints        Multiple setd of points that make up a polyline
   * @param {Array} getSegmentTPointFuns Functions of get a point on the curve with t
   * @param {Array} segments             BezierCurve data
   * @param {Number} precision           Calculation accuracy
   * @return {Object} Calculation results and related data
   * @return {Array}  Option.segmentPoints Point data that constitutes a polyline after calculation
   * @return {Number} Option.cycles Number of iterations
   * @return {Number} Option.rounds The number of recursions for the last iteration
   */


  function calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision) {
    // The number of loops for the current iteration
    var rounds = 4; // Number of iterations

    var cycles = 1;

    var _loop = function _loop() {
      // Recalculate the number of points per curve based on the last iteration data
      var totalPointsNum = segmentPoints.reduce(function (total, seg) {
        return total + seg.length;
      }, 0); // Add last points of segment to calc exact segment length

      segmentPoints.forEach(function (seg, i) {
        return seg.push(segments[i][2]);
      });
      var segmentPointsDistance = getSegmentPointsDistance(segmentPoints);
      var lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
        return total + seg.length;
      }, 0);
      var segmentlength = segmentPointsDistance.map(function (seg) {
        return getNumsSum(seg);
      });
      var totalLength = getNumsSum(segmentlength);
      var avgLength = totalLength / lineSegmentNum; // Check if precision is reached

      var allDeviations = getAllDeviations(segmentPointsDistance, avgLength);
      if (allDeviations <= precision) return "break";
      totalPointsNum = ceil(avgLength / precision * totalPointsNum * 1.1);
      var segmentPointsNum = segmentlength.map(function (length) {
        return ceil(length / totalLength * totalPointsNum);
      }); // Calculate the points after redistribution

      segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum);
      totalPointsNum = segmentPoints.reduce(function (total, seg) {
        return total + seg.length;
      }, 0);
      var segmentPointsForLength = JSON.parse(JSON.stringify(segmentPoints));
      segmentPointsForLength.forEach(function (seg, i) {
        return seg.push(segments[i][2]);
      });
      segmentPointsDistance = getSegmentPointsDistance(segmentPointsForLength);
      lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
        return total + seg.length;
      }, 0);
      segmentlength = segmentPointsDistance.map(function (seg) {
        return getNumsSum(seg);
      });
      totalLength = getNumsSum(segmentlength);
      avgLength = totalLength / lineSegmentNum;
      var stepSize = 1 / totalPointsNum / 10; // Recursively for each segment of the polyline

      getSegmentTPointFuns.forEach(function (getSegmentTPointFun, i) {
        var currentSegmentPointsNum = segmentPointsNum[i];
        var t = new Array(currentSegmentPointsNum).fill('').map(function (foo, j) {
          return j / segmentPointsNum[i];
        }); // Repeated recursive offset

        for (var r = 0; r < rounds; r++) {
          var distance = getSegmentPointsDistance([segmentPoints[i]])[0];
          var deviations = distance.map(function (d) {
            return d - avgLength;
          });
          var offset = 0;

          for (var j = 0; j < currentSegmentPointsNum; j++) {
            if (j === 0) return;
            offset += deviations[j - 1];
            t[j] -= stepSize * offset;
            if (t[j] > 1) t[j] = 1;
            if (t[j] < 0) t[j] = 0;
            segmentPoints[i][j] = getSegmentTPointFun(t[j]);
          }
        }
      });
      rounds *= 4;
      cycles++;
    };

    do {
      var _ret = _loop();

      if (_ret === "break") break;
    } while (rounds <= 1025);

    segmentPoints = segmentPoints.reduce(function (all, seg) {
      return all.concat(seg);
    }, []);
    return {
      segmentPoints: segmentPoints,
      cycles: cycles,
      rounds: rounds
    };
  }
  /**
   * @description Get the polyline corresponding to the Bezier curve
   * @param {Array} bezierCurve BezierCurve data
   * @param {Number} precision  Calculation accuracy. Recommended for 1-20. Default = 5
   * @return {Array|Boolean} Point data that constitutes a polyline after calculation (Invalid input will return false)
   */


  function bezierCurveToPolyline(bezierCurve) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

    if (!bezierCurve) {
      console.error('bezierCurveToPolyline: Missing parameters!');
      return false;
    }

    if (!(bezierCurve instanceof Array)) {
      console.error('bezierCurveToPolyline: Parameter bezierCurve must be an array!');
      return false;
    }

    if (typeof precision !== 'number') {
      console.error('bezierCurveToPolyline: Parameter precision must be a number!');
      return false;
    }

    var _abstractBezierCurveT = abstractBezierCurveToPolyline(bezierCurve, precision),
        segmentPoints = _abstractBezierCurveT.segmentPoints;

    return segmentPoints;
  }
  /**
   * @description Get the bezier curve length
   * @param {Array} bezierCurve bezierCurve data
   * @param {Number} precision  calculation accuracy. Recommended for 5-10. Default = 5
   * @return {Number|Boolean} BezierCurve length (Invalid input will return false)
   */


  function getBezierCurveLength(bezierCurve) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

    if (!bezierCurve) {
      console.error('getBezierCurveLength: Missing parameters!');
      return false;
    }

    if (!(bezierCurve instanceof Array)) {
      console.error('getBezierCurveLength: Parameter bezierCurve must be an array!');
      return false;
    }

    if (typeof precision !== 'number') {
      console.error('getBezierCurveLength: Parameter precision must be a number!');
      return false;
    }

    var _abstractBezierCurveT2 = abstractBezierCurveToPolyline(bezierCurve, precision),
        segmentPoints = _abstractBezierCurveT2.segmentPoints; // Calculate the total length of the points that make up the polyline


    var pointsDistance = getSegmentPointsDistance([segmentPoints])[0];
    var length = getNumsSum(pointsDistance);
    return length;
  }

  var _default = bezierCurveToPolyline;
  exports["default"] = _default;
  });

  unwrapExports(bezierCurveToPolyline_1);
  var bezierCurveToPolyline_2 = bezierCurveToPolyline_1.bezierCurveToPolyline;
  var bezierCurveToPolyline_3 = bezierCurveToPolyline_1.getBezierCurveLength;

  var polylineToBezierCurve_1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _slicedToArray2 = interopRequireDefault(slicedToArray);

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  /**
   * @description Abstract the polyline formed by N points into a set of bezier curve
   * @param {Array} polyline A set of points that make up a polyline
   * @param {Boolean} close  Closed curve
   * @param {Number} offsetA Smoothness
   * @param {Number} offsetB Smoothness
   * @return {Array|Boolean} A set of bezier curve (Invalid input will return false)
   */
  function polylineToBezierCurve(polyline) {
    var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var offsetA = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.25;
    var offsetB = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;

    if (!(polyline instanceof Array)) {
      console.error('polylineToBezierCurve: Parameter polyline must be an array!');
      return false;
    }

    if (polyline.length <= 2) {
      console.error('polylineToBezierCurve: Converting to a curve requires at least 3 points!');
      return false;
    }

    var startPoint = polyline[0];
    var bezierCurveLineNum = polyline.length - 1;
    var bezierCurvePoints = new Array(bezierCurveLineNum).fill(0).map(function (foo, i) {
      return [].concat((0, _toConsumableArray2["default"])(getBezierCurveLineControlPoints(polyline, i, close, offsetA, offsetB)), [polyline[i + 1]]);
    });
    if (close) closeBezierCurve(bezierCurvePoints, startPoint);
    bezierCurvePoints.unshift(polyline[0]);
    return bezierCurvePoints;
  }
  /**
   * @description Get the control points of the Bezier curve
   * @param {Array} polyline A set of points that make up a polyline
   * @param {Number} index   The index of which get controls points's point in polyline
   * @param {Boolean} close  Closed curve
   * @param {Number} offsetA Smoothness
   * @param {Number} offsetB Smoothness
   * @return {Array} Control points
   */


  function getBezierCurveLineControlPoints(polyline, index) {
    var close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var offsetA = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;
    var offsetB = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25;
    var pointNum = polyline.length;
    if (pointNum < 3 || index >= pointNum) return;
    var beforePointIndex = index - 1;
    if (beforePointIndex < 0) beforePointIndex = close ? pointNum + beforePointIndex : 0;
    var afterPointIndex = index + 1;
    if (afterPointIndex >= pointNum) afterPointIndex = close ? afterPointIndex - pointNum : pointNum - 1;
    var afterNextPointIndex = index + 2;
    if (afterNextPointIndex >= pointNum) afterNextPointIndex = close ? afterNextPointIndex - pointNum : pointNum - 1;
    var pointBefore = polyline[beforePointIndex];
    var pointMiddle = polyline[index];
    var pointAfter = polyline[afterPointIndex];
    var pointAfterNext = polyline[afterNextPointIndex];
    return [[pointMiddle[0] + offsetA * (pointAfter[0] - pointBefore[0]), pointMiddle[1] + offsetA * (pointAfter[1] - pointBefore[1])], [pointAfter[0] - offsetB * (pointAfterNext[0] - pointMiddle[0]), pointAfter[1] - offsetB * (pointAfterNext[1] - pointMiddle[1])]];
  }
  /**
   * @description Get the last curve of the closure
   * @param {Array} bezierCurve A set of sub-curve
   * @param {Array} startPoint  Start point
   * @return {Array} The last curve for closure
   */


  function closeBezierCurve(bezierCurve, startPoint) {
    var firstSubCurve = bezierCurve[0];
    var lastSubCurve = bezierCurve.slice(-1)[0];
    bezierCurve.push([getSymmetryPoint(lastSubCurve[1], lastSubCurve[2]), getSymmetryPoint(firstSubCurve[0], startPoint), startPoint]);
    return bezierCurve;
  }
  /**
   * @description Get the symmetry point
   * @param {Array} point       Symmetric point
   * @param {Array} centerPoint Symmetric center
   * @return {Array} Symmetric point
   */


  function getSymmetryPoint(point, centerPoint) {
    var _point = (0, _slicedToArray2["default"])(point, 2),
        px = _point[0],
        py = _point[1];

    var _centerPoint = (0, _slicedToArray2["default"])(centerPoint, 2),
        cx = _centerPoint[0],
        cy = _centerPoint[1];

    var minusX = cx - px;
    var minusY = cy - py;
    return [cx + minusX, cy + minusY];
  }

  var _default = polylineToBezierCurve;
  exports["default"] = _default;
  });

  unwrapExports(polylineToBezierCurve_1);

  var lib$1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "bezierCurveToPolyline", {
    enumerable: true,
    get: function get() {
      return bezierCurveToPolyline_1.bezierCurveToPolyline;
    }
  });
  Object.defineProperty(exports, "getBezierCurveLength", {
    enumerable: true,
    get: function get() {
      return bezierCurveToPolyline_1.getBezierCurveLength;
    }
  });
  Object.defineProperty(exports, "polylineToBezierCurve", {
    enumerable: true,
    get: function get() {
      return _polylineToBezierCurve["default"];
    }
  });
  exports["default"] = void 0;



  var _polylineToBezierCurve = interopRequireDefault(polylineToBezierCurve_1);

  var _default = {
    bezierCurveToPolyline: bezierCurveToPolyline_1.bezierCurveToPolyline,
    getBezierCurveLength: bezierCurveToPolyline_1.getBezierCurveLength,
    polylineToBezierCurve: _polylineToBezierCurve["default"]
  };
  exports["default"] = _default;
  });

  unwrapExports(lib$1);

  var _validateCollection = function (it, TYPE) {
    if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
    return it;
  };

  var dP$3 = _objectDp.f;









  var fastKey = _meta.fastKey;

  var SIZE = _descriptors ? '_s' : 'size';

  var getEntry = function (that, key) {
    // fast case
    var index = fastKey(key);
    var entry;
    if (index !== 'F') return that._i[index];
    // frozen object case
    for (entry = that._f; entry; entry = entry.n) {
      if (entry.k == key) return entry;
    }
  };

  var _collectionStrong = {
    getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        _anInstance(that, C, NAME, '_i');
        that._t = NAME;         // collection type
        that._i = _objectCreate(null); // index
        that._f = undefined;    // first entry
        that._l = undefined;    // last entry
        that[SIZE] = 0;         // size
        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
      });
      _redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
            entry.r = true;
            if (entry.p) entry.p = entry.p.n = undefined;
            delete data[entry.i];
          }
          that._f = that._l = undefined;
          that[SIZE] = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function (key) {
          var that = _validateCollection(this, NAME);
          var entry = getEntry(that, key);
          if (entry) {
            var next = entry.n;
            var prev = entry.p;
            delete that._i[entry.i];
            entry.r = true;
            if (prev) prev.n = next;
            if (next) next.p = prev;
            if (that._f == entry) that._f = next;
            if (that._l == entry) that._l = prev;
            that[SIZE]--;
          } return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn /* , that = undefined */) {
          _validateCollection(this, NAME);
          var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
          var entry;
          while (entry = entry ? entry.n : this._f) {
            f(entry.v, entry.k, this);
            // revert to the last existing entry
            while (entry && entry.r) entry = entry.p;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(_validateCollection(this, NAME), key);
        }
      });
      if (_descriptors) dP$3(C.prototype, 'size', {
        get: function () {
          return _validateCollection(this, NAME)[SIZE];
        }
      });
      return C;
    },
    def: function (that, key, value) {
      var entry = getEntry(that, key);
      var prev, index;
      // change existing entry
      if (entry) {
        entry.v = value;
      // create new entry
      } else {
        that._l = entry = {
          i: index = fastKey(key, true), // <- index
          k: key,                        // <- key
          v: value,                      // <- value
          p: prev = that._l,             // <- previous entry
          n: undefined,                  // <- next entry
          r: false                       // <- removed
        };
        if (!that._f) that._f = entry;
        if (prev) prev.n = entry;
        that[SIZE]++;
        // add to index
        if (index !== 'F') that._i[index] = entry;
      } return that;
    },
    getEntry: getEntry,
    setStrong: function (C, NAME, IS_MAP) {
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      _iterDefine(C, NAME, function (iterated, kind) {
        this._t = _validateCollection(iterated, NAME); // target
        this._k = kind;                     // kind
        this._l = undefined;                // previous
      }, function () {
        var that = this;
        var kind = that._k;
        var entry = that._l;
        // revert to the last existing entry
        while (entry && entry.r) entry = entry.p;
        // get next entry
        if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
          // or finish the iteration
          that._t = undefined;
          return _iterStep(1);
        }
        // return step by kind
        if (kind == 'keys') return _iterStep(0, entry.k);
        if (kind == 'values') return _iterStep(0, entry.v);
        return _iterStep(0, [entry.k, entry.v]);
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

      // add [@@species], 23.1.2.2, 23.2.2.2
      _setSpecies(NAME);
    }
  };

  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */


  var check = function (O, proto) {
    _anObject(O);
    if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
  };
  var _setProto = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
      function (test, buggy, set) {
        try {
          set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
          set(test, []);
          buggy = !(test instanceof Array);
        } catch (e) { buggy = true; }
        return function setPrototypeOf(O, proto) {
          check(O, proto);
          if (buggy) O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }({}, false) : undefined),
    check: check
  };

  var setPrototypeOf = _setProto.set;
  var _inheritIfRequired = function (that, target, C) {
    var S = target.constructor;
    var P;
    if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
      setPrototypeOf(that, P);
    } return that;
  };

  var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
    var Base = _global[NAME];
    var C = Base;
    var ADDER = IS_MAP ? 'set' : 'add';
    var proto = C && C.prototype;
    var O = {};
    var fixMethod = function (KEY) {
      var fn = proto[KEY];
      _redefine(proto, KEY,
        KEY == 'delete' ? function (a) {
          return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
        } : KEY == 'has' ? function has(a) {
          return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
        } : KEY == 'get' ? function get(a) {
          return IS_WEAK && !_isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
        } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
          : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
      );
    };
    if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
      new C().entries().next();
    }))) {
      // create collection constructor
      C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
      _redefineAll(C.prototype, methods);
      _meta.NEED = true;
    } else {
      var instance = new C();
      // early implementations not supports chaining
      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      var THROWS_ON_PRIMITIVES = _fails(function () { instance.has(1); });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      var ACCEPT_ITERABLES = _iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      var BUGGY_ZERO = !IS_WEAK && _fails(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C();
        var index = 5;
        while (index--) $instance[ADDER](index, index);
        return !$instance.has(-0);
      });
      if (!ACCEPT_ITERABLES) {
        C = wrapper(function (target, iterable) {
          _anInstance(target, C, NAME);
          var that = _inheritIfRequired(new Base(), target, C);
          if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
          return that;
        });
        C.prototype = proto;
        proto.constructor = C;
      }
      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }
      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
      // weak collections should not contains .clear method
      if (IS_WEAK && proto.clear) delete proto.clear;
    }

    _setToStringTag(C, NAME);

    O[NAME] = C;
    _export(_export.G + _export.W + _export.F * (C != Base), O);

    if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

    return C;
  };

  var MAP = 'Map';

  // 23.1 Map Objects
  var es6_map = _collection(MAP, function (get) {
    return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
  }, {
    // 23.1.3.6 Map.prototype.get(key)
    get: function get(key) {
      var entry = _collectionStrong.getEntry(_validateCollection(this, MAP), key);
      return entry && entry.v;
    },
    // 23.1.3.9 Map.prototype.set(key, value)
    set: function set(key, value) {
      return _collectionStrong.def(_validateCollection(this, MAP), key === 0 ? 0 : key, value);
    }
  }, _collectionStrong, true);

  var max$1 = Math.max;
  var min$2 = Math.min;
  var floor$1 = Math.floor;
  var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  _fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
    return [
      // `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = defined(this);
        var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
        return fn !== undefined
          ? fn.call(searchValue, O, replaceValue)
          : $replace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        var res = maybeCallNative($replace, regexp, this, replaceValue);
        if (res.done) return res.value;

        var rx = _anObject(regexp);
        var S = String(this);
        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);
        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = _regexpExecAbstract(rx, S);
          if (result === null) break;
          results.push(result);
          if (!global) break;
          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
        }
        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];
          var matched = String(result[0]);
          var position = max$1(min$2(_toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];

      // https://tc39.github.io/ecma262/#sec-getsubstitution
    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = _toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return $replace.call(replacement, symbols, function (match, ch) {
        var capture;
        switch (ch.charAt(0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return str.slice(0, position);
          case "'": return str.slice(tailPos);
          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor$1(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    }
  });

  var canvas = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.drawPolylinePath = drawPolylinePath;
  exports.drawBezierCurvePath = drawBezierCurvePath;
  exports["default"] = void 0;





















  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  /**
   * @description Draw a polyline path
   * @param {Object} ctx        Canvas 2d context
   * @param {Array} points      The points that makes up a polyline
   * @param {Boolean} beginPath Whether to execute beginPath
   * @param {Boolean} closePath Whether to execute closePath
   * @return {Undefined} Void
   */
  function drawPolylinePath(ctx, points) {
    var beginPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var closePath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (!ctx || points.length < 2) return false;
    if (beginPath) ctx.beginPath();
    points.forEach(function (point, i) {
      return point && (i === 0 ? ctx.moveTo.apply(ctx, _toConsumableArray(point)) : ctx.lineTo.apply(ctx, _toConsumableArray(point)));
    });
    if (closePath) ctx.closePath();
  }
  /**
   * @description Draw a bezier curve path
   * @param {Object} ctx        Canvas 2d context
   * @param {Array} points      The points that makes up a bezier curve
   * @param {Array} moveTo      The point need to excute moveTo
   * @param {Boolean} beginPath Whether to execute beginPath
   * @param {Boolean} closePath Whether to execute closePath
   * @return {Undefined} Void
   */


  function drawBezierCurvePath(ctx, points) {
    var moveTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var beginPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var closePath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (!ctx || !points) return false;
    if (beginPath) ctx.beginPath();
    if (moveTo) ctx.moveTo.apply(ctx, _toConsumableArray(moveTo));
    points.forEach(function (item) {
      return item && ctx.bezierCurveTo.apply(ctx, _toConsumableArray(item[0]).concat(_toConsumableArray(item[1]), _toConsumableArray(item[2])));
    });
    if (closePath) ctx.closePath();
  }

  var _default = {
    drawPolylinePath: drawPolylinePath,
    drawBezierCurvePath: drawBezierCurvePath
  };
  exports["default"] = _default;
  });

  unwrapExports(canvas);
  var canvas_1 = canvas.drawPolylinePath;
  var canvas_2 = canvas.drawBezierCurvePath;

  var graphs_1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.extendNewGraph = extendNewGraph;
  exports["default"] = exports.text = exports.bezierCurve = exports.smoothline = exports.polyline = exports.regPolygon = exports.sector = exports.arc = exports.ring = exports.rect = exports.ellipse = exports.circle = void 0;





































  var _bezierCurve2 = _interopRequireDefault(lib$1);





  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  var polylineToBezierCurve = _bezierCurve2["default"].polylineToBezierCurve,
      bezierCurveToPolyline = _bezierCurve2["default"].bezierCurveToPolyline;
  var circle = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0
    },
    validator: function validator(_ref) {
      var shape = _ref.shape;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;

      if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
        console.error('Circle shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref2, _ref3) {
      var ctx = _ref2.ctx;
      var shape = _ref3.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;
      ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref4) {
      var shape = _ref4.shape;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;
      return (0, util.checkPointIsInCircle)(position, rx, ry, r);
    },
    setGraphCenter: function setGraphCenter(e, _ref5) {
      var shape = _ref5.shape,
          style = _ref5.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref6, _ref7) {
      var movementX = _ref6.movementX,
          movementY = _ref6.movementY;
      var shape = _ref7.shape;
      this.attr('shape', {
        rx: shape.rx + movementX,
        ry: shape.ry + movementY
      });
    }
  };
  exports.circle = circle;
  var ellipse = {
    shape: {
      rx: 0,
      ry: 0,
      hr: 0,
      vr: 0
    },
    validator: function validator(_ref8) {
      var shape = _ref8.shape;
      var rx = shape.rx,
          ry = shape.ry,
          hr = shape.hr,
          vr = shape.vr;

      if (typeof rx !== 'number' || typeof ry !== 'number' || typeof hr !== 'number' || typeof vr !== 'number') {
        console.error('Ellipse shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref9, _ref10) {
      var ctx = _ref9.ctx;
      var shape = _ref10.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          hr = shape.hr,
          vr = shape.vr;
      ctx.ellipse(rx, ry, hr > 0 ? hr : 0.01, vr > 0 ? vr : 0.01, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref11) {
      var shape = _ref11.shape;
      var rx = shape.rx,
          ry = shape.ry,
          hr = shape.hr,
          vr = shape.vr;
      var a = Math.max(hr, vr);
      var b = Math.min(hr, vr);
      var c = Math.sqrt(a * a - b * b);
      var leftFocusPoint = [rx - c, ry];
      var rightFocusPoint = [rx + c, ry];
      var distance = (0, util.getTwoPointDistance)(position, leftFocusPoint) + (0, util.getTwoPointDistance)(position, rightFocusPoint);
      return distance <= 2 * a;
    },
    setGraphCenter: function setGraphCenter(e, _ref12) {
      var shape = _ref12.shape,
          style = _ref12.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref13, _ref14) {
      var movementX = _ref13.movementX,
          movementY = _ref13.movementY;
      var shape = _ref14.shape;
      this.attr('shape', {
        rx: shape.rx + movementX,
        ry: shape.ry + movementY
      });
    }
  };
  exports.ellipse = ellipse;
  var rect = {
    shape: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },
    validator: function validator(_ref15) {
      var shape = _ref15.shape;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;

      if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
        console.error('Rect shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref16, _ref17) {
      var ctx = _ref16.ctx;
      var shape = _ref17.shape;
      ctx.beginPath();
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref18) {
      var shape = _ref18.shape;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      return (0, util.checkPointIsInRect)(position, x, y, w, h);
    },
    setGraphCenter: function setGraphCenter(e, _ref19) {
      var shape = _ref19.shape,
          style = _ref19.style;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      style.graphCenter = [x + w / 2, y + h / 2];
    },
    move: function move(_ref20, _ref21) {
      var movementX = _ref20.movementX,
          movementY = _ref20.movementY;
      var shape = _ref21.shape;
      this.attr('shape', {
        x: shape.x + movementX,
        y: shape.y + movementY
      });
    }
  };
  exports.rect = rect;
  var ring = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0
    },
    validator: function validator(_ref22) {
      var shape = _ref22.shape;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;

      if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
        console.error('Ring shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref23, _ref24) {
      var ctx = _ref23.ctx;
      var shape = _ref24.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;
      ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref25) {
      var shape = _ref25.shape,
          style = _ref25.style;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;
      var lineWidth = style.lineWidth;
      var halfLineWidth = lineWidth / 2;
      var minDistance = r - halfLineWidth;
      var maxDistance = r + halfLineWidth;
      var distance = (0, util.getTwoPointDistance)(position, [rx, ry]);
      return distance >= minDistance && distance <= maxDistance;
    },
    setGraphCenter: function setGraphCenter(e, _ref26) {
      var shape = _ref26.shape,
          style = _ref26.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref27, _ref28) {
      var movementX = _ref27.movementX,
          movementY = _ref27.movementY;
      var shape = _ref28.shape;
      this.attr('shape', {
        rx: shape.rx + movementX,
        ry: shape.ry + movementY
      });
    }
  };
  exports.ring = ring;
  var arc = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0,
      startAngle: 0,
      endAngle: 0,
      clockWise: true
    },
    validator: function validator(_ref29) {
      var shape = _ref29.shape;
      var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

      if (keys.find(function (key) {
        return typeof shape[key] !== 'number';
      })) {
        console.error('Arc shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref30, _ref31) {
      var ctx = _ref30.ctx;
      var shape = _ref31.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      ctx.arc(rx, ry, r > 0 ? r : 0.001, startAngle, endAngle, !clockWise);
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref32) {
      var shape = _ref32.shape,
          style = _ref32.style;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      var lineWidth = style.lineWidth;
      var halfLineWidth = lineWidth / 2;
      var insideRadius = r - halfLineWidth;
      var outsideRadius = r + halfLineWidth;
      return !(0, util.checkPointIsInSector)(position, rx, ry, insideRadius, startAngle, endAngle, clockWise) && (0, util.checkPointIsInSector)(position, rx, ry, outsideRadius, startAngle, endAngle, clockWise);
    },
    setGraphCenter: function setGraphCenter(e, _ref33) {
      var shape = _ref33.shape,
          style = _ref33.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref34, _ref35) {
      var movementX = _ref34.movementX,
          movementY = _ref34.movementY;
      var shape = _ref35.shape;
      this.attr('shape', {
        rx: shape.rx + movementX,
        ry: shape.ry + movementY
      });
    }
  };
  exports.arc = arc;
  var sector = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0,
      startAngle: 0,
      endAngle: 0,
      clockWise: true
    },
    validator: function validator(_ref36) {
      var shape = _ref36.shape;
      var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

      if (keys.find(function (key) {
        return typeof shape[key] !== 'number';
      })) {
        console.error('Sector shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref37, _ref38) {
      var ctx = _ref37.ctx;
      var shape = _ref38.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      ctx.arc(rx, ry, r > 0 ? r : 0.01, startAngle, endAngle, !clockWise);
      ctx.lineTo(rx, ry);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    },
    hoverCheck: function hoverCheck(position, _ref39) {
      var shape = _ref39.shape;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      return (0, util.checkPointIsInSector)(position, rx, ry, r, startAngle, endAngle, clockWise);
    },
    setGraphCenter: function setGraphCenter(e, _ref40) {
      var shape = _ref40.shape,
          style = _ref40.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref41, _ref42) {
      var movementX = _ref41.movementX,
          movementY = _ref41.movementY;
      var shape = _ref42.shape;
      var rx = shape.rx,
          ry = shape.ry;
      this.attr('shape', {
        rx: rx + movementX,
        ry: ry + movementY
      });
    }
  };
  exports.sector = sector;
  var regPolygon = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0,
      side: 0
    },
    validator: function validator(_ref43) {
      var shape = _ref43.shape;
      var side = shape.side;
      var keys = ['rx', 'ry', 'r', 'side'];

      if (keys.find(function (key) {
        return typeof shape[key] !== 'number';
      })) {
        console.error('RegPolygon shape configuration is abnormal!');
        return false;
      }

      if (side < 3) {
        console.error('RegPolygon at least trigon!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref44, _ref45) {
      var ctx = _ref44.ctx;
      var shape = _ref45.shape,
          cache = _ref45.cache;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          side = shape.side;

      if (!cache.points || cache.rx !== rx || cache.ry !== ry || cache.r !== r || cache.side !== side) {
        var _points = (0, util.getRegularPolygonPoints)(rx, ry, r, side);

        Object.assign(cache, {
          points: _points,
          rx: rx,
          ry: ry,
          r: r,
          side: side
        });
      }

      var points = cache.points;
      (0, canvas.drawPolylinePath)(ctx, points);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    },
    hoverCheck: function hoverCheck(position, _ref46) {
      var cache = _ref46.cache;
      var points = cache.points;
      return (0, util.checkPointIsInPolygon)(position, points);
    },
    setGraphCenter: function setGraphCenter(e, _ref47) {
      var shape = _ref47.shape,
          style = _ref47.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref48, _ref49) {
      var movementX = _ref48.movementX,
          movementY = _ref48.movementY;
      var shape = _ref49.shape,
          cache = _ref49.cache;
      var rx = shape.rx,
          ry = shape.ry;
      cache.rx += movementX;
      cache.ry += movementY;
      this.attr('shape', {
        rx: rx + movementX,
        ry: ry + movementY
      });
      cache.points = cache.points.map(function (_ref50) {
        var _ref51 = _slicedToArray(_ref50, 2),
            x = _ref51[0],
            y = _ref51[1];

        return [x + movementX, y + movementY];
      });
    }
  };
  exports.regPolygon = regPolygon;
  var polyline = {
    shape: {
      points: [],
      close: false
    },
    validator: function validator(_ref52) {
      var shape = _ref52.shape;
      var points = shape.points;

      if (!(points instanceof Array)) {
        console.error('Polyline points should be an array!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref53, _ref54) {
      var ctx = _ref53.ctx;
      var shape = _ref54.shape,
          lineWidth = _ref54.style.lineWidth;
      ctx.beginPath();
      var points = shape.points,
          close = shape.close;
      if (lineWidth === 1) points = (0, util.eliminateBlur)(points);
      (0, canvas.drawPolylinePath)(ctx, points);

      if (close) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.stroke();
      }
    },
    hoverCheck: function hoverCheck(position, _ref55) {
      var shape = _ref55.shape,
          style = _ref55.style;
      var points = shape.points,
          close = shape.close;
      var lineWidth = style.lineWidth;

      if (close) {
        return (0, util.checkPointIsInPolygon)(position, points);
      } else {
        return (0, util.checkPointIsNearPolyline)(position, points, lineWidth);
      }
    },
    setGraphCenter: function setGraphCenter(e, _ref56) {
      var shape = _ref56.shape,
          style = _ref56.style;
      var points = shape.points;
      style.graphCenter = points[0];
    },
    move: function move(_ref57, _ref58) {
      var movementX = _ref57.movementX,
          movementY = _ref57.movementY;
      var shape = _ref58.shape;
      var points = shape.points;
      var moveAfterPoints = points.map(function (_ref59) {
        var _ref60 = _slicedToArray(_ref59, 2),
            x = _ref60[0],
            y = _ref60[1];

        return [x + movementX, y + movementY];
      });
      this.attr('shape', {
        points: moveAfterPoints
      });
    }
  };
  exports.polyline = polyline;
  var smoothline = {
    shape: {
      points: [],
      close: false
    },
    validator: function validator(_ref61) {
      var shape = _ref61.shape;
      var points = shape.points;

      if (!(points instanceof Array)) {
        console.error('Smoothline points should be an array!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref62, _ref63) {
      var ctx = _ref62.ctx;
      var shape = _ref63.shape,
          cache = _ref63.cache;
      var points = shape.points,
          close = shape.close;

      if (!cache.points || cache.points.toString() !== points.toString()) {
        var _bezierCurve = polylineToBezierCurve(points, close);

        var hoverPoints = bezierCurveToPolyline(_bezierCurve);
        Object.assign(cache, {
          points: (0, util.deepClone)(points, true),
          bezierCurve: _bezierCurve,
          hoverPoints: hoverPoints
        });
      }

      var bezierCurve = cache.bezierCurve;
      ctx.beginPath();
      (0, canvas.drawBezierCurvePath)(ctx, bezierCurve.slice(1), bezierCurve[0]);

      if (close) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.stroke();
      }
    },
    hoverCheck: function hoverCheck(position, _ref64) {
      var cache = _ref64.cache,
          shape = _ref64.shape,
          style = _ref64.style;
      var hoverPoints = cache.hoverPoints;
      var close = shape.close;
      var lineWidth = style.lineWidth;

      if (close) {
        return (0, util.checkPointIsInPolygon)(position, hoverPoints);
      } else {
        return (0, util.checkPointIsNearPolyline)(position, hoverPoints, lineWidth);
      }
    },
    setGraphCenter: function setGraphCenter(e, _ref65) {
      var shape = _ref65.shape,
          style = _ref65.style;
      var points = shape.points;
      style.graphCenter = points[0];
    },
    move: function move(_ref66, _ref67) {
      var movementX = _ref66.movementX,
          movementY = _ref66.movementY;
      var shape = _ref67.shape,
          cache = _ref67.cache;
      var points = shape.points;
      var moveAfterPoints = points.map(function (_ref68) {
        var _ref69 = _slicedToArray(_ref68, 2),
            x = _ref69[0],
            y = _ref69[1];

        return [x + movementX, y + movementY];
      });
      cache.points = moveAfterPoints;

      var _cache$bezierCurve$ = _slicedToArray(cache.bezierCurve[0], 2),
          fx = _cache$bezierCurve$[0],
          fy = _cache$bezierCurve$[1];

      var curves = cache.bezierCurve.slice(1);
      cache.bezierCurve = [[fx + movementX, fy + movementY]].concat(_toConsumableArray(curves.map(function (curve) {
        return curve.map(function (_ref70) {
          var _ref71 = _slicedToArray(_ref70, 2),
              x = _ref71[0],
              y = _ref71[1];

          return [x + movementX, y + movementY];
        });
      })));
      cache.hoverPoints = cache.hoverPoints.map(function (_ref72) {
        var _ref73 = _slicedToArray(_ref72, 2),
            x = _ref73[0],
            y = _ref73[1];

        return [x + movementX, y + movementY];
      });
      this.attr('shape', {
        points: moveAfterPoints
      });
    }
  };
  exports.smoothline = smoothline;
  var bezierCurve = {
    shape: {
      points: [],
      close: false
    },
    validator: function validator(_ref74) {
      var shape = _ref74.shape;
      var points = shape.points;

      if (!(points instanceof Array)) {
        console.error('BezierCurve points should be an array!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref75, _ref76) {
      var ctx = _ref75.ctx;
      var shape = _ref76.shape,
          cache = _ref76.cache;
      var points = shape.points,
          close = shape.close;

      if (!cache.points || cache.points.toString() !== points.toString()) {
        var hoverPoints = bezierCurveToPolyline(points, 20);
        Object.assign(cache, {
          points: (0, util.deepClone)(points, true),
          hoverPoints: hoverPoints
        });
      }

      ctx.beginPath();
      (0, canvas.drawBezierCurvePath)(ctx, points.slice(1), points[0]);

      if (close) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.stroke();
      }
    },
    hoverCheck: function hoverCheck(position, _ref77) {
      var cache = _ref77.cache,
          shape = _ref77.shape,
          style = _ref77.style;
      var hoverPoints = cache.hoverPoints;
      var close = shape.close;
      var lineWidth = style.lineWidth;

      if (close) {
        return (0, util.checkPointIsInPolygon)(position, hoverPoints);
      } else {
        return (0, util.checkPointIsNearPolyline)(position, hoverPoints, lineWidth);
      }
    },
    setGraphCenter: function setGraphCenter(e, _ref78) {
      var shape = _ref78.shape,
          style = _ref78.style;
      var points = shape.points;
      style.graphCenter = points[0];
    },
    move: function move(_ref79, _ref80) {
      var movementX = _ref79.movementX,
          movementY = _ref79.movementY;
      var shape = _ref80.shape,
          cache = _ref80.cache;
      var points = shape.points;

      var _points$ = _slicedToArray(points[0], 2),
          fx = _points$[0],
          fy = _points$[1];

      var curves = points.slice(1);
      var bezierCurve = [[fx + movementX, fy + movementY]].concat(_toConsumableArray(curves.map(function (curve) {
        return curve.map(function (_ref81) {
          var _ref82 = _slicedToArray(_ref81, 2),
              x = _ref82[0],
              y = _ref82[1];

          return [x + movementX, y + movementY];
        });
      })));
      cache.points = bezierCurve;
      cache.hoverPoints = cache.hoverPoints.map(function (_ref83) {
        var _ref84 = _slicedToArray(_ref83, 2),
            x = _ref84[0],
            y = _ref84[1];

        return [x + movementX, y + movementY];
      });
      this.attr('shape', {
        points: bezierCurve
      });
    }
  };
  exports.bezierCurve = bezierCurve;
  var text = {
    shape: {
      content: '',
      position: [],
      maxWidth: undefined,
      rowGap: 0
    },
    validator: function validator(_ref85) {
      var shape = _ref85.shape;
      var content = shape.content,
          position = shape.position,
          rowGap = shape.rowGap;

      if (typeof content !== 'string') {
        console.error('Text content should be a string!');
        return false;
      }

      if (!(position instanceof Array)) {
        console.error('Text position should be an array!');
        return false;
      }

      if (typeof rowGap !== 'number') {
        console.error('Text rowGap should be a number!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref86, _ref87) {
      var ctx = _ref86.ctx;
      var shape = _ref87.shape;
      var content = shape.content,
          position = shape.position,
          maxWidth = shape.maxWidth,
          rowGap = shape.rowGap;
      var textBaseline = ctx.textBaseline,
          font = ctx.font;
      var fontSize = parseInt(font.replace(/\D/g, ''));

      var _position = position,
          _position2 = _slicedToArray(_position, 2),
          x = _position2[0],
          y = _position2[1];

      content = content.split('\n');
      var rowNum = content.length;
      var lineHeight = fontSize + rowGap;
      var allHeight = rowNum * lineHeight - rowGap;
      var offset = 0;

      if (textBaseline === 'middle') {
        offset = allHeight / 2;
        y += fontSize / 2;
      }

      if (textBaseline === 'bottom') {
        offset = allHeight;
        y += fontSize;
      }

      position = new Array(rowNum).fill(0).map(function (foo, i) {
        return [x, y + i * lineHeight - offset];
      });
      ctx.beginPath();
      content.forEach(function (text, i) {
        ctx.fillText.apply(ctx, [text].concat(_toConsumableArray(position[i]), [maxWidth]));
        ctx.strokeText.apply(ctx, [text].concat(_toConsumableArray(position[i]), [maxWidth]));
      });
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref88) {
      var shape = _ref88.shape,
          style = _ref88.style;
      return false;
    },
    setGraphCenter: function setGraphCenter(e, _ref89) {
      var shape = _ref89.shape,
          style = _ref89.style;
      var position = shape.position;
      style.graphCenter = _toConsumableArray(position);
    },
    move: function move(_ref90, _ref91) {
      var movementX = _ref90.movementX,
          movementY = _ref90.movementY;
      var shape = _ref91.shape;

      var _shape$position = _slicedToArray(shape.position, 2),
          x = _shape$position[0],
          y = _shape$position[1];

      this.attr('shape', {
        position: [x + movementX, y + movementY]
      });
    }
  };
  exports.text = text;
  var graphs = new Map([['circle', circle], ['ellipse', ellipse], ['rect', rect], ['ring', ring], ['arc', arc], ['sector', sector], ['regPolygon', regPolygon], ['polyline', polyline], ['smoothline', smoothline], ['bezierCurve', bezierCurve], ['text', text]]);
  var _default = graphs;
  /**
   * @description Extend new graph
   * @param {String} name   Name of Graph
   * @param {Object} config Configuration of Graph
   * @return {Undefined} Void
   */

  exports["default"] = _default;

  function extendNewGraph(name, config) {
    if (!name || !config) {
      console.error('ExtendNewGraph Missing Parameters!');
      return;
    }

    if (!config.shape) {
      console.error('Required attribute of shape to extendNewGraph!');
      return;
    }

    if (!config.validator) {
      console.error('Required function of validator to extendNewGraph!');
      return;
    }

    if (!config.draw) {
      console.error('Required function of draw to extendNewGraph!');
      return;
    }

    graphs.set(name, config);
  }
  });

  unwrapExports(graphs_1);
  var graphs_2 = graphs_1.extendNewGraph;
  var graphs_3 = graphs_1.text;
  var graphs_4 = graphs_1.bezierCurve;
  var graphs_5 = graphs_1.smoothline;
  var graphs_6 = graphs_1.polyline;
  var graphs_7 = graphs_1.regPolygon;
  var graphs_8 = graphs_1.sector;
  var graphs_9 = graphs_1.arc;
  var graphs_10 = graphs_1.ring;
  var graphs_11 = graphs_1.rect;
  var graphs_12 = graphs_1.ellipse;
  var graphs_13 = graphs_1.circle;

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList)
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var style_class = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;







































  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * @description Class Style
   * @param {Object} style  Style configuration
   * @return {Style} Instance of Style
   */
  var Style = function Style(style) {
    _classCallCheck(this, Style);

    this.colorProcessor(style);
    var defaultStyle = {
      /**
       * @description Rgba value of graph fill color
       * @type {Array}
       * @default fill = [0, 0, 0, 1]
       */
      fill: [0, 0, 0, 1],

      /**
       * @description Rgba value of graph stroke color
       * @type {Array}
       * @default stroke = [0, 0, 0, 1]
       */
      stroke: [0, 0, 0, 0],

      /**
       * @description Opacity of graph
       * @type {Number}
       * @default opacity = 1
       */
      opacity: 1,

      /**
       * @description LineCap of Ctx
       * @type {String}
       * @default lineCap = null
       * @example lineCap = 'butt'|'round'|'square'
       */
      lineCap: null,

      /**
       * @description Linejoin of Ctx
       * @type {String}
       * @default lineJoin = null
       * @example lineJoin = 'round'|'bevel'|'miter'
       */
      lineJoin: null,

      /**
       * @description LineDash of Ctx
       * @type {Array}
       * @default lineDash = null
       * @example lineDash = [10, 10]
       */
      lineDash: null,

      /**
       * @description LineDashOffset of Ctx
       * @type {Number}
       * @default lineDashOffset = null
       * @example lineDashOffset = 10
       */
      lineDashOffset: null,

      /**
       * @description ShadowBlur of Ctx
       * @type {Number}
       * @default shadowBlur = 0
       */
      shadowBlur: 0,

      /**
       * @description Rgba value of graph shadow color
       * @type {Array}
       * @default shadowColor = [0, 0, 0, 0]
       */
      shadowColor: [0, 0, 0, 0],

      /**
       * @description ShadowOffsetX of Ctx
       * @type {Number}
       * @default shadowOffsetX = 0
       */
      shadowOffsetX: 0,

      /**
       * @description ShadowOffsetY of Ctx
       * @type {Number}
       * @default shadowOffsetY = 0
       */
      shadowOffsetY: 0,

      /**
       * @description LineWidth of Ctx
       * @type {Number}
       * @default lineWidth = 0
       */
      lineWidth: 0,

      /**
       * @description Stroke width is not scaled
       * @type {Boolean}
       * @default strokeNoScale = false
       */
      strokeNoScale: false,

      /**
       * @description Center point of the graph
       * @type {Array}
       * @default graphCenter = null
       * @example graphCenter = [10, 10]
       */
      graphCenter: null,

      /**
       * @description Graph scale
       * @type {Array}
       * @default scale = null
       * @example scale = [1.5, 1.5]
       */
      scale: null,

      /**
       * @description Graph rotation degree
       * @type {Number}
       * @default rotate = null
       * @example rotate = 10
       */
      rotate: null,

      /**
       * @description Graph translate distance
       * @type {Array}
       * @default translate = null
       * @example translate = [10, 10]
       */
      translate: null,

      /**
       * @description Cursor status when hover
       * @type {String}
       * @default hoverCursor = 'pointer'
       * @example hoverCursor = 'default'|'pointer'|'auto'|'crosshair'|'move'|'wait'|...
       */
      hoverCursor: 'pointer',

      /**
       * @description Font style of Ctx
       * @type {String}
       * @default fontStyle = 'normal'
       * @example fontStyle = 'normal'|'italic'|'oblique'
       */
      fontStyle: 'normal',

      /**
       * @description Font varient of Ctx
       * @type {String}
       * @default fontVarient = 'normal'
       * @example fontVarient = 'normal'|'small-caps'
       */
      fontVarient: 'normal',

      /**
       * @description Font weight of Ctx
       * @type {String|Number}
       * @default fontWeight = 'normal'
       * @example fontWeight = 'normal'|'bold'|'bolder'|'lighter'|Number
       */
      fontWeight: 'normal',

      /**
       * @description Font size of Ctx
       * @type {Number}
       * @default fontSize = 10
       */
      fontSize: 10,

      /**
       * @description Font family of Ctx
       * @type {String}
       * @default fontFamily = 'Arial'
       */
      fontFamily: 'Arial',

      /**
       * @description TextAlign of Ctx
       * @type {String}
       * @default textAlign = 'center'
       * @example textAlign = 'start'|'end'|'left'|'right'|'center'
       */
      textAlign: 'center',

      /**
       * @description TextBaseline of Ctx
       * @type {String}
       * @default textBaseline = 'middle'
       * @example textBaseline = 'top'|'bottom'|'middle'|'alphabetic'|'hanging'
       */
      textBaseline: 'middle',

      /**
       * @description The color used to create the gradient
       * @type {Array}
       * @default gradientColor = null
       * @example gradientColor = ['#000', '#111', '#222']
       */
      gradientColor: null,

      /**
       * @description Gradient type
       * @type {String}
       * @default gradientType = 'linear'
       * @example gradientType = 'linear' | 'radial'
       */
      gradientType: 'linear',

      /**
       * @description Gradient params
       * @type {Array}
       * @default gradientParams = null
       * @example gradientParams = [x0, y0, x1, y1] (Linear Gradient)
       * @example gradientParams = [x0, y0, r0, x1, y1, r1] (Radial Gradient)
       */
      gradientParams: null,

      /**
       * @description When to use gradients
       * @type {String}
       * @default gradientWith = 'stroke'
       * @example gradientWith = 'stroke' | 'fill'
       */
      gradientWith: 'stroke',

      /**
       * @description Gradient color stops
       * @type {String}
       * @default gradientStops = 'auto'
       * @example gradientStops = 'auto' | [0, .2, .3, 1]
       */
      gradientStops: 'auto',

      /**
       * @description Extended color that supports animation transition
       * @type {Array|Object}
       * @default colors = null
       * @example colors = ['#000', '#111', '#222']
       * @example colors = { a: '#000', b: '#111' }
       */
      colors: null
    };
    Object.assign(this, defaultStyle, style);
  };
  /**
   * @description Set colors to rgba value
   * @param {Object} style style config
   * @param {Boolean} reverse Whether to perform reverse operation
   * @return {Undefined} Void
   */


  exports["default"] = Style;

  Style.prototype.colorProcessor = function (style) {
    var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var processor = reverse ? lib.getColorFromRgbValue : lib.getRgbaValue;
    var colorProcessorKeys = ['fill', 'stroke', 'shadowColor'];
    var allKeys = Object.keys(style);
    var colorKeys = allKeys.filter(function (key) {
      return colorProcessorKeys.find(function (k) {
        return k === key;
      });
    });
    colorKeys.forEach(function (key) {
      return style[key] = processor(style[key]);
    });
    var gradientColor = style.gradientColor,
        colors = style.colors;
    if (gradientColor) style.gradientColor = gradientColor.map(function (c) {
      return processor(c);
    });

    if (colors) {
      var colorsKeys = Object.keys(colors);
      colorsKeys.forEach(function (key) {
        return colors[key] = processor(colors[key]);
      });
    }
  };
  /**
   * @description Init graph style
   * @param {Object} ctx Context of canvas
   * @return {Undefined} Void
   */


  Style.prototype.initStyle = function (ctx) {
    initTransform(ctx, this);
    initGraphStyle(ctx, this);
    initGradient(ctx, this);
  };
  /**
   * @description Init canvas transform
   * @param {Object} ctx  Context of canvas
   * @param {Style} style Instance of Style
   * @return {Undefined} Void
   */


  function initTransform(ctx, style) {
    ctx.save();
    var graphCenter = style.graphCenter,
        rotate = style.rotate,
        scale = style.scale,
        translate = style.translate;
    if (!(graphCenter instanceof Array)) return;
    ctx.translate.apply(ctx, _toConsumableArray(graphCenter));
    if (rotate) ctx.rotate(rotate * Math.PI / 180);
    if (scale instanceof Array) ctx.scale.apply(ctx, _toConsumableArray(scale));
    if (translate) ctx.translate.apply(ctx, _toConsumableArray(translate));
    ctx.translate(-graphCenter[0], -graphCenter[1]);
  }

  var autoSetStyleKeys = ['lineCap', 'lineJoin', 'lineDashOffset', 'shadowOffsetX', 'shadowOffsetY', 'lineWidth', 'textAlign', 'textBaseline'];
  /**
   * @description Set the style of canvas ctx
   * @param {Object} ctx  Context of canvas
   * @param {Style} style Instance of Style
   * @return {Undefined} Void
   */

  function initGraphStyle(ctx, style) {
    var fill = style.fill,
        stroke = style.stroke,
        shadowColor = style.shadowColor,
        opacity = style.opacity;
    autoSetStyleKeys.forEach(function (key) {
      if (key || typeof key === 'number') ctx[key] = style[key];
    });
    fill = _toConsumableArray(fill);
    stroke = _toConsumableArray(stroke);
    shadowColor = _toConsumableArray(shadowColor);
    fill[3] *= opacity;
    stroke[3] *= opacity;
    shadowColor[3] *= opacity;
    ctx.fillStyle = (0, lib.getColorFromRgbValue)(fill);
    ctx.strokeStyle = (0, lib.getColorFromRgbValue)(stroke);
    ctx.shadowColor = (0, lib.getColorFromRgbValue)(shadowColor);
    var lineDash = style.lineDash,
        shadowBlur = style.shadowBlur;

    if (lineDash) {
      lineDash = lineDash.map(function (v) {
        return v >= 0 ? v : 0;
      });
      ctx.setLineDash(lineDash);
    }

    if (typeof shadowBlur === 'number') ctx.shadowBlur = shadowBlur > 0 ? shadowBlur : 0.001;
    var fontStyle = style.fontStyle,
        fontVarient = style.fontVarient,
        fontWeight = style.fontWeight,
        fontSize = style.fontSize,
        fontFamily = style.fontFamily;
    ctx.font = fontStyle + ' ' + fontVarient + ' ' + fontWeight + ' ' + fontSize + 'px' + ' ' + fontFamily;
  }
  /**
   * @description Set the gradient color of canvas ctx
   * @param {Object} ctx  Context of canvas
   * @param {Style} style Instance of Style
   * @return {Undefined} Void
   */


  function initGradient(ctx, style) {
    if (!gradientValidator(style)) return;
    var gradientColor = style.gradientColor,
        gradientParams = style.gradientParams,
        gradientType = style.gradientType,
        gradientWith = style.gradientWith,
        gradientStops = style.gradientStops,
        opacity = style.opacity;
    gradientColor = gradientColor.map(function (color) {
      var colorOpacity = color[3] * opacity;

      var clonedColor = _toConsumableArray(color);

      clonedColor[3] = colorOpacity;
      return clonedColor;
    });
    gradientColor = gradientColor.map(function (c) {
      return (0, lib.getColorFromRgbValue)(c);
    });
    if (gradientStops === 'auto') gradientStops = getAutoColorStops(gradientColor);
    var gradient = ctx["create".concat(gradientType.slice(0, 1).toUpperCase() + gradientType.slice(1), "Gradient")].apply(ctx, _toConsumableArray(gradientParams));
    gradientStops.forEach(function (stop, i) {
      return gradient.addColorStop(stop, gradientColor[i]);
    });
    ctx["".concat(gradientWith, "Style")] = gradient;
  }
  /**
   * @description Check if the gradient configuration is legal
   * @param {Style} style Instance of Style
   * @return {Boolean} Check Result
   */


  function gradientValidator(style) {
    var gradientColor = style.gradientColor,
        gradientParams = style.gradientParams,
        gradientType = style.gradientType,
        gradientWith = style.gradientWith,
        gradientStops = style.gradientStops;
    if (!gradientColor || !gradientParams) return false;

    if (gradientColor.length === 1) {
      console.warn('The gradient needs to provide at least two colors');
      return false;
    }

    if (gradientType !== 'linear' && gradientType !== 'radial') {
      console.warn('GradientType only supports linear or radial, current value is ' + gradientType);
      return false;
    }

    var gradientParamsLength = gradientParams.length;

    if (gradientType === 'linear' && gradientParamsLength !== 4 || gradientType === 'radial' && gradientParamsLength !== 6) {
      console.warn('The expected length of gradientParams is ' + (gradientType === 'linear' ? '4' : '6'));
      return false;
    }

    if (gradientWith !== 'fill' && gradientWith !== 'stroke') {
      console.warn('GradientWith only supports fill or stroke, current value is ' + gradientWith);
      return false;
    }

    if (gradientStops !== 'auto' && !(gradientStops instanceof Array)) {
      console.warn("gradientStops only supports 'auto' or Number Array ([0, .5, 1]), current value is " + gradientStops);
      return false;
    }

    return true;
  }
  /**
   * @description Get a uniform gradient color stop
   * @param {Array} color Gradient color
   * @return {Array} Gradient color stop
   */


  function getAutoColorStops(color) {
    var stopGap = 1 / (color.length - 1);
    return color.map(function (foo, i) {
      return stopGap * i;
    });
  }
  /**
   * @description Restore canvas ctx transform
   * @param {Object} ctx  Context of canvas
   * @return {Undefined} Void
   */


  Style.prototype.restoreTransform = function (ctx) {
    ctx.restore();
  };
  /**
   * @description Update style data
   * @param {Object} change Changed data
   * @return {Undefined} Void
   */


  Style.prototype.update = function (change) {
    this.colorProcessor(change);
    Object.assign(this, change);
  };
  /**
   * @description Get the current style configuration
   * @return {Object} Style configuration
   */


  Style.prototype.getStyle = function () {
    var clonedStyle = (0, util.deepClone)(this, true);
    this.colorProcessor(clonedStyle, true);
    return clonedStyle;
  };
  });

  unwrapExports(style_class);

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  var curves = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = exports.easeInOutBounce = exports.easeOutBounce = exports.easeInBounce = exports.easeInOutElastic = exports.easeOutElastic = exports.easeInElastic = exports.easeInOutBack = exports.easeOutBack = exports.easeInBack = exports.easeInOutQuint = exports.easeOutQuint = exports.easeInQuint = exports.easeInOutQuart = exports.easeOutQuart = exports.easeInQuart = exports.easeInOutCubic = exports.easeOutCubic = exports.easeInCubic = exports.easeInOutQuad = exports.easeOutQuad = exports.easeInQuad = exports.easeInOutSine = exports.easeOutSine = exports.easeInSine = exports.linear = void 0;
  var linear = [[[0, 1], '', [0.33, 0.67]], [[1, 0], [0.67, 0.33]]];
  /**
   * @description Sine
   */

  exports.linear = linear;
  var easeInSine = [[[0, 1]], [[0.538, 0.564], [0.169, 0.912], [0.880, 0.196]], [[1, 0]]];
  exports.easeInSine = easeInSine;
  var easeOutSine = [[[0, 1]], [[0.444, 0.448], [0.169, 0.736], [0.718, 0.16]], [[1, 0]]];
  exports.easeOutSine = easeOutSine;
  var easeInOutSine = [[[0, 1]], [[0.5, 0.5], [0.2, 1], [0.8, 0]], [[1, 0]]];
  /**
   * @description Quad
   */

  exports.easeInOutSine = easeInOutSine;
  var easeInQuad = [[[0, 1]], [[0.550, 0.584], [0.231, 0.904], [0.868, 0.264]], [[1, 0]]];
  exports.easeInQuad = easeInQuad;
  var easeOutQuad = [[[0, 1]], [[0.413, 0.428], [0.065, 0.816], [0.760, 0.04]], [[1, 0]]];
  exports.easeOutQuad = easeOutQuad;
  var easeInOutQuad = [[[0, 1]], [[0.5, 0.5], [0.3, 0.9], [0.7, 0.1]], [[1, 0]]];
  /**
   * @description Cubic
   */

  exports.easeInOutQuad = easeInOutQuad;
  var easeInCubic = [[[0, 1]], [[0.679, 0.688], [0.366, 0.992], [0.992, 0.384]], [[1, 0]]];
  exports.easeInCubic = easeInCubic;
  var easeOutCubic = [[[0, 1]], [[0.321, 0.312], [0.008, 0.616], [0.634, 0.008]], [[1, 0]]];
  exports.easeOutCubic = easeOutCubic;
  var easeInOutCubic = [[[0, 1]], [[0.5, 0.5], [0.3, 1], [0.7, 0]], [[1, 0]]];
  /**
   * @description Quart
   */

  exports.easeInOutCubic = easeInOutCubic;
  var easeInQuart = [[[0, 1]], [[0.812, 0.74], [0.611, 0.988], [1.013, 0.492]], [[1, 0]]];
  exports.easeInQuart = easeInQuart;
  var easeOutQuart = [[[0, 1]], [[0.152, 0.244], [0.001, 0.448], [0.285, -0.02]], [[1, 0]]];
  exports.easeOutQuart = easeOutQuart;
  var easeInOutQuart = [[[0, 1]], [[0.5, 0.5], [0.4, 1], [0.6, 0]], [[1, 0]]];
  /**
   * @description Quint
   */

  exports.easeInOutQuart = easeInOutQuart;
  var easeInQuint = [[[0, 1]], [[0.857, 0.856], [0.714, 1], [1, 0.712]], [[1, 0]]];
  exports.easeInQuint = easeInQuint;
  var easeOutQuint = [[[0, 1]], [[0.108, 0.2], [0.001, 0.4], [0.214, -0.012]], [[1, 0]]];
  exports.easeOutQuint = easeOutQuint;
  var easeInOutQuint = [[[0, 1]], [[0.5, 0.5], [0.5, 1], [0.5, 0]], [[1, 0]]];
  /**
   * @description Back
   */

  exports.easeInOutQuint = easeInOutQuint;
  var easeInBack = [[[0, 1]], [[0.667, 0.896], [0.380, 1.184], [0.955, 0.616]], [[1, 0]]];
  exports.easeInBack = easeInBack;
  var easeOutBack = [[[0, 1]], [[0.335, 0.028], [0.061, 0.22], [0.631, -0.18]], [[1, 0]]];
  exports.easeOutBack = easeOutBack;
  var easeInOutBack = [[[0, 1]], [[0.5, 0.5], [0.4, 1.4], [0.6, -0.4]], [[1, 0]]];
  /**
   * @description Elastic
   */

  exports.easeInOutBack = easeInOutBack;
  var easeInElastic = [[[0, 1]], [[0.474, 0.964], [0.382, 0.988], [0.557, 0.952]], [[0.619, 1.076], [0.565, 1.088], [0.669, 1.08]], [[0.770, 0.916], [0.712, 0.924], [0.847, 0.904]], [[0.911, 1.304], [0.872, 1.316], [0.961, 1.34]], [[1, 0]]];
  exports.easeInElastic = easeInElastic;
  var easeOutElastic = [[[0, 1]], [[0.073, -0.32], [0.034, -0.328], [0.104, -0.344]], [[0.191, 0.092], [0.110, 0.06], [0.256, 0.08]], [[0.310, -0.076], [0.260, -0.068], [0.357, -0.076]], [[0.432, 0.032], [0.362, 0.028], [0.683, -0.004]], [[1, 0]]];
  exports.easeOutElastic = easeOutElastic;
  var easeInOutElastic = [[[0, 1]], [[0.210, 0.94], [0.167, 0.884], [0.252, 0.98]], [[0.299, 1.104], [0.256, 1.092], [0.347, 1.108]], [[0.5, 0.496], [0.451, 0.672], [0.548, 0.324]], [[0.696, -0.108], [0.652, -0.112], [0.741, -0.124]], [[0.805, 0.064], [0.756, 0.012], [0.866, 0.096]], [[1, 0]]];
  /**
   * @description Bounce
   */

  exports.easeInOutElastic = easeInOutElastic;
  var easeInBounce = [[[0, 1]], [[0.148, 1], [0.075, 0.868], [0.193, 0.848]], [[0.326, 1], [0.276, 0.836], [0.405, 0.712]], [[0.600, 1], [0.511, 0.708], [0.671, 0.348]], [[1, 0]]];
  exports.easeInBounce = easeInBounce;
  var easeOutBounce = [[[0, 1]], [[0.357, 0.004], [0.270, 0.592], [0.376, 0.252]], [[0.604, -0.004], [0.548, 0.312], [0.669, 0.184]], [[0.820, 0], [0.749, 0.184], [0.905, 0.132]], [[1, 0]]];
  exports.easeOutBounce = easeOutBounce;
  var easeInOutBounce = [[[0, 1]], [[0.102, 1], [0.050, 0.864], [0.117, 0.86]], [[0.216, 0.996], [0.208, 0.844], [0.227, 0.808]], [[0.347, 0.996], [0.343, 0.8], [0.480, 0.292]], [[0.635, 0.004], [0.511, 0.676], [0.656, 0.208]], [[0.787, 0], [0.760, 0.2], [0.795, 0.144]], [[0.905, -0.004], [0.899, 0.164], [0.944, 0.144]], [[1, 0]]];
  exports.easeInOutBounce = easeInOutBounce;

  var _default = new Map([['linear', linear], ['easeInSine', easeInSine], ['easeOutSine', easeOutSine], ['easeInOutSine', easeInOutSine], ['easeInQuad', easeInQuad], ['easeOutQuad', easeOutQuad], ['easeInOutQuad', easeInOutQuad], ['easeInCubic', easeInCubic], ['easeOutCubic', easeOutCubic], ['easeInOutCubic', easeInOutCubic], ['easeInQuart', easeInQuart], ['easeOutQuart', easeOutQuart], ['easeInOutQuart', easeInOutQuart], ['easeInQuint', easeInQuint], ['easeOutQuint', easeOutQuint], ['easeInOutQuint', easeInOutQuint], ['easeInBack', easeInBack], ['easeOutBack', easeOutBack], ['easeInOutBack', easeInOutBack], ['easeInElastic', easeInElastic], ['easeOutElastic', easeOutElastic], ['easeInOutElastic', easeInOutElastic], ['easeInBounce', easeInBounce], ['easeOutBounce', easeOutBounce], ['easeInOutBounce', easeInOutBounce]]);

  exports["default"] = _default;
  });

  unwrapExports(curves);
  var curves_1 = curves.easeInOutBounce;
  var curves_2 = curves.easeOutBounce;
  var curves_3 = curves.easeInBounce;
  var curves_4 = curves.easeInOutElastic;
  var curves_5 = curves.easeOutElastic;
  var curves_6 = curves.easeInElastic;
  var curves_7 = curves.easeInOutBack;
  var curves_8 = curves.easeOutBack;
  var curves_9 = curves.easeInBack;
  var curves_10 = curves.easeInOutQuint;
  var curves_11 = curves.easeOutQuint;
  var curves_12 = curves.easeInQuint;
  var curves_13 = curves.easeInOutQuart;
  var curves_14 = curves.easeOutQuart;
  var curves_15 = curves.easeInQuart;
  var curves_16 = curves.easeInOutCubic;
  var curves_17 = curves.easeOutCubic;
  var curves_18 = curves.easeInCubic;
  var curves_19 = curves.easeInOutQuad;
  var curves_20 = curves.easeOutQuad;
  var curves_21 = curves.easeInQuad;
  var curves_22 = curves.easeInOutSine;
  var curves_23 = curves.easeOutSine;
  var curves_24 = curves.easeInSine;
  var curves_25 = curves.linear;

  var lib$2 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.transition = transition;
  exports.injectNewCurve = injectNewCurve;
  exports["default"] = void 0;

  var _slicedToArray2 = interopRequireDefault(slicedToArray);

  var _typeof2 = interopRequireDefault(_typeof_1);

  var _curves = interopRequireDefault(curves);

  var defaultTransitionBC = 'linear';
  /**
   * @description Get the N-frame animation state by the start and end state
   *              of the animation and the easing curve
   * @param {String|Array} tBC               Easing curve name or data
   * @param {Number|Array|Object} startState Animation start state
   * @param {Number|Array|Object} endState   Animation end state
   * @param {Number} frameNum                Number of Animation frames
   * @param {Boolean} deep                   Whether to use recursive mode
   * @return {Array|Boolean} State of each frame of the animation (Invalid input will return false)
   */

  function transition(tBC) {
    var startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;
    var deep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (!checkParams.apply(void 0, arguments)) return false;

    try {
      // Get the transition bezier curve
      var bezierCurve = getBezierCurve(tBC); // Get the progress of each frame state

      var frameStateProgress = getFrameStateProgress(bezierCurve, frameNum); // If the recursion mode is not enabled or the state type is Number, the shallow state calculation is performed directly.

      if (!deep || typeof endState === 'number') return getTransitionState(startState, endState, frameStateProgress);
      return recursionTransitionState(startState, endState, frameStateProgress);
    } catch (_unused) {
      console.warn('Transition parameter may be abnormal!');
      return [endState];
    }
  }
  /**
   * @description Check if the parameters are legal
   * @param {String} tBC      Name of transition bezier curve
   * @param {Any} startState  Transition start state
   * @param {Any} endState    Transition end state
   * @param {Number} frameNum Number of transition frames
   * @return {Boolean} Is the parameter legal
   */


  function checkParams(tBC) {
    var startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;

    if (!tBC || startState === false || endState === false || !frameNum) {
      console.error('transition: Missing Parameters!');
      return false;
    }

    if ((0, _typeof2["default"])(startState) !== (0, _typeof2["default"])(endState)) {
      console.error('transition: Inconsistent Status Types!');
      return false;
    }

    var stateType = (0, _typeof2["default"])(endState);

    if (stateType === 'string' || stateType === 'boolean' || !tBC.length) {
      console.error('transition: Unsupported Data Type of State!');
      return false;
    }

    if (!_curves["default"].has(tBC) && !(tBC instanceof Array)) {
      console.warn('transition: Transition curve not found, default curve will be used!');
    }

    return true;
  }
  /**
   * @description Get the transition bezier curve
   * @param {String} tBC Name of transition bezier curve
   * @return {Array} Bezier curve data
   */


  function getBezierCurve(tBC) {
    var bezierCurve = '';

    if (_curves["default"].has(tBC)) {
      bezierCurve = _curves["default"].get(tBC);
    } else if (tBC instanceof Array) {
      bezierCurve = tBC;
    } else {
      bezierCurve = _curves["default"].get(defaultTransitionBC);
    }

    return bezierCurve;
  }
  /**
   * @description Get the progress of each frame state
   * @param {Array} bezierCurve Transition bezier curve
   * @param {Number} frameNum   Number of transition frames
   * @return {Array} Progress of each frame state
   */


  function getFrameStateProgress(bezierCurve, frameNum) {
    var tMinus = 1 / (frameNum - 1);
    var tState = new Array(frameNum).fill(0).map(function (t, i) {
      return i * tMinus;
    });
    var frameState = tState.map(function (t) {
      return getFrameStateFromT(bezierCurve, t);
    });
    return frameState;
  }
  /**
   * @description Get the progress of the corresponding frame according to t
   * @param {Array} bezierCurve Transition bezier curve
   * @param {Number} t          Current frame t
   * @return {Number} Progress of current frame
   */


  function getFrameStateFromT(bezierCurve, t) {
    var tBezierCurvePoint = getBezierCurvePointFromT(bezierCurve, t);
    var bezierCurvePointT = getBezierCurvePointTFromReT(tBezierCurvePoint, t);
    return getBezierCurveTState(tBezierCurvePoint, bezierCurvePointT);
  }
  /**
   * @description Get the corresponding sub-curve according to t
   * @param {Array} bezierCurve Transition bezier curve
   * @param {Number} t          Current frame t
   * @return {Array} Sub-curve of t
   */


  function getBezierCurvePointFromT(bezierCurve, t) {
    var lastIndex = bezierCurve.length - 1;
    var begin = '',
        end = '';
    bezierCurve.findIndex(function (item, i) {
      if (i === lastIndex) return;
      begin = item;
      end = bezierCurve[i + 1];
      var currentMainPointX = begin[0][0];
      var nextMainPointX = end[0][0];
      return t >= currentMainPointX && t < nextMainPointX;
    });
    var p0 = begin[0];
    var p1 = begin[2] || begin[0];
    var p2 = end[1] || end[0];
    var p3 = end[0];
    return [p0, p1, p2, p3];
  }
  /**
   * @description Get local t based on t and sub-curve
   * @param {Array} bezierCurve Sub-curve
   * @param {Number} t          Current frame t
   * @return {Number} local t of sub-curve
   */


  function getBezierCurvePointTFromReT(bezierCurve, t) {
    var reBeginX = bezierCurve[0][0];
    var reEndX = bezierCurve[3][0];
    var xMinus = reEndX - reBeginX;
    var tMinus = t - reBeginX;
    return tMinus / xMinus;
  }
  /**
   * @description Get the curve progress of t
   * @param {Array} bezierCurve Sub-curve
   * @param {Number} t          Current frame t
   * @return {Number} Progress of current frame
   */


  function getBezierCurveTState(_ref, t) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 4),
        _ref2$ = (0, _slicedToArray2["default"])(_ref2[0], 2),
        p0 = _ref2$[1],
        _ref2$2 = (0, _slicedToArray2["default"])(_ref2[1], 2),
        p1 = _ref2$2[1],
        _ref2$3 = (0, _slicedToArray2["default"])(_ref2[2], 2),
        p2 = _ref2$3[1],
        _ref2$4 = (0, _slicedToArray2["default"])(_ref2[3], 2),
        p3 = _ref2$4[1];

    var pow = Math.pow;
    var tMinus = 1 - t;
    var result1 = p0 * pow(tMinus, 3);
    var result2 = 3 * p1 * t * pow(tMinus, 2);
    var result3 = 3 * p2 * pow(t, 2) * tMinus;
    var result4 = p3 * pow(t, 3);
    return 1 - (result1 + result2 + result3 + result4);
  }
  /**
   * @description Get transition state according to frame progress
   * @param {Any} startState   Transition start state
   * @param {Any} endState     Transition end state
   * @param {Array} frameState Frame state progress
   * @return {Array} Transition frame state
   */


  function getTransitionState(begin, end, frameState) {
    var stateType = 'object';
    if (typeof begin === 'number') stateType = 'number';
    if (begin instanceof Array) stateType = 'array';
    if (stateType === 'number') return getNumberTransitionState(begin, end, frameState);
    if (stateType === 'array') return getArrayTransitionState(begin, end, frameState);
    if (stateType === 'object') return getObjectTransitionState(begin, end, frameState);
    return frameState.map(function (t) {
      return end;
    });
  }
  /**
   * @description Get the transition data of the number type
   * @param {Number} startState Transition start state
   * @param {Number} endState   Transition end state
   * @param {Array} frameState  Frame state progress
   * @return {Array} Transition frame state
   */


  function getNumberTransitionState(begin, end, frameState) {
    var minus = end - begin;
    return frameState.map(function (s) {
      return begin + minus * s;
    });
  }
  /**
   * @description Get the transition data of the array type
   * @param {Array} startState Transition start state
   * @param {Array} endState   Transition end state
   * @param {Array} frameState Frame state progress
   * @return {Array} Transition frame state
   */


  function getArrayTransitionState(begin, end, frameState) {
    var minus = end.map(function (v, i) {
      if (typeof v !== 'number') return false;
      return v - begin[i];
    });
    return frameState.map(function (s) {
      return minus.map(function (v, i) {
        if (v === false) return end[i];
        return begin[i] + v * s;
      });
    });
  }
  /**
   * @description Get the transition data of the object type
   * @param {Object} startState Transition start state
   * @param {Object} endState   Transition end state
   * @param {Array} frameState  Frame state progress
   * @return {Array} Transition frame state
   */


  function getObjectTransitionState(begin, end, frameState) {
    var keys = Object.keys(end);
    var beginValue = keys.map(function (k) {
      return begin[k];
    });
    var endValue = keys.map(function (k) {
      return end[k];
    });
    var arrayState = getArrayTransitionState(beginValue, endValue, frameState);
    return arrayState.map(function (item) {
      var frameData = {};
      item.forEach(function (v, i) {
        return frameData[keys[i]] = v;
      });
      return frameData;
    });
  }
  /**
   * @description Get the transition state data by recursion
   * @param {Array|Object} startState Transition start state
   * @param {Array|Object} endState   Transition end state
   * @param {Array} frameState        Frame state progress
   * @return {Array} Transition frame state
   */


  function recursionTransitionState(begin, end, frameState) {
    var state = getTransitionState(begin, end, frameState);

    var _loop = function _loop(key) {
      var bTemp = begin[key];
      var eTemp = end[key];
      if ((0, _typeof2["default"])(eTemp) !== 'object') return "continue";
      var data = recursionTransitionState(bTemp, eTemp, frameState);
      state.forEach(function (fs, i) {
        return fs[key] = data[i];
      });
    };

    for (var key in end) {
      var _ret = _loop(key);

      if (_ret === "continue") continue;
    }

    return state;
  }
  /**
   * @description Inject new curve into curves as config
   * @param {Any} key     The key of curve
   * @param {Array} curve Bezier curve data
   * @return {Undefined} No return
   */


  function injectNewCurve(key, curve) {
    if (!key || !curve) {
      console.error('InjectNewCurve Missing Parameters!');
      return;
    }

    _curves["default"].set(key, curve);
  }

  var _default = transition;
  exports["default"] = _default;
  });

  unwrapExports(lib$2);
  var lib_1$1 = lib$2.transition;
  var lib_2$1 = lib$2.injectNewCurve;

  var graph_class = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;







































  var _style = _interopRequireDefault(style_class);

  var _transition = _interopRequireDefault(lib$2);



  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * @description Class Graph
   * @param {Object} graph  Graph default configuration
   * @param {Object} config Graph config
   * @return {Graph} Instance of Graph
   */
  var Graph = function Graph(graph, config) {
    _classCallCheck(this, Graph);

    config = (0, util.deepClone)(config, true);
    var defaultConfig = {
      /**
       * @description Weather to render graph
       * @type {Boolean}
       * @default visible = true
       */
      visible: true,

      /**
       * @description Whether to enable drag
       * @type {Boolean}
       * @default drag = false
       */
      drag: false,

      /**
       * @description Whether to enable hover
       * @type {Boolean}
       * @default hover = false
       */
      hover: false,

      /**
       * @description Graph rendering index
       *  Give priority to index high graph in rendering
       * @type {Number}
       * @example index = 1
       */
      index: 1,

      /**
       * @description Animation delay time(ms)
       * @type {Number}
       * @default animationDelay = 0
       */
      animationDelay: 0,

      /**
       * @description Number of animation frames
       * @type {Number}
       * @default animationFrame = 30
       */
      animationFrame: 30,

      /**
       * @description Animation dynamic curve (Supported by transition)
       * @type {String}
       * @default animationCurve = 'linear'
       * @link https://github.com/jiaming743/Transition
       */
      animationCurve: 'linear',

      /**
       * @description Weather to pause graph animation
       * @type {Boolean}
       * @default animationPause = false
       */
      animationPause: false,

      /**
       * @description Rectangular hover detection zone
       *  Use this method for hover detection first
       * @type {Null|Array}
       * @default hoverRect = null
       * @example hoverRect = [0, 0, 100, 100] // [Rect start x, y, Rect width, height]
       */
      hoverRect: null,

      /**
       * @description Mouse enter event handler
       * @type {Function|Null}
       * @default mouseEnter = null
       */
      mouseEnter: null,

      /**
       * @description Mouse outer event handler
       * @type {Function|Null}
       * @default mouseOuter = null
       */
      mouseOuter: null,

      /**
       * @description Mouse click event handler
       * @type {Function|Null}
       * @default click = null
       */
      click: null
    };
    var configAbleNot = {
      status: 'static',
      animationRoot: [],
      animationKeys: [],
      animationFrameState: [],
      cache: {}
    };
    if (!config.shape) config.shape = {};
    if (!config.style) config.style = {};
    var shape = Object.assign({}, graph.shape, config.shape);
    Object.assign(defaultConfig, config, configAbleNot);
    Object.assign(this, graph, defaultConfig);
    this.shape = shape;
    this.style = new _style["default"](config.style);
    this.addedProcessor();
  };
  /**
   * @description Processor of added
   * @return {Undefined} Void
   */


  exports["default"] = Graph;

  Graph.prototype.addedProcessor = function () {
    if (typeof this.setGraphCenter === 'function') this.setGraphCenter(null, this); // The life cycle 'added"

    if (typeof this.added === 'function') this.added(this);
  };
  /**
   * @description Processor of draw
   * @param {CRender} render Instance of CRender
   * @param {Graph} graph    Instance of Graph
   * @return {Undefined} Void
   */


  Graph.prototype.drawProcessor = function (render, graph) {
    var ctx = render.ctx;
    graph.style.initStyle(ctx);
    if (typeof this.beforeDraw === 'function') this.beforeDraw(this, render);
    graph.draw(render, graph);
    if (typeof this.drawed === 'function') this.drawed(this, render);
    graph.style.restoreTransform(ctx);
  };
  /**
   * @description Processor of hover check
   * @param {Array} position Mouse Position
   * @param {Graph} graph    Instance of Graph
   * @return {Boolean} Result of hover check
   */


  Graph.prototype.hoverCheckProcessor = function (position, _ref) {
    var hoverRect = _ref.hoverRect,
        style = _ref.style,
        hoverCheck = _ref.hoverCheck;
    var graphCenter = style.graphCenter,
        rotate = style.rotate,
        scale = style.scale,
        translate = style.translate;

    if (graphCenter) {
      if (rotate) position = (0, util.getRotatePointPos)(-rotate, position, graphCenter);
      if (scale) position = (0, util.getScalePointPos)(scale.map(function (s) {
        return 1 / s;
      }), position, graphCenter);
      if (translate) position = (0, util.getTranslatePointPos)(translate.map(function (v) {
        return v * -1;
      }), position);
    }

    if (hoverRect) return util.checkPointIsInRect.apply(void 0, [position].concat(_toConsumableArray(hoverRect)));
    return hoverCheck(position, this);
  };
  /**
   * @description Processor of move
   * @param {Event} e Mouse movement event
   * @return {Undefined} Void
   */


  Graph.prototype.moveProcessor = function (e) {
    this.move(e, this);
    if (typeof this.beforeMove === 'function') this.beforeMove(e, this);
    if (typeof this.setGraphCenter === 'function') this.setGraphCenter(e, this);
    if (typeof this.moved === 'function') this.moved(e, this);
  };
  /**
   * @description Update graph state
   * @param {String} attrName Updated attribute name
   * @param {Any} change      Updated value
   * @return {Undefined} Void
   */


  Graph.prototype.attr = function (attrName) {
    var change = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    if (!attrName || change === undefined) return false;
    var isObject = _typeof(this[attrName]) === 'object';
    if (isObject) change = (0, util.deepClone)(change, true);
    var render = this.render;

    if (attrName === 'style') {
      this.style.update(change);
    } else if (isObject) {
      Object.assign(this[attrName], change);
    } else {
      this[attrName] = change;
    }

    if (attrName === 'index') render.sortGraphsByIndex();
    render.drawAllGraph();
  };
  /**
   * @description Update graphics state (with animation)
   *  Only shape and style attributes are supported
   * @param {String} attrName Updated attribute name
   * @param {Any} change      Updated value
   * @param {Boolean} wait    Whether to store the animation waiting
   *                          for the next animation request
   * @return {Promise} Animation Promise
   */


  Graph.prototype.animation =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(attrName, change) {
      var wait,
          changeRoot,
          changeKeys,
          beforeState,
          animationFrame,
          animationCurve,
          animationDelay,
          animationFrameState,
          render,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              wait = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;

              if (!(attrName !== 'shape' && attrName !== 'style')) {
                _context2.next = 4;
                break;
              }

              console.error('Only supported shape and style animation!');
              return _context2.abrupt("return");

            case 4:
              change = (0, util.deepClone)(change, true);
              if (attrName === 'style') this.style.colorProcessor(change);
              changeRoot = this[attrName];
              changeKeys = Object.keys(change);
              beforeState = {};
              changeKeys.forEach(function (key) {
                return beforeState[key] = changeRoot[key];
              });
              animationFrame = this.animationFrame, animationCurve = this.animationCurve, animationDelay = this.animationDelay;
              animationFrameState = (0, _transition["default"])(animationCurve, beforeState, change, animationFrame, true);
              this.animationRoot.push(changeRoot);
              this.animationKeys.push(changeKeys);
              this.animationFrameState.push(animationFrameState);

              if (!wait) {
                _context2.next = 17;
                break;
              }

              return _context2.abrupt("return");

            case 17:
              if (!(animationDelay > 0)) {
                _context2.next = 20;
                break;
              }

              _context2.next = 20;
              return delay(animationDelay);

            case 20:
              render = this.render;
              return _context2.abrupt("return", new Promise(
              /*#__PURE__*/
              function () {
                var _ref3 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(resolve) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return render.launchAnimation();

                        case 2:
                          resolve();

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }()));

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * @description Extract the next frame of data from the animation queue
   *              and update the graph state
   * @return {Undefined} Void
   */


  Graph.prototype.turnNextAnimationFrame = function (timeStamp) {
    var animationDelay = this.animationDelay,
        animationRoot = this.animationRoot,
        animationKeys = this.animationKeys,
        animationFrameState = this.animationFrameState,
        animationPause = this.animationPause;
    if (animationPause) return;
    if (Date.now() - timeStamp < animationDelay) return;
    animationRoot.forEach(function (root, i) {
      animationKeys[i].forEach(function (key) {
        root[key] = animationFrameState[i][0][key];
      });
    });
    animationFrameState.forEach(function (stateItem, i) {
      stateItem.shift();
      var noFrame = stateItem.length === 0;
      if (noFrame) animationRoot[i] = null;
      if (noFrame) animationKeys[i] = null;
    });
    this.animationFrameState = animationFrameState.filter(function (state) {
      return state.length;
    });
    this.animationRoot = animationRoot.filter(function (root) {
      return root;
    });
    this.animationKeys = animationKeys.filter(function (keys) {
      return keys;
    });
  };
  /**
   * @description Skip to the last frame of animation
   * @return {Undefined} Void
   */


  Graph.prototype.animationEnd = function () {
    var animationFrameState = this.animationFrameState,
        animationKeys = this.animationKeys,
        animationRoot = this.animationRoot,
        render = this.render;
    animationRoot.forEach(function (root, i) {
      var currentKeys = animationKeys[i];
      var lastState = animationFrameState[i].pop();
      currentKeys.forEach(function (key) {
        return root[key] = lastState[key];
      });
    });
    this.animationFrameState = [];
    this.animationKeys = [];
    this.animationRoot = [];
    return render.drawAllGraph();
  };
  /**
   * @description Pause animation behavior
   * @return {Undefined} Void
   */


  Graph.prototype.pauseAnimation = function () {
    this.attr('animationPause', true);
  };
  /**
   * @description Try animation behavior
   * @return {Undefined} Void
   */


  Graph.prototype.playAnimation = function () {
    var render = this.render;
    this.attr('animationPause', false);
    return new Promise(
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(resolve) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return render.launchAnimation();

              case 2:
                resolve();

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());
  };
  /**
   * @description Processor of delete
   * @param {CRender} render Instance of CRender
   * @return {Undefined} Void
   */


  Graph.prototype.delProcessor = function (render) {
    var _this = this;

    var graphs = render.graphs;
    var index = graphs.findIndex(function (graph) {
      return graph === _this;
    });
    if (index === -1) return;
    if (typeof this.beforeDelete === 'function') this.beforeDelete(this);
    graphs.splice(index, 1, null);
    if (typeof this.deleted === 'function') this.deleted(this);
  };
  /**
   * @description Return a timed release Promise
   * @param {Number} time Release time
   * @return {Promise} A timed release Promise
   */


  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  });

  unwrapExports(graph_class);

  var crender_class = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;







































  var _color = _interopRequireDefault(lib);

  var _bezierCurve = _interopRequireDefault(lib$1);



  var _graphs = _interopRequireDefault(graphs_1);

  var _graph = _interopRequireDefault(graph_class);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * @description           Class of CRender
   * @param {Object} canvas Canvas DOM
   * @return {CRender}      Instance of CRender
   */
  var CRender = function CRender(canvas) {
    _classCallCheck(this, CRender);

    if (!canvas) {
      console.error('CRender Missing parameters!');
      return;
    }

    var ctx = canvas.getContext('2d');
    var clientWidth = canvas.clientWidth,
        clientHeight = canvas.clientHeight;
    var area = [clientWidth, clientHeight];
    canvas.setAttribute('width', clientWidth);
    canvas.setAttribute('height', clientHeight);
    /**
     * @description Context of the canvas
     * @type {Object}
     * @example ctx = canvas.getContext('2d')
     */

    this.ctx = ctx;
    /**
     * @description Width and height of the canvas
     * @type {Array}
     * @example area = [300，100]
     */

    this.area = area;
    /**
     * @description Whether render is in animation rendering
     * @type {Boolean}
     * @example animationStatus = true|false
     */

    this.animationStatus = false;
    /**
     * @description Added graph
     * @type {[Graph]}
     * @example graphs = [Graph, Graph, ...]
     */

    this.graphs = [];
    /**
     * @description Color plugin
     * @type {Object}
     * @link https://github.com/jiaming743/color
     */

    this.color = _color["default"];
    /**
     * @description Bezier Curve plugin
     * @type {Object}
     * @link https://github.com/jiaming743/BezierCurve
     */

    this.bezierCurve = _bezierCurve["default"]; // bind event handler

    canvas.addEventListener('mousedown', mouseDown.bind(this));
    canvas.addEventListener('mousemove', mouseMove.bind(this));
    canvas.addEventListener('mouseup', mouseUp.bind(this));
  };
  /**
   * @description        Clear canvas drawing area
   * @return {Undefined} Void
   */


  exports["default"] = CRender;

  CRender.prototype.clearArea = function () {
    var _this$ctx;

    var area = this.area;

    (_this$ctx = this.ctx).clearRect.apply(_this$ctx, [0, 0].concat(_toConsumableArray(area)));
  };
  /**
   * @description           Add graph to render
   * @param {Object} config Graph configuration
   * @return {Graph}        Graph instance
   */


  CRender.prototype.add = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var name = config.name;

    if (!name) {
      console.error('add Missing parameters!');
      return;
    }

    var graphConfig = _graphs["default"].get(name);

    if (!graphConfig) {
      console.warn('No corresponding graph configuration found!');
      return;
    }

    var graph = new _graph["default"](graphConfig, config);
    if (!graph.validator(graph)) return;
    graph.render = this;
    this.graphs.push(graph);
    this.sortGraphsByIndex();
    this.drawAllGraph();
    return graph;
  };
  /**
   * @description Sort the graph by index
   * @return {Undefined} Void
   */


  CRender.prototype.sortGraphsByIndex = function () {
    var graphs = this.graphs;
    graphs.sort(function (a, b) {
      if (a.index > b.index) return 1;
      if (a.index === b.index) return 0;
      if (a.index < b.index) return -1;
    });
  };
  /**
   * @description         Delete graph in render
   * @param {Graph} graph The graph to be deleted
   * @return {Undefined}  Void
   */


  CRender.prototype.delGraph = function (graph) {
    if (typeof graph.delProcessor !== 'function') return;
    graph.delProcessor(this);
    this.graphs = this.graphs.filter(function (graph) {
      return graph;
    });
    this.drawAllGraph();
  };
  /**
   * @description        Delete all graph in render
   * @return {Undefined} Void
   */


  CRender.prototype.delAllGraph = function () {
    var _this = this;

    this.graphs.forEach(function (graph) {
      return graph.delProcessor(_this);
    });
    this.graphs = this.graphs.filter(function (graph) {
      return graph;
    });
    this.drawAllGraph();
  };
  /**
   * @description        Draw all the graphs in the render
   * @return {Undefined} Void
   */


  CRender.prototype.drawAllGraph = function () {
    var _this2 = this;

    this.clearArea();
    this.graphs.filter(function (graph) {
      return graph && graph.visible;
    }).forEach(function (graph) {
      return graph.drawProcessor(_this2, graph);
    });
  };
  /**
   * @description      Animate the graph whose animation queue is not empty
   *                   and the animationPause is equal to false
   * @return {Promise} Animation Promise
   */


  CRender.prototype.launchAnimation = function () {
    var _this3 = this;

    var animationStatus = this.animationStatus;
    if (animationStatus) return;
    this.animationStatus = true;
    return new Promise(function (resolve) {
      animation.call(_this3, function () {
        _this3.animationStatus = false;
        resolve();
      }, Date.now());
    });
  };
  /**
   * @description Try to animate every graph
   * @param {Function} callback Callback in animation end
   * @param {Number} timeStamp  Time stamp of animation start
   * @return {Undefined} Void
   */


  function animation(callback, timeStamp) {
    var graphs = this.graphs;

    if (!animationAble(graphs)) {
      callback();
      return;
    }

    graphs.forEach(function (graph) {
      return graph.turnNextAnimationFrame(timeStamp);
    });
    this.drawAllGraph();
    requestAnimationFrame(animation.bind(this, callback, timeStamp));
  }
  /**
   * @description Find if there are graph that can be animated
   * @param {[Graph]} graphs
   * @return {Boolean}
   */


  function animationAble(graphs) {
    return graphs.find(function (graph) {
      return !graph.animationPause && graph.animationFrameState.length;
    });
  }
  /**
   * @description Handler of CRender mousedown event
   * @return {Undefined} Void
   */


  function mouseDown(e) {
    var graphs = this.graphs;
    var hoverGraph = graphs.find(function (graph) {
      return graph.status === 'hover';
    });
    if (!hoverGraph) return;
    hoverGraph.status = 'active';
  }
  /**
   * @description Handler of CRender mousemove event
   * @return {Undefined} Void
   */


  function mouseMove(e) {
    var offsetX = e.offsetX,
        offsetY = e.offsetY;
    var position = [offsetX, offsetY];
    var graphs = this.graphs;
    var activeGraph = graphs.find(function (graph) {
      return graph.status === 'active' || graph.status === 'drag';
    });

    if (activeGraph) {
      if (!activeGraph.drag) return;

      if (typeof activeGraph.move !== 'function') {
        console.error('No move method is provided, cannot be dragged!');
        return;
      }

      activeGraph.moveProcessor(e);
      activeGraph.status = 'drag';
      return;
    }

    var hoverGraph = graphs.find(function (graph) {
      return graph.status === 'hover';
    });
    var hoverAbleGraphs = graphs.filter(function (graph) {
      return graph.hover && (typeof graph.hoverCheck === 'function' || graph.hoverRect);
    });
    var hoveredGraph = hoverAbleGraphs.find(function (graph) {
      return graph.hoverCheckProcessor(position, graph);
    });

    if (hoveredGraph) {
      document.body.style.cursor = hoveredGraph.style.hoverCursor;
    } else {
      document.body.style.cursor = 'default';
    }

    var hoverGraphMouseOuterIsFun = false,
        hoveredGraphMouseEnterIsFun = false;
    if (hoverGraph) hoverGraphMouseOuterIsFun = typeof hoverGraph.mouseOuter === 'function';
    if (hoveredGraph) hoveredGraphMouseEnterIsFun = typeof hoveredGraph.mouseEnter === 'function';
    if (!hoveredGraph && !hoverGraph) return;

    if (!hoveredGraph && hoverGraph) {
      if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph);
      hoverGraph.status = 'static';
      return;
    }

    if (hoveredGraph && hoveredGraph === hoverGraph) return;

    if (hoveredGraph && !hoverGraph) {
      if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph);
      hoveredGraph.status = 'hover';
      return;
    }

    if (hoveredGraph && hoverGraph && hoveredGraph !== hoverGraph) {
      if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph);
      hoverGraph.status = 'static';
      if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph);
      hoveredGraph.status = 'hover';
    }
  }
  /**
   * @description Handler of CRender mouseup event
   * @return {Undefined} Void
   */


  function mouseUp(e) {
    var graphs = this.graphs;
    var activeGraph = graphs.find(function (graph) {
      return graph.status === 'active';
    });
    var dragGraph = graphs.find(function (graph) {
      return graph.status === 'drag';
    });
    if (activeGraph && typeof activeGraph.click === 'function') activeGraph.click(e, activeGraph);
    graphs.forEach(function (graph) {
      return graph && (graph.status = 'static');
    });
    if (activeGraph) activeGraph.status = 'hover';
    if (dragGraph) dragGraph.status = 'hover';
  }
  /**
   * @description         Clone Graph
   * @param {Graph} graph The target to be cloned
   * @return {Graph}      Cloned graph
   */


  CRender.prototype.clone = function (graph) {
    var style = graph.style.getStyle();

    var clonedGraph = _objectSpread({}, graph, {
      style: style
    });

    delete clonedGraph.render;
    clonedGraph = (0, util.deepClone)(clonedGraph, true);
    return this.add(clonedGraph);
  };
  });

  unwrapExports(crender_class);

  var lib$3 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "extendNewGraph", {
    enumerable: true,
    get: function get() {
      return graphs_1.extendNewGraph;
    }
  });
  Object.defineProperty(exports, "injectNewCurve", {
    enumerable: true,
    get: function get() {
      return lib$2.injectNewCurve;
    }
  });
  exports["default"] = void 0;

  var _crender = _interopRequireDefault(crender_class);





  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _default = _crender["default"];
  exports["default"] = _default;
  });

  var CRender = unwrapExports(lib$3);

  function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _nonIterableSpread$1(); }

  function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray$1(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  var pie = {
    shape: {
      rx: 0,
      ry: 0,
      ir: 0,
      or: 0,
      startAngle: 0,
      endAngle: 0,
      clockWise: true
    },
    validator: function validator(_ref) {
      var shape = _ref.shape;
      var keys = ['rx', 'ry', 'ir', 'or', 'startAngle', 'endAngle'];

      if (keys.find(function (key) {
        return typeof shape[key] !== 'number';
      })) {
        console.error('Pie shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref2, _ref3) {
      var ctx = _ref2.ctx;
      var shape = _ref3.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          ir = shape.ir,
          or = shape.or,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      rx = parseInt(rx) + 0.5;
      ry = parseInt(ry) + 0.5;
      ctx.arc(rx, ry, ir > 0 ? ir : 0, startAngle, endAngle, !clockWise);
      var connectPoint1 = (0, util.getCircleRadianPoint)(rx, ry, or, endAngle).map(function (p) {
        return parseInt(p) + 0.5;
      });
      var connectPoint2 = (0, util.getCircleRadianPoint)(rx, ry, ir, startAngle).map(function (p) {
        return parseInt(p) + 0.5;
      });
      ctx.lineTo.apply(ctx, _toConsumableArray$1(connectPoint1));
      ctx.arc(rx, ry, or > 0 ? or : 0, endAngle, startAngle, clockWise);
      ctx.lineTo.apply(ctx, _toConsumableArray$1(connectPoint2));
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  };
  var agArc = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0,
      startAngle: 0,
      endAngle: 0,
      gradientStartAngle: null,
      gradientEndAngle: null
    },
    validator: function validator(_ref4) {
      var shape = _ref4.shape;
      var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

      if (keys.find(function (key) {
        return typeof shape[key] !== 'number';
      })) {
        console.error('AgArc shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref5, _ref6) {
      var ctx = _ref5.ctx;
      var shape = _ref6.shape,
          style = _ref6.style;
      var gradient = style.gradient;
      gradient = gradient.map(function (cv) {
        return (0, lib.getColorFromRgbValue)(cv);
      });

      if (gradient.length === 1) {
        gradient = [gradient[0], gradient[0]];
      }

      var gradientArcNum = gradient.length - 1;
      var gradientStartAngle = shape.gradientStartAngle,
          gradientEndAngle = shape.gradientEndAngle,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          r = shape.r,
          rx = shape.rx,
          ry = shape.ry;
      if (gradientStartAngle === null) gradientStartAngle = startAngle;
      if (gradientEndAngle === null) gradientEndAngle = endAngle;
      var angleGap = (gradientEndAngle - gradientStartAngle) / gradientArcNum;
      if (angleGap === Math.PI * 2) angleGap = Math.PI * 2 - 0.001;

      for (var i = 0; i < gradientArcNum; i++) {
        ctx.beginPath();
        var startPoint = (0, util.getCircleRadianPoint)(rx, ry, r, startAngle + angleGap * i);
        var endPoint = (0, util.getCircleRadianPoint)(rx, ry, r, startAngle + angleGap * (i + 1));
        var color = (0, util$1.getLinearGradientColor)(ctx, startPoint, endPoint, [gradient[i], gradient[i + 1]]);
        var arcStartAngle = startAngle + angleGap * i;
        var arcEndAngle = startAngle + angleGap * (i + 1);
        var doBreak = false;

        if (arcEndAngle > endAngle) {
          arcEndAngle = endAngle;
          doBreak = true;
        }

        ctx.arc(rx, ry, r, arcStartAngle, arcEndAngle);
        ctx.strokeStyle = color;
        ctx.stroke();
        if (doBreak) break;
      }
    }
  };
  var numberText = {
    shape: {
      number: [],
      content: '',
      position: [0, 0],
      toFixed: 0
    },
    validator: function validator(_ref7) {
      var shape = _ref7.shape;
      var number = shape.number,
          content = shape.content,
          position = shape.position;

      if (!(number instanceof Array) || typeof content !== 'string' || !(position instanceof Array)) {
        console.error('NumberText shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref8, _ref9) {
      var ctx = _ref8.ctx;
      var shape = _ref9.shape;
      ctx.beginPath();
      var number = shape.number,
          content = shape.content,
          position = shape.position,
          toFixed = shape.toFixed;
      var textSegments = content.split('{nt}');
      var lastSegmentIndex = textSegments.length - 1;
      var textString = '';
      textSegments.forEach(function (t, i) {
        var currentNumber = number[i];
        if (i === lastSegmentIndex) currentNumber = '';
        if (typeof currentNumber === 'number') currentNumber = currentNumber.toFixed(toFixed);
        textString += t + (currentNumber || '');
      });
      ctx.closePath();
      ctx.strokeText.apply(ctx, [textString].concat(_toConsumableArray$1(position)));
      ctx.fillText.apply(ctx, [textString].concat(_toConsumableArray$1(position)));
    }
  };
  var lineIcon = {
    shape: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },
    validator: function validator(_ref10) {
      var shape = _ref10.shape;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;

      if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
        console.error('lineIcon shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref11, _ref12) {
      var ctx = _ref11.ctx;
      var shape = _ref12.shape;
      ctx.beginPath();
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      var halfH = h / 2;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.moveTo(x, y + halfH);
      ctx.lineTo(x + w, y + halfH);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      var radius = halfH - 5 * 2;
      if (radius <= 0) radius = 3;
      ctx.arc(x + w / 2, y + halfH, radius, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fill();
    },
    hoverCheck: function hoverCheck(position, _ref13) {
      var shape = _ref13.shape;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      return (0, util.checkPointIsInRect)(position, x, y, w, h);
    },
    setGraphCenter: function setGraphCenter(e, _ref14) {
      var shape = _ref14.shape,
          style = _ref14.style;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      style.graphCenter = [x + w / 2, y + h / 2];
    }
  };
  (0, lib$3.extendNewGraph)('pie', pie);
  (0, lib$3.extendNewGraph)('agArc', agArc);
  (0, lib$3.extendNewGraph)('numberText', numberText);
  (0, lib$3.extendNewGraph)('lineIcon', lineIcon);

  var color = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.colorConfig = void 0;
  var colorConfig = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e062ae', '#e690d1', '#e7bcf3', '#9d96f5', '#8378ea', '#96bfff'];
  exports.colorConfig = colorConfig;
  });

  unwrapExports(color);
  var color_1 = color.colorConfig;

  var grid = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.gridConfig = void 0;
  var gridConfig = {
    /**
     * @description Grid left margin
     * @type {String|Number}
     * @default left = '10%'
     * @example left = '10%' | 10
     */
    left: '10%',

    /**
     * @description Grid right margin
     * @type {String|Number}
     * @default right = '10%'
     * @example right = '10%' | 10
     */
    right: '10%',

    /**
     * @description Grid top margin
     * @type {String|Number}
     * @default top = 60
     * @example top = '10%' | 60
     */
    top: 60,

    /**
     * @description Grid bottom margin
     * @type {String|Number}
     * @default bottom = 60
     * @example bottom = '10%' | 60
     */
    bottom: 60,

    /**
     * @description Grid default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fill: 'rgba(0, 0, 0, 0)'
    },

    /**
     * @description Grid render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = -30
     */
    rLevel: -30,

    /**
     * @description Grid animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Grid animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 30
  };
  exports.gridConfig = gridConfig;
  });

  unwrapExports(grid);
  var grid_1 = grid.gridConfig;

  var axis = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.yAxisConfig = exports.xAxisConfig = void 0;
  var xAxisConfig = {
    /**
     * @description Axis name
     * @type {String}
     * @default name = ''
     */
    name: '',

    /**
     * @description Whether to display this axis
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis position
     * @type {String}
     * @default position = 'bottom'
     * @example position = 'bottom' | 'top'
     */
    position: 'bottom',

    /**
     * @description Name gap
     * @type {Number}
     * @default nameGap = 15
     */
    nameGap: 15,

    /**
     * @description Name location
     * @type {String}
     * @default nameLocation = 'end'
     * @example nameLocation = 'end' | 'center' | 'start'
     */
    nameLocation: 'end',

    /**
     * @description Name default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    nameTextStyle: {
      fill: '#333',
      fontSize: 10
    },

    /**
     * @description Axis min value
     * @type {String|Number}
     * @default min = '20%'
     * @example min = '20%' | 0
     */
    min: '20%',

    /**
     * @description Axis max value
     * @type {String|Number}
     * @default max = '20%'
     * @example max = '20%' | 0
     */
    max: '20%',

    /**
     * @description Axis value interval
     * @type {Number}
     * @default interval = null
     * @example interval = 100
     */
    interval: null,

    /**
     * @description Min interval
     * @type {Number}
     * @default minInterval = null
     * @example minInterval = 1
     */
    minInterval: null,

    /**
     * @description Max interval
     * @type {Number}
     * @default maxInterval = null
     * @example maxInterval = 100
     */
    maxInterval: null,

    /**
     * @description Boundary gap
     * @type {Boolean}
     * @default boundaryGap = null
     * @example boundaryGap = true
     */
    boundaryGap: null,

    /**
     * @description Axis split number
     * @type {Number}
     * @default splitNumber = 5
     */
    splitNumber: 5,

    /**
     * @description Axis line configuration
     * @type {Object}
     */
    axisLine: {
      /**
       * @description Whether to display axis line
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis line default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#333',
        lineWidth: 1
      }
    },

    /**
     * @description Axis tick configuration
     * @type {Object}
     */
    axisTick: {
      /**
       * @description Whether to display axis tick
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis tick default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#333',
        lineWidth: 1
      }
    },

    /**
     * @description Axis label configuration
     * @type {Object}
     */
    axisLabel: {
      /**
       * @description Whether to display axis label
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis label formatter
       * @type {String|Function}
       * @default formatter = null
       * @example formatter = '{value}件'
       * @example formatter = (dataItem) => (dataItem.value)
       */
      formatter: null,

      /**
       * @description Axis label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fill: '#333',
        fontSize: 10,
        rotate: 0
      }
    },

    /**
     * @description Axis split line configuration
     * @type {Object}
     */
    splitLine: {
      /**
       * @description Whether to display axis split line
       * @type {Boolean}
       * @default show = false
       */
      show: false,

      /**
       * @description Axis split line default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#d4d4d4',
        lineWidth: 1
      }
    },

    /**
     * @description X axis render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = -20
     */
    rLevel: -20,

    /**
     * @description X axis animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description X axis animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 50
  };
  exports.xAxisConfig = xAxisConfig;
  var yAxisConfig = {
    /**
     * @description Axis name
     * @type {String}
     * @default name = ''
     */
    name: '',

    /**
     * @description Whether to display this axis
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Axis position
     * @type {String}
     * @default position = 'left'
     * @example position = 'left' | 'right'
     */
    position: 'left',

    /**
     * @description Name gap
     * @type {Number}
     * @default nameGap = 15
     */
    nameGap: 15,

    /**
     * @description Name location
     * @type {String}
     * @default nameLocation = 'end'
     * @example nameLocation = 'end' | 'center' | 'start'
     */
    nameLocation: 'end',

    /**
     * @description name default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    nameTextStyle: {
      fill: '#333',
      fontSize: 10
    },

    /**
     * @description Axis min value
     * @type {String|Number}
     * @default min = '20%'
     * @example min = '20%' | 0
     */
    min: '20%',

    /**
     * @description Axis max value
     * @type {String|Number}
     * @default max = '20%'
     * @example max = '20%' | 0
     */
    max: '20%',

    /**
     * @description Axis value interval
     * @type {Number}
     * @default interval = null
     * @example interval = 100
     */
    interval: null,

    /**
     * @description Min interval
     * @type {Number}
     * @default minInterval = null
     * @example minInterval = 1
     */
    minInterval: null,

    /**
     * @description Max interval
     * @type {Number}
     * @default maxInterval = null
     * @example maxInterval = 100
     */
    maxInterval: null,

    /**
     * @description Boundary gap
     * @type {Boolean}
     * @default boundaryGap = null
     * @example boundaryGap = true
     */
    boundaryGap: null,

    /**
     * @description Axis split number
     * @type {Number}
     * @default splitNumber = 5
     */
    splitNumber: 5,

    /**
     * @description Axis line configuration
     * @type {Object}
     */
    axisLine: {
      /**
       * @description Whether to display axis line
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis line default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#333',
        lineWidth: 1
      }
    },

    /**
     * @description Axis tick configuration
     * @type {Object}
     */
    axisTick: {
      /**
       * @description Whether to display axis tick
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis tick default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#333',
        lineWidth: 1
      }
    },

    /**
     * @description Axis label configuration
     * @type {Object}
     */
    axisLabel: {
      /**
       * @description Whether to display axis label
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis label formatter
       * @type {String|Function}
       * @default formatter = null
       * @example formatter = '{value}件'
       * @example formatter = (dataItem) => (dataItem.value)
       */
      formatter: null,

      /**
       * @description Axis label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fill: '#333',
        fontSize: 10,
        rotate: 0
      }
    },

    /**
     * @description Axis split line configuration
     * @type {Object}
     */
    splitLine: {
      /**
       * @description Whether to display axis split line
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis split line default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#d4d4d4',
        lineWidth: 1
      }
    },

    /**
     * @description Y axis render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = -20
     */
    rLevel: -20,

    /**
     * @description Y axis animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Y axis animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 50
  };
  exports.yAxisConfig = yAxisConfig;
  });

  unwrapExports(axis);
  var axis_1 = axis.yAxisConfig;
  var axis_2 = axis.xAxisConfig;

  var title = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.titleConfig = void 0;
  var titleConfig = {
    /**
     * @description Whether to display title
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Title text
     * @type {String}
     * @default text = ''
     */
    text: '',

    /**
     * @description Title offset
     * @type {Array}
     * @default offset = [0, -20]
     */
    offset: [0, -20],

    /**
     * @description Title default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fill: '#333',
      fontSize: 17,
      fontWeight: 'bold',
      textAlign: 'center',
      textBaseline: 'bottom'
    },

    /**
     * @description Title render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = 20
     */
    rLevel: 20,

    /**
     * @description Title animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Title animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 50
  };
  exports.titleConfig = titleConfig;
  });

  unwrapExports(title);
  var title_1 = title.titleConfig;

  var line = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.lineConfig = void 0;
  var lineConfig = {
    /**
     * @description Whether to display this line chart
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Legend name
     * @type {String}
     * @default name = ''
     */
    name: '',

    /**
     * @description Smooth line
     * @type {Boolean}
     * @default smooth = false
     */
    smooth: false,

    /**
     * @description Line x axis index
     * @type {Number}
     * @default xAxisIndex = 0
     * @example xAxisIndex = 0 | 1
     */
    xAxisIndex: 0,

    /**
     * @description Line y axis index
     * @type {Number}
     * @default yAxisIndex = 0
     * @example yAxisIndex = 0 | 1
     */
    yAxisIndex: 0,

    /**
     * @description Line chart data
     * @type {Array}
     * @default data = []
     * @example data = [100, 200, 300]
     */
    data: [],

    /**
     * @description Line default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      lineWidth: 1
    },

    /**
     * @description Line point configuration
     * @type {Object}
     */
    linePoint: {
      /**
       * @description Whether to display line point
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Line point radius
       * @type {Number}
       * @default radius = 2
       */
      radius: 2,

      /**
       * @description Line point default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fill: '#fff',
        lineWidth: 1
      }
    },

    /**
     * @description Line area configuration
     * @type {Object}
     */
    lineArea: {
      /**
       * @description Whether to display line area
       * @type {Boolean}
       * @default show = false
       */
      show: false,

      /**
       * @description Line area gradient color (Hex|rgb|rgba)
       * @type {Array}
       * @default gradient = []
       */
      gradient: [],

      /**
       * @description Line area style default configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        opacity: 0.5
      }
    },

    /**
     * @description Line label configuration
     * @type {Object}
     */
    label: {
      /**
       * @description Whether to display line label
       * @type {Boolean}
       * @default show = false
       */
      show: false,

      /**
       * @description Line label position
       * @type {String}
       * @default position = 'top'
       * @example position = 'top' | 'center' | 'bottom'
       */
      position: 'top',

      /**
       * @description Line label offset
       * @type {Array}
       * @default offset = [0, -10]
       */
      offset: [0, -10],

      /**
       * @description Line label formatter
       * @type {String|Function}
       * @default formatter = null
       * @example formatter = '{value}件'
       * @example formatter = (dataItem) => (dataItem.value)
       */
      formatter: null,

      /**
       * @description Line label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fontSize: 10
      }
    },

    /**
     * @description Line chart render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = 10
     */
    rLevel: 10,

    /**
     * @description Line animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Line animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 50
  };
  exports.lineConfig = lineConfig;
  });

  unwrapExports(line);
  var line_1 = line.lineConfig;

  var bar = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.barConfig = void 0;
  var barConfig = {
    /**
     * @description Whether to display this bar chart
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Legend name
     * @type {String}
     * @default name = ''
     */
    name: '',

    /**
     * @description Bar shape type
     * @type {String}
     * @default shapeType = 'normal'
     * @example shapeType = 'normal' | 'leftEchelon' | 'rightEchelon'
     */
    shapeType: 'normal',

    /**
     * @description Echelon bar sharpness offset
     * @type {Number}
     * @default echelonOffset = 10
     */
    echelonOffset: 10,

    /**
     * @description Bar width
     * This property should be set on the last 'bar' series
     * in this coordinate system to take effect and will be in effect
     * for all 'bar' series in this coordinate system
     * @type {String|Number}
     * @default barWidth = 'auto'
     * @example barWidth = 'auto' | '10%' | 20
     */
    barWidth: 'auto',

    /**
     * @description Bar gap
     * This property should be set on the last 'bar' series
     * in this coordinate system to take effect and will be in effect
     * for all 'bar' series in this coordinate system
     * @type {String|Number}
     * @default barGap = '30%'
     * @example barGap = '30%' | 30
     */
    barGap: '30%',

    /**
     * @description Bar category gap
     * This property should be set on the last 'bar' series
     * in this coordinate system to take effect and will be in effect
     * for all 'bar' series in this coordinate system
     * @type {String|Number}
     * @default barCategoryGap = '20%'
     * @example barCategoryGap = '20%' | 20
     */
    barCategoryGap: '20%',

    /**
     * @description Bar x axis index
     * @type {Number}
     * @default xAxisIndex = 0
     * @example xAxisIndex = 0 | 1
     */
    xAxisIndex: 0,

    /**
     * @description Bar y axis index
     * @type {Number}
     * @default yAxisIndex = 0
     * @example yAxisIndex = 0 | 1
     */
    yAxisIndex: 0,

    /**
     * @description Bar chart data
     * @type {Array}
     * @default data = []
     * @example data = [100, 200, 300]
     */
    data: [],

    /**
     * @description Background bar configuration
     * @type {Object}
     */
    backgroundBar: {
      /**
       * @description Whether to display background bar
       * @type {Boolean}
       * @default show = false
       */
      show: false,

      /**
       * @description Background bar width
       * @type {String|Number}
       * @default width = 'auto'
       * @example width = 'auto' | '30%' | 30
       */
      width: 'auto',

      /**
       * @description Background bar default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fill: 'rgba(200, 200, 200, .4)'
      }
    },

    /**
     * @description Bar label configuration
     * @type {Object}
     */
    label: {
      /**
       * @description Whether to display bar label
       * @type {Boolean}
       * @default show = false
       */
      show: false,

      /**
       * @description Bar label position
       * @type {String}
       * @default position = 'top'
       * @example position = 'top' | 'center' | 'bottom'
       */
      position: 'top',

      /**
       * @description Bar label offset
       * @type {Array}
       * @default offset = [0, -10]
       */
      offset: [0, -10],

      /**
       * @description Bar label formatter
       * @type {String|Function}
       * @default formatter = null
       * @example formatter = '{value}件'
       * @example formatter = (dataItem) => (dataItem.value)
       */
      formatter: null,

      /**
       * @description Bar label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fontSize: 10
      }
    },

    /**
     * @description Bar gradient configuration
     * @type {Object}
     */
    gradient: {
      /**
       * @description Gradient color (Hex|rgb|rgba)
       * @type {Array}
       * @default color = []
       */
      color: [],

      /**
       * @description Local gradient
       * @type {Boolean}
       * @default local = true
       */
      local: true
    },

    /**
     * @description Bar style default configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    barStyle: {},

    /**
     * @description Bar chart render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = 0
     */
    rLevel: 0,

    /**
     * @description Bar animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Bar animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 50
  };
  exports.barConfig = barConfig;
  });

  unwrapExports(bar);
  var bar_1 = bar.barConfig;

  var pie$1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.pieConfig = void 0;
  var pieConfig = {
    /**
     * @description Whether to display this pie chart
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Legend name
     * @type {String}
     * @default name = ''
     */
    name: '',

    /**
     * @description Radius of pie
     * @type {String|Number}
     * @default radius = '50%'
     * @example radius = '50%' | 100
     */
    radius: '50%',

    /**
     * @description Center point of pie
     * @type {Array}
     * @default center = ['50%','50%']
     * @example center = ['50%','50%'] | [100, 100]
     */
    center: ['50%', '50%'],

    /**
     * @description Pie chart start angle
     * @type {Number}
     * @default startAngle = -Math.PI / 2
     * @example startAngle = -Math.PI
     */
    startAngle: -Math.PI / 2,

    /**
     * @description Whether to enable rose type
     * @type {Boolean}
     * @default roseType = false
     */
    roseType: false,

    /**
     * @description Automatic sorting in rose type
     * @type {Boolean}
     * @default roseSort = true
     */
    roseSort: true,

    /**
     * @description Rose radius increasing
     * @type {String|Number}
     * @default roseIncrement = 'auto'
     * @example roseIncrement = 'auto' | '10%' | 10
     */
    roseIncrement: 'auto',

    /**
     * @description Pie chart data
     * @type {Array}
     * @default data = []
     */
    data: [],

    /**
     * @description Pie inside label configuration
     * @type {Object}
     */
    insideLabel: {
      /**
       * @description Whether to display inside label
       * @type {Boolean}
       * @default show = false
       */
      show: false,

      /**
       * @description Label formatter
       * @type {String|Function}
       * @default formatter = '{percent}%'
       * @example formatter = '${name}-{value}-{percent}%'
       * @example formatter = (dataItem) => (dataItem.name)
       */
      formatter: '{percent}%',

      /**
       * @description Label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fontSize: 10,
        fill: '#fff',
        textAlign: 'center',
        textBaseline: 'middle'
      }
    },

    /**
     * @description Pie Outside label configuration
     * @type {Object}
     */
    outsideLabel: {
      /**
       * @description Whether to display outside label
       * @type {Boolean}
       * @default show = false
       */
      show: true,

      /**
       * @description Label formatter
       * @type {String|Function}
       * @default formatter = '{name}'
       * @example formatter = '${name}-{value}-{percent}%'
       * @example formatter = (dataItem) => (dataItem.name)
       */
      formatter: '{name}',

      /**
       * @description Label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fontSize: 11
      },

      /**
       * @description Gap beteen label line bended place and pie
       * @type {String|Number}
       * @default labelLineBendGap = '20%'
       * @example labelLineBendGap = '20%' | 20
       */
      labelLineBendGap: '20%',

      /**
       * @description Label line end length
       * @type {Number}
       * @default labelLineEndLength = 50
       */
      labelLineEndLength: 50,

      /**
       * @description Label line default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      labelLineStyle: {
        lineWidth: 1
      }
    },

    /**
     * @description Pie default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    pieStyle: {},

    /**
     * @description Percentage fractional precision
     * @type {Number}
     * @default percentToFixed = 0
     */
    percentToFixed: 0,

    /**
     * @description Pie chart render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = 10
     */
    rLevel: 10,

    /**
     * @description Animation delay gap
     * @type {Number}
     * @default animationDelayGap = 60
     */
    animationDelayGap: 60,

    /**
     * @description Pie animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Pie start animation curve
     * @type {String}
     * @default startAnimationCurve = 'easeOutBack'
     */
    startAnimationCurve: 'easeOutBack',

    /**
     * @description Pie animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 50
  };
  exports.pieConfig = pieConfig;
  });

  unwrapExports(pie$1);
  var pie_1 = pie$1.pieConfig;

  var radarAxis = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.radarAxisConfig = void 0;
  var radarAxisConfig = {
    /**
     * @description Whether to display this radar axis
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Center point of radar axis
     * @type {Array}
     * @default center = ['50%','50%']
     * @example center = ['50%','50%'] | [100, 100]
     */
    center: ['50%', '50%'],

    /**
     * @description Radius of radar axis
     * @type {String|Number}
     * @default radius = '65%'
     * @example radius = '65%' | 100
     */
    radius: '65%',

    /**
     * @description Radar axis start angle
     * @type {Number}
     * @default startAngle = -Math.PI / 2
     * @example startAngle = -Math.PI
     */
    startAngle: -Math.PI / 2,

    /**
     * @description Radar axis split number
     * @type {Number}
     * @default splitNum = 5
     */
    splitNum: 5,

    /**
     * @description Whether to enable polygon radar axis
     * @type {Boolean}
     * @default polygon = false
     */
    polygon: false,

    /**
     * @description Axis label configuration
     * @type {Object}
     */
    axisLabel: {
      /**
       * @description Whether to display axis label
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Label gap between label and radar axis
       * @type {Number}
       * @default labelGap = 15
       */
      labelGap: 15,

      /**
       * @description Label color (Hex|rgb|rgba), will cover style.fill
       * @type {Array}
       * @default color = []
       */
      color: [],

      /**
       * @description Axis label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fill: '#333'
      }
    },

    /**
     * @description Axis line configuration
     * @type {Object}
     */
    axisLine: {
      /**
       * @description Whether to display axis line
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Line color (Hex|rgb|rgba), will cover style.stroke
       * @type {Array}
       * @default color = []
       */
      color: [],

      /**
       * @description Axis label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#999',
        lineWidth: 1
      }
    },

    /**
     * @description Split line configuration
     * @type {Object}
     */
    splitLine: {
      /**
       * @description Whether to display split line
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Line color (Hex|rgb|rgba), will cover style.stroke
       * @type {Array}
       * @default color = []
       */
      color: [],

      /**
       * @description Split line default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#d4d4d4',
        lineWidth: 1
      }
    },

    /**
     * @description Split area configuration
     * @type {Object}
     */
    splitArea: {
      /**
       * @description Whether to display split area
       * @type {Boolean}
       * @default show = false
       */
      show: false,

      /**
       * @description Area color (Hex|rgb|rgba), will cover style.stroke
       * @type {Array}
       * @default color = []
       */
      color: ['#f5f5f5', '#e6e6e6'],

      /**
       * @description Split area default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {}
    },

    /**
     * @description Bar chart render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = -10
     */
    rLevel: -10,

    /**
     * @description Radar axis animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Radar axis animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrane: 50
  };
  exports.radarAxisConfig = radarAxisConfig;
  });

  unwrapExports(radarAxis);
  var radarAxis_1 = radarAxis.radarAxisConfig;

  var radar = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.radarConfig = void 0;
  var radarConfig = {
    /**
     * @description Whether to display this radar
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Legend name
     * @type {String}
     * @default name = ''
     */
    name: '',

    /**
     * @description Radar chart data
     * @type {Array}
     * @default data = []
     * @example data = [100, 200, 300]
     */
    data: [],

    /**
     * @description Radar default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    radarStyle: {
      lineWidth: 1
    },

    /**
     * @description Radar point configuration
     * @type {Object}
     */
    point: {
      /**
       * @description Whether to display radar point
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Point radius
       * @type {Number}
       * @default radius = 2
       */
      radius: 2,

      /**
       * @description Radar point default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fill: '#fff'
      }
    },

    /**
     * @description Radar label configuration
     * @type {Object}
     */
    label: {
      /**
       * @description Whether to display radar label
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Label position offset
       * @type {Array}
       * @default offset = [0, 0]
       */
      offset: [0, 0],

      /**
       * @description Label gap between label and radar
       * @type {Number}
       * @default labelGap = 5
       */
      labelGap: 5,

      /**
       * @description Label formatter
       * @type {String|Function}
       * @default formatter = null
       * @example formatter = 'Score-{value}'
       * @example formatter = (label) => (label)
       */
      formatter: null,

      /**
       * @description Radar label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fontSize: 10
      }
    },

    /**
     * @description Radar chart render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = 10
     */
    rLevel: 10,

    /**
     * @description Radar animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Radar animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrane: 50
  };
  exports.radarConfig = radarConfig;
  });

  unwrapExports(radar);
  var radar_1 = radar.radarConfig;

  var gauge = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.gaugeConfig = void 0;
  var gaugeConfig = {
    /**
     * @description Whether to display this gauge
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Legend name
     * @type {String}
     * @default name = ''
     */
    name: '',

    /**
     * @description Radius of gauge
     * @type {String|Number}
     * @default radius = '60%'
     * @example radius = '60%' | 100
     */
    radius: '60%',

    /**
     * @description Center point of gauge
     * @type {Array}
     * @default center = ['50%','50%']
     * @example center = ['50%','50%'] | [100, 100]
     */
    center: ['50%', '50%'],

    /**
     * @description Gauge start angle
     * @type {Number}
     * @default startAngle = -(Math.PI / 4) * 5
     * @example startAngle = -Math.PI
     */
    startAngle: -(Math.PI / 4) * 5,

    /**
     * @description Gauge end angle
     * @type {Number}
     * @default endAngle = Math.PI / 4
     * @example endAngle = 0
     */
    endAngle: Math.PI / 4,

    /**
     * @description Gauge min value
     * @type {Number}
     * @default min = 0
     */
    min: 0,

    /**
     * @description Gauge max value
     * @type {Number}
     * @default max = 100
     */
    max: 100,

    /**
     * @description Gauge split number
     * @type {Number}
     * @default splitNum = 5
     */
    splitNum: 5,

    /**
     * @description Gauge arc line width
     * @type {Number}
     * @default arcLineWidth = 15
     */
    arcLineWidth: 15,

    /**
     * @description Gauge chart data
     * @type {Array}
     * @default data = []
     */
    data: [],

    /**
     * @description Data item arc default style configuration
     * @type {Object}
     * @default dataItemStyle = {Configuration Of Class Style}
     */
    dataItemStyle: {},

    /**
     * @description Axis tick configuration
     * @type {Object}
     */
    axisTick: {
      /**
       * @description Whether to display axis tick
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis tick length
       * @type {Number}
       * @default tickLength = 6
       */
      tickLength: 6,

      /**
       * @description Axis tick default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#999',
        lineWidth: 1
      }
    },

    /**
     * @description Axis label configuration
     * @type {Object}
     */
    axisLabel: {
      /**
       * @description Whether to display axis label
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Axis label data (Can be calculated automatically)
       * @type {Array}
       * @default data = [Number...]
       */
      data: [],

      /**
       * @description Axis label formatter
       * @type {String|Function}
       * @default formatter = null
       * @example formatter = '{value}%'
       * @example formatter = (labelItem) => (labelItem.value)
       */
      formatter: null,

      /**
       * @description Axis label gap between label and axis tick
       * @type {String|Function}
       * @default labelGap = 5
       */
      labelGap: 5,

      /**
       * @description Axis label default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {}
    },

    /**
     * @description Gauge pointer configuration
     * @type {Object}
     */
    pointer: {
      /**
       * @description Whether to display pointer
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Pointer value index of data
       * @type {Number}
       * @default valueIndex = 0 (pointer.value = data[0].value)
       */
      valueIndex: 0,

      /**
       * @description Pointer default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        scale: [1, 1],
        fill: '#fb7293'
      }
    },

    /**
     * @description Data item arc detail configuration
     * @type {Object}
     */
    details: {
      /**
       * @description Whether to display details
       * @type {Boolean}
       * @default show = false
       */
      show: false,

      /**
       * @description Details formatter
       * @type {String|Function}
       * @default formatter = null
       * @example formatter = '{value}%'
       * @example formatter = '{name}%'
       * @example formatter = (dataItem) => (dataItem.value)
       */
      formatter: null,

      /**
       * @description Details position offset
       * @type {Array}
       * @default offset = [0, 0]
       * @example offset = [10, 10]
       */
      offset: [0, 0],

      /**
       * @description Value fractional precision
       * @type {Number}
       * @default valueToFixed = 0
       */
      valueToFixed: 0,

      /**
       * @description Details position
       * @type {String}
       * @default position = 'center'
       * @example position = 'start' | 'center' | 'end'
       */
      position: 'center',

      /**
       * @description Details default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        textBaseline: 'middle'
      }
    },

    /**
     * @description Gauge background arc configuration
     * @type {Object}
     */
    backgroundArc: {
      /**
       * @description Whether to display background arc
       * @type {Boolean}
       * @default show = true
       */
      show: true,

      /**
       * @description Background arc default style configuration
       * @type {Object}
       * @default style = {Configuration Of Class Style}
       */
      style: {
        stroke: '#e0e0e0'
      }
    },

    /**
     * @description Gauge chart render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = 10
     */
    rLevel: 10,

    /**
     * @description Gauge animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Gauge animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 50
  };
  exports.gaugeConfig = gaugeConfig;
  });

  unwrapExports(gauge);
  var gauge_1 = gauge.gaugeConfig;

  var legend = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.legendConfig = void 0;
  var legendConfig = {
    /**
     * @description Whether to display legend
     * @type {Boolean}
     * @default show = true
     */
    show: true,

    /**
     * @description Legend orient
     * @type {String}
     * @default orient = 'horizontal'
     * @example orient = 'horizontal' | 'vertical'
     */
    orient: 'horizontal',

    /**
     * @description Legend left
     * @type {String|Number}
     * @default left = 'auto'
     * @example left = 'auto' | '10%' | 10
     */
    left: 'auto',

    /**
     * @description Legend right
     * @type {String|Number}
     * @default right = 'auto'
     * @example right = 'auto' | '10%' | 10
     */
    right: 'auto',

    /**
     * @description Legend top
     * @type {String|Number}
     * @default top = 'auto'
     * @example top = 'auto' | '10%' | 10
     */
    top: 'auto',

    /**
     * @description Legend bottom
     * @type {String|Number}
     * @default bottom = 'auto'
     * @example bottom = 'auto' | '10%' | 10
     */
    bottom: 'auto',

    /**
     * @description Legend item gap
     * @type {Number}
     * @default itemGap = 10
     */
    itemGap: 10,

    /**
     * @description Icon width
     * @type {Number}
     * @default iconWidth = 25
     */
    iconWidth: 25,

    /**
     * @description Icon height
     * @type {Number}
     * @default iconHeight = 10
     */
    iconHeight: 10,

    /**
     * @description Whether legend is optional
     * @type {Boolean}
     * @default selectAble = true
     */
    selectAble: true,

    /**
     * @description Legend data
     * @type {Array}
     * @default data = []
     */
    data: [],

    /**
     * @description Legend text default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    textStyle: {
      fontFamily: 'Arial',
      fontSize: 13,
      fill: '#000'
    },

    /**
     * @description Legend icon default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    iconStyle: {},

    /**
     * @description Legend text unselected default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    textUnselectedStyle: {
      fontFamily: 'Arial',
      fontSize: 13,
      fill: '#999'
    },

    /**
     * @description Legend icon unselected default style configuration
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    iconUnselectedStyle: {
      fill: '#999'
    },

    /**
     * @description Legend render level
     * Priority rendering high level
     * @type {Number}
     * @default rLevel = 20
     */
    rLevel: 20,

    /**
     * @description Legend animation curve
     * @type {String}
     * @default animationCurve = 'easeOutCubic'
     */
    animationCurve: 'easeOutCubic',

    /**
     * @description Legend animation frame
     * @type {Number}
     * @default animationFrame = 50
     */
    animationFrame: 50
  };
  exports.legendConfig = legendConfig;
  });

  unwrapExports(legend);
  var legend_1 = legend.legendConfig;

  var config = createCommonjsModule(function (module, exports) {









  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.changeDefaultConfig = changeDefaultConfig;
  Object.defineProperty(exports, "colorConfig", {
    enumerable: true,
    get: function get() {
      return color.colorConfig;
    }
  });
  Object.defineProperty(exports, "gridConfig", {
    enumerable: true,
    get: function get() {
      return grid.gridConfig;
    }
  });
  Object.defineProperty(exports, "xAxisConfig", {
    enumerable: true,
    get: function get() {
      return axis.xAxisConfig;
    }
  });
  Object.defineProperty(exports, "yAxisConfig", {
    enumerable: true,
    get: function get() {
      return axis.yAxisConfig;
    }
  });
  Object.defineProperty(exports, "titleConfig", {
    enumerable: true,
    get: function get() {
      return title.titleConfig;
    }
  });
  Object.defineProperty(exports, "lineConfig", {
    enumerable: true,
    get: function get() {
      return line.lineConfig;
    }
  });
  Object.defineProperty(exports, "barConfig", {
    enumerable: true,
    get: function get() {
      return bar.barConfig;
    }
  });
  Object.defineProperty(exports, "pieConfig", {
    enumerable: true,
    get: function get() {
      return pie$1.pieConfig;
    }
  });
  Object.defineProperty(exports, "radarAxisConfig", {
    enumerable: true,
    get: function get() {
      return radarAxis.radarAxisConfig;
    }
  });
  Object.defineProperty(exports, "radarConfig", {
    enumerable: true,
    get: function get() {
      return radar.radarConfig;
    }
  });
  Object.defineProperty(exports, "gaugeConfig", {
    enumerable: true,
    get: function get() {
      return gauge.gaugeConfig;
    }
  });
  Object.defineProperty(exports, "legendConfig", {
    enumerable: true,
    get: function get() {
      return legend.legendConfig;
    }
  });
  exports.keys = void 0;

























  var allConfig = {
    colorConfig: color.colorConfig,
    gridConfig: grid.gridConfig,
    xAxisConfig: axis.xAxisConfig,
    yAxisConfig: axis.yAxisConfig,
    titleConfig: title.titleConfig,
    lineConfig: line.lineConfig,
    barConfig: bar.barConfig,
    pieConfig: pie$1.pieConfig,
    radarAxisConfig: radarAxis.radarAxisConfig,
    radarConfig: radar.radarConfig,
    gaugeConfig: gauge.gaugeConfig,
    legendConfig: legend.legendConfig
    /**
     * @description Change default configuration
     * @param {String} key          Configuration key
     * @param {Object|Array} config Your config
     * @return {Undefined} No return
     */

  };

  function changeDefaultConfig(key, config) {
    if (!allConfig["".concat(key, "Config")]) {
      console.warn('Change default config Error - Invalid key!');
      return;
    }

    (0, util$1.deepMerge)(allConfig["".concat(key, "Config")], config);
  }

  var keys = ['color', 'title', 'legend', 'xAxis', 'yAxis', 'grid', 'radarAxis', 'line', 'bar', 'pie', 'radar', 'gauge'];
  exports.keys = keys;
  });

  unwrapExports(config);
  var config_1 = config.changeDefaultConfig;
  var config_2 = config.keys;

  var mergeColor_1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.mergeColor = mergeColor;











  function mergeColor(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var defaultColor = (0, util.deepClone)(config.colorConfig, true);
    var color = option.color,
        series = option.series;
    if (!series) series = [];
    if (!color) color = [];
    option.color = color = (0, util$1.deepMerge)(defaultColor, color);
    if (!series.length) return;
    var colorNum = color.length;
    series.forEach(function (item, i) {
      if (item.color) return;
      item.color = color[i % colorNum];
    });
    var pies = series.filter(function (_ref) {
      var type = _ref.type;
      return type === 'pie';
    });
    pies.forEach(function (pie) {
      return pie.data.forEach(function (di, i) {
        return di.color = color[i % colorNum];
      });
    });
    var gauges = series.filter(function (_ref2) {
      var type = _ref2.type;
      return type === 'gauge';
    });
    gauges.forEach(function (gauge) {
      return gauge.data.forEach(function (di, i) {
        return di.color = color[i % colorNum];
      });
    });
  }
  });

  unwrapExports(mergeColor_1);
  var mergeColor_2 = mergeColor_1.mergeColor;

  var updater_class = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.doUpdate = doUpdate;
  exports.Updater = void 0;































  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Updater = function Updater(config, series) {
    _classCallCheck(this, Updater);

    var chart = config.chart,
        key = config.key,
        getGraphConfig = config.getGraphConfig;

    if (typeof getGraphConfig !== 'function') {
      console.warn('Updater need function getGraphConfig!');
      return;
    }

    if (!chart[key]) this.graphs = chart[key] = [];
    Object.assign(this, config);
    this.update(series);
  };

  exports.Updater = Updater;

  Updater.prototype.update = function (series) {
    var _this = this;

    var graphs = this.graphs,
        beforeUpdate = this.beforeUpdate;
    delRedundanceGraph(this, series);
    if (!series.length) return;

    var beforeUpdateType = _typeof(beforeUpdate);

    series.forEach(function (seriesItem, i) {
      if (beforeUpdateType === 'function') beforeUpdate(graphs, seriesItem, i, _this);
      var cache = graphs[i];

      if (cache) {
        changeGraphs(cache, seriesItem, i, _this);
      } else {
        addGraphs(graphs, seriesItem, i, _this);
      }
    });
  };

  function delRedundanceGraph(updater, series) {
    var graphs = updater.graphs,
        render = updater.chart.render;
    var cacheGraphNum = graphs.length;
    var needGraphNum = series.length;

    if (cacheGraphNum > needGraphNum) {
      var needDelGraphs = graphs.splice(needGraphNum);
      needDelGraphs.forEach(function (item) {
        return item.forEach(function (g) {
          return render.delGraph(g);
        });
      });
    }
  }

  function changeGraphs(cache, seriesItem, i, updater) {
    var getGraphConfig = updater.getGraphConfig,
        render = updater.chart.render,
        beforeChange = updater.beforeChange;
    var configs = getGraphConfig(seriesItem, updater);
    balanceGraphsNum(cache, configs, render);
    cache.forEach(function (graph, j) {
      var config = configs[j];
      if (typeof beforeChange === 'function') beforeChange(graph, config);
      updateGraphConfigByKey(graph, config);
    });
  }

  function balanceGraphsNum(graphs, graphConfig, render) {
    var cacheGraphNum = graphs.length;
    var needGraphNum = graphConfig.length;

    if (needGraphNum > cacheGraphNum) {
      var lastCacheGraph = graphs.slice(-1)[0];
      var needAddGraphNum = needGraphNum - cacheGraphNum;
      var needAddGraphs = new Array(needAddGraphNum).fill(0).map(function (foo) {
        return render.clone(lastCacheGraph);
      });
      graphs.push.apply(graphs, _toConsumableArray(needAddGraphs));
    } else if (needGraphNum < cacheGraphNum) {
      var needDelCache = graphs.splice(needGraphNum);
      needDelCache.forEach(function (g) {
        return render.delGraph(g);
      });
    }
  }

  function addGraphs(graphs, seriesItem, i, updater) {
    var getGraphConfig = updater.getGraphConfig,
        getStartGraphConfig = updater.getStartGraphConfig,
        chart = updater.chart;
    var render = chart.render;
    var startConfigs = null;
    if (typeof getStartGraphConfig === 'function') startConfigs = getStartGraphConfig(seriesItem, updater);
    var configs = getGraphConfig(seriesItem, updater);
    if (!configs.length) return;

    if (startConfigs) {
      graphs[i] = startConfigs.map(function (config) {
        return render.add(config);
      });
      graphs[i].forEach(function (graph, i) {
        var config = configs[i];
        updateGraphConfigByKey(graph, config);
      });
    } else {
      graphs[i] = configs.map(function (config) {
        return render.add(config);
      });
    }

    var afterAddGraph = updater.afterAddGraph;
    if (typeof afterAddGraph === 'function') afterAddGraph(graphs[i]);
  }

  function updateGraphConfigByKey(graph, config) {
    var keys = Object.keys(config);
    keys.forEach(function (key) {
      if (key === 'shape' || key === 'style') {
        graph.animation(key, config[key], true);
      } else {
        graph[key] = config[key];
      }
    });
  }

  function doUpdate() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        chart = _ref.chart,
        series = _ref.series,
        key = _ref.key,
        getGraphConfig = _ref.getGraphConfig,
        getStartGraphConfig = _ref.getStartGraphConfig,
        beforeChange = _ref.beforeChange,
        beforeUpdate = _ref.beforeUpdate,
        afterAddGraph = _ref.afterAddGraph;

    if (chart[key]) {
      chart[key].update(series);
    } else {
      chart[key] = new Updater({
        chart: chart,
        key: key,
        getGraphConfig: getGraphConfig,
        getStartGraphConfig: getStartGraphConfig,
        beforeChange: beforeChange,
        beforeUpdate: beforeUpdate,
        afterAddGraph: afterAddGraph
      }, series);
    }
  }
  });

  unwrapExports(updater_class);
  var updater_class_1 = updater_class.doUpdate;
  var updater_class_2 = updater_class.Updater;

  var title_1$1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.title = title;

















  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function title(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var title = [];

    if (option.title) {
      title[0] = (0, util$1.deepMerge)((0, util.deepClone)(config.titleConfig, true), option.title);
    }

    (0, updater_class.doUpdate)({
      chart: chart,
      series: title,
      key: 'title',
      getGraphConfig: getTitleConfig
    });
  }

  function getTitleConfig(titleItem, updater) {
    var animationCurve = config.titleConfig.animationCurve,
        animationFrame = config.titleConfig.animationFrame,
        rLevel = config.titleConfig.rLevel;
    var shape = getTitleShape(titleItem, updater);
    var style = getTitleStyle(titleItem);
    return [{
      name: 'text',
      index: rLevel,
      visible: titleItem.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    }];
  }

  function getTitleShape(titleItem, updater) {
    var offset = titleItem.offset,
        text = titleItem.text;
    var _updater$chart$gridAr = updater.chart.gridArea,
        x = _updater$chart$gridAr.x,
        y = _updater$chart$gridAr.y,
        w = _updater$chart$gridAr.w;

    var _offset = _slicedToArray(offset, 2),
        ox = _offset[0],
        oy = _offset[1];

    return {
      content: text,
      position: [x + w / 2 + ox, y + oy]
    };
  }

  function getTitleStyle(titleItem) {
    var style = titleItem.style;
    return style;
  }
  });

  unwrapExports(title_1$1);
  var title_2 = title_1$1.title;

  var grid_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.grid = grid;





























  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function grid(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var grid = option.grid;
    grid = (0, util$1.deepMerge)((0, util.deepClone)(config.gridConfig, true), grid || {});
    (0, updater_class.doUpdate)({
      chart: chart,
      series: [grid],
      key: 'grid',
      getGraphConfig: getGridConfig
    });
  }

  function getGridConfig(gridItem, updater) {
    var animationCurve = gridItem.animationCurve,
        animationFrame = gridItem.animationFrame,
        rLevel = gridItem.rLevel;
    var shape = getGridShape(gridItem, updater);
    var style = getGridStyle(gridItem);
    updater.chart.gridArea = _objectSpread({}, shape);
    return [{
      name: 'rect',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    }];
  }

  function getGridShape(gridItem, updater) {
    var _updater$chart$render = _slicedToArray(updater.chart.render.area, 2),
        w = _updater$chart$render[0],
        h = _updater$chart$render[1];

    var left = getNumberValue(gridItem.left, w);
    var right = getNumberValue(gridItem.right, w);
    var top = getNumberValue(gridItem.top, h);
    var bottom = getNumberValue(gridItem.bottom, h);
    var width = w - left - right;
    var height = h - top - bottom;
    return {
      x: left,
      y: top,
      w: width,
      h: height
    };
  }

  function getNumberValue(val, all) {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return 0;
    return all * parseInt(val) / 100;
  }

  function getGridStyle(gridItem) {
    var style = gridItem.style;
    return style;
  }
  });

  unwrapExports(grid_1$1);
  var grid_2 = grid_1$1.grid;

  var $indexOf = _arrayIncludes(false);
  var $native = [].indexOf;
  var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

  _export(_export.P + _export.F * (NEGATIVE_ZERO || !_strictMethod($native)), 'Array', {
    // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      return NEGATIVE_ZERO
        // convert -0 to +0
        ? $native.apply(this, arguments) || 0
        : $indexOf(this, searchElement, arguments[1]);
    }
  });

  var axis_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.axis = axis;















































  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  var axisConfig = {
    xAxisConfig: config.xAxisConfig,
    yAxisConfig: config.yAxisConfig
  };
  var min = Math.min,
      max = Math.max,
      abs = Math.abs,
      pow = Math.pow;

  function axis(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var xAxis = option.xAxis,
        yAxis = option.yAxis,
        series = option.series;
    var allAxis = [];

    if (xAxis && yAxis && series) {
      allAxis = getAllAxis(xAxis, yAxis);
      allAxis = mergeDefaultAxisConfig(allAxis);
      allAxis = allAxis.filter(function (_ref) {
        var show = _ref.show;
        return show;
      });
      allAxis = mergeDefaultBoundaryGap(allAxis);
      allAxis = calcAxisLabelData(allAxis, series);
      allAxis = setAxisPosition(allAxis);
      allAxis = calcAxisLinePosition(allAxis, chart);
      allAxis = calcAxisTickPosition(allAxis);
      allAxis = calcAxisNamePosition(allAxis);
      allAxis = calcSplitLinePosition(allAxis, chart);
    }

    (0, updater_class.doUpdate)({
      chart: chart,
      series: allAxis,
      key: 'axisLine',
      getGraphConfig: getLineConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: allAxis,
      key: 'axisTick',
      getGraphConfig: getTickConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: allAxis,
      key: 'axisLabel',
      getGraphConfig: getLabelConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: allAxis,
      key: 'axisName',
      getGraphConfig: getNameConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: allAxis,
      key: 'splitLine',
      getGraphConfig: getSplitLineConfig
    });
    chart.axisData = allAxis;
  }

  function getAllAxis(xAxis, yAxis) {
    var allXAxis = [],
        allYAxis = [];

    if (xAxis instanceof Array) {
      var _allXAxis;

      (_allXAxis = allXAxis).push.apply(_allXAxis, _toConsumableArray(xAxis));
    } else {
      allXAxis.push(xAxis);
    }

    if (yAxis instanceof Array) {
      var _allYAxis;

      (_allYAxis = allYAxis).push.apply(_allYAxis, _toConsumableArray(yAxis));
    } else {
      allYAxis.push(yAxis);
    }

    allXAxis.splice(2);
    allYAxis.splice(2);
    allXAxis = allXAxis.map(function (axis, i) {
      return _objectSpread({}, axis, {
        index: i,
        axis: 'x'
      });
    });
    allYAxis = allYAxis.map(function (axis, i) {
      return _objectSpread({}, axis, {
        index: i,
        axis: 'y'
      });
    });
    return [].concat(_toConsumableArray(allXAxis), _toConsumableArray(allYAxis));
  }

  function mergeDefaultAxisConfig(allAxis) {
    var xAxis = allAxis.filter(function (_ref2) {
      var axis = _ref2.axis;
      return axis === 'x';
    });
    var yAxis = allAxis.filter(function (_ref3) {
      var axis = _ref3.axis;
      return axis === 'y';
    });
    xAxis = xAxis.map(function (axis) {
      return (0, util$1.deepMerge)((0, util.deepClone)(config.xAxisConfig), axis);
    });
    yAxis = yAxis.map(function (axis) {
      return (0, util$1.deepMerge)((0, util.deepClone)(config.yAxisConfig), axis);
    });
    return [].concat(_toConsumableArray(xAxis), _toConsumableArray(yAxis));
  }

  function mergeDefaultBoundaryGap(allAxis) {
    var valueAxis = allAxis.filter(function (_ref4) {
      var data = _ref4.data;
      return data === 'value';
    });
    var labelAxis = allAxis.filter(function (_ref5) {
      var data = _ref5.data;
      return data !== 'value';
    });
    valueAxis.forEach(function (axis) {
      if (typeof axis.boundaryGap === 'boolean') return;
      axis.boundaryGap = false;
    });
    labelAxis.forEach(function (axis) {
      if (typeof axis.boundaryGap === 'boolean') return;
      axis.boundaryGap = true;
    });
    return [].concat(_toConsumableArray(valueAxis), _toConsumableArray(labelAxis));
  }

  function calcAxisLabelData(allAxis, series) {
    var valueAxis = allAxis.filter(function (_ref6) {
      var data = _ref6.data;
      return data === 'value';
    });
    var labelAxis = allAxis.filter(function (_ref7) {
      var data = _ref7.data;
      return data instanceof Array;
    });
    valueAxis = calcValueAxisLabelData(valueAxis, series);
    labelAxis = calcLabelAxisLabelData(labelAxis);
    return [].concat(_toConsumableArray(valueAxis), _toConsumableArray(labelAxis));
  }

  function calcValueAxisLabelData(valueAxis, series) {
    return valueAxis.map(function (axis) {
      var minMaxValue = getValueAxisMaxMinValue(axis, series);

      var _getTrueMinMax = getTrueMinMax(axis, minMaxValue),
          _getTrueMinMax2 = _slicedToArray(_getTrueMinMax, 2),
          min = _getTrueMinMax2[0],
          max = _getTrueMinMax2[1];

      var interval = getValueInterval(min, max, axis);
      var formatter = axis.axisLabel.formatter;
      var label = [];

      if (minMaxValue[0] === minMaxValue[1]) {
        label = minMaxValue;
      } else if (min < 0 && max > 0) {
        label = getValueAxisLabelFromZero(min, max, interval);
      } else {
        label = getValueAxisLabelFromMin(min, max, interval);
      }

      label = label.map(function (l) {
        return parseFloat(l.toFixed(2));
      });
      return _objectSpread({}, axis, {
        maxValue: label.slice(-1)[0],
        minValue: label[0],
        label: getAfterFormatterLabel(label, formatter)
      });
    });
  }

  function getValueAxisMaxMinValue(axis, series) {
    series = series.filter(function (_ref8) {
      var show = _ref8.show,
          type = _ref8.type;
      if (show === false) return false;
      if (type === 'pie') return false;
      return true;
    });
    if (series.length === 0) return [0, 0];
    var index = axis.index,
        axisType = axis.axis;
    series = mergeStackData(series);
    var axisName = axisType + 'Axis';
    var valueSeries = series.filter(function (s) {
      return s[axisName] === index;
    });
    if (!valueSeries.length) valueSeries = series;
    return getSeriesMinMaxValue(valueSeries);
  }

  function getSeriesMinMaxValue(series) {
    if (!series) return;
    var minValue = min.apply(void 0, _toConsumableArray(series.map(function (_ref9) {
      var data = _ref9.data;
      return min.apply(void 0, _toConsumableArray((0, util$1.filterNonNumber)(data)));
    })));
    var maxValue = max.apply(void 0, _toConsumableArray(series.map(function (_ref10) {
      var data = _ref10.data;
      return max.apply(void 0, _toConsumableArray((0, util$1.filterNonNumber)(data)));
    })));
    return [minValue, maxValue];
  }

  function mergeStackData(series) {
    var seriesCloned = (0, util.deepClone)(series, true);
    series.forEach(function (item, i) {
      var data = (0, util$1.mergeSameStackData)(item, series);
      seriesCloned[i].data = data;
    });
    return seriesCloned;
  }

  function getTrueMinMax(_ref11, _ref12) {
    var min = _ref11.min,
        max = _ref11.max,
        axis = _ref11.axis;

    var _ref13 = _slicedToArray(_ref12, 2),
        minValue = _ref13[0],
        maxValue = _ref13[1];

    var minType = _typeof(min),
        maxType = _typeof(max);

    if (!testMinMaxType(min)) {
      min = axisConfig[axis + 'AxisConfig'].min;
      minType = 'string';
    }

    if (!testMinMaxType(max)) {
      max = axisConfig[axis + 'AxisConfig'].max;
      maxType = 'string';
    }

    if (minType === 'string') {
      min = parseInt(minValue - abs(minValue * parseFloat(min) / 100));
      var lever = getValueLever(min);
      min = parseFloat((min / lever - 0.1).toFixed(1)) * lever;
    }

    if (maxType === 'string') {
      max = parseInt(maxValue + abs(maxValue * parseFloat(max) / 100));

      var _lever = getValueLever(max);

      max = parseFloat((max / _lever + 0.1).toFixed(1)) * _lever;
    }

    return [min, max];
  }

  function getValueLever(value) {
    var valueString = abs(value).toString();
    var valueLength = valueString.length;
    var firstZeroIndex = valueString.replace(/0*$/g, '').indexOf('0');
    var pow10Num = valueLength - 1;
    if (firstZeroIndex !== -1) pow10Num -= firstZeroIndex;
    return pow(10, pow10Num);
  }

  function testMinMaxType(val) {
    var valType = _typeof(val);

    var isValidString = valType === 'string' && /^\d+%$/.test(val);
    var isValidNumber = valType === 'number';
    return isValidString || isValidNumber;
  }

  function getValueAxisLabelFromZero(min, max, interval) {
    var negative = [],
        positive = [];
    var currentNegative = 0,
        currentPositive = 0;

    do {
      negative.push(currentNegative -= interval);
    } while (currentNegative > min);

    do {
      positive.push(currentPositive += interval);
    } while (currentPositive < max);

    return [].concat(_toConsumableArray(negative.reverse()), [0], _toConsumableArray(positive));
  }

  function getValueAxisLabelFromMin(min, max, interval) {
    var label = [min],
        currentValue = min;

    do {
      label.push(currentValue += interval);
    } while (currentValue < max);

    return label;
  }

  function getAfterFormatterLabel(label, formatter) {
    if (!formatter) return label;
    if (typeof formatter === 'string') label = label.map(function (l) {
      return formatter.replace('{value}', l);
    });
    if (typeof formatter === 'function') label = label.map(function (value, index) {
      return formatter({
        value: value,
        index: index
      });
    });
    return label;
  }

  function calcLabelAxisLabelData(labelAxis) {
    return labelAxis.map(function (axis) {
      var data = axis.data,
          formatter = axis.axisLabel.formatter;
      return _objectSpread({}, axis, {
        label: getAfterFormatterLabel(data, formatter)
      });
    });
  }

  function getValueInterval(min, max, axis) {
    var interval = axis.interval,
        minInterval = axis.minInterval,
        maxInterval = axis.maxInterval,
        splitNumber = axis.splitNumber,
        axisType = axis.axis;
    var config = axisConfig[axisType + 'AxisConfig'];
    if (typeof interval !== 'number') interval = config.interval;
    if (typeof minInterval !== 'number') minInterval = config.minInterval;
    if (typeof maxInterval !== 'number') maxInterval = config.maxInterval;
    if (typeof splitNumber !== 'number') splitNumber = config.splitNumber;
    if (typeof interval === 'number') return interval;
    var valueInterval = parseInt((max - min) / (splitNumber - 1));
    if (valueInterval.toString().length > 1) valueInterval = parseInt(valueInterval.toString().replace(/\d$/, '0'));
    if (valueInterval === 0) valueInterval = 1;
    if (typeof minInterval === 'number' && valueInterval < minInterval) return minInterval;
    if (typeof maxInterval === 'number' && valueInterval > maxInterval) return maxInterval;
    return valueInterval;
  }

  function setAxisPosition(allAxis) {
    var xAxis = allAxis.filter(function (_ref14) {
      var axis = _ref14.axis;
      return axis === 'x';
    });
    var yAxis = allAxis.filter(function (_ref15) {
      var axis = _ref15.axis;
      return axis === 'y';
    });
    if (xAxis[0] && !xAxis[0].position) xAxis[0].position = config.xAxisConfig.position;

    if (xAxis[1] && !xAxis[1].position) {
      xAxis[1].position = xAxis[0].position === 'bottom' ? 'top' : 'bottom';
    }

    if (yAxis[0] && !yAxis[0].position) yAxis[0].position = config.yAxisConfig.position;

    if (yAxis[1] && !yAxis[1].position) {
      yAxis[1].position = yAxis[0].position === 'left' ? 'right' : 'left';
    }

    return [].concat(_toConsumableArray(xAxis), _toConsumableArray(yAxis));
  }

  function calcAxisLinePosition(allAxis, chart) {
    var _chart$gridArea = chart.gridArea,
        x = _chart$gridArea.x,
        y = _chart$gridArea.y,
        w = _chart$gridArea.w,
        h = _chart$gridArea.h;
    allAxis = allAxis.map(function (axis) {
      var position = axis.position;
      var linePosition = [];

      if (position === 'left') {
        linePosition = [[x, y], [x, y + h]].reverse();
      } else if (position === 'right') {
        linePosition = [[x + w, y], [x + w, y + h]].reverse();
      } else if (position === 'top') {
        linePosition = [[x, y], [x + w, y]];
      } else if (position === 'bottom') {
        linePosition = [[x, y + h], [x + w, y + h]];
      }

      return _objectSpread({}, axis, {
        linePosition: linePosition
      });
    });
    return allAxis;
  }

  function calcAxisTickPosition(allAxis, chart) {
    return allAxis.map(function (axisItem) {
      var axis = axisItem.axis,
          linePosition = axisItem.linePosition,
          position = axisItem.position,
          label = axisItem.label,
          boundaryGap = axisItem.boundaryGap;
      if (typeof boundaryGap !== 'boolean') boundaryGap = axisConfig[axis + 'AxisConfig'].boundaryGap;
      var labelNum = label.length;

      var _linePosition = _slicedToArray(linePosition, 2),
          _linePosition$ = _slicedToArray(_linePosition[0], 2),
          startX = _linePosition$[0],
          startY = _linePosition$[1],
          _linePosition$2 = _slicedToArray(_linePosition[1], 2),
          endX = _linePosition$2[0],
          endY = _linePosition$2[1];

      var gapLength = axis === 'x' ? endX - startX : endY - startY;
      var gap = gapLength / (boundaryGap ? labelNum : labelNum - 1);
      var tickPosition = new Array(labelNum).fill(0).map(function (foo, i) {
        if (axis === 'x') {
          return [startX + gap * (boundaryGap ? i + 0.5 : i), startY];
        }

        return [startX, startY + gap * (boundaryGap ? i + 0.5 : i)];
      });
      var tickLinePosition = getTickLinePosition(axis, boundaryGap, position, tickPosition, gap);
      return _objectSpread({}, axisItem, {
        tickPosition: tickPosition,
        tickLinePosition: tickLinePosition,
        tickGap: gap
      });
    });
  }

  function getTickLinePosition(axisType, boundaryGap, position, tickPosition, gap) {
    var index = axisType === 'x' ? 1 : 0;
    var plus = 5;
    if (axisType === 'x' && position === 'top') plus = -5;
    if (axisType === 'y' && position === 'left') plus = -5;
    var tickLinePosition = tickPosition.map(function (lineStart) {
      var lineEnd = (0, util.deepClone)(lineStart);
      lineEnd[index] += plus;
      return [(0, util.deepClone)(lineStart), lineEnd];
    });
    if (!boundaryGap) return tickLinePosition;
    index = axisType === 'x' ? 0 : 1;
    plus = gap / 2;
    tickLinePosition.forEach(function (_ref16) {
      var _ref17 = _slicedToArray(_ref16, 2),
          lineStart = _ref17[0],
          lineEnd = _ref17[1];

      lineStart[index] += plus;
      lineEnd[index] += plus;
    });
    return tickLinePosition;
  }

  function calcAxisNamePosition(allAxis, chart) {
    return allAxis.map(function (axisItem) {
      var nameGap = axisItem.nameGap,
          nameLocation = axisItem.nameLocation,
          position = axisItem.position,
          linePosition = axisItem.linePosition;

      var _linePosition2 = _slicedToArray(linePosition, 2),
          lineStart = _linePosition2[0],
          lineEnd = _linePosition2[1];

      var namePosition = _toConsumableArray(lineStart);

      if (nameLocation === 'end') namePosition = _toConsumableArray(lineEnd);

      if (nameLocation === 'center') {
        namePosition[0] = (lineStart[0] + lineEnd[0]) / 2;
        namePosition[1] = (lineStart[1] + lineEnd[1]) / 2;
      }

      var index = 0;
      if (position === 'top' && nameLocation === 'center') index = 1;
      if (position === 'bottom' && nameLocation === 'center') index = 1;
      if (position === 'left' && nameLocation !== 'center') index = 1;
      if (position === 'right' && nameLocation !== 'center') index = 1;
      var plus = nameGap;
      if (position === 'top' && nameLocation !== 'end') plus *= -1;
      if (position === 'left' && nameLocation !== 'start') plus *= -1;
      if (position === 'bottom' && nameLocation === 'start') plus *= -1;
      if (position === 'right' && nameLocation === 'end') plus *= -1;
      namePosition[index] += plus;
      return _objectSpread({}, axisItem, {
        namePosition: namePosition
      });
    });
  }

  function calcSplitLinePosition(allAxis, chart) {
    var _chart$gridArea2 = chart.gridArea,
        w = _chart$gridArea2.w,
        h = _chart$gridArea2.h;
    return allAxis.map(function (axisItem) {
      var tickLinePosition = axisItem.tickLinePosition,
          position = axisItem.position,
          boundaryGap = axisItem.boundaryGap;
      var index = 0,
          plus = w;
      if (position === 'top' || position === 'bottom') index = 1;
      if (position === 'top' || position === 'bottom') plus = h;
      if (position === 'right' || position === 'bottom') plus *= -1;
      var splitLinePosition = tickLinePosition.map(function (_ref18) {
        var _ref19 = _slicedToArray(_ref18, 1),
            startPoint = _ref19[0];

        var endPoint = _toConsumableArray(startPoint);

        endPoint[index] += plus;
        return [_toConsumableArray(startPoint), endPoint];
      });
      if (!boundaryGap) splitLinePosition.shift();
      return _objectSpread({}, axisItem, {
        splitLinePosition: splitLinePosition
      });
    });
  }

  function getLineConfig(axisItem) {
    var animationCurve = axisItem.animationCurve,
        animationFrame = axisItem.animationFrame,
        rLevel = axisItem.rLevel;
    return [{
      name: 'polyline',
      index: rLevel,
      visible: axisItem.axisLine.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getLineShape(axisItem),
      style: getLineStyle(axisItem)
    }];
  }

  function getLineShape(axisItem) {
    var linePosition = axisItem.linePosition;
    return {
      points: linePosition
    };
  }

  function getLineStyle(axisItem) {
    return axisItem.axisLine.style;
  }

  function getTickConfig(axisItem) {
    var animationCurve = axisItem.animationCurve,
        animationFrame = axisItem.animationFrame,
        rLevel = axisItem.rLevel;
    var shapes = getTickShapes(axisItem);
    var style = getTickStyle(axisItem);
    return shapes.map(function (shape) {
      return {
        name: 'polyline',
        index: rLevel,
        visible: axisItem.axisTick.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: shape,
        style: style
      };
    });
  }

  function getTickShapes(axisItem) {
    var tickLinePosition = axisItem.tickLinePosition;
    return tickLinePosition.map(function (points) {
      return {
        points: points
      };
    });
  }

  function getTickStyle(axisItem) {
    return axisItem.axisTick.style;
  }

  function getLabelConfig(axisItem) {
    var animationCurve = axisItem.animationCurve,
        animationFrame = axisItem.animationFrame,
        rLevel = axisItem.rLevel;
    var shapes = getLabelShapes(axisItem);
    var styles = getLabelStyle(axisItem, shapes);
    return shapes.map(function (shape, i) {
      return {
        name: 'text',
        index: rLevel,
        visible: axisItem.axisLabel.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: shape,
        style: styles[i],
        setGraphCenter: function setGraphCenter() {
          return void 0;
        }
      };
    });
  }

  function getLabelShapes(axisItem) {
    var label = axisItem.label,
        tickPosition = axisItem.tickPosition,
        position = axisItem.position;
    return tickPosition.map(function (point, i) {
      return {
        position: getLabelRealPosition(point, position),
        content: label[i].toString()
      };
    });
  }

  function getLabelRealPosition(points, position) {
    var index = 0,
        plus = 10;
    if (position === 'top' || position === 'bottom') index = 1;
    if (position === 'top' || position === 'left') plus = -10;
    points = (0, util.deepClone)(points);
    points[index] += plus;
    return points;
  }

  function getLabelStyle(axisItem, shapes) {
    var position = axisItem.position;
    var style = axisItem.axisLabel.style;
    var align = getAxisLabelRealAlign(position);
    style = (0, util$1.deepMerge)(align, style);
    var styles = shapes.map(function (_ref20) {
      var position = _ref20.position;
      return _objectSpread({}, style, {
        graphCenter: position
      });
    });
    return styles;
  }

  function getAxisLabelRealAlign(position) {
    if (position === 'left') return {
      textAlign: 'right',
      textBaseline: 'middle'
    };
    if (position === 'right') return {
      textAlign: 'left',
      textBaseline: 'middle'
    };
    if (position === 'top') return {
      textAlign: 'center',
      textBaseline: 'bottom'
    };
    if (position === 'bottom') return {
      textAlign: 'center',
      textBaseline: 'top'
    };
  }

  function getNameConfig(axisItem) {
    var animationCurve = axisItem.animationCurve,
        animationFrame = axisItem.animationFrame,
        rLevel = axisItem.rLevel;
    return [{
      name: 'text',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getNameShape(axisItem),
      style: getNameStyle(axisItem)
    }];
  }

  function getNameShape(axisItem) {
    var name = axisItem.name,
        namePosition = axisItem.namePosition;
    return {
      content: name,
      position: namePosition
    };
  }

  function getNameStyle(axisItem) {
    var nameLocation = axisItem.nameLocation,
        position = axisItem.position,
        style = axisItem.nameTextStyle;
    var align = getNameRealAlign(position, nameLocation);
    return (0, util$1.deepMerge)(align, style);
  }

  function getNameRealAlign(position, location) {
    if (position === 'top' && location === 'start' || position === 'bottom' && location === 'start' || position === 'left' && location === 'center') return {
      textAlign: 'right',
      textBaseline: 'middle'
    };
    if (position === 'top' && location === 'end' || position === 'bottom' && location === 'end' || position === 'right' && location === 'center') return {
      textAlign: 'left',
      textBaseline: 'middle'
    };
    if (position === 'top' && location === 'center' || position === 'left' && location === 'end' || position === 'right' && location === 'end') return {
      textAlign: 'center',
      textBaseline: 'bottom'
    };
    if (position === 'bottom' && location === 'center' || position === 'left' && location === 'start' || position === 'right' && location === 'start') return {
      textAlign: 'center',
      textBaseline: 'top'
    };
  }

  function getSplitLineConfig(axisItem) {
    var animationCurve = axisItem.animationCurve,
        animationFrame = axisItem.animationFrame,
        rLevel = axisItem.rLevel;
    var shapes = getSplitLineShapes(axisItem);
    var style = getSplitLineStyle(axisItem);
    return shapes.map(function (shape) {
      return {
        name: 'polyline',
        index: rLevel,
        visible: axisItem.splitLine.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: shape,
        style: style
      };
    });
  }

  function getSplitLineShapes(axisItem) {
    var splitLinePosition = axisItem.splitLinePosition;
    return splitLinePosition.map(function (points) {
      return {
        points: points
      };
    });
  }

  function getSplitLineStyle(axisItem) {
    return axisItem.splitLine.style;
  }
  });

  unwrapExports(axis_1$1);
  var axis_2$1 = axis_1$1.axis;

  var line_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.line = line;













































  var _bezierCurve = _interopRequireDefault(lib$1);



  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var polylineToBezierCurve = _bezierCurve["default"].polylineToBezierCurve,
      getBezierCurveLength = _bezierCurve["default"].getBezierCurveLength;

  function line(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var xAxis = option.xAxis,
        yAxis = option.yAxis,
        series = option.series;
    var lines = [];

    if (xAxis && yAxis && series) {
      lines = (0, util$1.initNeedSeries)(series, config.lineConfig, 'line');
      lines = calcLinesPosition(lines, chart);
    }

    (0, updater_class.doUpdate)({
      chart: chart,
      series: lines,
      key: 'lineArea',
      getGraphConfig: getLineAreaConfig,
      getStartGraphConfig: getStartLineAreaConfig,
      beforeUpdate: beforeUpdateLineAndArea,
      beforeChange: beforeChangeLineAndArea
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: lines,
      key: 'line',
      getGraphConfig: getLineConfig,
      getStartGraphConfig: getStartLineConfig,
      beforeUpdate: beforeUpdateLineAndArea,
      beforeChange: beforeChangeLineAndArea
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: lines,
      key: 'linePoint',
      getGraphConfig: getPointConfig,
      getStartGraphConfig: getStartPointConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: lines,
      key: 'lineLabel',
      getGraphConfig: getLabelConfig
    });
  }

  function calcLinesPosition(lines, chart) {
    var axisData = chart.axisData;
    return lines.map(function (lineItem) {
      var lineData = (0, util$1.mergeSameStackData)(lineItem, lines);
      lineData = mergeNonNumber(lineItem, lineData);
      var lineAxis = getLineAxis(lineItem, axisData);
      var linePosition = getLinePosition(lineData, lineAxis);
      var lineFillBottomPos = getLineFillBottomPos(lineAxis);
      return _objectSpread({}, lineItem, {
        linePosition: linePosition.filter(function (p) {
          return p;
        }),
        lineFillBottomPos: lineFillBottomPos
      });
    });
  }

  function mergeNonNumber(lineItem, lineData) {
    var data = lineItem.data;
    return lineData.map(function (v, i) {
      return typeof data[i] === 'number' ? v : null;
    });
  }

  function getLineAxis(line, axisData) {
    var xAxisIndex = line.xAxisIndex,
        yAxisIndex = line.yAxisIndex;
    var xAxis = axisData.find(function (_ref) {
      var axis = _ref.axis,
          index = _ref.index;
      return axis === 'x' && index === xAxisIndex;
    });
    var yAxis = axisData.find(function (_ref2) {
      var axis = _ref2.axis,
          index = _ref2.index;
      return axis === 'y' && index === yAxisIndex;
    });
    return [xAxis, yAxis];
  }

  function getLinePosition(lineData, lineAxis) {
    var valueAxisIndex = lineAxis.findIndex(function (_ref3) {
      var data = _ref3.data;
      return data === 'value';
    });
    var valueAxis = lineAxis[valueAxisIndex];
    var labelAxis = lineAxis[1 - valueAxisIndex];
    var linePosition = valueAxis.linePosition,
        axis = valueAxis.axis;
    var tickPosition = labelAxis.tickPosition;
    var tickNum = tickPosition.length;
    var valueAxisPosIndex = axis === 'x' ? 0 : 1;
    var valueAxisStartPos = linePosition[0][valueAxisPosIndex];
    var valueAxisEndPos = linePosition[1][valueAxisPosIndex];
    var valueAxisPosMinus = valueAxisEndPos - valueAxisStartPos;
    var maxValue = valueAxis.maxValue,
        minValue = valueAxis.minValue;
    var valueMinus = maxValue - minValue;
    var position = new Array(tickNum).fill(0).map(function (foo, i) {
      var v = lineData[i];
      if (typeof v !== 'number') return null;
      var valuePercent = (v - minValue) / valueMinus;
      if (valueMinus === 0) valuePercent = 0;
      return valuePercent * valueAxisPosMinus + valueAxisStartPos;
    });
    return position.map(function (vPos, i) {
      if (i >= tickNum || typeof vPos !== 'number') return null;
      var pos = [vPos, tickPosition[i][1 - valueAxisPosIndex]];
      if (valueAxisPosIndex === 0) return pos;
      pos.reverse();
      return pos;
    });
  }

  function getLineFillBottomPos(lineAxis) {
    var valueAxis = lineAxis.find(function (_ref4) {
      var data = _ref4.data;
      return data === 'value';
    });
    var axis = valueAxis.axis,
        linePosition = valueAxis.linePosition,
        minValue = valueAxis.minValue,
        maxValue = valueAxis.maxValue;
    var changeIndex = axis === 'x' ? 0 : 1;
    var changeValue = linePosition[0][changeIndex];

    if (minValue < 0 && maxValue > 0) {
      var valueMinus = maxValue - minValue;
      var posMinus = Math.abs(linePosition[0][changeIndex] - linePosition[1][changeIndex]);
      var offset = Math.abs(minValue) / valueMinus * posMinus;
      if (axis === 'y') offset *= -1;
      changeValue += offset;
    }

    return {
      changeIndex: changeIndex,
      changeValue: changeValue
    };
  }

  function getLineAreaConfig(lineItem) {
    var animationCurve = lineItem.animationCurve,
        animationFrame = lineItem.animationFrame,
        lineFillBottomPos = lineItem.lineFillBottomPos,
        rLevel = lineItem.rLevel;
    return [{
      name: getLineGraphName(lineItem),
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      visible: lineItem.lineArea.show,
      lineFillBottomPos: lineFillBottomPos,
      shape: getLineAndAreaShape(lineItem),
      style: getLineAreaStyle(lineItem),
      drawed: lineAreaDrawed
    }];
  }

  function getLineAndAreaShape(lineItem) {
    var linePosition = lineItem.linePosition;
    return {
      points: linePosition
    };
  }

  function getLineAreaStyle(lineItem) {
    var lineArea = lineItem.lineArea,
        color = lineItem.color;
    var gradient = lineArea.gradient,
        style = lineArea.style;
    var fillColor = [style.fill || color];
    var gradientColor = (0, util$1.deepMerge)(fillColor, gradient);
    if (gradientColor.length === 1) gradientColor.push(gradientColor[0]);
    var gradientParams = getGradientParams(lineItem);
    style = _objectSpread({}, style, {
      stroke: 'rgba(0, 0, 0, 0)'
    });
    return (0, util$1.deepMerge)({
      gradientColor: gradientColor,
      gradientParams: gradientParams,
      gradientType: 'linear',
      gradientWith: 'fill'
    }, style);
  }

  function getGradientParams(lineItem) {
    var lineFillBottomPos = lineItem.lineFillBottomPos,
        linePosition = lineItem.linePosition;
    var changeIndex = lineFillBottomPos.changeIndex,
        changeValue = lineFillBottomPos.changeValue;
    var mainPos = linePosition.map(function (p) {
      return p[changeIndex];
    });
    var maxPos = Math.max.apply(Math, _toConsumableArray(mainPos));
    var minPos = Math.min.apply(Math, _toConsumableArray(mainPos));
    var beginPos = maxPos;
    if (changeIndex === 1) beginPos = minPos;

    if (changeIndex === 1) {
      return [0, beginPos, 0, changeValue];
    } else {
      return [beginPos, 0, changeValue, 0];
    }
  }

  function lineAreaDrawed(_ref5, _ref6) {
    var lineFillBottomPos = _ref5.lineFillBottomPos,
        shape = _ref5.shape;
    var ctx = _ref6.ctx;
    var points = shape.points;
    var changeIndex = lineFillBottomPos.changeIndex,
        changeValue = lineFillBottomPos.changeValue;

    var linePoint1 = _toConsumableArray(points[points.length - 1]);

    var linePoint2 = _toConsumableArray(points[0]);

    linePoint1[changeIndex] = changeValue;
    linePoint2[changeIndex] = changeValue;
    ctx.lineTo.apply(ctx, _toConsumableArray(linePoint1));
    ctx.lineTo.apply(ctx, _toConsumableArray(linePoint2));
    ctx.closePath();
    ctx.fill();
  }

  function getStartLineAreaConfig(lineItem) {
    var config = getLineAreaConfig(lineItem)[0];

    var style = _objectSpread({}, config.style);

    style.opacity = 0;
    config.style = style;
    return [config];
  }

  function beforeUpdateLineAndArea(graphs, lineItem, i, updater) {
    var cache = graphs[i];
    if (!cache) return;
    var currentName = getLineGraphName(lineItem);
    var render = updater.chart.render;
    var name = cache[0].name;
    var delAll = currentName !== name;
    if (!delAll) return;
    cache.forEach(function (g) {
      return render.delGraph(g);
    });
    graphs[i] = null;
  }

  function beforeChangeLineAndArea(graph, config) {
    var points = config.shape.points;
    var graphPoints = graph.shape.points;
    var graphPointsNum = graphPoints.length;
    var pointsNum = points.length;

    if (pointsNum > graphPointsNum) {
      var lastPoint = graphPoints.slice(-1)[0];
      var newAddPoints = new Array(pointsNum - graphPointsNum).fill(0).map(function (foo) {
        return _toConsumableArray(lastPoint);
      });
      graphPoints.push.apply(graphPoints, _toConsumableArray(newAddPoints));
    } else if (pointsNum < graphPointsNum) {
      graphPoints.splice(pointsNum);
    }
  }

  function getLineConfig(lineItem) {
    var animationCurve = lineItem.animationCurve,
        animationFrame = lineItem.animationFrame,
        rLevel = lineItem.rLevel;
    return [{
      name: getLineGraphName(lineItem),
      index: rLevel + 1,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getLineAndAreaShape(lineItem),
      style: getLineStyle(lineItem)
    }];
  }

  function getLineGraphName(lineItem) {
    var smooth = lineItem.smooth;
    return smooth ? 'smoothline' : 'polyline';
  }

  function getLineStyle(lineItem) {
    var lineStyle = lineItem.lineStyle,
        color = lineItem.color,
        smooth = lineItem.smooth,
        linePosition = lineItem.linePosition;
    var lineLength = getLineLength(linePosition, smooth);
    return (0, util$1.deepMerge)({
      stroke: color,
      lineDash: [lineLength, 0]
    }, lineStyle);
  }

  function getLineLength(points) {
    var smooth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!smooth) return (0, util$1.getPolylineLength)(points);
    var curve = polylineToBezierCurve(points);
    return getBezierCurveLength(curve);
  }

  function getStartLineConfig(lineItem) {
    var lineDash = lineItem.lineStyle.lineDash;
    var config = getLineConfig(lineItem)[0];
    var realLineDash = config.style.lineDash;

    if (lineDash) {
      realLineDash = [0, 0];
    } else {
      realLineDash = _toConsumableArray(realLineDash).reverse();
    }

    config.style.lineDash = realLineDash;
    return [config];
  }

  function getPointConfig(lineItem) {
    var animationCurve = lineItem.animationCurve,
        animationFrame = lineItem.animationFrame,
        rLevel = lineItem.rLevel;
    var shapes = getPointShapes(lineItem);
    var style = getPointStyle(lineItem);
    return shapes.map(function (shape) {
      return {
        name: 'circle',
        index: rLevel + 2,
        visible: lineItem.linePoint.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: shape,
        style: style
      };
    });
  }

  function getPointShapes(lineItem) {
    var linePosition = lineItem.linePosition,
        radius = lineItem.linePoint.radius;
    return linePosition.map(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          rx = _ref8[0],
          ry = _ref8[1];

      return {
        r: radius,
        rx: rx,
        ry: ry
      };
    });
  }

  function getPointStyle(lineItem) {
    var color = lineItem.color,
        style = lineItem.linePoint.style;
    return (0, util$1.deepMerge)({
      stroke: color
    }, style);
  }

  function getStartPointConfig(lineItem) {
    var configs = getPointConfig(lineItem);
    configs.forEach(function (config) {
      config.shape.r = 0.1;
    });
    return configs;
  }

  function getLabelConfig(lineItem) {
    var animationCurve = lineItem.animationCurve,
        animationFrame = lineItem.animationFrame,
        rLevel = lineItem.rLevel;
    var shapes = getLabelShapes(lineItem);
    var style = getLabelStyle(lineItem);
    return shapes.map(function (shape, i) {
      return {
        name: 'text',
        index: rLevel + 3,
        visible: lineItem.label.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: shape,
        style: style
      };
    });
  }

  function getLabelShapes(lineItem) {
    var contents = formatterLabel(lineItem);
    var position = getLabelPosition(lineItem);
    return contents.map(function (content, i) {
      return {
        content: content,
        position: position[i]
      };
    });
  }

  function getLabelPosition(lineItem) {
    var linePosition = lineItem.linePosition,
        lineFillBottomPos = lineItem.lineFillBottomPos,
        label = lineItem.label;
    var position = label.position,
        offset = label.offset;
    var changeIndex = lineFillBottomPos.changeIndex,
        changeValue = lineFillBottomPos.changeValue;
    return linePosition.map(function (pos) {
      if (position === 'bottom') {
        pos = _toConsumableArray(pos);
        pos[changeIndex] = changeValue;
      }

      if (position === 'center') {
        var bottom = _toConsumableArray(pos);

        bottom[changeIndex] = changeValue;
        pos = getCenterLabelPoint(pos, bottom);
      }

      return getOffsetedPoint(pos, offset);
    });
  }

  function getOffsetedPoint(_ref9, _ref10) {
    var _ref11 = _slicedToArray(_ref9, 2),
        x = _ref11[0],
        y = _ref11[1];

    var _ref12 = _slicedToArray(_ref10, 2),
        ox = _ref12[0],
        oy = _ref12[1];

    return [x + ox, y + oy];
  }

  function getCenterLabelPoint(_ref13, _ref14) {
    var _ref15 = _slicedToArray(_ref13, 2),
        ax = _ref15[0],
        ay = _ref15[1];

    var _ref16 = _slicedToArray(_ref14, 2),
        bx = _ref16[0],
        by = _ref16[1];

    return [(ax + bx) / 2, (ay + by) / 2];
  }

  function formatterLabel(lineItem) {
    var data = lineItem.data,
        formatter = lineItem.label.formatter;
    data = data.filter(function (d) {
      return typeof d === 'number';
    }).map(function (d) {
      return d.toString();
    });
    if (!formatter) return data;

    var type = _typeof(formatter);

    if (type === 'string') return data.map(function (d) {
      return formatter.replace('{value}', d);
    });
    if (type === 'function') return data.map(function (value, index) {
      return formatter({
        value: value,
        index: index
      });
    });
    return data;
  }

  function getLabelStyle(lineItem) {
    var color = lineItem.color,
        style = lineItem.label.style;
    return (0, util$1.deepMerge)({
      fill: color
    }, style);
  }
  });

  unwrapExports(line_1$1);
  var line_2 = line_1$1.line;

  var SET = 'Set';

  // 23.2 Set Objects
  var es6_set = _collection(SET, function (get) {
    return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
  }, {
    // 23.2.3.1 Set.prototype.add(value)
    add: function add(value) {
      return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
    }
  }, _collectionStrong);

  var bar_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.bar = bar;



















































  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function bar(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var xAxis = option.xAxis,
        yAxis = option.yAxis,
        series = option.series;
    var bars = [];

    if (xAxis && yAxis && series) {
      bars = (0, util$1.initNeedSeries)(series, config.barConfig, 'bar');
      bars = setBarAxis(bars, chart);
      bars = setBarPositionData(bars);
      bars = calcBarsPosition(bars);
    }

    (0, updater_class.doUpdate)({
      chart: chart,
      series: bars.slice(-1),
      key: 'backgroundBar',
      getGraphConfig: getBackgroundBarConfig
    });
    bars.reverse();
    (0, updater_class.doUpdate)({
      chart: chart,
      series: bars,
      key: 'bar',
      getGraphConfig: getBarConfig,
      getStartGraphConfig: getStartBarConfig,
      beforeUpdate: beforeUpdateBar
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: bars,
      key: 'barLabel',
      getGraphConfig: getLabelConfig
    });
  }

  function setBarAxis(bars, chart) {
    var axisData = chart.axisData;
    bars.forEach(function (bar) {
      var xAxisIndex = bar.xAxisIndex,
          yAxisIndex = bar.yAxisIndex;
      if (typeof xAxisIndex !== 'number') xAxisIndex = 0;
      if (typeof yAxisIndex !== 'number') yAxisIndex = 0;
      var xAxis = axisData.find(function (_ref) {
        var axis = _ref.axis,
            index = _ref.index;
        return "".concat(axis).concat(index) === "x".concat(xAxisIndex);
      });
      var yAxis = axisData.find(function (_ref2) {
        var axis = _ref2.axis,
            index = _ref2.index;
        return "".concat(axis).concat(index) === "y".concat(yAxisIndex);
      });
      var axis = [xAxis, yAxis];
      var valueAxisIndex = axis.findIndex(function (_ref3) {
        var data = _ref3.data;
        return data === 'value';
      });
      bar.valueAxis = axis[valueAxisIndex];
      bar.labelAxis = axis[1 - valueAxisIndex];
    });
    return bars;
  }

  function setBarPositionData(bars, chart) {
    var labelBarGroup = groupBarByLabelAxis(bars);
    labelBarGroup.forEach(function (group) {
      setBarIndex(group);
      setBarNum(group);
      setBarCategoryWidth(group);
      setBarWidthAndGap(group);
      setBarAllWidthAndGap(group);
    });
    return bars;
  }

  function setBarIndex(bars) {
    var stacks = getBarStack(bars);
    stacks = stacks.map(function (stack) {
      return {
        stack: stack,
        index: -1
      };
    });
    var currentIndex = 0;
    bars.forEach(function (bar) {
      var stack = bar.stack;

      if (!stack) {
        bar.barIndex = currentIndex;
        currentIndex++;
      } else {
        var stackData = stacks.find(function (_ref4) {
          var s = _ref4.stack;
          return s === stack;
        });

        if (stackData.index === -1) {
          stackData.index = currentIndex;
          currentIndex++;
        }

        bar.barIndex = stackData.index;
      }
    });
  }

  function groupBarByLabelAxis(bars) {
    var labelAxis = bars.map(function (_ref5) {
      var _ref5$labelAxis = _ref5.labelAxis,
          axis = _ref5$labelAxis.axis,
          index = _ref5$labelAxis.index;
      return axis + index;
    });
    labelAxis = _toConsumableArray(new Set(labelAxis));
    return labelAxis.map(function (axisIndex) {
      return bars.filter(function (_ref6) {
        var _ref6$labelAxis = _ref6.labelAxis,
            axis = _ref6$labelAxis.axis,
            index = _ref6$labelAxis.index;
        return axis + index === axisIndex;
      });
    });
  }

  function getBarStack(bars) {
    var stacks = [];
    bars.forEach(function (_ref7) {
      var stack = _ref7.stack;
      if (stack) stacks.push(stack);
    });
    return _toConsumableArray(new Set(stacks));
  }

  function setBarNum(bars) {
    var barNum = _toConsumableArray(new Set(bars.map(function (_ref8) {
      var barIndex = _ref8.barIndex;
      return barIndex;
    }))).length;

    bars.forEach(function (bar) {
      return bar.barNum = barNum;
    });
  }

  function setBarCategoryWidth(bars) {
    var lastBar = bars.slice(-1)[0];
    var barCategoryGap = lastBar.barCategoryGap,
        tickGap = lastBar.labelAxis.tickGap;
    var barCategoryWidth = 0;

    if (typeof barCategoryGap === 'number') {
      barCategoryWidth = barCategoryGap;
    } else {
      barCategoryWidth = (1 - parseInt(barCategoryGap) / 100) * tickGap;
    }

    bars.forEach(function (bar) {
      return bar.barCategoryWidth = barCategoryWidth;
    });
  }

  function setBarWidthAndGap(bars) {
    var _bars$slice$ = bars.slice(-1)[0],
        barCategoryWidth = _bars$slice$.barCategoryWidth,
        barWidth = _bars$slice$.barWidth,
        barGap = _bars$slice$.barGap,
        barNum = _bars$slice$.barNum;
    var widthAndGap = [];

    if (typeof barWidth === 'number' || barWidth !== 'auto') {
      widthAndGap = getBarWidthAndGapWithPercentOrNumber(barCategoryWidth, barWidth, barGap);
    } else if (barWidth === 'auto') {
      widthAndGap = getBarWidthAndGapWidthAuto(barCategoryWidth, barWidth, barGap, barNum);
    }

    var _widthAndGap = widthAndGap,
        _widthAndGap2 = _slicedToArray(_widthAndGap, 2),
        width = _widthAndGap2[0],
        gap = _widthAndGap2[1];

    bars.forEach(function (bar) {
      bar.barWidth = width;
      bar.barGap = gap;
    });
  }

  function getBarWidthAndGapWithPercentOrNumber(barCategoryWidth, barWidth, barGap) {
    var width = 0,
        gap = 0;

    if (typeof barWidth === 'number') {
      width = barWidth;
    } else {
      width = parseInt(barWidth) / 100 * barCategoryWidth;
    }

    if (typeof barGap === 'number') {
      gap = barGap;
    } else {
      gap = parseInt(barGap) / 100 * width;
    }

    return [width, gap];
  }

  function getBarWidthAndGapWidthAuto(barCategoryWidth, barWidth, barGap, barNum) {
    var width = 0,
        gap = 0;
    var barItemWidth = barCategoryWidth / barNum;

    if (typeof barGap === 'number') {
      gap = barGap;
      width = barItemWidth - gap;
    } else {
      var percent = 10 + parseInt(barGap) / 10;

      if (percent === 0) {
        width = barItemWidth * 2;
        gap = -width;
      } else {
        width = barItemWidth / percent * 10;
        gap = barItemWidth - width;
      }
    }

    return [width, gap];
  }

  function setBarAllWidthAndGap(bars) {
    var _bars$slice$2 = bars.slice(-1)[0],
        barGap = _bars$slice$2.barGap,
        barWidth = _bars$slice$2.barWidth,
        barNum = _bars$slice$2.barNum;
    var barAllWidthAndGap = (barGap + barWidth) * barNum - barGap;
    bars.forEach(function (bar) {
      return bar.barAllWidthAndGap = barAllWidthAndGap;
    });
  }

  function calcBarsPosition(bars, chart) {
    bars = calcBarValueAxisCoordinate(bars);
    bars = calcBarLabelAxisCoordinate(bars);
    bars = eliminateNullBarLabelAxis(bars);
    bars = keepSameNumBetweenBarAndData(bars);
    return bars;
  }

  function calcBarLabelAxisCoordinate(bars) {
    return bars.map(function (bar) {
      var labelAxis = bar.labelAxis,
          barAllWidthAndGap = bar.barAllWidthAndGap,
          barGap = bar.barGap,
          barWidth = bar.barWidth,
          barIndex = bar.barIndex;
      var tickGap = labelAxis.tickGap,
          tickPosition = labelAxis.tickPosition,
          axis = labelAxis.axis;
      var coordinateIndex = axis === 'x' ? 0 : 1;
      var barLabelAxisPos = tickPosition.map(function (tick, i) {
        var barCategoryStartPos = tickPosition[i][coordinateIndex] - tickGap / 2;
        var barItemsStartPos = barCategoryStartPos + (tickGap - barAllWidthAndGap) / 2;
        return barItemsStartPos + (barIndex + 0.5) * barWidth + barIndex * barGap;
      });
      return _objectSpread({}, bar, {
        barLabelAxisPos: barLabelAxisPos
      });
    });
  }

  function calcBarValueAxisCoordinate(bars) {
    return bars.map(function (bar) {
      var data = (0, util$1.mergeSameStackData)(bar, bars);
      data = eliminateNonNumberData(bar, data);
      var _bar$valueAxis = bar.valueAxis,
          axis = _bar$valueAxis.axis,
          minValue = _bar$valueAxis.minValue,
          maxValue = _bar$valueAxis.maxValue,
          linePosition = _bar$valueAxis.linePosition;
      var startPos = getValuePos(minValue, maxValue, minValue < 0 ? 0 : minValue, linePosition, axis);
      var endPos = data.map(function (v) {
        return getValuePos(minValue, maxValue, v, linePosition, axis);
      });
      var barValueAxisPos = endPos.map(function (p) {
        return [startPos, p];
      });
      return _objectSpread({}, bar, {
        barValueAxisPos: barValueAxisPos
      });
    });
  }

  function eliminateNonNumberData(barItem, barData) {
    var data = barItem.data;
    return barData.map(function (v, i) {
      return typeof data[i] === 'number' ? v : null;
    }).filter(function (d) {
      return d !== null;
    });
  }

  function eliminateNullBarLabelAxis(bars) {
    return bars.map(function (bar) {
      var barLabelAxisPos = bar.barLabelAxisPos,
          data = bar.data;
      data.forEach(function (d, i) {
        if (typeof d === 'number') return;
        barLabelAxisPos[i] = null;
      });
      return _objectSpread({}, bar, {
        barLabelAxisPos: barLabelAxisPos.filter(function (p) {
          return p !== null;
        })
      });
    });
  }

  function keepSameNumBetweenBarAndData(bars) {
    bars.forEach(function (bar) {
      var data = bar.data,
          barLabelAxisPos = bar.barLabelAxisPos,
          barValueAxisPos = bar.barValueAxisPos;
      var dataNum = data.filter(function (d) {
        return typeof d === 'number';
      }).length;
      var axisPosNum = barLabelAxisPos.length;

      if (axisPosNum > dataNum) {
        barLabelAxisPos.splice(dataNum);
        barValueAxisPos.splice(dataNum);
      }
    });
    return bars;
  }

  function getValuePos(min, max, value, linePosition, axis) {
    if (typeof value !== 'number') return null;
    var valueMinus = max - min;
    var coordinateIndex = axis === 'x' ? 0 : 1;
    var posMinus = linePosition[1][coordinateIndex] - linePosition[0][coordinateIndex];
    var percent = (value - min) / valueMinus;
    if (valueMinus === 0) percent = 0;
    var pos = percent * posMinus;
    return pos + linePosition[0][coordinateIndex];
  }

  function getBackgroundBarConfig(barItem) {
    var animationCurve = barItem.animationCurve,
        animationFrame = barItem.animationFrame,
        rLevel = barItem.rLevel;
    var shapes = getBackgroundBarShapes(barItem);
    var style = getBackgroundBarStyle(barItem);
    return shapes.map(function (shape) {
      return {
        name: 'rect',
        index: rLevel,
        visible: barItem.backgroundBar.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: shape,
        style: style
      };
    });
  }

  function getBackgroundBarShapes(barItem) {
    var labelAxis = barItem.labelAxis,
        valueAxis = barItem.valueAxis;
    var tickPosition = labelAxis.tickPosition;
    var axis = valueAxis.axis,
        linePosition = valueAxis.linePosition;
    var width = getBackgroundBarWidth(barItem);
    var haltWidth = width / 2;
    var posIndex = axis === 'x' ? 0 : 1;
    var centerPos = tickPosition.map(function (p) {
      return p[1 - posIndex];
    });
    var _ref9 = [linePosition[0][posIndex], linePosition[1][posIndex]],
        start = _ref9[0],
        end = _ref9[1];
    return centerPos.map(function (center) {
      if (axis === 'x') {
        return {
          x: start,
          y: center - haltWidth,
          w: end - start,
          h: width
        };
      } else {
        return {
          x: center - haltWidth,
          y: end,
          w: width,
          h: start - end
        };
      }
    });
  }

  function getBackgroundBarWidth(barItem) {
    var barAllWidthAndGap = barItem.barAllWidthAndGap,
        barCategoryWidth = barItem.barCategoryWidth,
        backgroundBar = barItem.backgroundBar;
    var width = backgroundBar.width;
    if (typeof width === 'number') return width;
    if (width === 'auto') return barAllWidthAndGap;
    return parseInt(width) / 100 * barCategoryWidth;
  }

  function getBackgroundBarStyle(barItem) {
    return barItem.backgroundBar.style;
  }

  function getBarConfig(barItem) {
    var barLabelAxisPos = barItem.barLabelAxisPos,
        animationCurve = barItem.animationCurve,
        animationFrame = barItem.animationFrame,
        rLevel = barItem.rLevel;
    var name = getBarName(barItem);
    return barLabelAxisPos.map(function (foo, i) {
      return {
        name: name,
        index: rLevel,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getBarShape(barItem, i),
        style: getBarStyle(barItem, i)
      };
    });
  }

  function getBarName(barItem) {
    var shapeType = barItem.shapeType;
    if (shapeType === 'leftEchelon' || shapeType === 'rightEchelon') return 'polyline';
    return 'rect';
  }

  function getBarShape(barItem, i) {
    var shapeType = barItem.shapeType;

    if (shapeType === 'leftEchelon') {
      return getLeftEchelonShape(barItem, i);
    } else if (shapeType === 'rightEchelon') {
      return getRightEchelonShape(barItem, i);
    } else {
      return getNormalBarShape(barItem, i);
    }
  }

  function getLeftEchelonShape(barItem, i) {
    var barValueAxisPos = barItem.barValueAxisPos,
        barLabelAxisPos = barItem.barLabelAxisPos,
        barWidth = barItem.barWidth,
        echelonOffset = barItem.echelonOffset;

    var _barValueAxisPos$i = _slicedToArray(barValueAxisPos[i], 2),
        start = _barValueAxisPos$i[0],
        end = _barValueAxisPos$i[1];

    var labelAxisPos = barLabelAxisPos[i];
    var halfWidth = barWidth / 2;
    var valueAxis = barItem.valueAxis.axis;
    var points = [];

    if (valueAxis === 'x') {
      points[0] = [end, labelAxisPos - halfWidth];
      points[1] = [end, labelAxisPos + halfWidth];
      points[2] = [start, labelAxisPos + halfWidth];
      points[3] = [start + echelonOffset, labelAxisPos - halfWidth];
      if (end - start < echelonOffset) points.splice(3, 1);
    } else {
      points[0] = [labelAxisPos - halfWidth, end];
      points[1] = [labelAxisPos + halfWidth, end];
      points[2] = [labelAxisPos + halfWidth, start];
      points[3] = [labelAxisPos - halfWidth, start - echelonOffset];
      if (start - end < echelonOffset) points.splice(3, 1);
    }

    return {
      points: points,
      close: true
    };
  }

  function getRightEchelonShape(barItem, i) {
    var barValueAxisPos = barItem.barValueAxisPos,
        barLabelAxisPos = barItem.barLabelAxisPos,
        barWidth = barItem.barWidth,
        echelonOffset = barItem.echelonOffset;

    var _barValueAxisPos$i2 = _slicedToArray(barValueAxisPos[i], 2),
        start = _barValueAxisPos$i2[0],
        end = _barValueAxisPos$i2[1];

    var labelAxisPos = barLabelAxisPos[i];
    var halfWidth = barWidth / 2;
    var valueAxis = barItem.valueAxis.axis;
    var points = [];

    if (valueAxis === 'x') {
      points[0] = [end, labelAxisPos + halfWidth];
      points[1] = [end, labelAxisPos - halfWidth];
      points[2] = [start, labelAxisPos - halfWidth];
      points[3] = [start + echelonOffset, labelAxisPos + halfWidth];
      if (end - start < echelonOffset) points.splice(2, 1);
    } else {
      points[0] = [labelAxisPos + halfWidth, end];
      points[1] = [labelAxisPos - halfWidth, end];
      points[2] = [labelAxisPos - halfWidth, start];
      points[3] = [labelAxisPos + halfWidth, start - echelonOffset];
      if (start - end < echelonOffset) points.splice(2, 1);
    }

    return {
      points: points,
      close: true
    };
  }

  function getNormalBarShape(barItem, i) {
    var barValueAxisPos = barItem.barValueAxisPos,
        barLabelAxisPos = barItem.barLabelAxisPos,
        barWidth = barItem.barWidth;

    var _barValueAxisPos$i3 = _slicedToArray(barValueAxisPos[i], 2),
        start = _barValueAxisPos$i3[0],
        end = _barValueAxisPos$i3[1];

    var labelAxisPos = barLabelAxisPos[i];
    var valueAxis = barItem.valueAxis.axis;
    var shape = {};

    if (valueAxis === 'x') {
      shape.x = start;
      shape.y = labelAxisPos - barWidth / 2;
      shape.w = end - start;
      shape.h = barWidth;
    } else {
      shape.x = labelAxisPos - barWidth / 2;
      shape.y = end;
      shape.w = barWidth;
      shape.h = start - end;
    }

    return shape;
  }

  function getBarStyle(barItem, i) {
    var barStyle = barItem.barStyle,
        gradient = barItem.gradient,
        color = barItem.color;
    var fillColor = [barStyle.fill || color];
    var gradientColor = (0, util$1.deepMerge)(fillColor, gradient.color);
    if (gradientColor.length === 1) gradientColor.push(gradientColor[0]);
    var gradientParams = getGradientParams(barItem, i);
    return (0, util$1.deepMerge)({
      gradientColor: gradientColor,
      gradientParams: gradientParams,
      gradientType: 'linear',
      gradientWith: 'fill'
    }, barStyle);
  }

  function getGradientParams(barItem, i) {
    var barValueAxisPos = barItem.barValueAxisPos,
        barLabelAxisPos = barItem.barLabelAxisPos,
        data = barItem.data;
    var _barItem$valueAxis = barItem.valueAxis,
        linePosition = _barItem$valueAxis.linePosition,
        axis = _barItem$valueAxis.axis;

    var _barValueAxisPos$i4 = _slicedToArray(barValueAxisPos[i], 2),
        start = _barValueAxisPos$i4[0],
        end = _barValueAxisPos$i4[1];

    var labelAxisPos = barLabelAxisPos[i];
    var value = data[i];

    var _linePosition = _slicedToArray(linePosition, 2),
        lineStart = _linePosition[0],
        lineEnd = _linePosition[1];

    var valueAxisIndex = axis === 'x' ? 0 : 1;
    var endPos = end;

    if (!barItem.gradient.local) {
      endPos = value < 0 ? lineStart[valueAxisIndex] : lineEnd[valueAxisIndex];
    }

    if (axis === 'y') {
      return [labelAxisPos, endPos, labelAxisPos, start];
    } else {
      return [endPos, labelAxisPos, start, labelAxisPos];
    }
  }

  function getStartBarConfig(barItem) {
    var configs = getBarConfig(barItem);
    var shapeType = barItem.shapeType;
    configs.forEach(function (config) {
      var shape = config.shape;

      if (shapeType === 'leftEchelon') {
        shape = getStartLeftEchelonShape(shape, barItem);
      } else if (shapeType === 'rightEchelon') {
        shape = getStartRightEchelonShape(shape, barItem);
      } else {
        shape = getStartNormalBarShape(shape, barItem);
      }

      config.shape = shape;
    });
    return configs;
  }

  function getStartLeftEchelonShape(shape, barItem) {
    var axis = barItem.valueAxis.axis;
    shape = (0, util.deepClone)(shape);
    var _shape = shape,
        points = _shape.points;
    var index = axis === 'x' ? 0 : 1;
    var start = points[2][index];
    points.forEach(function (point) {
      return point[index] = start;
    });
    return shape;
  }

  function getStartRightEchelonShape(shape, barItem) {
    var axis = barItem.valueAxis.axis;
    shape = (0, util.deepClone)(shape);
    var _shape2 = shape,
        points = _shape2.points;
    var index = axis === 'x' ? 0 : 1;
    var start = points[2][index];
    points.forEach(function (point) {
      return point[index] = start;
    });
    return shape;
  }

  function getStartNormalBarShape(shape, barItem) {
    var axis = barItem.valueAxis.axis;
    var x = shape.x,
        y = shape.y,
        w = shape.w,
        h = shape.h;

    if (axis === 'x') {
      w = 0;
    } else {
      y = y + h;
      h = 0;
    }

    return {
      x: x,
      y: y,
      w: w,
      h: h
    };
  }

  function beforeUpdateBar(graphs, barItem, i, updater) {
    var render = updater.chart.render;
    var name = getBarName(barItem);

    if (graphs[i] && graphs[i][0].name !== name) {
      graphs[i].forEach(function (g) {
        return render.delGraph(g);
      });
      graphs[i] = null;
    }
  }

  function getLabelConfig(barItem) {
    var animationCurve = barItem.animationCurve,
        animationFrame = barItem.animationFrame,
        rLevel = barItem.rLevel;
    var shapes = getLabelShapes(barItem);
    var style = getLabelStyle(barItem);
    return shapes.map(function (shape) {
      return {
        name: 'text',
        index: rLevel,
        visible: barItem.label.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: shape,
        style: style
      };
    });
  }

  function getLabelShapes(barItem) {
    var contents = getFormatterLabels(barItem);
    var position = getLabelsPosition(barItem);
    return position.map(function (pos, i) {
      return {
        position: pos,
        content: contents[i]
      };
    });
  }

  function getFormatterLabels(barItem) {
    var data = barItem.data,
        label = barItem.label;
    var formatter = label.formatter;
    data = data.filter(function (d) {
      return typeof d === 'number';
    }).map(function (d) {
      return d.toString();
    });
    if (!formatter) return data;

    var type = _typeof(formatter);

    if (type === 'string') return data.map(function (d) {
      return formatter.replace('{value}', d);
    });
    if (type === 'function') return data.map(function (d, i) {
      return formatter({
        value: d,
        index: i
      });
    });
    return data;
  }

  function getLabelsPosition(barItem) {
    var label = barItem.label,
        barValueAxisPos = barItem.barValueAxisPos,
        barLabelAxisPos = barItem.barLabelAxisPos;
    var position = label.position,
        offset = label.offset;
    var axis = barItem.valueAxis.axis;
    return barValueAxisPos.map(function (_ref10, i) {
      var _ref11 = _slicedToArray(_ref10, 2),
          start = _ref11[0],
          end = _ref11[1];

      var labelAxisPos = barLabelAxisPos[i];
      var pos = [end, labelAxisPos];

      if (position === 'bottom') {
        pos = [start, labelAxisPos];
      }

      if (position === 'center') {
        pos = [(start + end) / 2, labelAxisPos];
      }

      if (axis === 'y') pos.reverse();
      return getOffsetedPoint(pos, offset);
    });
  }

  function getOffsetedPoint(_ref12, _ref13) {
    var _ref14 = _slicedToArray(_ref12, 2),
        x = _ref14[0],
        y = _ref14[1];

    var _ref15 = _slicedToArray(_ref13, 2),
        ox = _ref15[0],
        oy = _ref15[1];

    return [x + ox, y + oy];
  }

  function getLabelStyle(barItem) {
    var color = barItem.color,
        style = barItem.label.style,
        gc = barItem.gradient.color;
    if (gc.length) color = gc[0];
    style = (0, util$1.deepMerge)({
      fill: color
    }, style);
    return style;
  }
  });

  unwrapExports(bar_1$1);
  var bar_2 = bar_1$1.bar;

  var pie_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.pie = pie;















































  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function pie(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var series = option.series;
    if (!series) series = [];
    var pies = (0, util$1.initNeedSeries)(series, pie$1.pieConfig, 'pie');
    pies = calcPiesCenter(pies, chart);
    pies = calcPiesRadius(pies, chart);
    pies = calcRosePiesRadius(pies);
    pies = calcPiesPercent(pies);
    pies = calcPiesAngle(pies);
    pies = calcPiesInsideLabelPos(pies);
    pies = calcPiesEdgeCenterPos(pies);
    pies = calcPiesOutSideLabelPos(pies);
    (0, updater_class.doUpdate)({
      chart: chart,
      series: pies,
      key: 'pie',
      getGraphConfig: getPieConfig,
      getStartGraphConfig: getStartPieConfig,
      beforeChange: beforeChangePie
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: pies,
      key: 'pieInsideLabel',
      getGraphConfig: getInsideLabelConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: pies,
      key: 'pieOutsideLabelLine',
      getGraphConfig: getOutsideLabelLineConfig,
      getStartGraphConfig: getStartOutsideLabelLineConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: pies,
      key: 'pieOutsideLabel',
      getGraphConfig: getOutsideLabelConfig,
      getStartGraphConfig: getStartOutsideLabelConfig
    });
  }

  function calcPiesCenter(pies, chart) {
    var area = chart.render.area;
    pies.forEach(function (pie) {
      var center = pie.center;
      center = center.map(function (pos, i) {
        if (typeof pos === 'number') return pos;
        return parseInt(pos) / 100 * area[i];
      });
      pie.center = center;
    });
    return pies;
  }

  function calcPiesRadius(pies, chart) {
    var maxRadius = Math.min.apply(Math, _toConsumableArray(chart.render.area)) / 2;
    pies.forEach(function (pie) {
      var radius = pie.radius,
          data = pie.data;
      radius = getNumberRadius(radius, maxRadius);
      data.forEach(function (item) {
        var itemRadius = item.radius;
        if (!itemRadius) itemRadius = radius;
        itemRadius = getNumberRadius(itemRadius, maxRadius);
        item.radius = itemRadius;
      });
      pie.radius = radius;
    });
    return pies;
  }

  function getNumberRadius(radius, maxRadius) {
    if (!(radius instanceof Array)) radius = [0, radius];
    radius = radius.map(function (r) {
      if (typeof r === 'number') return r;
      return parseInt(r) / 100 * maxRadius;
    });
    return radius;
  }

  function calcRosePiesRadius(pies, chart) {
    var rosePie = pies.filter(function (_ref) {
      var roseType = _ref.roseType;
      return roseType;
    });
    rosePie.forEach(function (pie) {
      var radius = pie.radius,
          data = pie.data,
          roseSort = pie.roseSort;
      var roseIncrement = getRoseIncrement(pie);

      var dataCopy = _toConsumableArray(data);

      data = sortData(data);
      data.forEach(function (item, i) {
        item.radius[1] = radius[1] - roseIncrement * i;
      });

      if (roseSort) {
        data.reverse();
      } else {
        pie.data = dataCopy;
      }

      pie.roseIncrement = roseIncrement;
    });
    return pies;
  }

  function sortData(data) {
    return data.sort(function (_ref2, _ref3) {
      var a = _ref2.value;
      var b = _ref3.value;
      if (a === b) return 0;
      if (a > b) return -1;
      if (a < b) return 1;
    });
  }

  function getRoseIncrement(pie) {
    var radius = pie.radius,
        roseIncrement = pie.roseIncrement;
    if (typeof roseIncrement === 'number') return roseIncrement;

    if (roseIncrement === 'auto') {
      var data = pie.data;
      var allRadius = data.reduce(function (all, _ref4) {
        var radius = _ref4.radius;
        return [].concat(_toConsumableArray(all), _toConsumableArray(radius));
      }, []);
      var minRadius = Math.min.apply(Math, _toConsumableArray(allRadius));
      var maxRadius = Math.max.apply(Math, _toConsumableArray(allRadius));
      return (maxRadius - minRadius) * 0.6 / (data.length - 1 || 1);
    }

    return parseInt(roseIncrement) / 100 * radius[1];
  }

  function calcPiesPercent(pies) {
    pies.forEach(function (pie) {
      var data = pie.data,
          percentToFixed = pie.percentToFixed;
      var sum = getDataSum(data);
      data.forEach(function (item) {
        var value = item.value;
        item.percent = parseFloat((value / sum * 100).toFixed(percentToFixed));
      });
      var percentSumNoLast = (0, util$1.mulAdd)(data.slice(0, -1).map(function (_ref5) {
        var percent = _ref5.percent;
        return percent;
      }));
      data.slice(-1)[0].percent = 100 - percentSumNoLast;
    });
    return pies;
  }

  function getDataSum(data) {
    return (0, util$1.mulAdd)(data.map(function (_ref6) {
      var value = _ref6.value;
      return value;
    }));
  }

  function calcPiesAngle(pies) {
    pies.forEach(function (pie) {
      var start = pie.startAngle,
          data = pie.data;
      data.forEach(function (item, i) {
        var _getDataAngle = getDataAngle(data, i),
            _getDataAngle2 = _slicedToArray(_getDataAngle, 2),
            startAngle = _getDataAngle2[0],
            endAngle = _getDataAngle2[1];

        item.startAngle = start + startAngle;
        item.endAngle = start + endAngle;
      });
    });
    return pies;
  }

  function getDataAngle(data, i) {
    var fullAngle = Math.PI * 2;
    var needAddData = data.slice(0, i + 1);
    var percentSum = (0, util$1.mulAdd)(needAddData.map(function (_ref7) {
      var percent = _ref7.percent;
      return percent;
    }));
    var percent = data[i].percent;
    var startPercent = percentSum - percent;
    return [fullAngle * startPercent / 100, fullAngle * percentSum / 100];
  }

  function calcPiesInsideLabelPos(pies) {
    pies.forEach(function (pieItem) {
      var data = pieItem.data;
      data.forEach(function (item) {
        item.insideLabelPos = getPieInsideLabelPos(pieItem, item);
      });
    });
    return pies;
  }

  function getPieInsideLabelPos(pieItem, dataItem) {
    var center = pieItem.center;

    var startAngle = dataItem.startAngle,
        endAngle = dataItem.endAngle,
        _dataItem$radius = _slicedToArray(dataItem.radius, 2),
        ir = _dataItem$radius[0],
        or = _dataItem$radius[1];

    var radius = (ir + or) / 2;
    var angle = (startAngle + endAngle) / 2;
    return util.getCircleRadianPoint.apply(void 0, _toConsumableArray(center).concat([radius, angle]));
  }

  function calcPiesEdgeCenterPos(pies) {
    pies.forEach(function (pie) {
      var data = pie.data,
          center = pie.center;
      data.forEach(function (item) {
        var startAngle = item.startAngle,
            endAngle = item.endAngle,
            radius = item.radius;
        var centerAngle = (startAngle + endAngle) / 2;

        var pos = util.getCircleRadianPoint.apply(void 0, _toConsumableArray(center).concat([radius[1], centerAngle]));

        item.edgeCenterPos = pos;
      });
    });
    return pies;
  }

  function calcPiesOutSideLabelPos(pies) {
    pies.forEach(function (pieItem) {
      var leftPieDataItems = getLeftOrRightPieDataItems(pieItem);
      var rightPieDataItems = getLeftOrRightPieDataItems(pieItem, false);
      leftPieDataItems = sortPiesFromTopToBottom(leftPieDataItems);
      rightPieDataItems = sortPiesFromTopToBottom(rightPieDataItems);
      addLabelLineAndAlign(leftPieDataItems, pieItem);
      addLabelLineAndAlign(rightPieDataItems, pieItem, false);
    });
    return pies;
  }

  function getLabelLineBendRadius(pieItem) {
    var labelLineBendGap = pieItem.outsideLabel.labelLineBendGap;
    var maxRadius = getPieMaxRadius(pieItem);

    if (typeof labelLineBendGap !== 'number') {
      labelLineBendGap = parseInt(labelLineBendGap) / 100 * maxRadius;
    }

    return labelLineBendGap + maxRadius;
  }

  function getPieMaxRadius(pieItem) {
    var data = pieItem.data;
    var radius = data.map(function (_ref8) {
      var _ref8$radius = _slicedToArray(_ref8.radius, 2),
          foo = _ref8$radius[0],
          r = _ref8$radius[1];

      return r;
    });
    return Math.max.apply(Math, _toConsumableArray(radius));
  }

  function getLeftOrRightPieDataItems(pieItem) {
    var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var data = pieItem.data,
        center = pieItem.center;
    var centerXPos = center[0];
    return data.filter(function (_ref9) {
      var edgeCenterPos = _ref9.edgeCenterPos;
      var xPos = edgeCenterPos[0];
      if (left) return xPos <= centerXPos;
      return xPos > centerXPos;
    });
  }

  function sortPiesFromTopToBottom(dataItem) {
    dataItem.sort(function (_ref10, _ref11) {
      var _ref10$edgeCenterPos = _slicedToArray(_ref10.edgeCenterPos, 2),
          t = _ref10$edgeCenterPos[0],
          ay = _ref10$edgeCenterPos[1];

      var _ref11$edgeCenterPos = _slicedToArray(_ref11.edgeCenterPos, 2),
          tt = _ref11$edgeCenterPos[0],
          by = _ref11$edgeCenterPos[1];

      if (ay > by) return 1;
      if (ay < by) return -1;
      if (ay === by) return 0;
    });
    return dataItem;
  }

  function addLabelLineAndAlign(dataItem, pieItem) {
    var left = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var center = pieItem.center,
        outsideLabel = pieItem.outsideLabel;
    var radius = getLabelLineBendRadius(pieItem);
    dataItem.forEach(function (item) {
      var edgeCenterPos = item.edgeCenterPos,
          startAngle = item.startAngle,
          endAngle = item.endAngle;
      var labelLineEndLength = outsideLabel.labelLineEndLength;
      var angle = (startAngle + endAngle) / 2;

      var bendPoint = util.getCircleRadianPoint.apply(void 0, _toConsumableArray(center).concat([radius, angle]));

      var endPoint = _toConsumableArray(bendPoint);

      endPoint[0] += labelLineEndLength * (left ? -1 : 1);
      item.labelLine = [edgeCenterPos, bendPoint, endPoint];
      item.labelLineLength = (0, util$1.getPolylineLength)(item.labelLine);
      item.align = {
        textAlign: 'left',
        textBaseline: 'middle'
      };
      if (left) item.align.textAlign = 'right';
    });
  }

  function getPieConfig(pieItem) {
    var data = pieItem.data,
        animationCurve = pieItem.animationCurve,
        animationFrame = pieItem.animationFrame,
        rLevel = pieItem.rLevel;
    return data.map(function (foo, i) {
      return {
        name: 'pie',
        index: rLevel,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getPieShape(pieItem, i),
        style: getPieStyle(pieItem, i)
      };
    });
  }

  function getStartPieConfig(pieItem) {
    var animationDelayGap = pieItem.animationDelayGap,
        startAnimationCurve = pieItem.startAnimationCurve;
    var configs = getPieConfig(pieItem);
    configs.forEach(function (config, i) {
      config.animationCurve = startAnimationCurve;
      config.animationDelay = i * animationDelayGap;
      config.shape.or = config.shape.ir;
    });
    return configs;
  }

  function beforeChangePie(graph) {
    graph.animationDelay = 0;
  }

  function getPieShape(pieItem, i) {
    var center = pieItem.center,
        data = pieItem.data;
    var dataItem = data[i];
    var radius = dataItem.radius,
        startAngle = dataItem.startAngle,
        endAngle = dataItem.endAngle;
    return {
      startAngle: startAngle,
      endAngle: endAngle,
      ir: radius[0],
      or: radius[1],
      rx: center[0],
      ry: center[1]
    };
  }

  function getPieStyle(pieItem, i) {
    var pieStyle = pieItem.pieStyle,
        data = pieItem.data;
    var dataItem = data[i];
    var color = dataItem.color;
    return (0, util$1.deepMerge)({
      fill: color
    }, pieStyle);
  }

  function getInsideLabelConfig(pieItem) {
    var animationCurve = pieItem.animationCurve,
        animationFrame = pieItem.animationFrame,
        data = pieItem.data,
        rLevel = pieItem.rLevel;
    return data.map(function (foo, i) {
      return {
        name: 'text',
        index: rLevel,
        visible: pieItem.insideLabel.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getInsideLabelShape(pieItem, i),
        style: getInsideLabelStyle(pieItem)
      };
    });
  }

  function getInsideLabelShape(pieItem, i) {
    var insideLabel = pieItem.insideLabel,
        data = pieItem.data;
    var formatter = insideLabel.formatter;
    var dataItem = data[i];

    var formatterType = _typeof(formatter);

    var label = '';

    if (formatterType === 'string') {
      label = formatter.replace('{name}', dataItem.name);
      label = label.replace('{percent}', dataItem.percent);
      label = label.replace('{value}', dataItem.value);
    }

    if (formatterType === 'function') {
      label = formatter(dataItem);
    }

    return {
      content: label,
      position: dataItem.insideLabelPos
    };
  }

  function getInsideLabelStyle(pieItem, i) {
    var style = pieItem.insideLabel.style;
    return style;
  }

  function getOutsideLabelLineConfig(pieItem) {
    var animationCurve = pieItem.animationCurve,
        animationFrame = pieItem.animationFrame,
        data = pieItem.data,
        rLevel = pieItem.rLevel;
    return data.map(function (foo, i) {
      return {
        name: 'polyline',
        index: rLevel,
        visible: pieItem.outsideLabel.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getOutsideLabelLineShape(pieItem, i),
        style: getOutsideLabelLineStyle(pieItem, i)
      };
    });
  }

  function getStartOutsideLabelLineConfig(pieItem) {
    var data = pieItem.data;
    var configs = getOutsideLabelLineConfig(pieItem);
    configs.forEach(function (config, i) {
      config.style.lineDash = [0, data[i].labelLineLength];
    });
    return configs;
  }

  function getOutsideLabelLineShape(pieItem, i) {
    var data = pieItem.data;
    var dataItem = data[i];
    return {
      points: dataItem.labelLine
    };
  }

  function getOutsideLabelLineStyle(pieItem, i) {
    var outsideLabel = pieItem.outsideLabel,
        data = pieItem.data;
    var labelLineStyle = outsideLabel.labelLineStyle;
    var color = data[i].color;
    return (0, util$1.deepMerge)({
      stroke: color,
      lineDash: [data[i].labelLineLength, 0]
    }, labelLineStyle);
  }

  function getOutsideLabelConfig(pieItem) {
    var animationCurve = pieItem.animationCurve,
        animationFrame = pieItem.animationFrame,
        data = pieItem.data,
        rLevel = pieItem.rLevel;
    return data.map(function (foo, i) {
      return {
        name: 'text',
        index: rLevel,
        visible: pieItem.outsideLabel.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getOutsideLabelShape(pieItem, i),
        style: getOutsideLabelStyle(pieItem, i)
      };
    });
  }

  function getStartOutsideLabelConfig(pieItem) {
    var data = pieItem.data;
    var configs = getOutsideLabelConfig(pieItem);
    configs.forEach(function (config, i) {
      config.shape.position = data[i].labelLine[1];
    });
    return configs;
  }

  function getOutsideLabelShape(pieItem, i) {
    var outsideLabel = pieItem.outsideLabel,
        data = pieItem.data;
    var formatter = outsideLabel.formatter;
    var _data$i = data[i],
        labelLine = _data$i.labelLine,
        name = _data$i.name,
        percent = _data$i.percent,
        value = _data$i.value;

    var formatterType = _typeof(formatter);

    var label = '';

    if (formatterType === 'string') {
      label = formatter.replace('{name}', name);
      label = label.replace('{percent}', percent);
      label = label.replace('{value}', value);
    }

    if (formatterType === 'function') {
      label = formatter(data[i]);
    }

    return {
      content: label,
      position: labelLine[2]
    };
  }

  function getOutsideLabelStyle(pieItem, i) {
    var outsideLabel = pieItem.outsideLabel,
        data = pieItem.data;
    var _data$i2 = data[i],
        color = _data$i2.color,
        align = _data$i2.align;
    var style = outsideLabel.style;
    return (0, util$1.deepMerge)(_objectSpread({
      fill: color
    }, align), style);
  }
  });

  unwrapExports(pie_1$1);
  var pie_2 = pie_1$1.pie;

  var radarAxis_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.radarAxis = radarAxis;











































  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function radarAxis(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var radar = option.radar;
    var radarAxis = [];

    if (radar) {
      radarAxis = mergeRadarAxisDefaultConfig(radar);
      radarAxis = calcRadarAxisCenter(radarAxis, chart);
      radarAxis = calcRadarAxisRingRadius(radarAxis, chart);
      radarAxis = calcRadarAxisLinePosition(radarAxis);
      radarAxis = calcRadarAxisAreaRadius(radarAxis);
      radarAxis = calcRadarAxisLabelPosition(radarAxis);
      radarAxis = [radarAxis];
    }

    var radarAxisForUpdate = radarAxis;
    if (radarAxis.length && !radarAxis[0].show) radarAxisForUpdate = [];
    (0, updater_class.doUpdate)({
      chart: chart,
      series: radarAxisForUpdate,
      key: 'radarAxisSplitArea',
      getGraphConfig: getSplitAreaConfig,
      beforeUpdate: beforeUpdateSplitArea,
      beforeChange: beforeChangeSplitArea
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: radarAxisForUpdate,
      key: 'radarAxisSplitLine',
      getGraphConfig: getSplitLineConfig,
      beforeUpdate: beforeUpdateSplitLine,
      beforeChange: beforeChangeSplitLine
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: radarAxisForUpdate,
      key: 'radarAxisLine',
      getGraphConfig: getAxisLineConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: radarAxisForUpdate,
      key: 'radarAxisLable',
      getGraphConfig: getAxisLabelConfig
    });
    chart.radarAxis = radarAxis[0];
  }

  function mergeRadarAxisDefaultConfig(radar) {
    return (0, util$1.deepMerge)((0, util.deepClone)(config.radarAxisConfig), radar);
  }

  function calcRadarAxisCenter(radarAxis, chart) {
    var area = chart.render.area;
    var center = radarAxis.center;
    radarAxis.centerPos = center.map(function (v, i) {
      if (typeof v === 'number') return v;
      return parseInt(v) / 100 * area[i];
    });
    return radarAxis;
  }

  function calcRadarAxisRingRadius(radarAxis, chart) {
    var area = chart.render.area;
    var splitNum = radarAxis.splitNum,
        radius = radarAxis.radius;
    var maxRadius = Math.min.apply(Math, _toConsumableArray(area)) / 2;
    if (typeof radius !== 'number') radius = parseInt(radius) / 100 * maxRadius;
    var splitGap = radius / splitNum;
    radarAxis.ringRadius = new Array(splitNum).fill(0).map(function (foo, i) {
      return splitGap * (i + 1);
    });
    radarAxis.radius = radius;
    return radarAxis;
  }

  function calcRadarAxisLinePosition(radarAxis) {
    var indicator = radarAxis.indicator,
        centerPos = radarAxis.centerPos,
        radius = radarAxis.radius,
        startAngle = radarAxis.startAngle;
    var fullAngle = Math.PI * 2;
    var indicatorNum = indicator.length;
    var indicatorGap = fullAngle / indicatorNum;
    var angles = new Array(indicatorNum).fill(0).map(function (foo, i) {
      return indicatorGap * i + startAngle;
    });
    radarAxis.axisLineAngles = angles;
    radarAxis.axisLinePosition = angles.map(function (g) {
      return util.getCircleRadianPoint.apply(void 0, _toConsumableArray(centerPos).concat([radius, g]));
    });
    return radarAxis;
  }

  function calcRadarAxisAreaRadius(radarAxis) {
    var ringRadius = radarAxis.ringRadius;
    var subRadius = ringRadius[0] / 2;
    radarAxis.areaRadius = ringRadius.map(function (r) {
      return r - subRadius;
    });
    return radarAxis;
  }

  function calcRadarAxisLabelPosition(radarAxis) {
    var axisLineAngles = radarAxis.axisLineAngles,
        centerPos = radarAxis.centerPos,
        radius = radarAxis.radius,
        axisLabel = radarAxis.axisLabel;
    radius += axisLabel.labelGap;
    radarAxis.axisLabelPosition = axisLineAngles.map(function (angle) {
      return util.getCircleRadianPoint.apply(void 0, _toConsumableArray(centerPos).concat([radius, angle]));
    });
    return radarAxis;
  }

  function getSplitAreaConfig(radarAxis) {
    var areaRadius = radarAxis.areaRadius,
        polygon = radarAxis.polygon,
        animationCurve = radarAxis.animationCurve,
        animationFrame = radarAxis.animationFrame,
        rLevel = radarAxis.rLevel;
    var name = polygon ? 'regPolygon' : 'ring';
    return areaRadius.map(function (foo, i) {
      return {
        name: name,
        index: rLevel,
        visible: radarAxis.splitArea.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getSplitAreaShape(radarAxis, i),
        style: getSplitAreaStyle(radarAxis, i)
      };
    });
  }

  function getSplitAreaShape(radarAxis, i) {
    var polygon = radarAxis.polygon,
        areaRadius = radarAxis.areaRadius,
        indicator = radarAxis.indicator,
        centerPos = radarAxis.centerPos;
    var indicatorNum = indicator.length;
    var shape = {
      rx: centerPos[0],
      ry: centerPos[1],
      r: areaRadius[i]
    };
    if (polygon) shape.side = indicatorNum;
    return shape;
  }

  function getSplitAreaStyle(radarAxis, i) {
    var splitArea = radarAxis.splitArea,
        ringRadius = radarAxis.ringRadius,
        axisLineAngles = radarAxis.axisLineAngles,
        polygon = radarAxis.polygon,
        centerPos = radarAxis.centerPos;
    var color = splitArea.color,
        style = splitArea.style;
    style = _objectSpread({
      fill: 'rgba(0, 0, 0, 0)'
    }, style);
    var lineWidth = ringRadius[0] - 0;

    if (polygon) {
      var point1 = util.getCircleRadianPoint.apply(void 0, _toConsumableArray(centerPos).concat([ringRadius[0], axisLineAngles[0]]));

      var point2 = util.getCircleRadianPoint.apply(void 0, _toConsumableArray(centerPos).concat([ringRadius[0], axisLineAngles[1]]));

      lineWidth = (0, util$1.getPointToLineDistance)(centerPos, point1, point2);
    }

    style = (0, util$1.deepMerge)((0, util.deepClone)(style, true), {
      lineWidth: lineWidth
    });
    if (!color.length) return style;
    var colorNum = color.length;
    return (0, util$1.deepMerge)(style, {
      stroke: color[i % colorNum]
    });
  }

  function beforeUpdateSplitArea(graphs, radarAxis, i, updater) {
    var cache = graphs[i];
    if (!cache) return;
    var render = updater.chart.render;
    var polygon = radarAxis.polygon;
    var name = cache[0].name;
    var currentName = polygon ? 'regPolygon' : 'ring';
    var delAll = currentName !== name;
    if (!delAll) return;
    cache.forEach(function (g) {
      return render.delGraph(g);
    });
    graphs[i] = null;
  }

  function beforeChangeSplitArea(graph, config) {
    var side = config.shape.side;
    if (typeof side !== 'number') return;
    graph.shape.side = side;
  }

  function getSplitLineConfig(radarAxis) {
    var ringRadius = radarAxis.ringRadius,
        polygon = radarAxis.polygon,
        animationCurve = radarAxis.animationCurve,
        animationFrame = radarAxis.animationFrame,
        rLevel = radarAxis.rLevel;
    var name = polygon ? 'regPolygon' : 'ring';
    return ringRadius.map(function (foo, i) {
      return {
        name: name,
        index: rLevel,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        visible: radarAxis.splitLine.show,
        shape: getSplitLineShape(radarAxis, i),
        style: getSplitLineStyle(radarAxis, i)
      };
    });
  }

  function getSplitLineShape(radarAxis, i) {
    var ringRadius = radarAxis.ringRadius,
        centerPos = radarAxis.centerPos,
        indicator = radarAxis.indicator,
        polygon = radarAxis.polygon;
    var shape = {
      rx: centerPos[0],
      ry: centerPos[1],
      r: ringRadius[i]
    };
    var indicatorNum = indicator.length;
    if (polygon) shape.side = indicatorNum;
    return shape;
  }

  function getSplitLineStyle(radarAxis, i) {
    var splitLine = radarAxis.splitLine;
    var color = splitLine.color,
        style = splitLine.style;
    style = _objectSpread({
      fill: 'rgba(0, 0, 0, 0)'
    }, style);
    if (!color.length) return style;
    var colorNum = color.length;
    return (0, util$1.deepMerge)(style, {
      stroke: color[i % colorNum]
    });
  }

  function beforeUpdateSplitLine(graphs, radarAxis, i, updater) {
    var cache = graphs[i];
    if (!cache) return;
    var render = updater.chart.render;
    var polygon = radarAxis.polygon;
    var name = cache[0].name;
    var currenName = polygon ? 'regPolygon' : 'ring';
    var delAll = currenName !== name;
    if (!delAll) return;
    cache.forEach(function (g) {
      return render.delGraph(g);
    });
    graphs[i] = null;
  }

  function beforeChangeSplitLine(graph, config) {
    var side = config.shape.side;
    if (typeof side !== 'number') return;
    graph.shape.side = side;
  }

  function getAxisLineConfig(radarAxis) {
    var axisLinePosition = radarAxis.axisLinePosition,
        animationCurve = radarAxis.animationCurve,
        animationFrame = radarAxis.animationFrame,
        rLevel = radarAxis.rLevel;
    return axisLinePosition.map(function (foo, i) {
      return {
        name: 'polyline',
        index: rLevel,
        visible: radarAxis.axisLine.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getAxisLineShape(radarAxis, i),
        style: getAxisLineStyle(radarAxis, i)
      };
    });
  }

  function getAxisLineShape(radarAxis, i) {
    var centerPos = radarAxis.centerPos,
        axisLinePosition = radarAxis.axisLinePosition;
    var points = [centerPos, axisLinePosition[i]];
    return {
      points: points
    };
  }

  function getAxisLineStyle(radarAxis, i) {
    var axisLine = radarAxis.axisLine;
    var color = axisLine.color,
        style = axisLine.style;
    if (!color.length) return style;
    var colorNum = color.length;
    return (0, util$1.deepMerge)(style, {
      stroke: color[i % colorNum]
    });
  }

  function getAxisLabelConfig(radarAxis) {
    var axisLabelPosition = radarAxis.axisLabelPosition,
        animationCurve = radarAxis.animationCurve,
        animationFrame = radarAxis.animationFrame,
        rLevel = radarAxis.rLevel;
    return axisLabelPosition.map(function (foo, i) {
      return {
        name: 'text',
        index: rLevel,
        visible: radarAxis.axisLabel.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getAxisLableShape(radarAxis, i),
        style: getAxisLableStyle(radarAxis, i)
      };
    });
  }

  function getAxisLableShape(radarAxis, i) {
    var axisLabelPosition = radarAxis.axisLabelPosition,
        indicator = radarAxis.indicator;
    return {
      content: indicator[i].name,
      position: axisLabelPosition[i]
    };
  }

  function getAxisLableStyle(radarAxis, i) {
    var axisLabel = radarAxis.axisLabel,
        _radarAxis$centerPos = _slicedToArray(radarAxis.centerPos, 2),
        x = _radarAxis$centerPos[0],
        y = _radarAxis$centerPos[1],
        axisLabelPosition = radarAxis.axisLabelPosition;

    var color = axisLabel.color,
        style = axisLabel.style;

    var _axisLabelPosition$i = _slicedToArray(axisLabelPosition[i], 2),
        labelXpos = _axisLabelPosition$i[0],
        labelYPos = _axisLabelPosition$i[1];

    var textAlign = labelXpos > x ? 'left' : 'right';
    var textBaseline = labelYPos > y ? 'top' : 'bottom';
    style = (0, util$1.deepMerge)({
      textAlign: textAlign,
      textBaseline: textBaseline
    }, style);
    if (!color.length) return style;
    var colorNum = color.length;
    return (0, util$1.deepMerge)(style, {
      fill: color[i % colorNum]
    });
  }
  });

  unwrapExports(radarAxis_1$1);
  var radarAxis_2 = radarAxis_1$1.radarAxis;

  var radar_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.radar = radar;













































  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function radar(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var series = option.series;
    if (!series) series = [];
    var radars = (0, util$1.initNeedSeries)(series, config.radarConfig, 'radar');
    radars = calcRadarPosition(radars, chart);
    radars = calcRadarLabelPosition(radars, chart);
    radars = calcRadarLabelAlign(radars, chart);
    (0, updater_class.doUpdate)({
      chart: chart,
      series: radars,
      key: 'radar',
      getGraphConfig: getRadarConfig,
      getStartGraphConfig: getStartRadarConfig,
      beforeChange: beforeChangeRadar
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: radars,
      key: 'radarPoint',
      getGraphConfig: getPointConfig,
      getStartGraphConfig: getStartPointConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: radars,
      key: 'radarLabel',
      getGraphConfig: getLabelConfig
    });
  }

  function calcRadarPosition(radars, chart) {
    var radarAxis = chart.radarAxis;
    if (!radarAxis) return [];
    var indicator = radarAxis.indicator,
        axisLineAngles = radarAxis.axisLineAngles,
        radius = radarAxis.radius,
        centerPos = radarAxis.centerPos;
    radars.forEach(function (radarItem) {
      var data = radarItem.data;
      radarItem.dataRadius = [];
      radarItem.radarPosition = indicator.map(function (_ref, i) {
        var max = _ref.max,
            min = _ref.min;
        var v = data[i];
        if (typeof max !== 'number') max = v;
        if (typeof min !== 'number') min = 0;
        if (typeof v !== 'number') v = min;
        var dataRadius = (v - min) / (max - min) * radius;
        radarItem.dataRadius[i] = dataRadius;
        return util.getCircleRadianPoint.apply(void 0, _toConsumableArray(centerPos).concat([dataRadius, axisLineAngles[i]]));
      });
    });
    return radars;
  }

  function calcRadarLabelPosition(radars, chart) {
    var radarAxis = chart.radarAxis;
    if (!radarAxis) return [];
    var centerPos = radarAxis.centerPos,
        axisLineAngles = radarAxis.axisLineAngles;
    radars.forEach(function (radarItem) {
      var dataRadius = radarItem.dataRadius,
          label = radarItem.label;
      var labelGap = label.labelGap;
      radarItem.labelPosition = dataRadius.map(function (r, i) {
        return util.getCircleRadianPoint.apply(void 0, _toConsumableArray(centerPos).concat([r + labelGap, axisLineAngles[i]]));
      });
    });
    return radars;
  }

  function calcRadarLabelAlign(radars, chart) {
    var radarAxis = chart.radarAxis;
    if (!radarAxis) return [];

    var _radarAxis$centerPos = _slicedToArray(radarAxis.centerPos, 2),
        x = _radarAxis$centerPos[0],
        y = _radarAxis$centerPos[1];

    radars.forEach(function (radarItem) {
      var labelPosition = radarItem.labelPosition;
      var labelAlign = labelPosition.map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            lx = _ref3[0],
            ly = _ref3[1];

        var textAlign = lx > x ? 'left' : 'right';
        var textBaseline = ly > y ? 'top' : 'bottom';
        return {
          textAlign: textAlign,
          textBaseline: textBaseline
        };
      });
      radarItem.labelAlign = labelAlign;
    });
    return radars;
  }

  function getRadarConfig(radarItem) {
    var animationCurve = radarItem.animationCurve,
        animationFrame = radarItem.animationFrame,
        rLevel = radarItem.rLevel;
    return [{
      name: 'polyline',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getRadarShape(radarItem),
      style: getRadarStyle(radarItem)
    }];
  }

  function getStartRadarConfig(radarItem, updater) {
    var centerPos = updater.chart.radarAxis.centerPos;
    var config = getRadarConfig(radarItem)[0];
    var pointNum = config.shape.points.length;
    var points = new Array(pointNum).fill(0).map(function (foo) {
      return _toConsumableArray(centerPos);
    });
    config.shape.points = points;
    return [config];
  }

  function getRadarShape(radarItem) {
    var radarPosition = radarItem.radarPosition;
    return {
      points: radarPosition,
      close: true
    };
  }

  function getRadarStyle(radarItem) {
    var radarStyle = radarItem.radarStyle,
        color = radarItem.color;
    var colorRgbaValue = (0, lib.getRgbaValue)(color);
    colorRgbaValue[3] = 0.5;
    var radarDefaultColor = {
      stroke: color,
      fill: (0, lib.getColorFromRgbValue)(colorRgbaValue)
    };
    return (0, util$1.deepMerge)(radarDefaultColor, radarStyle);
  }

  function beforeChangeRadar(graph, _ref4) {
    var shape = _ref4.shape;
    var graphPoints = graph.shape.points;
    var graphPointsNum = graphPoints.length;
    var pointsNum = shape.points.length;

    if (pointsNum > graphPointsNum) {
      var lastPoint = graphPoints.slice(-1)[0];
      var newAddPoints = new Array(pointsNum - graphPointsNum).fill(0).map(function (foo) {
        return _toConsumableArray(lastPoint);
      });
      graphPoints.push.apply(graphPoints, _toConsumableArray(newAddPoints));
    } else if (pointsNum < graphPointsNum) {
      graphPoints.splice(pointsNum);
    }
  }

  function getPointConfig(radarItem) {
    var radarPosition = radarItem.radarPosition,
        animationCurve = radarItem.animationCurve,
        animationFrame = radarItem.animationFrame,
        rLevel = radarItem.rLevel;
    return radarPosition.map(function (foo, i) {
      return {
        name: 'circle',
        index: rLevel,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        visible: radarItem.point.show,
        shape: getPointShape(radarItem, i),
        style: getPointStyle(radarItem)
      };
    });
  }

  function getStartPointConfig(radarItem) {
    var configs = getPointConfig(radarItem);
    configs.forEach(function (config) {
      return config.shape.r = 0.01;
    });
    return configs;
  }

  function getPointShape(radarItem, i) {
    var radarPosition = radarItem.radarPosition,
        point = radarItem.point;
    var radius = point.radius;
    var position = radarPosition[i];
    return {
      rx: position[0],
      ry: position[1],
      r: radius
    };
  }

  function getPointStyle(radarItem, i) {
    var point = radarItem.point,
        color = radarItem.color;
    var style = point.style;
    return (0, util$1.deepMerge)({
      stroke: color
    }, style);
  }

  function getLabelConfig(radarItem) {
    var labelPosition = radarItem.labelPosition,
        animationCurve = radarItem.animationCurve,
        animationFrame = radarItem.animationFrame,
        rLevel = radarItem.rLevel;
    return labelPosition.map(function (foo, i) {
      return {
        name: 'text',
        index: rLevel,
        visible: radarItem.label.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getLabelShape(radarItem, i),
        style: getLabelStyle(radarItem, i)
      };
    });
  }

  function getLabelShape(radarItem, i) {
    var labelPosition = radarItem.labelPosition,
        label = radarItem.label,
        data = radarItem.data;
    var offset = label.offset,
        formatter = label.formatter;
    var position = mergePointOffset(labelPosition[i], offset);
    var labelText = data[i] ? data[i].toString() : '0';

    var formatterType = _typeof(formatter);

    if (formatterType === 'string') labelText = formatter.replace('{value}', labelText);
    if (formatterType === 'function') labelText = formatter(labelText);
    return {
      content: labelText,
      position: position
    };
  }

  function mergePointOffset(_ref5, _ref6) {
    var _ref7 = _slicedToArray(_ref5, 2),
        x = _ref7[0],
        y = _ref7[1];

    var _ref8 = _slicedToArray(_ref6, 2),
        ox = _ref8[0],
        oy = _ref8[1];

    return [x + ox, y + oy];
  }

  function getLabelStyle(radarItem, i) {
    var label = radarItem.label,
        color = radarItem.color,
        labelAlign = radarItem.labelAlign;
    var style = label.style;

    var defaultColorAndAlign = _objectSpread({
      fill: color
    }, labelAlign[i]);

    return (0, util$1.deepMerge)(defaultColorAndAlign, style);
  }
  });

  unwrapExports(radar_1$1);
  var radar_2 = radar_1$1.radar;

  var gauge_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.gauge = gauge$1;















































  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function gauge$1(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var series = option.series;
    if (!series) series = [];
    var gauges = (0, util$1.initNeedSeries)(series, gauge.gaugeConfig, 'gauge');
    gauges = calcGaugesCenter(gauges, chart);
    gauges = calcGaugesRadius(gauges, chart);
    gauges = calcGaugesDataRadiusAndLineWidth(gauges, chart);
    gauges = calcGaugesDataAngles(gauges);
    gauges = calcGaugesDataGradient(gauges);
    gauges = calcGaugesAxisTickPosition(gauges);
    gauges = calcGaugesLabelPositionAndAlign(gauges);
    gauges = calcGaugesLabelData(gauges);
    gauges = calcGaugesDetailsPosition(gauges);
    gauges = calcGaugesDetailsContent(gauges);
    (0, updater_class.doUpdate)({
      chart: chart,
      series: gauges,
      key: 'gaugeAxisTick',
      getGraphConfig: getAxisTickConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: gauges,
      key: 'gaugeAxisLabel',
      getGraphConfig: getAxisLabelConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: gauges,
      key: 'gaugeBackgroundArc',
      getGraphConfig: getBackgroundArcConfig,
      getStartGraphConfig: getStartBackgroundArcConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: gauges,
      key: 'gaugeArc',
      getGraphConfig: getArcConfig,
      getStartGraphConfig: getStartArcConfig,
      beforeChange: beforeChangeArc
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: gauges,
      key: 'gaugePointer',
      getGraphConfig: getPointerConfig,
      getStartGraphConfig: getStartPointerConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: gauges,
      key: 'gaugeDetails',
      getGraphConfig: getDetailsConfig
    });
  }

  function calcGaugesCenter(gauges, chart) {
    var area = chart.render.area;
    gauges.forEach(function (gaugeItem) {
      var center = gaugeItem.center;
      center = center.map(function (pos, i) {
        if (typeof pos === 'number') return pos;
        return parseInt(pos) / 100 * area[i];
      });
      gaugeItem.center = center;
    });
    return gauges;
  }

  function calcGaugesRadius(gauges, chart) {
    var area = chart.render.area;
    var maxRadius = Math.min.apply(Math, _toConsumableArray(area)) / 2;
    gauges.forEach(function (gaugeItem) {
      var radius = gaugeItem.radius;

      if (typeof radius !== 'number') {
        radius = parseInt(radius) / 100 * maxRadius;
      }

      gaugeItem.radius = radius;
    });
    return gauges;
  }

  function calcGaugesDataRadiusAndLineWidth(gauges, chart) {
    var area = chart.render.area;
    var maxRadius = Math.min.apply(Math, _toConsumableArray(area)) / 2;
    gauges.forEach(function (gaugeItem) {
      var radius = gaugeItem.radius,
          data = gaugeItem.data,
          arcLineWidth = gaugeItem.arcLineWidth;
      data.forEach(function (item) {
        var arcRadius = item.radius,
            lineWidth = item.lineWidth;
        if (!arcRadius) arcRadius = radius;
        if (typeof arcRadius !== 'number') arcRadius = parseInt(arcRadius) / 100 * maxRadius;
        item.radius = arcRadius;
        if (!lineWidth) lineWidth = arcLineWidth;
        item.lineWidth = lineWidth;
      });
    });
    return gauges;
  }

  function calcGaugesDataAngles(gauges, chart) {
    gauges.forEach(function (gaugeItem) {
      var startAngle = gaugeItem.startAngle,
          endAngle = gaugeItem.endAngle,
          data = gaugeItem.data,
          min = gaugeItem.min,
          max = gaugeItem.max;
      var angleMinus = endAngle - startAngle;
      var valueMinus = max - min;
      data.forEach(function (item) {
        var value = item.value;
        var itemAngle = Math.abs((value - min) / valueMinus * angleMinus);
        item.startAngle = startAngle;
        item.endAngle = startAngle + itemAngle;
      });
    });
    return gauges;
  }

  function calcGaugesDataGradient(gauges, chart) {
    gauges.forEach(function (gaugeItem) {
      var data = gaugeItem.data;
      data.forEach(function (item) {
        var color = item.color,
            gradient = item.gradient;
        if (!gradient || !gradient.length) gradient = color;
        if (!(gradient instanceof Array)) gradient = [gradient];
        item.gradient = gradient;
      });
    });
    return gauges;
  }

  function calcGaugesAxisTickPosition(gauges, chart) {
    gauges.forEach(function (gaugeItem) {
      var startAngle = gaugeItem.startAngle,
          endAngle = gaugeItem.endAngle,
          splitNum = gaugeItem.splitNum,
          center = gaugeItem.center,
          radius = gaugeItem.radius,
          arcLineWidth = gaugeItem.arcLineWidth,
          axisTick = gaugeItem.axisTick;
      var tickLength = axisTick.tickLength,
          lineWidth = axisTick.style.lineWidth;
      var angles = endAngle - startAngle;
      var outerRadius = radius - arcLineWidth / 2;
      var innerRadius = outerRadius - tickLength;
      var angleGap = angles / (splitNum - 1);
      var arcLength = 2 * Math.PI * radius * angles / (Math.PI * 2);
      var offset = Math.ceil(lineWidth / 2) / arcLength * angles;
      gaugeItem.tickAngles = [];
      gaugeItem.tickInnerRadius = [];
      gaugeItem.tickPosition = new Array(splitNum).fill(0).map(function (foo, i) {
        var angle = startAngle + angleGap * i;
        if (i === 0) angle += offset;
        if (i === splitNum - 1) angle -= offset;
        gaugeItem.tickAngles[i] = angle;
        gaugeItem.tickInnerRadius[i] = innerRadius;
        return [util.getCircleRadianPoint.apply(void 0, _toConsumableArray(center).concat([outerRadius, angle])), util.getCircleRadianPoint.apply(void 0, _toConsumableArray(center).concat([innerRadius, angle]))];
      });
    });
    return gauges;
  }

  function calcGaugesLabelPositionAndAlign(gauges, chart) {
    gauges.forEach(function (gaugeItem) {
      var center = gaugeItem.center,
          tickInnerRadius = gaugeItem.tickInnerRadius,
          tickAngles = gaugeItem.tickAngles,
          labelGap = gaugeItem.axisLabel.labelGap;
      var position = tickAngles.map(function (angle, i) {
        return util.getCircleRadianPoint.apply(void 0, _toConsumableArray(center).concat([tickInnerRadius[i] - labelGap, tickAngles[i]]));
      });
      var align = position.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            x = _ref2[0],
            y = _ref2[1];

        return {
          textAlign: x > center[0] ? 'right' : 'left',
          textBaseline: y > center[1] ? 'bottom' : 'top'
        };
      });
      gaugeItem.labelPosition = position;
      gaugeItem.labelAlign = align;
    });
    return gauges;
  }

  function calcGaugesLabelData(gauges, chart) {
    gauges.forEach(function (gaugeItem) {
      var axisLabel = gaugeItem.axisLabel,
          min = gaugeItem.min,
          max = gaugeItem.max,
          splitNum = gaugeItem.splitNum;
      var data = axisLabel.data,
          formatter = axisLabel.formatter;
      var valueGap = (max - min) / (splitNum - 1);
      var value = new Array(splitNum).fill(0).map(function (foo, i) {
        return parseInt(min + valueGap * i);
      });

      var formatterType = _typeof(formatter);

      data = (0, util$1.deepMerge)(value, data).map(function (v, i) {
        var label = v;

        if (formatterType === 'string') {
          label = formatter.replace('{value}', v);
        }

        if (formatterType === 'function') {
          label = formatter({
            value: v,
            index: i
          });
        }

        return label;
      });
      axisLabel.data = data;
    });
    return gauges;
  }

  function calcGaugesDetailsPosition(gauges, chart) {
    gauges.forEach(function (gaugeItem) {
      var data = gaugeItem.data,
          details = gaugeItem.details,
          center = gaugeItem.center;
      var position = details.position,
          offset = details.offset;
      var detailsPosition = data.map(function (_ref3) {
        var startAngle = _ref3.startAngle,
            endAngle = _ref3.endAngle,
            radius = _ref3.radius;
        var point = null;

        if (position === 'center') {
          point = center;
        } else if (position === 'start') {
          point = util.getCircleRadianPoint.apply(void 0, _toConsumableArray(center).concat([radius, startAngle]));
        } else if (position === 'end') {
          point = util.getCircleRadianPoint.apply(void 0, _toConsumableArray(center).concat([radius, endAngle]));
        }

        return getOffsetedPoint(point, offset);
      });
      gaugeItem.detailsPosition = detailsPosition;
    });
    return gauges;
  }

  function calcGaugesDetailsContent(gauges, chart) {
    gauges.forEach(function (gaugeItem) {
      var data = gaugeItem.data,
          details = gaugeItem.details;
      var formatter = details.formatter;

      var formatterType = _typeof(formatter);

      var contents = data.map(function (dataItem) {
        var content = dataItem.value;

        if (formatterType === 'string') {
          content = formatter.replace('{value}', '{nt}');
          content = content.replace('{name}', dataItem.name);
        }

        if (formatterType === 'function') content = formatter(dataItem);
        return content.toString();
      });
      gaugeItem.detailsContent = contents;
    });
    return gauges;
  }

  function getOffsetedPoint(_ref4, _ref5) {
    var _ref6 = _slicedToArray(_ref4, 2),
        x = _ref6[0],
        y = _ref6[1];

    var _ref7 = _slicedToArray(_ref5, 2),
        ox = _ref7[0],
        oy = _ref7[1];

    return [x + ox, y + oy];
  }

  function getAxisTickConfig(gaugeItem) {
    var tickPosition = gaugeItem.tickPosition,
        animationCurve = gaugeItem.animationCurve,
        animationFrame = gaugeItem.animationFrame,
        rLevel = gaugeItem.rLevel;
    return tickPosition.map(function (foo, i) {
      return {
        name: 'polyline',
        index: rLevel,
        visible: gaugeItem.axisTick.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getAxisTickShape(gaugeItem, i),
        style: getAxisTickStyle(gaugeItem)
      };
    });
  }

  function getAxisTickShape(gaugeItem, i) {
    var tickPosition = gaugeItem.tickPosition;
    return {
      points: tickPosition[i]
    };
  }

  function getAxisTickStyle(gaugeItem, i) {
    var style = gaugeItem.axisTick.style;
    return style;
  }

  function getAxisLabelConfig(gaugeItem) {
    var labelPosition = gaugeItem.labelPosition,
        animationCurve = gaugeItem.animationCurve,
        animationFrame = gaugeItem.animationFrame,
        rLevel = gaugeItem.rLevel;
    return labelPosition.map(function (foo, i) {
      return {
        name: 'text',
        index: rLevel,
        visible: gaugeItem.axisLabel.show,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getAxisLabelShape(gaugeItem, i),
        style: getAxisLabelStyle(gaugeItem, i)
      };
    });
  }

  function getAxisLabelShape(gaugeItem, i) {
    var labelPosition = gaugeItem.labelPosition,
        data = gaugeItem.axisLabel.data;
    return {
      content: data[i].toString(),
      position: labelPosition[i]
    };
  }

  function getAxisLabelStyle(gaugeItem, i) {
    var labelAlign = gaugeItem.labelAlign,
        axisLabel = gaugeItem.axisLabel;
    var style = axisLabel.style;
    return (0, util$1.deepMerge)(_objectSpread({}, labelAlign[i]), style);
  }

  function getBackgroundArcConfig(gaugeItem) {
    var animationCurve = gaugeItem.animationCurve,
        animationFrame = gaugeItem.animationFrame,
        rLevel = gaugeItem.rLevel;
    return [{
      name: 'arc',
      index: rLevel,
      visible: gaugeItem.backgroundArc.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getGaugeBackgroundArcShape(gaugeItem),
      style: getGaugeBackgroundArcStyle(gaugeItem)
    }];
  }

  function getGaugeBackgroundArcShape(gaugeItem) {
    var startAngle = gaugeItem.startAngle,
        endAngle = gaugeItem.endAngle,
        center = gaugeItem.center,
        radius = gaugeItem.radius;
    return {
      rx: center[0],
      ry: center[1],
      r: radius,
      startAngle: startAngle,
      endAngle: endAngle
    };
  }

  function getGaugeBackgroundArcStyle(gaugeItem) {
    var backgroundArc = gaugeItem.backgroundArc,
        arcLineWidth = gaugeItem.arcLineWidth;
    var style = backgroundArc.style;
    return (0, util$1.deepMerge)({
      lineWidth: arcLineWidth
    }, style);
  }

  function getStartBackgroundArcConfig(gaugeItem) {
    var config = getBackgroundArcConfig(gaugeItem)[0];

    var shape = _objectSpread({}, config.shape);

    shape.endAngle = config.shape.startAngle;
    config.shape = shape;
    return [config];
  }

  function getArcConfig(gaugeItem) {
    var data = gaugeItem.data,
        animationCurve = gaugeItem.animationCurve,
        animationFrame = gaugeItem.animationFrame,
        rLevel = gaugeItem.rLevel;
    return data.map(function (foo, i) {
      return {
        name: 'agArc',
        index: rLevel,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getGaugeArcShape(gaugeItem, i),
        style: getGaugeArcStyle(gaugeItem, i)
      };
    });
  }

  function getGaugeArcShape(gaugeItem, i) {
    var data = gaugeItem.data,
        center = gaugeItem.center,
        gradientEndAngle = gaugeItem.endAngle;
    var _data$i = data[i],
        radius = _data$i.radius,
        startAngle = _data$i.startAngle,
        endAngle = _data$i.endAngle,
        localGradient = _data$i.localGradient;
    if (localGradient) gradientEndAngle = endAngle;
    return {
      rx: center[0],
      ry: center[1],
      r: radius,
      startAngle: startAngle,
      endAngle: endAngle,
      gradientEndAngle: gradientEndAngle
    };
  }

  function getGaugeArcStyle(gaugeItem, i) {
    var data = gaugeItem.data,
        dataItemStyle = gaugeItem.dataItemStyle;
    var _data$i2 = data[i],
        lineWidth = _data$i2.lineWidth,
        gradient = _data$i2.gradient;
    gradient = gradient.map(function (c) {
      return (0, lib.getRgbaValue)(c);
    });
    return (0, util$1.deepMerge)({
      lineWidth: lineWidth,
      gradient: gradient
    }, dataItemStyle);
  }

  function getStartArcConfig(gaugeItem) {
    var configs = getArcConfig(gaugeItem);
    configs.map(function (config) {
      var shape = _objectSpread({}, config.shape);

      shape.endAngle = config.shape.startAngle;
      config.shape = shape;
    });
    return configs;
  }

  function beforeChangeArc(graph, config) {
    var graphGradient = graph.style.gradient;
    var cacheNum = graphGradient.length;
    var needNum = config.style.gradient.length;

    if (cacheNum > needNum) {
      graphGradient.splice(needNum);
    } else {
      var last = graphGradient.slice(-1)[0];
      graphGradient.push.apply(graphGradient, _toConsumableArray(new Array(needNum - cacheNum).fill(0).map(function (foo) {
        return _toConsumableArray(last);
      })));
    }
  }

  function getPointerConfig(gaugeItem) {
    var animationCurve = gaugeItem.animationCurve,
        animationFrame = gaugeItem.animationFrame,
        center = gaugeItem.center,
        rLevel = gaugeItem.rLevel;
    return [{
      name: 'polyline',
      index: rLevel,
      visible: gaugeItem.pointer.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getPointerShape(gaugeItem),
      style: getPointerStyle(gaugeItem),
      setGraphCenter: function setGraphCenter(foo, graph) {
        graph.style.graphCenter = center;
      }
    }];
  }

  function getPointerShape(gaugeItem) {
    var center = gaugeItem.center;
    return {
      points: getPointerPoints(center),
      close: true
    };
  }

  function getPointerStyle(gaugeItem) {
    var startAngle = gaugeItem.startAngle,
        endAngle = gaugeItem.endAngle,
        min = gaugeItem.min,
        max = gaugeItem.max,
        data = gaugeItem.data,
        pointer = gaugeItem.pointer,
        center = gaugeItem.center;
    var valueIndex = pointer.valueIndex,
        style = pointer.style;
    var value = data[valueIndex] ? data[valueIndex].value : 0;
    var angle = (value - min) / (max - min) * (endAngle - startAngle) + startAngle + Math.PI / 2;
    return (0, util$1.deepMerge)({
      rotate: (0, util$1.radianToAngle)(angle),
      scale: [1, 1],
      graphCenter: center
    }, style);
  }

  function getPointerPoints(_ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
        x = _ref9[0],
        y = _ref9[1];

    var point1 = [x, y - 40];
    var point2 = [x + 5, y];
    var point3 = [x, y + 10];
    var point4 = [x - 5, y];
    return [point1, point2, point3, point4];
  }

  function getStartPointerConfig(gaugeItem) {
    var startAngle = gaugeItem.startAngle;
    var config = getPointerConfig(gaugeItem)[0];
    config.style.rotate = (0, util$1.radianToAngle)(startAngle + Math.PI / 2);
    return [config];
  }

  function getDetailsConfig(gaugeItem) {
    var detailsPosition = gaugeItem.detailsPosition,
        animationCurve = gaugeItem.animationCurve,
        animationFrame = gaugeItem.animationFrame,
        rLevel = gaugeItem.rLevel;
    var visible = gaugeItem.details.show;
    return detailsPosition.map(function (foo, i) {
      return {
        name: 'numberText',
        index: rLevel,
        visible: visible,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getDetailsShape(gaugeItem, i),
        style: getDetailsStyle(gaugeItem, i)
      };
    });
  }

  function getDetailsShape(gaugeItem, i) {
    var detailsPosition = gaugeItem.detailsPosition,
        detailsContent = gaugeItem.detailsContent,
        data = gaugeItem.data,
        details = gaugeItem.details;
    var position = detailsPosition[i];
    var content = detailsContent[i];
    var dataValue = data[i].value;
    var toFixed = details.valueToFixed;
    return {
      number: [dataValue],
      content: content,
      position: position,
      toFixed: toFixed
    };
  }

  function getDetailsStyle(gaugeItem, i) {
    var details = gaugeItem.details,
        data = gaugeItem.data;
    var style = details.style;
    var color = data[i].color;
    return (0, util$1.deepMerge)({
      fill: color
    }, style);
  }
  });

  unwrapExports(gauge_1$1);
  var gauge_2 = gauge_1$1.gauge;

  var legend_1$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.legend = legend;

































  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function legend(chart) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var legend = option.legend;

    if (legend) {
      legend = (0, util$1.deepMerge)((0, util.deepClone)(config.legendConfig, true), legend);
      legend = initLegendData(legend);
      legend = filterInvalidData(legend, option, chart);
      legend = calcLegendTextWidth(legend, chart);
      legend = calcLegendPosition(legend, chart);
      legend = [legend];
    } else {
      legend = [];
    }

    (0, updater_class.doUpdate)({
      chart: chart,
      series: legend,
      key: 'legendIcon',
      getGraphConfig: getIconConfig
    });
    (0, updater_class.doUpdate)({
      chart: chart,
      series: legend,
      key: 'legendText',
      getGraphConfig: getTextConfig
    });
  }

  function initLegendData(legend) {
    var data = legend.data;
    legend.data = data.map(function (item) {
      var itemType = _typeof(item);

      if (itemType === 'string') {
        return {
          name: item
        };
      } else if (itemType === 'object') {
        return item;
      }

      return {
        name: ''
      };
    });
    return legend;
  }

  function filterInvalidData(legend, option, chart) {
    var series = option.series;
    var legendStatus = chart.legendStatus;
    var data = legend.data.filter(function (item) {
      var name = item.name;
      var result = series.find(function (_ref) {
        var sn = _ref.name;
        return name === sn;
      });
      if (!result) return false;
      if (!item.color) item.color = result.color;
      if (!item.icon) item.icon = result.type;
      return item;
    });
    if (!legendStatus || legendStatus.length !== legend.data.length) legendStatus = new Array(legend.data.length).fill(true);
    data.forEach(function (item, i) {
      return item.status = legendStatus[i];
    });
    legend.data = data;
    chart.legendStatus = legendStatus;
    return legend;
  }

  function calcLegendTextWidth(legend, chart) {
    var ctx = chart.render.ctx;
    var data = legend.data,
        textStyle = legend.textStyle,
        textUnselectedStyle = legend.textUnselectedStyle;
    data.forEach(function (item) {
      var status = item.status,
          name = item.name;
      item.textWidth = getTextWidth(ctx, name, status ? textStyle : textUnselectedStyle);
    });
    return legend;
  }

  function getTextWidth(ctx, text, style) {
    ctx.font = getFontConfig(style);
    return ctx.measureText(text).width;
  }

  function getFontConfig(style) {
    var fontFamily = style.fontFamily,
        fontSize = style.fontSize;
    return "".concat(fontSize, "px ").concat(fontFamily);
  }

  function calcLegendPosition(legend, chart) {
    var orient = legend.orient;

    if (orient === 'vertical') {
      calcVerticalPosition(legend, chart);
    } else {
      calcHorizontalPosition(legend, chart);
    }

    return legend;
  }

  function calcHorizontalPosition(legend, chart) {
    var iconHeight = legend.iconHeight,
        itemGap = legend.itemGap;
    var lines = calcDefaultHorizontalPosition(legend, chart);
    var xOffsets = lines.map(function (line) {
      return getHorizontalXOffset(line, legend, chart);
    });
    var yOffset = getHorizontalYOffset(legend, chart);
    var align = {
      textAlign: 'left',
      textBaseline: 'middle'
    };
    lines.forEach(function (line, i) {
      return line.forEach(function (item) {
        var iconPosition = item.iconPosition,
            textPosition = item.textPosition;
        var xOffset = xOffsets[i];
        var realYOffset = yOffset + i * (itemGap + iconHeight);
        item.iconPosition = mergeOffset(iconPosition, [xOffset, realYOffset]);
        item.textPosition = mergeOffset(textPosition, [xOffset, realYOffset]);
        item.align = align;
      });
    });
  }

  function calcDefaultHorizontalPosition(legend, chart) {
    var data = legend.data,
        iconWidth = legend.iconWidth;
    var w = chart.render.area[0];
    var startIndex = 0;
    var lines = [[]];
    data.forEach(function (item, i) {
      var beforeWidth = getBeforeWidth(startIndex, i, legend);
      var endXPos = beforeWidth + iconWidth + 5 + item.textWidth;

      if (endXPos >= w) {
        startIndex = i;
        beforeWidth = getBeforeWidth(startIndex, i, legend);
        lines.push([]);
      }

      item.iconPosition = [beforeWidth, 0];
      item.textPosition = [beforeWidth + iconWidth + 5, 0];
      lines.slice(-1)[0].push(item);
    });
    return lines;
  }

  function getBeforeWidth(startIndex, currentIndex, legend) {
    var data = legend.data,
        iconWidth = legend.iconWidth,
        itemGap = legend.itemGap;
    var beforeItem = data.slice(startIndex, currentIndex);
    return (0, util$1.mulAdd)(beforeItem.map(function (_ref2) {
      var textWidth = _ref2.textWidth;
      return textWidth;
    })) + (currentIndex - startIndex) * (itemGap + 5 + iconWidth);
  }

  function getHorizontalXOffset(data, legend, chart) {
    var left = legend.left,
        right = legend.right,
        iconWidth = legend.iconWidth,
        itemGap = legend.itemGap;
    var w = chart.render.area[0];
    var dataNum = data.length;
    var allWidth = (0, util$1.mulAdd)(data.map(function (_ref3) {
      var textWidth = _ref3.textWidth;
      return textWidth;
    })) + dataNum * (5 + iconWidth) + (dataNum - 1) * itemGap;
    var horizontal = [left, right].findIndex(function (pos) {
      return pos !== 'auto';
    });

    if (horizontal === -1) {
      return (w - allWidth) / 2;
    } else if (horizontal === 0) {
      if (typeof left === 'number') return left;
      return parseInt(left) / 100 * w;
    } else {
      if (typeof right !== 'number') right = parseInt(right) / 100 * w;
      return w - (allWidth + right);
    }
  }

  function getHorizontalYOffset(legend, chart) {
    var top = legend.top,
        bottom = legend.bottom,
        iconHeight = legend.iconHeight;
    var h = chart.render.area[1];
    var vertical = [top, bottom].findIndex(function (pos) {
      return pos !== 'auto';
    });
    var halfIconHeight = iconHeight / 2;

    if (vertical === -1) {
      var _chart$gridArea = chart.gridArea,
          y = _chart$gridArea.y,
          height = _chart$gridArea.h;
      return y + height + 45 - halfIconHeight;
    } else if (vertical === 0) {
      if (typeof top === 'number') return top - halfIconHeight;
      return parseInt(top) / 100 * h - halfIconHeight;
    } else {
      if (typeof bottom !== 'number') bottom = parseInt(bottom) / 100 * h;
      return h - bottom - halfIconHeight;
    }
  }

  function mergeOffset(_ref4, _ref5) {
    var _ref6 = _slicedToArray(_ref4, 2),
        x = _ref6[0],
        y = _ref6[1];

    var _ref7 = _slicedToArray(_ref5, 2),
        ox = _ref7[0],
        oy = _ref7[1];

    return [x + ox, y + oy];
  }

  function calcVerticalPosition(legend, chart) {
    var _getVerticalXOffset = getVerticalXOffset(legend, chart),
        _getVerticalXOffset2 = _slicedToArray(_getVerticalXOffset, 2),
        isRight = _getVerticalXOffset2[0],
        xOffset = _getVerticalXOffset2[1];

    var yOffset = getVerticalYOffset(legend, chart);
    calcDefaultVerticalPosition(legend, isRight);
    var align = {
      textAlign: 'left',
      textBaseline: 'middle'
    };
    legend.data.forEach(function (item) {
      var textPosition = item.textPosition,
          iconPosition = item.iconPosition;
      item.textPosition = mergeOffset(textPosition, [xOffset, yOffset]);
      item.iconPosition = mergeOffset(iconPosition, [xOffset, yOffset]);
      item.align = align;
    });
  }

  function getVerticalXOffset(legend, chart) {
    var left = legend.left,
        right = legend.right;
    var w = chart.render.area[0];
    var horizontal = [left, right].findIndex(function (pos) {
      return pos !== 'auto';
    });

    if (horizontal === -1) {
      return [true, w - 10];
    } else {
      var offset = [left, right][horizontal];
      if (typeof offset !== 'number') offset = parseInt(offset) / 100 * w;
      return [Boolean(horizontal), offset];
    }
  }

  function getVerticalYOffset(legend, chart) {
    var iconHeight = legend.iconHeight,
        itemGap = legend.itemGap,
        data = legend.data,
        top = legend.top,
        bottom = legend.bottom;
    var h = chart.render.area[1];
    var dataNum = data.length;
    var allHeight = dataNum * iconHeight + (dataNum - 1) * itemGap;
    var vertical = [top, bottom].findIndex(function (pos) {
      return pos !== 'auto';
    });

    if (vertical === -1) {
      return (h - allHeight) / 2;
    } else {
      var offset = [top, bottom][vertical];
      if (typeof offset !== 'number') offset = parseInt(offset) / 100 * h;
      if (vertical === 1) offset = h - offset - allHeight;
      return offset;
    }
  }

  function calcDefaultVerticalPosition(legend, isRight) {
    var data = legend.data,
        iconWidth = legend.iconWidth,
        iconHeight = legend.iconHeight,
        itemGap = legend.itemGap;
    var halfIconHeight = iconHeight / 2;
    data.forEach(function (item, i) {
      var textWidth = item.textWidth;
      var yPos = (iconHeight + itemGap) * i + halfIconHeight;
      var iconXPos = isRight ? 0 - iconWidth : 0;
      var textXpos = isRight ? iconXPos - 5 - textWidth : iconWidth + 5;
      item.iconPosition = [iconXPos, yPos];
      item.textPosition = [textXpos, yPos];
    });
  }

  function getIconConfig(legendItem, updater) {
    var data = legendItem.data,
        selectAble = legendItem.selectAble,
        animationCurve = legendItem.animationCurve,
        animationFrame = legendItem.animationFrame,
        rLevel = legendItem.rLevel;
    return data.map(function (item, i) {
      return _defineProperty({
        name: item.icon === 'line' ? 'lineIcon' : 'rect',
        index: rLevel,
        visible: legendItem.show,
        hover: selectAble,
        click: selectAble,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        shape: getIconShape(legendItem, i),
        style: getIconStyle(legendItem, i)
      }, "click", createClickCallBack(legendItem, i, updater));
    });
  }

  function getIconShape(legendItem, i) {
    var data = legendItem.data,
        iconWidth = legendItem.iconWidth,
        iconHeight = legendItem.iconHeight;

    var _data$i$iconPosition = _slicedToArray(data[i].iconPosition, 2),
        x = _data$i$iconPosition[0],
        y = _data$i$iconPosition[1];

    var halfIconHeight = iconHeight / 2;
    return {
      x: x,
      y: y - halfIconHeight,
      w: iconWidth,
      h: iconHeight
    };
  }

  function getIconStyle(legendItem, i) {
    var data = legendItem.data,
        iconStyle = legendItem.iconStyle,
        iconUnselectedStyle = legendItem.iconUnselectedStyle;
    var _data$i = data[i],
        status = _data$i.status,
        color = _data$i.color;
    var style = status ? iconStyle : iconUnselectedStyle;
    return (0, util$1.deepMerge)({
      fill: color
    }, style);
  }

  function getTextConfig(legendItem, updater) {
    var data = legendItem.data,
        selectAble = legendItem.selectAble,
        animationCurve = legendItem.animationCurve,
        animationFrame = legendItem.animationFrame,
        rLevel = legendItem.rLevel;
    return data.map(function (foo, i) {
      return {
        name: 'text',
        index: rLevel,
        visible: legendItem.show,
        hover: selectAble,
        animationCurve: animationCurve,
        animationFrame: animationFrame,
        hoverRect: getTextHoverRect(legendItem, i),
        shape: getTextShape(legendItem, i),
        style: getTextStyle(legendItem, i),
        click: createClickCallBack(legendItem, i, updater)
      };
    });
  }

  function getTextShape(legendItem, i) {
    var _legendItem$data$i = legendItem.data[i],
        textPosition = _legendItem$data$i.textPosition,
        name = _legendItem$data$i.name;
    return {
      content: name,
      position: textPosition
    };
  }

  function getTextStyle(legendItem, i) {
    var textStyle = legendItem.textStyle,
        textUnselectedStyle = legendItem.textUnselectedStyle;
    var _legendItem$data$i2 = legendItem.data[i],
        status = _legendItem$data$i2.status,
        align = _legendItem$data$i2.align;
    var style = status ? textStyle : textUnselectedStyle;
    return (0, util$1.deepMerge)((0, util.deepClone)(style, true), align);
  }

  function getTextHoverRect(legendItem, i) {
    var textStyle = legendItem.textStyle,
        textUnselectedStyle = legendItem.textUnselectedStyle;

    var _legendItem$data$i3 = legendItem.data[i],
        status = _legendItem$data$i3.status,
        _legendItem$data$i3$t = _slicedToArray(_legendItem$data$i3.textPosition, 2),
        x = _legendItem$data$i3$t[0],
        y = _legendItem$data$i3$t[1],
        textWidth = _legendItem$data$i3.textWidth;

    var style = status ? textStyle : textUnselectedStyle;
    var fontSize = style.fontSize;
    return [x, y - fontSize / 2, textWidth, fontSize];
  }

  function createClickCallBack(legendItem, index, updater) {
    var name = legendItem.data[index].name;
    return function () {
      var _updater$chart = updater.chart,
          legendStatus = _updater$chart.legendStatus,
          option = _updater$chart.option;
      var status = !legendStatus[index];
      var change = option.series.find(function (_ref9) {
        var sn = _ref9.name;
        return sn === name;
      });
      change.show = status;
      legendStatus[index] = status;
      updater.chart.setOption(option);
    };
  }
  });

  unwrapExports(legend_1$1);
  var legend_2 = legend_1$1.legend;

  var core = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "mergeColor", {
    enumerable: true,
    get: function get() {
      return mergeColor_1.mergeColor;
    }
  });
  Object.defineProperty(exports, "title", {
    enumerable: true,
    get: function get() {
      return title_1$1.title;
    }
  });
  Object.defineProperty(exports, "grid", {
    enumerable: true,
    get: function get() {
      return grid_1$1.grid;
    }
  });
  Object.defineProperty(exports, "axis", {
    enumerable: true,
    get: function get() {
      return axis_1$1.axis;
    }
  });
  Object.defineProperty(exports, "line", {
    enumerable: true,
    get: function get() {
      return line_1$1.line;
    }
  });
  Object.defineProperty(exports, "bar", {
    enumerable: true,
    get: function get() {
      return bar_1$1.bar;
    }
  });
  Object.defineProperty(exports, "pie", {
    enumerable: true,
    get: function get() {
      return pie_1$1.pie;
    }
  });
  Object.defineProperty(exports, "radarAxis", {
    enumerable: true,
    get: function get() {
      return radarAxis_1$1.radarAxis;
    }
  });
  Object.defineProperty(exports, "radar", {
    enumerable: true,
    get: function get() {
      return radar_1$1.radar;
    }
  });
  Object.defineProperty(exports, "gauge", {
    enumerable: true,
    get: function get() {
      return gauge_1$1.gauge;
    }
  });
  Object.defineProperty(exports, "legend", {
    enumerable: true,
    get: function get() {
      return legend_1$1.legend;
    }
  });
  });

  unwrapExports(core);

  var charts_class = createCommonjsModule(function (module, exports) {







  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;





  var _cRender = _interopRequireDefault(lib$3);





  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Charts = function Charts(dom) {
    _classCallCheck(this, Charts);

    if (!dom) {
      console.error('Charts Missing parameters!');
      return false;
    }

    var clientWidth = dom.clientWidth,
        clientHeight = dom.clientHeight;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', clientWidth);
    canvas.setAttribute('height', clientHeight);
    dom.appendChild(canvas);
    var attribute = {
      container: dom,
      canvas: canvas,
      render: new _cRender["default"](canvas),
      option: null
    };
    Object.assign(this, attribute);
  };
  /**
   * @description Set chart option
   * @param {Object} option Chart option
   * @return {Undefined} No return
   */


  exports["default"] = Charts;

  Charts.prototype.setOption = function (option) {
    if (!option || _typeof(option) !== 'object') {
      console.error('setOption Missing parameters!');
      return false;
    }

    var optionCloned = (0, util.deepClone)(option, true);
    (0, core.mergeColor)(this, optionCloned);
    (0, core.grid)(this, optionCloned);
    (0, core.axis)(this, optionCloned);
    (0, core.radarAxis)(this, optionCloned);
    (0, core.title)(this, optionCloned);
    (0, core.bar)(this, optionCloned);
    (0, core.line)(this, optionCloned);
    (0, core.pie)(this, optionCloned);
    (0, core.radar)(this, optionCloned);
    (0, core.gauge)(this, optionCloned);
    (0, core.legend)(this, optionCloned);
    this.option = option;
    this.render.launchAnimation(); // console.warn(this)
  };
  /**
   * @description Resize chart
   * @return {Undefined} No return
   */


  Charts.prototype.resize = function () {
    var container = this.container,
        canvas = this.canvas,
        render = this.render,
        option = this.option;
    var clientWidth = container.clientWidth,
        clientHeight = container.clientHeight;
    canvas.setAttribute('width', clientWidth);
    canvas.setAttribute('height', clientHeight);
    render.area = [clientWidth, clientHeight];
    this.setOption(option);
  };
  });

  unwrapExports(charts_class);

  var lib$4 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "changeDefaultConfig", {
    enumerable: true,
    get: function get() {
      return config.changeDefaultConfig;
    }
  });
  exports["default"] = void 0;

  var _charts = _interopRequireDefault(charts_class);



  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var _default = _charts["default"];
  exports["default"] = _default;
  });

  var Charts = unwrapExports(lib$4);

  //
  var script$m = {
    name: 'DvCharts',
    mixins: [autoResize],
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        ref: `charts-container-${new Date().getTime()}`,
        chartRef: `chart-${new Date().getTime()}`,
        chart: null
      };
    },

    watch: {
      option() {
        let {
          chart,
          option
        } = this;
        if (!chart) return;
        if (!option) option = {};
        chart.setOption(option);
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          initChart
        } = this;
        initChart();
      },

      initChart() {
        const {
          $refs,
          chartRef,
          option
        } = this;
        const chart = this.chart = new Charts($refs[chartRef]);
        if (!option) return;
        chart.setOption(option);
      },

      onResize() {
        const {
          chart
        } = this;
        if (!chart) return;
        chart.resize();
      }

    }
  };

  /* script */
  const __vue_script__$m = script$m;

  /* template */
  var __vue_render__$m = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-charts-container" }, [
      _c("div", { ref: _vm.chartRef, staticClass: "charts-canvas-container" })
    ])
  };
  var __vue_staticRenderFns__$m = [];
  __vue_render__$m._withStripped = true;

    /* style */
    const __vue_inject_styles__$m = function (inject) {
      if (!inject) return
      inject("data-v-8a293874_0", { source: ".dv-charts-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-charts-container .charts-canvas-container {\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-charts-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-charts-container .charts-canvas-container {\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$m = undefined;
    /* module identifier */
    const __vue_module_identifier__$m = undefined;
    /* functional template */
    const __vue_is_functional_template__$m = false;
    /* style inject SSR */
    

    
    var Charts$1 = normalizeComponent_1(
      { render: __vue_render__$m, staticRenderFns: __vue_staticRenderFns__$m },
      __vue_inject_styles__$m,
      __vue_script__$m,
      __vue_scope_id__$m,
      __vue_is_functional_template__$m,
      __vue_module_identifier__$m,
      browser,
      undefined
    );

  function charts (Vue) {
    Vue.component(Charts$1.name, Charts$1);
  }

  //
  var script$n = {
    name: 'DvDigitalFlop',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        renderer: null,
        defaultConfig: {
          /**
           * @description Number for digital flop
           * @type {Array<Number>}
           * @default number = []
           * @example number = [10]
           */
          number: [],

          /**
           * @description Content formatter
           * @type {String}
           * @default content = ''
           * @example content = '{nt}个'
           */
          content: '',

          /**
           * @description Number toFixed
           * @type {Number}
           * @default toFixed = 0
           */
          toFixed: 0,

          /**
           * @description Text align
           * @type {String}
           * @default textAlign = 'center'
           * @example textAlign = 'center' | 'left' | 'right'
           */
          textAlign: 'center',

          /**
           * @description Text style configuration
           * @type {Object} {CRender Class Style}
           */
          style: {
            fontSize: 30,
            fill: '#3de7c9'
          },

          /**
           * @description CRender animationCurve
           * @type {String}
           * @default animationCurve = 'easeOutCubic'
           */
          animationCurve: 'easeOutCubic',

          /**
           * @description CRender animationFrame
           * @type {String}
           * @default animationFrame = 50
           */
          animationFrame: 50
        },
        mergedConfig: null,
        graph: null
      };
    },

    watch: {
      config() {
        const {
          update
        } = this;
        update();
      }

    },
    methods: {
      init() {
        const {
          initRender,
          mergeConfig,
          initGraph
        } = this;
        initRender();
        mergeConfig();
        initGraph();
      },

      initRender() {
        const {
          $refs
        } = this;
        this.renderer = new CRender($refs['digital-flop']);
      },

      mergeConfig() {
        const {
          defaultConfig,
          config
        } = this;
        this.mergedConfig = util_2$1(util_1(defaultConfig, true), config || {});
      },

      initGraph() {
        const {
          getShape,
          getStyle,
          renderer,
          mergedConfig
        } = this;
        const {
          animationCurve,
          animationFrame
        } = mergedConfig;
        const shape = getShape();
        const style = getStyle();
        this.graph = renderer.add({
          name: 'numberText',
          animationCurve,
          animationFrame,
          shape,
          style
        });
      },

      getShape() {
        const {
          number,
          content,
          toFixed,
          textAlign
        } = this.mergedConfig;
        const [w, h] = this.renderer.area;
        const position = [w / 2, h / 2];
        if (textAlign === 'left') position[0] = 0;
        if (textAlign === 'right') position[0] = w;
        return {
          number,
          content,
          toFixed,
          position
        };
      },

      getStyle() {
        const {
          style,
          textAlign
        } = this.mergedConfig;
        return util_2$1(style, {
          textAlign,
          textBaseline: 'middle'
        });
      },

      update() {
        const {
          mergeConfig,
          mergeShape,
          getShape,
          getStyle,
          graph,
          mergedConfig
        } = this;
        mergeConfig();
        if (!graph) return;
        const {
          animationCurve,
          animationFrame
        } = mergedConfig;
        const shape = getShape();
        const style = getStyle();
        mergeShape(graph, shape);
        graph.animationCurve = animationCurve;
        graph.animationFrame = animationFrame;
        graph.animation('style', style, true);
        graph.animation('shape', shape);
      },

      mergeShape(graph, shape) {
        const cacheNum = graph.shape.number.length;
        const shapeNum = shape.number.length;
        if (cacheNum !== shapeNum) graph.shape.number = shape.number;
      }

    },

    mounted() {
      const {
        init
      } = this;
      init();
    }

  };

  /* script */
  const __vue_script__$n = script$n;

  /* template */
  var __vue_render__$n = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "dv-digital-flop" }, [
      _c("canvas", { ref: "digital-flop" })
    ])
  };
  var __vue_staticRenderFns__$n = [];
  __vue_render__$n._withStripped = true;

    /* style */
    const __vue_inject_styles__$n = function (inject) {
      if (!inject) return
      inject("data-v-ba7262c4_0", { source: ".dv-digital-flop canvas {\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-digital-flop canvas {\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$n = undefined;
    /* module identifier */
    const __vue_module_identifier__$n = undefined;
    /* functional template */
    const __vue_is_functional_template__$n = false;
    /* style inject SSR */
    

    
    var DigitalFlop = normalizeComponent_1(
      { render: __vue_render__$n, staticRenderFns: __vue_staticRenderFns__$n },
      __vue_inject_styles__$n,
      __vue_script__$n,
      __vue_scope_id__$n,
      __vue_is_functional_template__$n,
      __vue_module_identifier__$n,
      browser,
      undefined
    );

  //
  var script$o = {
    name: 'DvActiveRingChart',
    components: {
      dvDigitalFlop: DigitalFlop
    },
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        defaultConfig: {
          /**
           * @description Ring radius
           * @type {String|Number}
           * @default radius = '50%'
           * @example radius = '50%' | 100
           */
          radius: '50%',

          /**
           * @description Active ring radius
           * @type {String|Number}
           * @default activeRadius = '55%'
           * @example activeRadius = '55%' | 110
           */
          activeRadius: '55%',

          /**
           * @description Ring data
           * @type {Array<Object>}
           * @default data = [{ name: '', value: 0 }]
           */
          data: [{
            name: '',
            value: 0
          }],

          /**
           * @description Ring line width
           * @type {Number}
           * @default lineWidth = 20
           */
          lineWidth: 20,

          /**
           * @description Active time gap (ms)
           * @type {Number}
           * @default activeTimeGap = 3000
           */
          activeTimeGap: 3000,

          /**
           * @description Ring color (hex|rgb|rgba|color keywords)
           * @type {Array<String>}
           * @default color = [Charts Default Color]
           * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
           */
          color: [],

          /**
           * @description Digital flop style
           * @type {Object}
           */
          digitalFlopStyle: {
            fontSize: 25,
            fill: '#fff'
          },

          /**
           * @description CRender animationCurve
           * @type {String}
           * @default animationCurve = 'easeOutCubic'
           */
          animationCurve: 'easeOutCubic',

          /**
           * @description CRender animationFrame
           * @type {String}
           * @default animationFrame = 50
           */
          animationFrame: 50
        },
        mergedConfig: null,
        chart: null,
        activeIndex: 0,
        animationHandler: ''
      };
    },

    computed: {
      digitalFlop() {
        const {
          mergedConfig,
          activeIndex
        } = this;
        if (!mergedConfig) return {};
        const {
          digitalFlopStyle,
          data
        } = mergedConfig;
        const value = data.map(({
          value
        }) => value);
        const sum = value.reduce((all, v) => all + v, 0);
        const percent = parseInt(value[activeIndex] / sum * 100);
        return {
          content: '{nt}%',
          number: [percent],
          style: digitalFlopStyle
        };
      },

      ringName() {
        const {
          mergedConfig,
          activeIndex
        } = this;
        if (!mergedConfig) return '';
        return mergedConfig.data[activeIndex].name;
      },

      fontSize() {
        const {
          mergedConfig
        } = this;
        if (!mergedConfig) return '';
        return `font-size: ${mergedConfig.digitalFlopStyle.fontSize}px;`;
      }

    },
    watch: {
      config() {
        const {
          animationHandler,
          mergeConfig,
          setRingOption
        } = this;
        clearTimeout(animationHandler);
        this.activeIndex = 0;
        mergeConfig();
        setRingOption();
      }

    },
    methods: {
      init() {
        const {
          initChart,
          mergeConfig,
          setRingOption
        } = this;
        initChart();
        mergeConfig();
        setRingOption();
      },

      initChart() {
        const {
          $refs
        } = this;
        this.chart = new Charts($refs['active-ring-chart']);
      },

      mergeConfig() {
        const {
          defaultConfig,
          config
        } = this;
        this.mergedConfig = util_2$1(util_1(defaultConfig, true), config || {});
      },

      setRingOption() {
        const {
          getRingOption,
          chart,
          ringAnimation
        } = this;
        const option = getRingOption();
        chart.setOption(option);
        ringAnimation();
      },

      getRingOption() {
        const {
          mergedConfig,
          getRealRadius
        } = this;
        const radius = getRealRadius();
        mergedConfig.data.forEach(dataItem => {
          dataItem.radius = radius;
        });
        return {
          series: [{
            type: 'pie',
            ...mergedConfig,
            outsideLabel: {
              show: false
            }
          }],
          color: mergedConfig.color
        };
      },

      getRealRadius(active = false) {
        const {
          mergedConfig,
          chart
        } = this;
        const {
          radius,
          activeRadius,
          lineWidth
        } = mergedConfig;
        const maxRadius = Math.min(...chart.render.area) / 2;
        const halfLineWidth = lineWidth / 2;
        let realRadius = active ? activeRadius : radius;
        if (typeof realRadius !== 'number') realRadius = parseInt(realRadius) / 100 * maxRadius;
        const insideRadius = realRadius - halfLineWidth;
        const outSideRadius = realRadius + halfLineWidth;
        return [insideRadius, outSideRadius];
      },

      ringAnimation() {
        let {
          activeIndex,
          getRingOption,
          chart,
          getRealRadius
        } = this;
        const radius = getRealRadius();
        const active = getRealRadius(true);
        const option = getRingOption();
        const {
          data
        } = option.series[0];
        data.forEach((dataItem, i) => {
          if (i === activeIndex) {
            dataItem.radius = active;
          } else {
            dataItem.radius = radius;
          }
        });
        chart.setOption(option);
        const {
          activeTimeGap
        } = option.series[0];
        this.animationHandler = setTimeout(foo => {
          activeIndex += 1;
          if (activeIndex >= data.length) activeIndex = 0;
          this.activeIndex = activeIndex;
          this.ringAnimation();
        }, activeTimeGap);
      }

    },

    mounted() {
      const {
        init
      } = this;
      init();
    },

    beforeDestroy() {
      const {
        animationHandler
      } = this;
      clearTimeout(animationHandler);
    }

  };

  /* script */
  const __vue_script__$o = script$o;

  /* template */
  var __vue_render__$o = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "dv-active-ring-chart" }, [
      _c("div", {
        ref: "active-ring-chart",
        staticClass: "active-ring-chart-container"
      }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "active-ring-info" },
        [
          _c("dv-digital-flop", { attrs: { config: _vm.digitalFlop } }),
          _vm._v(" "),
          _c("div", { staticClass: "active-ring-name", style: _vm.fontSize }, [
            _vm._v(_vm._s(_vm.ringName))
          ])
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$o = [];
  __vue_render__$o._withStripped = true;

    /* style */
    const __vue_inject_styles__$o = function (inject) {
      if (!inject) return
      inject("data-v-fce58c90_0", { source: ".dv-active-ring-chart {\n  position: relative;\n}\n.dv-active-ring-chart .active-ring-chart-container {\n  width: 100%;\n  height: 100%;\n}\n.dv-active-ring-chart .active-ring-info {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-active-ring-chart .active-ring-info .dv-digital-flop {\n  width: 100px;\n  height: 30px;\n}\n.dv-active-ring-chart .active-ring-info .active-ring-name {\n  width: 100px;\n  height: 30px;\n  color: #fff;\n  text-align: center;\n  vertical-align: middle;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;AACpB;AACA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,SAAS;EACT,QAAQ;EACR,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,YAAY;AACd;AACA;EACE,YAAY;EACZ,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,sBAAsB;EACtB,uBAAuB;EACvB,gBAAgB;EAChB,mBAAmB;AACrB","file":"main.vue","sourcesContent":[".dv-active-ring-chart {\n  position: relative;\n}\n.dv-active-ring-chart .active-ring-chart-container {\n  width: 100%;\n  height: 100%;\n}\n.dv-active-ring-chart .active-ring-info {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-active-ring-chart .active-ring-info .dv-digital-flop {\n  width: 100px;\n  height: 30px;\n}\n.dv-active-ring-chart .active-ring-info .active-ring-name {\n  width: 100px;\n  height: 30px;\n  color: #fff;\n  text-align: center;\n  vertical-align: middle;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$o = undefined;
    /* module identifier */
    const __vue_module_identifier__$o = undefined;
    /* functional template */
    const __vue_is_functional_template__$o = false;
    /* style inject SSR */
    

    
    var ActiveRingChart = normalizeComponent_1(
      { render: __vue_render__$o, staticRenderFns: __vue_staticRenderFns__$o },
      __vue_inject_styles__$o,
      __vue_script__$o,
      __vue_scope_id__$o,
      __vue_is_functional_template__$o,
      __vue_module_identifier__$o,
      browser,
      undefined
    );

  function activeRingChart (Vue) {
    Vue.component(ActiveRingChart.name, ActiveRingChart);
  }

  //
  var script$p = {
    name: 'DvCapsuleChart',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        defaultConfig: {
          /**
           * @description Capsule chart data
           * @type {Array<Object>}
           * @default data = []
           * @example data = [{ name: 'foo1', value: 100 }, { name: 'foo2', value: 100 }]
           */
          data: [],

          /**
           * @description Colors (hex|rgb|rgba|color keywords)
           * @type {Array<String>}
           * @default color = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293']
           * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
           */
          colors: ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293'],

          /**
           * @description Chart unit
           * @type {String}
           * @default unit = ''
           */
          unit: ''
        },
        mergedConfig: null,
        capsuleLength: [],
        labelData: []
      };
    },

    watch: {
      config() {
        const {
          calcData
        } = this;
        calcData();
      }

    },
    methods: {
      calcData() {
        const {
          mergeConfig,
          calcCapsuleLengthAndLabelData
        } = this;
        mergeConfig();
        calcCapsuleLengthAndLabelData();
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = util_2$1(util_1(defaultConfig, true), config || {});
      },

      calcCapsuleLengthAndLabelData() {
        const {
          data
        } = this.mergedConfig;
        if (!data.length) return;
        const capsuleValue = data.map(({
          value
        }) => value);
        const maxValue = Math.max(...capsuleValue);
        this.capsuleLength = capsuleValue.map(v => maxValue ? v / maxValue : 0);
        const oneFifth = maxValue / 5;
        this.labelData = new Array(6).fill(0).map((v, i) => Math.ceil(i * oneFifth));
      }

    },

    mounted() {
      const {
        calcData
      } = this;
      calcData();
    }

  };

  /* script */
  const __vue_script__$p = script$p;

  /* template */
  var __vue_render__$p = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "dv-capsule-chart" },
      [
        _vm.mergedConfig
          ? [
              _c(
                "div",
                { staticClass: "label-column" },
                [
                  _vm._l(_vm.mergedConfig.data, function(item) {
                    return _c("div", { key: item.name }, [
                      _vm._v(_vm._s(item.name))
                    ])
                  }),
                  _vm._v(" "),
                  _c("div", [_vm._v(" ")])
                ],
                2
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "capsule-container" },
                [
                  _vm._l(_vm.capsuleLength, function(capsule, index) {
                    return _c(
                      "div",
                      { key: index, staticClass: "capsule-item" },
                      [
                        _c("div", {
                          style:
                            "width: " +
                            capsule * 100 +
                            "%; background-color: " +
                            _vm.mergedConfig.colors[
                              index % _vm.mergedConfig.colors.length
                            ] +
                            ";"
                        })
                      ]
                    )
                  }),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "unit-label" },
                    _vm._l(_vm.labelData, function(label, index) {
                      return _c("div", { key: label + index }, [
                        _vm._v(_vm._s(label))
                      ])
                    }),
                    0
                  )
                ],
                2
              ),
              _vm._v(" "),
              _vm.mergedConfig.unit
                ? _c("div", { staticClass: "unit-text" }, [
                    _vm._v(_vm._s(_vm.mergedConfig.unit))
                  ])
                : _vm._e()
            ]
          : _vm._e()
      ],
      2
    )
  };
  var __vue_staticRenderFns__$p = [];
  __vue_render__$p._withStripped = true;

    /* style */
    const __vue_inject_styles__$p = function (inject) {
      if (!inject) return
      inject("data-v-7421b956_0", { source: ".dv-capsule-chart {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  box-sizing: border-box;\n  padding: 10px;\n  color: #fff;\n}\n.dv-capsule-chart .label-column {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  box-sizing: border-box;\n  padding-right: 10px;\n  text-align: right;\n  font-size: 12px;\n}\n.dv-capsule-chart .label-column div {\n  height: 20px;\n  line-height: 20px;\n}\n.dv-capsule-chart .capsule-container {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.dv-capsule-chart .capsule-item {\n  box-shadow: 0 0 3px #999;\n  height: 10px;\n  margin: 5px 0px;\n  border-radius: 5px;\n}\n.dv-capsule-chart .capsule-item div {\n  height: 8px;\n  margin-top: 1px;\n  border-radius: 5px;\n  transition: all 0.3s;\n}\n.dv-capsule-chart .unit-label {\n  height: 20px;\n  font-size: 12px;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n}\n.dv-capsule-chart .unit-text {\n  text-align: right;\n  display: flex;\n  align-items: flex-end;\n  font-size: 12px;\n  line-height: 20px;\n  margin-left: 10px;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,aAAa;EACb,mBAAmB;EACnB,sBAAsB;EACtB,aAAa;EACb,WAAW;AACb;AACA;EACE,aAAa;EACb,sBAAsB;EACtB,8BAA8B;EAC9B,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;EACjB,eAAe;AACjB;AACA;EACE,YAAY;EACZ,iBAAiB;AACnB;AACA;EACE,OAAO;EACP,aAAa;EACb,sBAAsB;EACtB,8BAA8B;AAChC;AACA;EACE,wBAAwB;EACxB,YAAY;EACZ,eAAe;EACf,kBAAkB;AACpB;AACA;EACE,WAAW;EACX,eAAe;EACf,kBAAkB;EAClB,oBAAoB;AACtB;AACA;EACE,YAAY;EACZ,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,mBAAmB;EACnB,8BAA8B;AAChC;AACA;EACE,iBAAiB;EACjB,aAAa;EACb,qBAAqB;EACrB,eAAe;EACf,iBAAiB;EACjB,iBAAiB;AACnB","file":"main.vue","sourcesContent":[".dv-capsule-chart {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  box-sizing: border-box;\n  padding: 10px;\n  color: #fff;\n}\n.dv-capsule-chart .label-column {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  box-sizing: border-box;\n  padding-right: 10px;\n  text-align: right;\n  font-size: 12px;\n}\n.dv-capsule-chart .label-column div {\n  height: 20px;\n  line-height: 20px;\n}\n.dv-capsule-chart .capsule-container {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.dv-capsule-chart .capsule-item {\n  box-shadow: 0 0 3px #999;\n  height: 10px;\n  margin: 5px 0px;\n  border-radius: 5px;\n}\n.dv-capsule-chart .capsule-item div {\n  height: 8px;\n  margin-top: 1px;\n  border-radius: 5px;\n  transition: all 0.3s;\n}\n.dv-capsule-chart .unit-label {\n  height: 20px;\n  font-size: 12px;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n}\n.dv-capsule-chart .unit-text {\n  text-align: right;\n  display: flex;\n  align-items: flex-end;\n  font-size: 12px;\n  line-height: 20px;\n  margin-left: 10px;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$p = undefined;
    /* module identifier */
    const __vue_module_identifier__$p = undefined;
    /* functional template */
    const __vue_is_functional_template__$p = false;
    /* style inject SSR */
    

    
    var CapsuleChart = normalizeComponent_1(
      { render: __vue_render__$p, staticRenderFns: __vue_staticRenderFns__$p },
      __vue_inject_styles__$p,
      __vue_script__$p,
      __vue_scope_id__$p,
      __vue_is_functional_template__$p,
      __vue_module_identifier__$p,
      browser,
      undefined
    );

  function capsuleChart (Vue) {
    Vue.component(CapsuleChart.name, CapsuleChart);
  }

  //
  var script$q = {
    name: 'DvWaterLevelPond',
    props: {
      config: Object,
      default: () => ({})
    },

    data() {
      return {
        gradientId: `water-level-pond-${new Date().getTime()}`,
        defaultConfig: {
          /**
           * @description Data
           * @type {Array<Number>}
           * @default data = []
           * @example data = [60, 40]
           */
          data: [],

          /**
           * @description Shape of wanter level pond
           * @type {String}
           * @default shape = 'rect'
           * @example shape = 'rect' | 'roundRect' | 'round'
           */
          shape: 'rect',

          /**
           * @description Water wave number
           * @type {Number}
           * @default waveNum = 3
           */
          waveNum: 3,

          /**
           * @description Water wave height (px)
           * @type {Number}
           * @default waveHeight = 40
           */
          waveHeight: 40,

          /**
           * @description Wave opacity
           * @type {Number}
           * @default waveOpacity = 0.4
           */
          waveOpacity: 0.4,

          /**
           * @description Colors (hex|rgb|rgba|color keywords)
           * @type {Array<String>}
           * @default colors = ['#00BAFF', '#3DE7C9']
           * @example colors = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
           */
          colors: ['#3DE7C9', '#00BAFF'],

          /**
           * @description Formatter
           * @type {String}
           * @default formatter = '{value}%'
           */
          formatter: '{value}%'
        },
        mergedConfig: {},
        renderer: null,
        svgBorderGradient: [],
        details: '',
        waves: [],
        animation: false
      };
    },

    computed: {
      radius() {
        const {
          shape
        } = this.mergedConfig;
        if (shape === 'round') return '50%';
        if (shape === 'rect') return '0';
        if (shape === 'roundRect') return '10px';
        return '0';
      },

      shape() {
        const {
          shape
        } = this.mergedConfig;
        if (!shape) return 'rect';
        return shape;
      }

    },
    watch: {
      config() {
        const {
          calcData,
          renderer
        } = this;
        renderer.delAllGraph();
        this.waves = [];
        setTimeout(calcData, 0);
      }

    },
    methods: {
      init() {
        const {
          initRender,
          config,
          calcData
        } = this;
        initRender();
        if (!config) return;
        calcData();
      },

      initRender() {
        const {
          $refs
        } = this;
        this.renderer = new CRender($refs['water-pond-level']);
      },

      calcData() {
        const {
          mergeConfig,
          calcSvgBorderGradient,
          calcDetails
        } = this;
        mergeConfig();
        calcSvgBorderGradient();
        calcDetails();
        const {
          addWave,
          animationWave
        } = this;
        addWave();
        animationWave();
      },

      mergeConfig() {
        const {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = util_2$1(util_1(defaultConfig, true), config);
      },

      calcSvgBorderGradient() {
        const {
          colors
        } = this.mergedConfig;
        const colorNum = colors.length;
        const colorOffsetGap = 100 / (colorNum - 1);
        this.svgBorderGradient = colors.map((c, i) => [colorOffsetGap * i, c]);
      },

      calcDetails() {
        const {
          data,
          formatter
        } = this.mergedConfig;

        if (!data.length) {
          this.details = '';
          return;
        }

        const maxValue = Math.max(...data);
        this.details = formatter.replace('{value}', maxValue);
      },

      addWave() {
        const {
          renderer,
          getWaveShapes,
          getWaveStyle,
          drawed
        } = this;
        const shapes = getWaveShapes();
        const style = getWaveStyle();
        this.waves = shapes.map(shape => renderer.add({
          name: 'smoothline',
          animationFrame: 300,
          shape,
          style,
          drawed
        }));
      },

      getWaveShapes() {
        const {
          mergedConfig,
          renderer,
          mergeOffset
        } = this;
        const {
          waveNum,
          waveHeight,
          data
        } = mergedConfig;
        const [w, h] = renderer.area;
        const pointsNum = waveNum * 4 + 4;
        const pointXGap = w / waveNum / 2;
        return data.map(v => {
          let points = new Array(pointsNum).fill(0).map((foo, j) => {
            const x = w - pointXGap * j;
            const startY = (1 - v / 100) * h;
            const y = j % 2 === 0 ? startY : startY - waveHeight;
            return [x, y];
          });
          points = points.map(p => mergeOffset(p, [pointXGap * 2, 0]));
          return {
            points
          };
        });
      },

      mergeOffset([x, y], [ox, oy]) {
        return [x + ox, y + oy];
      },

      getWaveStyle() {
        const {
          renderer,
          mergedConfig
        } = this;
        const h = renderer.area[1];
        return {
          gradientColor: mergedConfig.colors,
          gradientType: 'linear',
          gradientParams: [0, 0, 0, h],
          gradientWith: 'fill',
          opacity: mergedConfig.waveOpacity,
          translate: [0, 0]
        };
      },

      drawed({
        shape: {
          points
        }
      }, {
        ctx,
        area
      }) {
        const firstPoint = points[0];
        const lastPoint = points.slice(-1)[0];
        const h = area[1];
        ctx.lineTo(lastPoint[0], h);
        ctx.lineTo(firstPoint[0], h);
        ctx.closePath();
        ctx.fill();
      },

      async animationWave(repeat = 1) {
        const {
          waves,
          renderer,
          animation
        } = this;
        if (animation) return;
        this.animation = true;
        const w = renderer.area[0];
        waves.forEach(graph => {
          graph.attr('style', {
            translate: [0, 0]
          });
          graph.animation('style', {
            translate: [w, 0]
          }, true);
        });
        await renderer.launchAnimation();
        this.animation = false;
        if (!renderer.graphs.length) return;
        this.animationWave(repeat + 1);
      }

    },

    mounted() {
      const {
        init
      } = this;
      init();
    },

    beforeDestroy() {
      const {
        renderer
      } = this;
      renderer.delAllGraph();
      this.waves = [];
    }

  };

  /* script */
  const __vue_script__$q = script$q;

  /* template */
  var __vue_render__$q = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "dv-water-pond-level" }, [
      _vm.renderer
        ? _c("svg", [
            _c(
              "defs",
              [
                _c(
                  "linearGradient",
                  {
                    attrs: {
                      id: _vm.gradientId,
                      x1: "0%",
                      y1: "0%",
                      x2: "0%",
                      y2: "100%"
                    }
                  },
                  _vm._l(_vm.svgBorderGradient, function(lc) {
                    return _c("stop", {
                      key: lc[0],
                      attrs: { offset: lc[0], "stop-color": lc[1] }
                    })
                  }),
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _vm.renderer
              ? _c(
                  "text",
                  {
                    attrs: {
                      stroke: "url(#" + _vm.gradientId + ")",
                      fill: "url(#" + _vm.gradientId + ")",
                      x: _vm.renderer.area[0] / 2 + 8,
                      y: _vm.renderer.area[1] / 2 + 8
                    }
                  },
                  [_vm._v("\n      " + _vm._s(_vm.details) + "\n    ")]
                )
              : _vm._e(),
            _vm._v(" "),
            !_vm.shape || _vm.shape === "round"
              ? _c("ellipse", {
                  attrs: {
                    cx: _vm.renderer.area[0] / 2 + 8,
                    cy: _vm.renderer.area[1] / 2 + 8,
                    rx: _vm.renderer.area[0] / 2 + 5,
                    ry: _vm.renderer.area[1] / 2 + 5,
                    stroke: "url(#" + _vm.gradientId + ")"
                  }
                })
              : _c("rect", {
                  attrs: {
                    x: "2",
                    y: "2",
                    rx: _vm.shape === "roundRect" ? 10 : 0,
                    ry: _vm.shape === "roundRect" ? 10 : 0,
                    width: _vm.renderer.area[0] + 12,
                    height: _vm.renderer.area[1] + 12,
                    stroke: "url(#" + _vm.gradientId + ")"
                  }
                })
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("canvas", {
        ref: "water-pond-level",
        style: "border-radius: " + _vm.radius + ";"
      })
    ])
  };
  var __vue_staticRenderFns__$q = [];
  __vue_render__$q._withStripped = true;

    /* style */
    const __vue_inject_styles__$q = function (inject) {
      if (!inject) return
      inject("data-v-4101c79a_0", { source: ".dv-water-pond-level {\n  position: relative;\n}\n.dv-water-pond-level svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-water-pond-level text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n.dv-water-pond-level ellipse,\n.dv-water-pond-level rect {\n  fill: none;\n  stroke-width: 3;\n}\n.dv-water-pond-level canvas {\n  margin-top: 8px;\n  margin-left: 8px;\n  width: calc(100% - 16px);\n  height: calc(100% - 16px);\n  box-sizing: border-box;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,eAAe;EACf,iBAAiB;EACjB,mBAAmB;EACnB,yBAAyB;AAC3B;AACA;;EAEE,UAAU;EACV,eAAe;AACjB;AACA;EACE,eAAe;EACf,gBAAgB;EAChB,wBAAwB;EACxB,yBAAyB;EACzB,sBAAsB;AACxB","file":"main.vue","sourcesContent":[".dv-water-pond-level {\n  position: relative;\n}\n.dv-water-pond-level svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-water-pond-level text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n.dv-water-pond-level ellipse,\n.dv-water-pond-level rect {\n  fill: none;\n  stroke-width: 3;\n}\n.dv-water-pond-level canvas {\n  margin-top: 8px;\n  margin-left: 8px;\n  width: calc(100% - 16px);\n  height: calc(100% - 16px);\n  box-sizing: border-box;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$q = undefined;
    /* module identifier */
    const __vue_module_identifier__$q = undefined;
    /* functional template */
    const __vue_is_functional_template__$q = false;
    /* style inject SSR */
    

    
    var WaterLevelPond = normalizeComponent_1(
      { render: __vue_render__$q, staticRenderFns: __vue_staticRenderFns__$q },
      __vue_inject_styles__$q,
      __vue_script__$q,
      __vue_scope_id__$q,
      __vue_is_functional_template__$q,
      __vue_module_identifier__$q,
      browser,
      undefined
    );

  function waterLevelPond (Vue) {
    Vue.component(WaterLevelPond.name, WaterLevelPond);
  }

  //
  var script$r = {
    name: 'DvPercentPond',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        gradientId1: `percent-pond-gradientId1-${new Date().getTime()}`,
        gradientId2: `percent-pond-gradientId2-${new Date().getTime()}`,
        width: 0,
        height: 0,
        defaultConfig: {
          /**
           * @description Value
           * @type {Number}
           * @default value = 0
           */
          value: 0,

          /**
           * @description Colors (hex|rgb|rgba|color keywords)
           * @type {Array<String>}
           * @default colors = ['#00BAFF', '#3DE7C9']
           * @example colors = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
           */
          colors: ['#3DE7C9', '#00BAFF'],

          /**
           * @description Border width
           * @type {Number}
           * @default borderWidth = 3
           */
          borderWidth: 3,

          /**
           * @description Gap between border and pond
           * @type {Number}
           * @default borderGap = 3
           */
          borderGap: 3,

          /**
           * @description Line dash
           * @type {Array<Number>}
           * @default lineDash = [5, 1]
           */
          lineDash: [5, 1],

          /**
           * @description Text color
           * @type {String}
           * @default textColor = '#fff'
           */
          textColor: '#fff',

          /**
           * @description Border radius
           * @type {Number}
           * @default borderRadius = 5
           */
          borderRadius: 5,

          /**
           * @description Local Gradient
           * @type {Boolean}
           * @default localGradient = false
           * @example localGradient = false | true
           */
          localGradient: false,

          /**
           * @description Formatter
           * @type {String}
           * @default formatter = '{value}%'
           */
          formatter: '{value}%'
        },
        mergedConfig: null
      };
    },

    computed: {
      rectWidth() {
        const {
          mergedConfig,
          width
        } = this;
        if (!mergedConfig) return 0;
        const {
          borderWidth
        } = mergedConfig;
        return width - borderWidth;
      },

      rectHeight() {
        const {
          mergedConfig,
          height
        } = this;
        if (!mergedConfig) return 0;
        const {
          borderWidth
        } = mergedConfig;
        return height - borderWidth;
      },

      points() {
        const {
          mergedConfig,
          width,
          height
        } = this;
        const halfHeight = height / 2;
        if (!mergedConfig) return `0, ${halfHeight} 0, ${halfHeight}`;
        const {
          borderWidth,
          borderGap,
          value
        } = mergedConfig;
        const polylineLength = (width - (borderWidth + borderGap) * 2) / 100 * value;
        return `
        ${borderWidth + borderGap}, ${halfHeight}
        ${borderWidth + borderGap + polylineLength}, ${halfHeight + 0.001}
      `;
      },

      polylineWidth() {
        const {
          mergedConfig,
          height
        } = this;
        if (!mergedConfig) return 0;
        const {
          borderWidth,
          borderGap
        } = mergedConfig;
        return height - (borderWidth + borderGap) * 2;
      },

      linearGradient() {
        const {
          mergedConfig
        } = this;
        if (!mergedConfig) return [];
        const {
          colors
        } = mergedConfig;
        const colorNum = colors.length;
        const colorOffsetGap = 100 / (colorNum - 1);
        return colors.map((c, i) => [colorOffsetGap * i, c]);
      },

      polylineGradient() {
        const {
          gradientId1,
          gradientId2,
          mergedConfig
        } = this;
        if (!mergedConfig) return gradientId2;
        if (mergedConfig.localGradient) return gradientId1;
        return gradientId2;
      },

      gradient2XPos() {
        const {
          mergedConfig
        } = this;
        if (!mergedConfig) return '100%';
        const {
          value
        } = mergedConfig;
        return `${200 - value}%`;
      },

      details() {
        const {
          mergedConfig
        } = this;
        if (!mergedConfig) return '';
        const {
          value,
          formatter
        } = mergedConfig;
        return formatter.replace('{value}', value);
      }

    },
    watch: {
      config() {
        const {
          mergeConfig
        } = this;
        mergeConfig();
      }

    },
    methods: {
      async init() {
        const {
          initWH,
          config,
          mergeConfig
        } = this;
        await initWH();
        if (!config) return;
        mergeConfig();
      },

      async initWH() {
        const {
          $nextTick,
          $refs
        } = this;
        await $nextTick();
        const dom = $refs['percent-pond'];
        this.width = dom.clientWidth;
        this.height = dom.clientHeight;
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = util_2$1(util_1(defaultConfig, true), config || {});
      }

    },

    mounted() {
      const {
        init
      } = this;
      init();
    }

  };

  /* script */
  const __vue_script__$r = script$r;

  /* template */
  var __vue_render__$r = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: "percent-pond", staticClass: "dv-percent-pond" }, [
      _c("svg", [
        _c(
          "defs",
          [
            _c(
              "linearGradient",
              {
                attrs: {
                  id: _vm.gradientId1,
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "0%"
                }
              },
              _vm._l(_vm.linearGradient, function(lc) {
                return _c("stop", {
                  key: lc[0],
                  attrs: { offset: lc[0] + "%", "stop-color": lc[1] }
                })
              }),
              1
            ),
            _vm._v(" "),
            _c(
              "linearGradient",
              {
                attrs: {
                  id: _vm.gradientId2,
                  x1: "0%",
                  y1: "0%",
                  x2: _vm.gradient2XPos,
                  y2: "0%"
                }
              },
              _vm._l(_vm.linearGradient, function(lc) {
                return _c("stop", {
                  key: lc[0],
                  attrs: { offset: lc[0] + "%", "stop-color": lc[1] }
                })
              }),
              1
            )
          ],
          1
        ),
        _vm._v(" "),
        _c("rect", {
          attrs: {
            x: _vm.mergedConfig ? _vm.mergedConfig.borderWidth / 2 : "0",
            y: _vm.mergedConfig ? _vm.mergedConfig.borderWidth / 2 : "0",
            rx: _vm.mergedConfig ? _vm.mergedConfig.borderRadius : "0",
            ry: _vm.mergedConfig ? _vm.mergedConfig.borderRadius : "0",
            fill: "transparent",
            "stroke-width": _vm.mergedConfig ? _vm.mergedConfig.borderWidth : "0",
            stroke: "url(#" + _vm.gradientId1 + ")",
            width: _vm.rectWidth > 0 ? _vm.rectWidth : 0,
            height: _vm.rectHeight > 0 ? _vm.rectHeight : 0
          }
        }),
        _vm._v(" "),
        _c("polyline", {
          attrs: {
            "stroke-width": _vm.polylineWidth,
            "stroke-dasharray": _vm.mergedConfig
              ? _vm.mergedConfig.lineDash.join(",")
              : "0",
            stroke: "url(#" + _vm.polylineGradient + ")",
            points: _vm.points
          }
        }),
        _vm._v(" "),
        _c(
          "text",
          {
            attrs: {
              stroke: _vm.mergedConfig ? _vm.mergedConfig.textColor : "#fff",
              fill: _vm.mergedConfig ? _vm.mergedConfig.textColor : "#fff",
              x: _vm.width / 2,
              y: _vm.height / 2
            }
          },
          [_vm._v("\n      " + _vm._s(_vm.details) + "\n    ")]
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$r = [];
  __vue_render__$r._withStripped = true;

    /* style */
    const __vue_inject_styles__$r = function (inject) {
      if (!inject) return
      inject("data-v-7801b40e_0", { source: ".dv-percent-pond {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.dv-percent-pond svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-percent-pond polyline {\n  transition: all 0.3s;\n}\n.dv-percent-pond text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,aAAa;EACb,sBAAsB;AACxB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,WAAW;EACX,YAAY;AACd;AACA;EACE,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,iBAAiB;EACjB,mBAAmB;EACnB,yBAAyB;AAC3B","file":"main.vue","sourcesContent":[".dv-percent-pond {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.dv-percent-pond svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-percent-pond polyline {\n  transition: all 0.3s;\n}\n.dv-percent-pond text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$r = undefined;
    /* module identifier */
    const __vue_module_identifier__$r = undefined;
    /* functional template */
    const __vue_is_functional_template__$r = false;
    /* style inject SSR */
    

    
    var PercentPond = normalizeComponent_1(
      { render: __vue_render__$r, staticRenderFns: __vue_staticRenderFns__$r },
      __vue_inject_styles__$r,
      __vue_script__$r,
      __vue_scope_id__$r,
      __vue_is_functional_template__$r,
      __vue_module_identifier__$r,
      browser,
      undefined
    );

  function percentPond (Vue) {
    Vue.component(PercentPond.name, PercentPond);
  }

  //
  var script$s = {
    name: 'DvFlylineChart',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      },
      dev: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        ref: 'dv-flyline-chart',
        unique: Math.random(),
        maskId: `flyline-mask-id-${new Date().getTime()}`,
        maskCircleId: `mask-circle-id-${new Date().getTime()}`,
        gradientId: `gradient-id-${new Date().getTime()}`,
        gradient2Id: `gradient2-id-${new Date().getTime()}`,
        defaultConfig: {
          /**
           * @description Flyline chart center point
           * @type {Array<Number>}
           * @default centerPoint = [0, 0]
           */
          centerPoint: [0, 0],

          /**
           * @description Flyline start points
           * @type {Array<Array<Number>>}
           * @default points = []
           * @example points = [[10, 10], [100, 100]]
           */
          points: [],

          /**
           * @description Flyline width
           * @type {Number}
           * @default lineWidth = 1
           */
          lineWidth: 1,

          /**
           * @description Orbit color
           * @type {String}
           * @default orbitColor = 'rgba(103, 224, 227, .2)'
           */
          orbitColor: 'rgba(103, 224, 227, .2)',

          /**
           * @description Flyline color
           * @type {String}
           * @default orbitColor = '#ffde93'
           */
          flylineColor: '#ffde93',

          /**
           * @description K value
           * @type {Number}
           * @default k = -0.5
           * @example k = -1 ~ 1
           */
          k: -0.5,

          /**
           * @description Flyline curvature
           * @type {Number}
           * @default curvature = 5
           */
          curvature: 5,

          /**
           * @description Flyline radius
           * @type {Number}
           * @default flylineRadius = 100
           */
          flylineRadius: 100,

          /**
           * @description Flyline animation duration
           * @type {Array<Number>}
           * @default duration = [20, 30]
           */
          duration: [20, 30],

          /**
           * @description Relative points position
           * @type {Boolean}
           * @default relative = true
           */
          relative: true,

          /**
           * @description Back ground image url
           * @type {String}
           * @default bgImgUrl = ''
           * @example bgImgUrl = './img/bg.jpg'
           */
          bgImgUrl: '',

          /**
           * @description Text configuration
           * @type {Object}
           */
          text: {
            /**
             * @description Text offset
             * @type {Array<Number>}
             * @default offset = [0, 15]
             */
            offset: [0, 15],

            /**
             * @description Text color
             * @type {String}
             * @default color = '#ffdb5c'
             */
            color: '#ffdb5c',

            /**
             * @description Text font size
             * @type {Number}
             * @default fontSize = 12
             */
            fontSize: 12
          },

          /**
           * @description Halo configuration
           * @type {Object}
           */
          halo: {
            /**
             * @description Weather to show halo
             * @type {Boolean}
             * @default show = true
             * @example show = true | false
             */
            show: true,

            /**
             * @description Halo animation duration (10 = 1s)
             * @type {Number}
             * @default duration = 30
             */
            duration: 30,

            /**
             * @description Halo color
             * @type {String}
             * @default color = '#fb7293'
             */
            color: '#fb7293',

            /**
             * @description Halo max radius
             * @type {Number}
             * @default radius = 120
             */
            radius: 120
          },

          /**
           * @description Center point img configuration
           * @type {Object}
           */
          centerPointImg: {
            /**
             * @description Center point img width
             * @type {Number}
             * @default width = 40
             */
            width: 40,

            /**
             * @description Center point img height
             * @type {Number}
             * @default height = 40
             */
            height: 40,

            /**
             * @description Center point img url
             * @type {String}
             * @default url = ''
             */
            url: ''
          },

          /**
           * @description Points img configuration
           * @type {Object}
           * @default radius = 120
           */
          pointsImg: {
            /**
             * @description Points img width
             * @type {Number}
             * @default width = 15
             */
            width: 15,

            /**
             * @description Points img height
             * @type {Number}
             * @default height = 15
             */
            height: 15,

            /**
             * @description Points img url
             * @type {String}
             * @default url = ''
             */
            url: ''
          }
        },
        mergedConfig: null,
        paths: [],
        lengths: [],
        times: [],
        texts: []
      };
    },

    watch: {
      config() {
        const {
          calcData
        } = this;
        calcData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          calcData
        } = this;
        calcData();
      },

      async calcData() {
        const {
          mergeConfig,
          createFlylinePaths,
          calcLineLengths
        } = this;
        mergeConfig();
        createFlylinePaths();
        await calcLineLengths();
        const {
          calcTimes,
          calcTexts
        } = this;
        calcTimes();
        calcTexts();
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        const mergedConfig = util_2$1(util_1(defaultConfig, true), config || {});
        const {
          points
        } = mergedConfig;
        mergedConfig.points = points.map(item => {
          if (item instanceof Array) {
            return {
              position: item,
              text: ''
            };
          }

          return item;
        });
        this.mergedConfig = mergedConfig;
      },

      createFlylinePaths() {
        const {
          getPath,
          mergedConfig,
          width,
          height
        } = this;
        let {
          centerPoint,
          points,
          relative
        } = mergedConfig;
        points = points.map(({
          position
        }) => position);

        if (relative) {
          centerPoint = [width * centerPoint[0], height * centerPoint[1]];
          points = points.map(([x, y]) => [width * x, height * y]);
        }

        this.paths = points.map(point => getPath(centerPoint, point));
      },

      getPath(center, point) {
        const {
          getControlPoint
        } = this;
        const controlPoint = getControlPoint(center, point);
        return [point, controlPoint, center];
      },

      getControlPoint([sx, sy], [ex, ey]) {
        const {
          getKLinePointByx,
          mergedConfig
        } = this;
        const {
          curvature,
          k
        } = mergedConfig;
        const [mx, my] = [(sx + ex) / 2, (sy + ey) / 2];
        const distance = getPointDistance([sx, sy], [ex, ey]);
        const targetLength = distance / curvature;
        const disDived = targetLength / 2;
        let [dx, dy] = [mx, my];

        do {
          dx += disDived;
          dy = getKLinePointByx(k, [mx, my], dx)[1];
        } while (getPointDistance([mx, my], [dx, dy]) < targetLength);

        return [dx, dy];
      },

      getKLinePointByx(k, [lx, ly], x) {
        const y = ly - k * lx + k * x;
        return [x, y];
      },

      async calcLineLengths() {
        const {
          $nextTick,
          paths,
          $refs
        } = this;
        await $nextTick();
        this.lengths = paths.map((foo, i) => $refs[`path${i}`][0].getTotalLength());
      },

      calcTimes() {
        const {
          duration,
          points
        } = this.mergedConfig;
        this.times = points.map(foo => randomExtend(...duration) / 10);
      },

      calcTexts() {
        const {
          points
        } = this.mergedConfig;
        this.texts = points.map(({
          text
        }) => text);
      },

      consoleClickPos({
        offsetX,
        offsetY
      }) {
        const {
          width,
          height,
          dev
        } = this;
        if (!dev) return;
        const relativeX = (offsetX / width).toFixed(2);
        const relativeY = (offsetY / height).toFixed(2);
        console.warn(`dv-flyline-chart DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`);
      }

    }
  };

  /* script */
  const __vue_script__$s = script$s;

  /* template */
  var __vue_render__$s = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        ref: "dv-flyline-chart",
        staticClass: "dv-flyline-chart",
        style:
          "background-image: url(" +
          (_vm.mergedConfig ? _vm.mergedConfig.bgImgUrl : "") +
          ")",
        on: { click: _vm.consoleClickPos }
      },
      [
        _vm.mergedConfig
          ? _c(
              "svg",
              { attrs: { width: _vm.width, height: _vm.height } },
              [
                _c(
                  "defs",
                  [
                    _c(
                      "radialGradient",
                      {
                        attrs: {
                          id: _vm.gradientId,
                          cx: "50%",
                          cy: "50%",
                          r: "50%"
                        }
                      },
                      [
                        _c("stop", {
                          attrs: {
                            offset: "0%",
                            "stop-color": "#fff",
                            "stop-opacity": "1"
                          }
                        }),
                        _vm._v(" "),
                        _c("stop", {
                          attrs: {
                            offset: "100%",
                            "stop-color": "#fff",
                            "stop-opacity": "0"
                          }
                        })
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "radialGradient",
                      {
                        attrs: {
                          id: _vm.gradient2Id,
                          cx: "50%",
                          cy: "50%",
                          r: "50%"
                        }
                      },
                      [
                        _c("stop", {
                          attrs: {
                            offset: "0%",
                            "stop-color": "#fff",
                            "stop-opacity": "0"
                          }
                        }),
                        _vm._v(" "),
                        _c("stop", {
                          attrs: {
                            offset: "100%",
                            "stop-color": "#fff",
                            "stop-opacity": "1"
                          }
                        })
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _vm.paths[0]
                      ? _c(
                          "circle",
                          {
                            attrs: {
                              id: "circle" + _vm.paths[0].toString(),
                              cx: _vm.paths[0][2][0],
                              cy: _vm.paths[0][2][1]
                            }
                          },
                          [
                            _c("animate", {
                              attrs: {
                                attributeName: "r",
                                values: "1;" + _vm.mergedConfig.halo.radius,
                                dur: _vm.mergedConfig.halo.duration / 10 + "s",
                                repeatCount: "indefinite"
                              }
                            }),
                            _vm._v(" "),
                            _c("animate", {
                              attrs: {
                                attributeName: "opacity",
                                values: "1;0",
                                dur: _vm.mergedConfig.halo.duration / 10 + "s",
                                repeatCount: "indefinite"
                              }
                            })
                          ]
                        )
                      : _vm._e()
                  ],
                  1
                ),
                _vm._v(" "),
                _vm.paths[0]
                  ? _c("image", {
                      attrs: {
                        "xlink:href": _vm.mergedConfig.centerPointImg.url,
                        width: _vm.mergedConfig.centerPointImg.width,
                        height: _vm.mergedConfig.centerPointImg.height,
                        x:
                          _vm.paths[0][2][0] -
                          _vm.mergedConfig.centerPointImg.width / 2,
                        y:
                          _vm.paths[0][2][1] -
                          _vm.mergedConfig.centerPointImg.height / 2
                      }
                    })
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "mask",
                  { attrs: { id: "maskhalo" + _vm.paths[0].toString() } },
                  [
                    _vm.paths[0]
                      ? _c("use", {
                          attrs: {
                            "xlink:href": "#circle" + _vm.paths[0].toString(),
                            fill: "url(#" + _vm.gradient2Id + ")"
                          }
                        })
                      : _vm._e()
                  ]
                ),
                _vm._v(" "),
                _vm.paths[0] && _vm.mergedConfig.halo.show
                  ? _c("use", {
                      attrs: {
                        "xlink:href": "#circle" + _vm.paths[0].toString(),
                        fill: _vm.mergedConfig.halo.color,
                        mask: "url(#maskhalo" + _vm.paths[0].toString() + ")"
                      }
                    })
                  : _vm._e(),
                _vm._v(" "),
                _vm._l(_vm.paths, function(path, i) {
                  return _c("g", { key: i }, [
                    _c("defs", [
                      _c("path", {
                        ref: "path" + i,
                        refInFor: true,
                        attrs: {
                          id: "path" + path.toString(),
                          d:
                            "M" +
                            path[0].toString() +
                            " Q" +
                            path[1].toString() +
                            " " +
                            path[2].toString(),
                          fill: "transparent"
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("use", {
                      attrs: {
                        "xlink:href": "#path" + path.toString(),
                        "stroke-width": _vm.mergedConfig.lineWidth,
                        stroke: _vm.mergedConfig.orbitColor
                      }
                    }),
                    _vm._v(" "),
                    _vm.lengths[i]
                      ? _c(
                          "use",
                          {
                            attrs: {
                              "xlink:href": "#path" + path.toString(),
                              "stroke-width": _vm.mergedConfig.lineWidth,
                              stroke: _vm.mergedConfig.flylineColor,
                              mask:
                                "url(#mask" + _vm.unique + path.toString() + ")"
                            }
                          },
                          [
                            _c("animate", {
                              attrs: {
                                attributeName: "stroke-dasharray",
                                from: "0, " + _vm.lengths[i],
                                to: _vm.lengths[i] + ", 0",
                                dur: _vm.times[i] || 0,
                                repeatCount: "indefinite"
                              }
                            })
                          ]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _c(
                      "mask",
                      { attrs: { id: "mask" + _vm.unique + path.toString() } },
                      [
                        _c(
                          "circle",
                          {
                            attrs: {
                              cx: "0",
                              cy: "0",
                              r: _vm.mergedConfig.flylineRadius,
                              fill: "url(#" + _vm.gradientId + ")"
                            }
                          },
                          [
                            _c("animateMotion", {
                              attrs: {
                                dur: _vm.times[i] || 0,
                                path:
                                  "M" +
                                  path[0].toString() +
                                  " Q" +
                                  path[1].toString() +
                                  " " +
                                  path[2].toString(),
                                rotate: "auto",
                                repeatCount: "indefinite"
                              }
                            })
                          ],
                          1
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c("image", {
                      attrs: {
                        "xlink:href": _vm.mergedConfig.pointsImg.url,
                        width: _vm.mergedConfig.pointsImg.width,
                        height: _vm.mergedConfig.pointsImg.height,
                        x: path[0][0] - _vm.mergedConfig.pointsImg.width / 2,
                        y: path[0][1] - _vm.mergedConfig.pointsImg.height / 2
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "text",
                      {
                        style:
                          "fontSize:" + _vm.mergedConfig.text.fontSize + "px;",
                        attrs: {
                          fill: _vm.mergedConfig.text.color,
                          x: path[0][0] + _vm.mergedConfig.text.offset[0],
                          y: path[0][1] + _vm.mergedConfig.text.offset[1]
                        }
                      },
                      [_vm._v("\n        " + _vm._s(_vm.texts[i]) + "\n      ")]
                    )
                  ])
                })
              ],
              2
            )
          : _vm._e()
      ]
    )
  };
  var __vue_staticRenderFns__$s = [];
  __vue_render__$s._withStripped = true;

    /* style */
    const __vue_inject_styles__$s = function (inject) {
      if (!inject) return
      inject("data-v-65ea4c14_0", { source: ".dv-flyline-chart {\n  display: flex;\n  flex-direction: column;\n  background-size: 100% 100%;\n}\n.dv-flyline-chart polyline {\n  transition: all 0.3s;\n}\n.dv-flyline-chart text {\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,sBAAsB;EACtB,0BAA0B;AAC5B;AACA;EACE,oBAAoB;AACtB;AACA;EACE,mBAAmB;EACnB,yBAAyB;AAC3B","file":"main.vue","sourcesContent":[".dv-flyline-chart {\n  display: flex;\n  flex-direction: column;\n  background-size: 100% 100%;\n}\n.dv-flyline-chart polyline {\n  transition: all 0.3s;\n}\n.dv-flyline-chart text {\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$s = undefined;
    /* module identifier */
    const __vue_module_identifier__$s = undefined;
    /* functional template */
    const __vue_is_functional_template__$s = false;
    /* style inject SSR */
    

    
    var FlylineChart = normalizeComponent_1(
      { render: __vue_render__$s, staticRenderFns: __vue_staticRenderFns__$s },
      __vue_inject_styles__$s,
      __vue_script__$s,
      __vue_scope_id__$s,
      __vue_is_functional_template__$s,
      __vue_module_identifier__$s,
      browser,
      undefined
    );

  function flylineChart (Vue) {
    Vue.component(FlylineChart.name, FlylineChart);
  }

  //
  var script$t = {
    name: 'DvConicalColumnChart',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        ref: 'conical-column-chart',
        defaultConfig: {
          /**
           * @description Chart data
           * @type {Array<Object>}
           * @default data = []
           */
          data: [],

          /**
           * @description Chart img
           * @type {Array<String>}
           * @default img = []
           */
          img: [],

          /**
           * @description Chart font size
           * @type {Number}
           * @default fontSize = 12
           */
          fontSize: 12,

          /**
           * @description Img side length
           * @type {Number}
           * @default imgSideLength = 30
           */
          imgSideLength: 30,

          /**
           * @description Column color
           * @type {String}
           * @default columnColor = 'rgba(0, 194, 255, 0.4)'
           */
          columnColor: 'rgba(0, 194, 255, 0.4)',

          /**
           * @description Text color
           * @type {String}
           * @default textColor = '#fff'
           */
          textColor: '#fff',

          /**
           * @description Show value
           * @type {Boolean}
           * @default showValue = false
           */
          showValue: false
        },
        mergedConfig: null,
        column: []
      };
    },

    watch: {
      config() {
        const {
          calcData
        } = this;
        calcData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          calcData
        } = this;
        calcData();
      },

      calcData() {
        const {
          mergeConfig,
          initData,
          calcSVGPath
        } = this;
        mergeConfig();
        initData();
        calcSVGPath();
      },

      mergeConfig() {
        const {
          defaultConfig,
          config
        } = this;
        this.mergedConfig = util_2$1(util_1(defaultConfig, true), config || {});
      },

      initData() {
        const {
          mergedConfig
        } = this;
        let {
          data
        } = mergedConfig;
        data = util_1(data, true);
        data.sort(({
          value: a
        }, {
          value: b
        }) => {
          if (a > b) return -1;
          if (a < b) return 1;
          if (a === b) return 0;
        });
        const max = data[0] ? data[0].value : 10;
        data = data.map(item => ({ ...item,
          percent: item.value / max
        }));
        mergedConfig.data = data;
      },

      calcSVGPath() {
        const {
          mergedConfig,
          width,
          height
        } = this;
        const {
          imgSideLength,
          fontSize,
          data
        } = mergedConfig;
        const itemNum = data.length;
        const gap = width / (itemNum + 1);
        const useAbleHeight = height - imgSideLength - fontSize - 5;
        const svgBottom = height - fontSize - 5;
        this.column = data.map((item, i) => {
          const {
            percent
          } = item;
          const middleXPos = gap * (i + 1);
          const leftXPos = gap * i;
          const rightXpos = gap * (i + 2);
          const middleYPos = svgBottom - useAbleHeight * percent;
          const controlYPos = useAbleHeight * percent * 0.6 + middleYPos;
          const d = `
          M${leftXPos}, ${svgBottom}
          Q${middleXPos}, ${controlYPos} ${middleXPos},${middleYPos}
          M${middleXPos},${middleYPos}
          Q${middleXPos}, ${controlYPos} ${rightXpos},${svgBottom}
          L${leftXPos}, ${svgBottom}
          Z
        `;
          const textY = (svgBottom + middleYPos) / 2 + fontSize / 2;
          return { ...item,
            d,
            x: middleXPos,
            y: middleYPos,
            textY
          };
        });
      }

    }
  };

  /* script */
  const __vue_script__$t = script$t;

  /* template */
  var __vue_render__$t = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-conical-column-chart" }, [
      _c(
        "svg",
        { attrs: { width: _vm.width, height: _vm.height } },
        _vm._l(_vm.column, function(item, i) {
          return _c("g", { key: i }, [
            _c("path", {
              attrs: { d: item.d, fill: _vm.mergedConfig.columnColor }
            }),
            _vm._v(" "),
            _c(
              "text",
              {
                style: "fontSize:" + _vm.mergedConfig.fontSize + "px",
                attrs: {
                  fill: _vm.mergedConfig.textColor,
                  x: item.x,
                  y: _vm.height - 4
                }
              },
              [_vm._v("\n        " + _vm._s(item.name) + "\n      ")]
            ),
            _vm._v(" "),
            _vm.mergedConfig.img.length
              ? _c("image", {
                  attrs: {
                    "xlink:href":
                      _vm.mergedConfig.img[i % _vm.mergedConfig.img.length],
                    width: _vm.mergedConfig.imgSideLength,
                    height: _vm.mergedConfig.imgSideLength,
                    x: item.x - _vm.mergedConfig.imgSideLength / 2,
                    y: item.y - _vm.mergedConfig.imgSideLength
                  }
                })
              : _vm._e(),
            _vm._v(" "),
            _vm.mergedConfig.showValue
              ? _c(
                  "text",
                  {
                    style: "fontSize:" + _vm.mergedConfig.fontSize + "px",
                    attrs: {
                      fill: _vm.mergedConfig.textColor,
                      x: item.x,
                      y: item.textY
                    }
                  },
                  [_vm._v("\n        " + _vm._s(item.value) + "\n      ")]
                )
              : _vm._e()
          ])
        }),
        0
      )
    ])
  };
  var __vue_staticRenderFns__$t = [];
  __vue_render__$t._withStripped = true;

    /* style */
    const __vue_inject_styles__$t = function (inject) {
      if (!inject) return
      inject("data-v-774de7d0_0", { source: ".dv-conical-column-chart {\n  width: 100%;\n  height: 100%;\n}\n.dv-conical-column-chart text {\n  text-anchor: middle;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,mBAAmB;AACrB","file":"main.vue","sourcesContent":[".dv-conical-column-chart {\n  width: 100%;\n  height: 100%;\n}\n.dv-conical-column-chart text {\n  text-anchor: middle;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$t = undefined;
    /* module identifier */
    const __vue_module_identifier__$t = undefined;
    /* functional template */
    const __vue_is_functional_template__$t = false;
    /* style inject SSR */
    

    
    var ConicalColumnChart = normalizeComponent_1(
      { render: __vue_render__$t, staticRenderFns: __vue_staticRenderFns__$t },
      __vue_inject_styles__$t,
      __vue_script__$t,
      __vue_scope_id__$t,
      __vue_is_functional_template__$t,
      __vue_module_identifier__$t,
      browser,
      undefined
    );

  function conicalColumnChart (Vue) {
    Vue.component(ConicalColumnChart.name, ConicalColumnChart);
  }

  function digitalFlop (Vue) {
    Vue.component(DigitalFlop.name, DigitalFlop);
  }

  //
  var script$u = {
    name: 'DvScrollBoard',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        ref: 'scroll-board',
        defaultConfig: {
          /**
           * @description Board header
           * @type {Array<String>}
           * @default header = []
           * @example header = ['column1', 'column2', 'column3']
           */
          header: [],

          /**
           * @description Board data
           * @type {Array<Array>}
           * @default data = []
           */
          data: [],

          /**
           * @description Row num
           * @type {Number}
           * @default rowNum = 5
           */
          rowNum: 5,

          /**
           * @description Header background color
           * @type {String}
           * @default headerBGC = '#00BAFF'
           */
          headerBGC: '#00BAFF',

          /**
           * @description Odd row background color
           * @type {String}
           * @default oddRowBGC = '#003B51'
           */
          oddRowBGC: '#003B51',

          /**
           * @description Even row background color
           * @type {String}
           * @default evenRowBGC = '#003B51'
           */
          evenRowBGC: '#0A2732',

          /**
           * @description Scroll wait time
           * @type {Number}
           * @default waitTime = 2000
           */
          waitTime: 2000,

          /**
           * @description Header height
           * @type {Number}
           * @default headerHeight = 35
           */
          headerHeight: 35,

          /**
           * @description Column width
           * @type {Array<Number>}
           * @default columnWidth = []
           */
          columnWidth: [],

          /**
           * @description Column align
           * @type {Array<String>}
           * @default align = []
           * @example align = ['left', 'center', 'right']
           */
          align: [],

          /**
           * @description Show index
           * @type {Boolean}
           * @default index = false
           */
          index: false,

          /**
           * @description Carousel type
           * @type {String}
           * @default carousel = 'single'
           * @example carousel = 'single' | 'page'
           */
          carousel: 'single'
        },
        mergedConfig: null,
        header: [],
        rowsData: [],
        rows: [],
        widths: [],
        heights: [],
        avgHeight: 0,
        aligns: [],
        animationIndex: 0,
        animationHandler: ''
      };
    },

    watch: {
      config() {
        const {
          stopAnimation,
          calcData
        } = this;
        stopAnimation();
        calcData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          mergedConfig,
          calcWidths,
          calcHeights
        } = this;
        if (!mergedConfig) return;
        calcWidths();
        calcHeights();
      },

      calcData() {
        const {
          mergeConfig,
          calcHeaderData,
          calcRowsData
        } = this;
        mergeConfig();
        calcHeaderData();
        calcRowsData();
        const {
          calcWidths,
          calcHeights,
          calcAligns
        } = this;
        calcWidths();
        calcHeights();
        calcAligns();
        const {
          animation
        } = this;
        animation(true);
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = util_2$1(util_1(defaultConfig, true), config || {});
      },

      calcHeaderData() {
        let {
          header,
          index
        } = this.mergedConfig;

        if (!header.length) {
          this.header = [];
          return;
        }

        header = [...header];
        if (index) header.unshift('#');
        this.header = header;
      },

      calcRowsData() {
        let {
          data,
          index,
          headerBGC,
          rowNum
        } = this.mergedConfig;

        if (index) {
          data = data.map((row, i) => {
            row = [...row];
            const indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</spand>`;
            row.unshift(indexTag);
            return row;
          });
        }

        data = data.map((ceils, i) => ({
          ceils,
          rowIndex: i
        }));
        const rowLength = data.length;

        if (rowLength > rowNum && rowLength < 2 * rowNum) {
          data = [...data, ...data];
        }

        data = data.map((d, i) => ({ ...d,
          scroll: i
        }));
        this.rowsData = data;
        this.rows = data;
      },

      calcWidths() {
        const {
          width,
          mergedConfig,
          rowsData
        } = this;
        const {
          columnWidth,
          header
        } = mergedConfig;
        const usedWidth = columnWidth.reduce((all, w) => all + w, 0);
        let columnNum = 0;

        if (rowsData[0]) {
          columnNum = rowsData[0].ceils.length;
        } else if (header.length) {
          columnNum = header.length;
        }

        const avgWidth = (width - usedWidth) / (columnNum - columnWidth.length);
        const widths = new Array(columnNum).fill(avgWidth);
        this.widths = util_2$1(widths, columnWidth);
      },

      calcHeights(onresize = false) {
        const {
          height,
          mergedConfig,
          header
        } = this;
        const {
          headerHeight,
          rowNum,
          data
        } = mergedConfig;
        let allHeight = height;
        if (header.length) allHeight -= headerHeight;
        const avgHeight = allHeight / rowNum;
        this.avgHeight = avgHeight;
        if (!onresize) this.heights = new Array(data.length).fill(avgHeight);
      },

      calcAligns() {
        const {
          header,
          mergedConfig
        } = this;
        const columnNum = header.length;
        let aligns = new Array(columnNum).fill('left');
        const {
          align
        } = mergedConfig;
        this.aligns = util_2$1(aligns, align);
      },

      async animation(start = false) {
        let {
          avgHeight,
          animationIndex,
          mergedConfig,
          rowsData,
          animation
        } = this;
        const {
          waitTime,
          carousel,
          rowNum
        } = mergedConfig;
        const rowLength = rowsData.length;
        if (rowNum >= rowLength) return;
        if (start) await new Promise(resolve => setTimeout(resolve, waitTime));
        const animationNum = carousel === 'single' ? 1 : rowNum;
        let rows = rowsData.slice(animationIndex);
        rows.push(...rowsData.slice(0, animationIndex));
        this.rows = rows;
        this.heights = new Array(rowLength).fill(avgHeight);
        await new Promise(resolve => setTimeout(resolve, 300));
        this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0));
        animationIndex += animationNum;
        const back = animationIndex - rowLength;
        if (back >= 0) animationIndex = back;
        this.animationIndex = animationIndex;
        this.animationHandler = setTimeout(animation, waitTime - 300);
      },

      stopAnimation() {
        const {
          animationHandler
        } = this;
        if (!animationHandler) return;
        clearTimeout(animationHandler);
      },

      emitEvent(ri, ci, row, ceil) {
        const {
          ceils,
          rowIndex
        } = row;
        this.$emit('click', {
          row: ceils,
          ceil,
          rowIndex,
          columnIndex: ci
        });
      }

    },

    destroyed() {
      const {
        stopAnimation
      } = this;
      stopAnimation();
    }

  };

  /* script */
  const __vue_script__$u = script$u;

  /* template */
  var __vue_render__$u = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-scroll-board" }, [
      _vm.header.length && _vm.mergedConfig
        ? _c(
            "div",
            {
              staticClass: "header",
              style: "background-color: " + _vm.mergedConfig.headerBGC + ";"
            },
            _vm._l(_vm.header, function(headerItem, i) {
              return _c("div", {
                key: headerItem + i,
                staticClass: "header-item",
                style:
                  "\n        height: " +
                  _vm.mergedConfig.headerHeight +
                  "px;\n        line-height: " +
                  _vm.mergedConfig.headerHeight +
                  "px;\n        width: " +
                  _vm.widths[i] +
                  "px;\n      ",
                attrs: { align: _vm.aligns[i] },
                domProps: { innerHTML: _vm._s(headerItem) }
              })
            }),
            0
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.mergedConfig
        ? _c(
            "div",
            {
              staticClass: "rows",
              style:
                "height: " +
                (_vm.height -
                  (_vm.header.length ? _vm.mergedConfig.headerHeight : 0)) +
                "px;"
            },
            _vm._l(_vm.rows, function(row, ri) {
              return _c(
                "div",
                {
                  key: row.toString() + row.scroll,
                  staticClass: "row-item",
                  style:
                    "\n        height: " +
                    _vm.heights[ri] +
                    "px;\n        line-height: " +
                    _vm.heights[ri] +
                    "px;\n        background-color: " +
                    _vm.mergedConfig[
                      row.rowIndex % 2 === 0 ? "evenRowBGC" : "oddRowBGC"
                    ] +
                    ";\n      "
                },
                _vm._l(row.ceils, function(ceil, ci) {
                  return _c("div", {
                    key: ceil + ri + ci,
                    staticClass: "ceil",
                    style: "width: " + _vm.widths[ci] + "px;",
                    attrs: { align: _vm.aligns[ci] },
                    domProps: { innerHTML: _vm._s(ceil) },
                    on: {
                      click: function($event) {
                        return _vm.emitEvent(ri, ci, row, ceil)
                      }
                    }
                  })
                }),
                0
              )
            }),
            0
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$u = [];
  __vue_render__$u._withStripped = true;

    /* style */
    const __vue_inject_styles__$u = function (inject) {
      if (!inject) return
      inject("data-v-309bd8aa_0", { source: ".dv-scroll-board {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  color: #fff;\n}\n.dv-scroll-board .text {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .header {\n  display: flex;\n  flex-direction: row;\n  font-size: 15px;\n}\n.dv-scroll-board .header .header-item {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows {\n  overflow: hidden;\n}\n.dv-scroll-board .rows .row-item {\n  display: flex;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows .ceil {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .rows .index {\n  border-radius: 3px;\n  padding: 0px 3px;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,WAAW;AACb;AACA;EACE,eAAe;EACf,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB;AACA;EACE,aAAa;EACb,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,eAAe;EACf,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;EACvB,oBAAoB;AACtB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,eAAe;EACf,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,gBAAgB;AAClB","file":"main.vue","sourcesContent":[".dv-scroll-board {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  color: #fff;\n}\n.dv-scroll-board .text {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .header {\n  display: flex;\n  flex-direction: row;\n  font-size: 15px;\n}\n.dv-scroll-board .header .header-item {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows {\n  overflow: hidden;\n}\n.dv-scroll-board .rows .row-item {\n  display: flex;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows .ceil {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .rows .index {\n  border-radius: 3px;\n  padding: 0px 3px;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$u = undefined;
    /* module identifier */
    const __vue_module_identifier__$u = undefined;
    /* functional template */
    const __vue_is_functional_template__$u = false;
    /* style inject SSR */
    

    
    var ScrollBoard = normalizeComponent_1(
      { render: __vue_render__$u, staticRenderFns: __vue_staticRenderFns__$u },
      __vue_inject_styles__$u,
      __vue_script__$u,
      __vue_scope_id__$u,
      __vue_is_functional_template__$u,
      __vue_module_identifier__$u,
      browser,
      undefined
    );

  function scrollBoard (Vue) {
    Vue.component(ScrollBoard.name, ScrollBoard);
  }

  //
  var script$v = {
    name: 'DvScrollRankingBoard',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        ref: 'scroll-ranking-board',
        defaultConfig: {
          /**
           * @description Board data
           * @type {Array<Object>}
           * @default data = []
           */
          data: [],

          /**
           * @description Row num
           * @type {Number}
           * @default rowNum = 5
           */
          rowNum: 5,

          /**
           * @description Scroll wait time
           * @type {Number}
           * @default waitTime = 2000
           */
          waitTime: 2000,

          /**
           * @description Carousel type
           * @type {String}
           * @default carousel = 'single'
           * @example carousel = 'single' | 'page'
           */
          carousel: 'single',

          /**
           * @description Value unit
           * @type {String}
           * @default unit = ''
           * @example unit = 'ton'
           */
          unit: ''
        },
        mergedConfig: null,
        rowsData: [],
        rows: [],
        heights: [],
        animationIndex: 0,
        animationHandler: ''
      };
    },

    watch: {
      config() {
        const {
          stopAnimation,
          calcData
        } = this;
        stopAnimation();
        calcData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          mergedConfig,
          calcHeights
        } = this;
        if (!mergedConfig) return;
        calcHeights(true);
      },

      calcData() {
        const {
          mergeConfig,
          calcRowsData
        } = this;
        mergeConfig();
        calcRowsData();
        const {
          calcHeights
        } = this;
        calcHeights();
        const {
          animation
        } = this;
        animation(true);
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = util_2$1(util_1(defaultConfig, true), config || {});
      },

      calcRowsData() {
        let {
          data,
          rowNum
        } = this.mergedConfig;
        data.sort(({
          value: a
        }, {
          value: b
        }) => {
          if (a > b) return -1;
          if (a < b) return 1;
          if (a === b) return 0;
        });
        const value = data.map(({
          value
        }) => value);
        const max = Math.max(...value) || 0;
        data = data.map((row, i) => ({ ...row,
          ranking: i + 1,
          percent: row.value / max * 100
        }));
        const rowLength = data.length;

        if (rowLength > rowNum && rowLength < 2 * rowNum) {
          data = [...data, ...data];
        }

        data = data.map((d, i) => ({ ...d,
          scroll: i
        }));
        this.rowsData = data;
        this.rows = data;
      },

      calcHeights(onresize = false) {
        const {
          height,
          mergedConfig
        } = this;
        const {
          rowNum,
          data
        } = mergedConfig;
        const avgHeight = height / rowNum;
        this.avgHeight = avgHeight;
        if (!onresize) this.heights = new Array(data.length).fill(avgHeight);
      },

      async animation(start = false) {
        let {
          avgHeight,
          animationIndex,
          mergedConfig,
          rowsData,
          animation
        } = this;
        const {
          waitTime,
          carousel,
          rowNum
        } = mergedConfig;
        const rowLength = rowsData.length;
        if (rowNum >= rowLength) return;
        if (start) await new Promise(resolve => setTimeout(resolve, waitTime));
        const animationNum = carousel === 'single' ? 1 : rowNum;
        let rows = rowsData.slice(animationIndex);
        rows.push(...rowsData.slice(0, animationIndex));
        this.rows = rows;
        this.heights = new Array(rowLength).fill(avgHeight);
        await new Promise(resolve => setTimeout(resolve, 300));
        this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0));
        animationIndex += animationNum;
        const back = animationIndex - rowLength;
        if (back >= 0) animationIndex = back;
        this.animationIndex = animationIndex;
        this.animationHandler = setTimeout(animation, waitTime - 300);
      },

      stopAnimation() {
        const {
          animationHandler
        } = this;
        if (!animationHandler) return;
        clearTimeout(animationHandler);
      }

    },

    destroyed() {
      const {
        stopAnimation
      } = this;
      stopAnimation();
    }

  };

  /* script */
  const __vue_script__$v = script$v;

  /* template */
  var __vue_render__$v = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: _vm.ref, staticClass: "dv-scroll-ranking-board" },
      _vm._l(_vm.rows, function(item, i) {
        return _c(
          "div",
          {
            key: item.toString() + item.scroll,
            staticClass: "row-item",
            style: "height: " + _vm.heights[i] + "px;"
          },
          [
            _c("div", { staticClass: "ranking-info" }, [
              _c("div", { staticClass: "rank" }, [
                _vm._v("No." + _vm._s(item.ranking))
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "info-name" }, [
                _vm._v(_vm._s(item.name))
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "ranking-value" }, [
                _vm._v(_vm._s(item.value + _vm.mergedConfig.unit))
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "ranking-column" }, [
              _c(
                "div",
                {
                  staticClass: "inside-column",
                  style: "width: " + item.percent + "%;"
                },
                [_c("div", { staticClass: "shine" })]
              )
            ])
          ]
        )
      }),
      0
    )
  };
  var __vue_staticRenderFns__$v = [];
  __vue_render__$v._withStripped = true;

    /* style */
    const __vue_inject_styles__$v = function (inject) {
      if (!inject) return
      inject("data-v-e8124c14_0", { source: ".dv-scroll-ranking-board {\n  width: 100%;\n  height: 100%;\n  color: #fff;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .row-item {\n  transition: all 0.3s;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-info {\n  display: flex;\n  width: 100%;\n  font-size: 13px;\n}\n.dv-scroll-ranking-board .ranking-info .rank {\n  width: 40px;\n  color: #1370fb;\n}\n.dv-scroll-ranking-board .ranking-info .info-name {\n  flex: 1;\n}\n.dv-scroll-ranking-board .ranking-column {\n  border-bottom: 2px solid rgba(19, 112, 251, 0.5);\n  margin-top: 5px;\n}\n.dv-scroll-ranking-board .ranking-column .inside-column {\n  position: relative;\n  height: 6px;\n  background-color: #1370fb;\n  margin-bottom: 2px;\n  border-radius: 1px;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-column .shine {\n  position: absolute;\n  left: 0%;\n  top: 2px;\n  height: 2px;\n  width: 50px;\n  transform: translateX(-100%);\n  background: radial-gradient(#28f8ff 5%, transparent 80%);\n  animation: shine 3s ease-in-out infinite alternate;\n}\n@keyframes shine {\n80% {\n    left: 0%;\n    transform: translateX(-100%);\n}\n100% {\n    left: 100%;\n    transform: translateX(0%);\n}\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;EACZ,WAAW;EACX,gBAAgB;AAClB;AACA;EACE,oBAAoB;EACpB,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,WAAW;EACX,eAAe;AACjB;AACA;EACE,WAAW;EACX,cAAc;AAChB;AACA;EACE,OAAO;AACT;AACA;EACE,gDAAgD;EAChD,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,yBAAyB;EACzB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,QAAQ;EACR,WAAW;EACX,WAAW;EACX,4BAA4B;EAC5B,wDAAwD;EACxD,kDAAkD;AACpD;AACA;AACE;IACE,QAAQ;IACR,4BAA4B;AAC9B;AACA;IACE,UAAU;IACV,yBAAyB;AAC3B;AACF","file":"main.vue","sourcesContent":[".dv-scroll-ranking-board {\n  width: 100%;\n  height: 100%;\n  color: #fff;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .row-item {\n  transition: all 0.3s;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-info {\n  display: flex;\n  width: 100%;\n  font-size: 13px;\n}\n.dv-scroll-ranking-board .ranking-info .rank {\n  width: 40px;\n  color: #1370fb;\n}\n.dv-scroll-ranking-board .ranking-info .info-name {\n  flex: 1;\n}\n.dv-scroll-ranking-board .ranking-column {\n  border-bottom: 2px solid rgba(19, 112, 251, 0.5);\n  margin-top: 5px;\n}\n.dv-scroll-ranking-board .ranking-column .inside-column {\n  position: relative;\n  height: 6px;\n  background-color: #1370fb;\n  margin-bottom: 2px;\n  border-radius: 1px;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-column .shine {\n  position: absolute;\n  left: 0%;\n  top: 2px;\n  height: 2px;\n  width: 50px;\n  transform: translateX(-100%);\n  background: radial-gradient(#28f8ff 5%, transparent 80%);\n  animation: shine 3s ease-in-out infinite alternate;\n}\n@keyframes shine {\n  80% {\n    left: 0%;\n    transform: translateX(-100%);\n  }\n  100% {\n    left: 100%;\n    transform: translateX(0%);\n  }\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$v = undefined;
    /* module identifier */
    const __vue_module_identifier__$v = undefined;
    /* functional template */
    const __vue_is_functional_template__$v = false;
    /* style inject SSR */
    

    
    var ScrollRankingBoard = normalizeComponent_1(
      { render: __vue_render__$v, staticRenderFns: __vue_staticRenderFns__$v },
      __vue_inject_styles__$v,
      __vue_script__$v,
      __vue_scope_id__$v,
      __vue_is_functional_template__$v,
      __vue_module_identifier__$v,
      browser,
      undefined
    );

  function scrollRankingBoard (Vue) {
    Vue.component(ScrollRankingBoard.name, ScrollRankingBoard);
  }

  /**
   * IMPORT COMPONENTS
   */
  /**
   * USE COMPONENTS
   */

  function datav (Vue) {
    Vue.use(fullScreenContainer);
    Vue.use(loading); // border box

    Vue.use(borderBox1);
    Vue.use(borderBox2);
    Vue.use(borderBox3);
    Vue.use(borderBox4);
    Vue.use(borderBox5);
    Vue.use(borderBox6);
    Vue.use(borderBox7);
    Vue.use(borderBox8);
    Vue.use(borderBox9);
    Vue.use(borderBox10); // decoration

    Vue.use(decoration1);
    Vue.use(decoration2);
    Vue.use(decoration3);
    Vue.use(decoration4);
    Vue.use(decoration5);
    Vue.use(decoration6);
    Vue.use(decoration7);
    Vue.use(decoration8);
    Vue.use(decoration9);
    Vue.use(decoration10); // charts

    Vue.use(charts);
    Vue.use(activeRingChart);
    Vue.use(capsuleChart);
    Vue.use(waterLevelPond);
    Vue.use(percentPond);
    Vue.use(flylineChart);
    Vue.use(conicalColumnChart);
    Vue.use(digitalFlop);
    Vue.use(scrollBoard);
    Vue.use(scrollRankingBoard);
  }

  Vue.use(datav);

}));
