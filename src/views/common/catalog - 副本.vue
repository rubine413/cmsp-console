<template>
    <div class="catalog-list">
        <div class="catalog-node" v-for="(item, index) in catalogNodes" :class="{ 'catalog-node-empty': !item.name }" 
            :draggable="!!item.name"
            @dragover.prevent
            @dragstart.stop="handleDragStart"
            @drop.stop="handleDrop"
            @dragenter.stop="handleDragEnter"
            @dragleave.stop="handleDragLeave"
            @dragend.prevent="handleDragEnd">
            <div class="catalog-handle">
                <span class="catalog-fold"></span><p>{{ item.name }}</p>
            </div>
            <catalog-node :node="item.children" :vm.sync="activeVm" v-if="item.children && item.children.length>0" :idx="index"></catalog-node>
        </div>
    </div>
</template>

<script>
import { addClass, removeClass, hasClass } from './../../assets/js/dom';

export default {
    name: 'catalog-node',
    props: {
        vm: { 
            type: Object,
            default: () => {
                return {};
            } 
        },
        node: {
            type: Array,
            default: () => {
                return [];
            }
        },
        idx: {
            type: Number,
            default: 0
        }
    },
    watch: {
        activeVm() {
            this.$emit('update:vm', this.activeVm);
        }
    },
    data() {
        return {
            activeVm: this.vm
        };
    },
    computed: {
        catalogNodes () { 
            let nodes = [];
            this.node.forEach(node => {
                nodes.push({}, node);
            });
            nodes.push({});
            return nodes;
        },
        isParent () { // 拖放限制 1：判断“我”是否为被拖动节点的父节点
            return this === this.activeVm.$parent;
        },
        isNextToMe () { // 拖放限制 2：判断“我”是否为被拖动节点的相邻节点
            return this.$parent === this.activeVm.$parent && Math.abs(this.idx - this.activeVm.idx) === 1;
        }
    },
    methods: {
        handleDragStart(e) {
            let target = e.target;
            let parent = target.parentNode;
            let clientRect = parent.getBoundingClientRect();
            // addClass(parent, 'catalog-node-dragging');


            this.activeVm = this; // 设置本组件为当前正在拖动的实例，此举将同步 sync 到所有 TreeNode 实例
            
            // this.$el.style.backgroundColor = 'silver';
        },
        handleDrop() {
            // this.clearBgColor(); // 此时 this 为目的地节点，vm 才是被拖动节点
            // if (!this.isAllowToDrop) return;

            // // 无论如何都直接删除被拖动节点
            // this.vm.$parent.node.children.$remove(this.vm.node);

            // // 情况 1：拖入空节点，成其兄弟（使用 splice 插入节点）
            // if (!this.node.name) {
            //     this.$parent.node.children.splice(this.idx / 2, 0, this.vm.node);
            //     return;
            // }

            // // 情况2：拖入普通节点，成为其子
            // if (!this.node.children) this.$set('node.children', []); // 须用 $set 引入双向绑定
            // this.node.children.push(this.vm.node);
        },
        handleDragEnter(e) { // 允许拖放才会显示样式
            let target = e.target;
            addClass(target, 'catalog-handle-hover');
            console.log('enter', target);
            let parent = target.parentNode;
            let clientRect = parent.getBoundingClientRect();
            console.log('handleDragEnter', clientRect);
        },
        handleDragLeave(e) {
            let target = e.target;
            removeClass(target, 'catalog-handle-hover');
            // this.clearBgColor();
        },
        handleDragEnd(e) {
            let target = e.target;
            let parent = target.parentNode;
            let clientRect = parent.getBoundingClientRect();
            console.log('handleDragEnd', clientRect);
            removeClass(parent, 'catalog-node-dragging');
            // this.clearBgColor();
        }
    },
    mounted() {}
};
</script>


<style lang="stylus" scoped>   
@import '../../style/global.styl'

.catalog-list
    display block
    position relative
    margin 0
    padding 0
    
    .catalog-list
        padding-left 30px
    
.catalog-node
    display block
    position relative
    font-size 13px
    margin 0        
    
.catalog-handle
    display flex
    height 30px    
    line-height 20px
    padding 5px 10px
    color #333
    border 1px solid #ccc
    background #fafafa
    background linear-gradient(top, #fafafa 0%, #eee 100%)
    border-radius 3px
    transition all .2s ease
    
    .catalog-node-empty &
        height 6px
        line-height 1
        padding 0
        background transparent
        border none
        border-radius 0
        
        &.catalog-handle-hover
            background-origin padding-box
            background #F2FBFF
            padding 5px 0
            height 30px
            // margin 5px 0
            // border 1px dashed #ccc
            border-radius 3px

.catalog-node-dragging
    position absolute
</style>
