✨背景：
适用于需要高亮提示的场景，如：


✨方法有很多

1.  裁剪页面的图片，定位到对应位置（不支持滚动条页面，适合静态页面）
1.  canvas画出镂空效果（较复杂）
1.  纯CSS实现了镂空效果（推荐，较简单，效果也很好，如box-shadow实现）
1.  借助第三方插件库

这里介绍用`box-shadow`实现效果：

 1️⃣根据指定ip元素获取元素属性


```
// src/util/tools.js 
/** 
 * @description 获取执行ip元素属性 
 * @param {String} 执行ip 
 * @returns {Object} 位置属性与宽高 
*/ 
export const getObjXy = function (id) { 
    const xy = document.getElementById(id)?.getBoundingClientRect() || {} 
    const top = xy.top - document.documentElement.clientTop + document.documentElement.scrollTop 
    // clientTop 在IE67中始终为2，其他高级点的浏览器为0 
    const bottom = xy.bottom 
    const left = xy.left - document.documentElement.clientLeft + document.documentElement.scrollLeft 
    const right = xy.right 
    const width = xy.width || right - left 
    //IE67不存在width，使用right - left获取 
    const height = xy.height || bottom - top 
    return { top, right, bottom, left, width, height } 
}
```
2️⃣镂空遮罩高亮组件

```
// hightLightPrompt.vue
<template>
    <div
        class="cover"
        v-if="visible"
        @click="coverCancel">
        <div
         class="canvas"
         :style="{
             left: attr.left + 'px',
             top: attr.top + 'px',
             width: attr.width + 'px',
             height: attr.height + 'px'         
         }">
             <div class="popper">
                 <p class="text">
                     // do some thing
                 </p>
                 <el-button @click="cancel">下一步</el-button>
             </div>
         </div>
    </div>
<template>
<script>
import { getObjXy } from '@/util/tools.js'
export default {
    props: {
        id: {xxx},
        content: {xxx},
        visible: {xxx}            
    },
    computed: {
        attr() {
            return getObjXy(this.id)        
        }    
    },
    methods: {
        cancel () {
            this.$emit('callback')        
        },
        coverCancel () { // 点击遮罩回调
            this.$emit('coverCallback')        
        }
    }
}
</script>
<style lang="scss" scoped>
.cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 4999;
    .canvas {
        position: absolute;
        width: 200px;
        height: 55px;
        top: 340px;
        z-index: 9999; // 保证最高层
        box-shadow: 0 0 0 999vw rgba(0, 0, 0, .8); // 阴影镂空
        .popper {
            // 实现想要的效果        
        }
    }
}

</style>
```
 3️⃣引入高亮组件

```
// App.vue
<HightLightPrompt
 :visible="visible"
 :id="xxx"
 :content="xxx"
 :callback="callback"
 :coverCallback="visible = false">
</HighLightPrompt>
...
// 通过localStorage存储状态实现首次登陆高亮提示，完美方案是和后端配合，这里仅扩展纯前端。
methods: {
    callback () {
        this.visible = false
        localStorage.setItem('xxx', false)    
    }
}，
mounted () {
  if (!localStorage.getItem('xxx')) this.visible = true    
}
```


