## ✨背景
哈喽，我是`JLong`😄，日常开发中，我们常常会遇到文本省略场景，业界常见UI库如Elment-ui中el-table提供show-overflow-tooltip属性支持内容过长时候省略显示tooltip，但经常有**一些场景用户希望可以在tooltip上面选中复制内容**，当前没看到比较适用的工具支持单行或者多行文本省略的同时，提示框自适应`（自行感知文本是否省略决定显隐）`。

这篇文章总结梳理一下开发该组件遇到的知识点，如`如何文本省略实现、如何判断文本是否省略、resize-observer-polyfill补丁监听resize`等，完整代码下文附上。

## ✨文本省略
简单普及一下各种文本省略方法


✔单行省略

```
<div class="text" :title="content">
    {{ content }}
</div>
.text {
    width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
}

```
`注意`：需要宽度，没宽度也没办法省略，会出现无效情况

✔多行省略

```
<div class="text" :title="content">
    {{ content }}
</div>
.text {
    width: 100px;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
```

浏览器对`-webkit-line-clamp`的支持情况与浏览器的版本和厂商有关。以下是浏览器对-webkit-line-clamp的支持情况：
- Chrome：从 Chrome 56 开始支持 -webkit-line-clamp 属性，但需要启用 CSS.WEBKIT.LINE_CLAMP 标志。在 Chrome 61 及更高版本中，该属性已默认启用。
- Safari：从 Safari 9.1 开始支持 -webkit-line-clamp 属性。在 Safari 10 及更高版本中，该属性已默认启用。
- Opera：从 Opera 33 开始支持 -webkit-line-clamp 属性。
- Edge：从 Edge 15 开始支持 -webkit-line-clamp 属性。

需要注意的是，虽然 -webkit-line-clamp 属性在某些浏览器中受到支持，但它在其他浏览器中可能不受支持。因此，在使用 -webkit-line-clamp 属性时，最好使用 CSS 前缀或 JavaScript 方法来确保在所有浏览器中都能正确地显示文本。

其他就不汇总了，这里用到了这两种，其他还有限制宽高的，截取判断的，js判断的，伪元素等，有兴趣可以自行了解下

## ✨ 判断文本是否溢出
参考[Determine if an HTML element's content overflows](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F143815%2Fdetermine-if-an-html-elements-content-overflows%2F29689110 "https://stackoverflow.com/questions/143815/determine-if-an-html-elements-content-overflows/29689110")最高赞回答，主要有两种思路：
1. 根据元素属性做判断：

`单行`：根据clientWidth和scrollWidth做判断，后者大说明溢出

`多行`：根据clientHeight和scrollHeight做判断，后者大说明溢出

> `el.clientWidth` 表示元素的内部宽度，包括内边距（padding），但不包括边框（border）和外边距（margin）。
> 
> `el.scrollWidth` 表示元素的可滚动宽度，即元素的内容宽度加上溢出部分的宽度。
> 
> 如果一个元素的 `el.clientWidth` 小于 `el.scrollWidth`，则说明该元素的内容溢出了其内部宽度，出现了文本溢出的情况，多行同理。

2. 将div克隆一份但不显示（visibility:hidden）,比较两者的宽度，如果副本的宽度大于元素本身的宽度，则表示溢出，否则未溢出`（这种方式注意销毁克隆元素）`


## ✨ 防抖+监听
防抖常见直接用` lodash库 `的`debounce` 即可
监听直接用window.addElementListener是不合适的，因为只需要监听元素宽高变化即可，这里使用`ResizeObserver`
> ResizeObserver是一个用于监听元素大小变化事件的API，它可以在元素大小改变时触发回调函数。这个API主要应用于响应式设计，当页面布局需要动态调整时非常有用。然而，使用ResizeObserver API时需要注意，频繁调用getBoundingClientRect​、getComputedStyle等API会导致浏览器重排（reflow），从而影响页面性能。

`ps:`存在兼容性问题，不过可以用`resize-observer-polyfill`插件解决兼容性问题



##  ✨代码（可直接复制）

```
<template>
    <el-popover
        :placement="placement"
        :disabled="!isShowToolTip"
        :trigger="trigger">
        <p
            ref="text"
            slot="reference"
            :class="[row === 1 ? 'single' : 'multiline']"
            :style="`-webkit-line-clamp: ${row === 1 ? 'none' : row}`"
            v-html="text">
        </p>
        <p v-html="text" :style="`text-align: ${align}; max-width: ${maxW}px`;"></p>
    </el-popover>
</template>
<script>
import ResizeObserver from 'resize-observer-polyfill'
import _ from 'lodash'
export default {
    props: {
        text: { type: String, default: '' },
        placement: { type: String, default: 'top' },
        trigger: { type: String, default: 'hover' },
        align: { type: String, default: 'left' },
        row: { type: [Number, String], default: 1 }, // 行数
        maxW: { type: [Number, String], default: 400 },
        resize: { type: Boolean, default: true } // 是否开启resize监听
    },
    data () {
        return { isShowToolTip: false, ro: null }
    },
    methods: {
        // 省略判断
        determine () {
            const node = this.$refs.text || null
            if (!node) return
            this.isShowToopTip = this.row === 1
                ? (node.clientWidth < node.scrollWidth) // 单行
                : (node.clientHeight < node.scrollHeight) // 多行
        },
        // 开启resize监听
        monitor () {
            if (this.resize) {
                this.ro = new ResizeObserver(_.debounce(this.determine, 500))
                this.ro.observe(this.$refs.text)
            } else {
                this.determine()
            }
        }
    },
    mounted () {
        this.isShowToolTip = false
        this.ro = null
        this.monitor()
    },
    beforeDestroy () {
        if (!this.resize || !this.ro || !this.$refs.text) return
        this.ro.unobserve(this.$refs.text)
    }
}
</script>
<style lang="scss" scoped>
.single {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.multiline {
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
</style>
```











