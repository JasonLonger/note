✨在日常项目中，技术栈为element-ui，发现常见el-table需要用到虚拟列表，所以结合一下，输出一个虚拟列表 + El-table

✨代码（可直接复制）
<template>
    <div class="box" :style="{ height: computedBoxHeight }">
        <!-- 表头占位 -->
        <el-table class="head-table infinite-list" :height=estimatedItemSize :data="[]">
            <el-table-column
                v-for="item in column"
                :key="item.prop + 'head'"
                :prop="item.prop"
                :width="item.width"
                :align="align">
            </el-table-column>
        </el-table>
        <div class="virtual-table">
            <!-- 可视区域容器 -->
            <div
                class="infinite-list-container"
                ref="list"
                :style="{ height: computedListHeight, 'overflow-y': overflowY }"
                @scroll="scrollEvent">
                <!-- 容器内占位，高度为总列表高度，用于形成滚动条 -->
                <div ref="phantom" class="infinite-list-phantom"></div>
                <!-- 列表项渲染区域 -->
                <div ref="content" class="infinite-list">
                    <el-table class="content-table" :data="visibleData">
                        <template class="infinite-list-item" ref="items">
                            <el-table-column
                                v-for="item in column"
                                :key="item.prop + 'content'"
                                :width="item.width"
                                :label="item.label"
                                :id="item._index"
                                :prop="item.prop"
                                :align="align>
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
