✨在日常项目中，技术栈为element-ui，发现常见el-table需要用到虚拟列表，所以结合一下，输出一个虚拟列表 + El-table

✨代码（可直接复制）
// 虚拟列表 + El-table
<template>
    <div class="box" :style="{ height: computedBoxHeight }">
        <!-- 表头占位：由于正常虚拟列表无法固定表头，所以这里额外添加一个el-table作为表头占位 -->
        <el-table class="head-table infinite-list" :height=estimatedItemSize :data="[]">
            <el-table-column
                v-for="item in column"
                :key="item.prop + 'head'"
                :prop="item.prop"
                :width="item.width"
                :align="align">
            </el-table-column>
        </el-table>
        <div class="virtual-table" ref='virtualTable'>
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
                        <template class="infinite-list-item">
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
<script>
export default {
    name: 'VirtualTable',
    props: {
        // 数据源,参考el-table写法传入即可
        dataSource: {
            type: Array,
            default: () => []
        },
        // table-column,参考el-table写法传入即可
        column: {
            type: Array,
            default: () => []
        },
        // 缓冲区个数，渲染项 = 可视项 + 2 * 缓冲区个数，算法可在下面调整
        bufferNum: {
            type: Number,
            default: 1
        },
        // 可显项个数
        visibleCount: {
            type: Number
            default: 6
        },
        // 字段偏移
        align: {
            type: String,
            default: 'left'
        }
    },
    watch: {
        _listData () {
            // 监听数据，初始化scrollTop
            if (this.$refs.list) this.$refs.list.scrollTop = 0
            this.$nextTick(() => {
                if (this.$refs.virtualTable) {
                    // 兼容不同分辨率下的高度
                    const node = this.$refs.virtualTable.getElementsByClassName('el-table__row')[0]
                    if (node) this.estimatedItemSize = node.offsetHeight
                }
            })
        }
    },
    computed: {
        // 处理总数据
        _listData () {
            return this.dataSource.map((item, index) => {
                return {
                    _index: `_${index}`,
                    ...item
                }
            })
        },
        // table高度 = （列表项 + 表头）* estimatedItemSize
        height () {
            return (this.visibleCount + 1) * this.estimatedItemSize
        },
        computedBoxHeight () {
            const emptyH = 60 // el-table空盒子默认高60
            const tableHeadH = 48 // 表头高度默认48
            // 兼容空项动态高度
            return this.dataSource.length > 0 ? (this.height + 'px') : emptyH + tableHeadH + 'px'
        },
        computedListHeight () {
            const emptyH = 60
            return this.dataSource.length > 0 ? (this.height - this.estimatedItemSize + 'px') : emptyH + 'px'
        },
        overFlowY () {
            return this._listData.length > this.visibleCount ? 'auto' : 'hidden'
        },
        /*
            支持平滑滚动，提供缓冲区，上方above 下方below
        */
        // 上方缓冲区数量
        aboveCount () {
            const len = this.dataSource.length
            const num = this.bufferNum
            if (this.start < num) return this.start
            if (this.start >= num && this.end + num <= len) return num
            return 2 * num - (len - this.end)
        },
        // 下方缓冲区数量
        belowCount () {
            return 2 * this.bufferNum - this.aboveCount
        },
        // 可显示项
        visibleData () {
            const start = this.start - this.aboveCount
            const end = this.end + this.belowCount
            // 不算很长就关闭列表渲染
            if (this.dataSource.length <= 2 * this.bufferNum + this.visibleCount) return this._listData
            return this._listData.slice(start, end)
        },
        // 扩展item
        positions () {
            return this._listData.map((d, index) => {
                index,
                height: this.estimatedItemSize,
                top: index * this.estimatedItemSize,
                bottom: (index + 1) * this.estimatedItemSize
            })
        }
    },
    data () {
        return {
            start: 0, // 起始索引
            end: 0, // 结束索引
            // 预估高度，参考el-table每项高度，如后续扩展撑开，可配
            estimatedItemSize: 47
        }
    },
    methods: {
        // 获取列表起始索引
        getStartIndex (scrollTop = 0) {
            // 二分法查找
            return this.binarySearch(this.positions, scrollTop)
        },
        // 二分查找，找出列表项bottom小于滚动高度的项
        binarySearch (list, value) {
            let start = 0
            let end = list.length - 1
            let tempIndex = null

            while (start <= end) {
                const midIndex = parseInt((start + end) / 2)
                const midValue = list[midIndex].bottom
                if (midValue === value) return midIndex + 1
                if (midValue < value) start = midIndex + 1
                if (midValue > value) {
                    if (tempIndex === null || tempIndex > midIndex) tempIndex = midIndex
                    end = end - 1
                }
            }
            return tempIndex
        },
        // 获取列表项的当前尺寸
        updateItemSize () {
            const nodes = this.$refs.virtualTable.getElementsByClassName('el-table-row')
            nodes.forEach((node) => {
                // 通过getBoundingClientRect api获取dom节点相关位置信息
                const rect = node.getBoundingClientRect()
                const height = rect.height
                const index = +node.id.slice(1)
                const oldHeight = this.positions[index]?.height
                const dValue = oldHeight - height
                // 存在差值，更新每一项的位置信息并缓存
                if (dValue) {
                    this.positions[index].bottom = this.positions[index]?.bottom - dValue
                    this.positions[index].height = height
                    for (let k = index + 1; k < this.positions.length; k++) {
                        this.positions[k].top = this.positions[k - 1].bottom
                        this.positions[k].bottom = this.positions[k].bottom - dValue
                    }
                }
            })
        },
        // 当前偏移量 = scrollTop - (scrollTop % itemSize), 算法是这个，加上缓冲区后，往上移 aboveCount * estimatedItemSize 距离
        setStartOffset () {
            let startOffset = 0
            if (this.start > -1) {
                const aboveCountSize = this.positions[this.start - this.aboveCount] ? this.positions[this.start - this.aboveCount]?.top : 0
                const size = this.positions[this.start]?.top - aboveCountSize
                startOffset = this.
            }
            this.$refs.content.style.transform = `translate3d(0, ${startOffset}px, 0)`
        },
        // 滚动事件
        scrollEvent () {
            const scrollTop = this.$refs.list.scrollTop // 当前滚动位置
            this.start = this.getStartIndex(scrollTop) // 开始索引
            this.end = this.start + this.visibleCount // 结束索引
            this.setStartOffset() // 获取当前偏移量
        }
    },
    mounted () {
        // 初始化
        this.start = 0
        this.end = this.start + this.visibleCount
    },
    // 使用vue update钩子函数，在数据更新时候触发，获取列表每项的位置信息并缓存
    updated () {
        this.$nextTick(function () {
            const nodes = this.$refs.virtualTable.getElementsByClassName('el-table-row')
            if (!nodes || !nodes.length)  return
            this.updateItemSize() // 获取真实元素大小，修改对应尺寸缓存
            const height = this.positions[this.positions.length - 1]?.bottom // 列表总高度 = 列表最后项bottom
            this.$refs.phantom.style.height = height + 'px'
            this.setStartOffset() // 更新真实偏移量
        })
    }
}
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    margin: 10px 0;
    position: relative;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    .head-table {
        float: left;
        ::v-deep .el-table__body-wrapper { // 隐藏表头warpper
            display: node;
        }
    }

}
.virtual-table {
    width: 100%;
    position: relative;
    margin-top: 48px;
    float: left;
    border-bottom: 1px solid #ebeef5;
    ::v-deep .el-table__row >td {
        border: none;
    }
    .content-table {
        ::v-deep .el-table__header-wrapper {
            display: none;
        }
    }
}
.infinite-list-container {
    position: relative;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
        width: 3px;
    }
    &::-webkit-scrollbar-button {
        display: none;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(144, 147, 153, 0.3);
        cursor: pointer;
        border-radius: 4px;
    }
    &::-webkit-scrollbar-corner {
        display: none;
    }
    &::-webkit-resizer {
        display: none;
    }
}
.infinite-list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
}
.infinite-list {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    ::v-deep .el-table__body-wrapper {
        overflow-x: hidden;
    }
}
.infinite-list-item {
    padding: 5px;
    color: #555;
    box-sizing: border-box;
    border-bottom: 1px solid #999;
}
::v-deep .virtual-table tbody tr:hover>td {
    background-color: #ffffff!important;
}
</style>


✨使用
<VirtualTable class="xxx" :dataSource="xxx" :column="xxx" align="center"></VirtualTable>
