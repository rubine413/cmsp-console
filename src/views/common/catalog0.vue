<template>
    <div class="catalog-node" :class="{ 'catalog-node-empty': !node.name }" 
        :draggable="!!node.name"
        @dragover.prevent
        @dragstart.stop="handleDragStart"
        @drop.stop="handleDrop"
        @dragenter.stop="handleDragEnter"
        @dragleave.stop="handleDragLeave"
        @dragend.prevent="handleDragEnd">
        <div class="catalog-handle">
            <span class="catalog-fold"></span><p>{{ node.name }}</p>
        </div>
        <div class="catalog-list" v-if="children && children.length>0">
            <catalog-node :node="item" v-for="(item, index) in children" :vm.sync="activeVm"  :idx="index"></catalog-node>
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
            type: Object,
            default: () => {
                return {};
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
        children () {
            let { children } = this.node;
            if (!children || !children.length) return [];
          
            let nodes = [];
            children.forEach(child => nodes.push({}, child));
            nodes.push({});
            // 最后生成 [E1, N1, E2, N2, E3, N3, E4]（其中 N 表示节点，E 表示空节点）            
            return nodes;
        },
        isParent () { // 拖放限制 1：判断“我”是否为被拖动节点的父节点
            return this === this.vm.$parent;
        },
        isNextToMe () { // 拖放限制 2：判断“我”是否为被拖动节点的相邻节点
            return this.$parent === this.vm.$parent && Math.abs(this.idx - this.vm.idx) === 1;
        },
        isMeOrMyAncestor () { // 拖放限制 3：判断被拖动节点是否为“我”自身或“我”的祖先
            var p = this;
            while (p) {
                if (this.vm === p) return true;
                p = p.$parent;
            }
            return false;
        },
        isAllowToDrop () { // 上述拖放限制条件的综合
            return !(this.isParent || this.isNextToMe || this.isMeOrMyAncestor);
        }
    },
    methods: {
        removeHoverClass(e) {
            let target = e.target;
            while (target) {
                if (hasClass(target, 'catalog-handle')) {
                    removeClass(target, 'catalog-handle-hover');
                    break;
                }                
                target = target.parentNode;
            }
        },
        addHoverClass(e) {
            let target = e.target;
            while (target) {
                if (target.nodeName === 'P') {
                    console.log('addHoverClass', target);
                }
                if (hasClass(target, 'catalog-handle')) {
                    addClass(target, 'catalog-handle-hover');
                    break;
                }                
                target = target.parentNode;
            }
        },
        handleDragStart(e) {
            let target = e.target;
            let parent = target.parentNode;
            let clientRect = parent.getBoundingClientRect();
            // addClass(parent, 'catalog-node-dragging');

            console.log('start', target);
            this.activeVm = this; // 设置本组件为当前正在拖动的实例，此举将同步 sync 到所有 TreeNode 实例
            
            // this.$el.style.backgroundColor = 'silver';
        },
        handleDrop(e) {
            // this.clearBgColor(); // 此时 this 为目的地节点，vm 才是被拖动节点
            if (!this.isAllowToDrop) {
                return;
            }
            let target = e.target;
            console.log('drop', target);
            this.removeHoverClass(e);
            // // 无论如何都直接删除被拖动节点 this.vm.node
            this.vm.$parent.node.children = this.vm.$parent.node.children.filter(node => {
                return node.name !== this.vm.node.name;
            });

            // // 情况 1：拖入空节点，成其兄弟（使用 splice 插入节点）
            if (!this.node.name) {
                this.$parent.node.children.splice(this.idx / 2, 0, this.vm.node);
                return;
            }

            // // 情况2：拖入普通节点，成为其子
            if (!this.node.children) this.$set('node.children', []); // 须用 $set 引入双向绑定
            this.node.children.push(this.vm.node);         
        },
        handleDragEnter(e) { // 允许拖放才会显示样式
            if (!this.isAllowToDrop) {
                return;
            }
            let target = e.target;
            console.log('enter', target);
            // addClass(target, 'catalog-handle-hover');
            this.addHoverClass(e);
        },
        handleDragLeave(e) {
            let target = e.target;
            // this.removeClass(target, 'catalog-handle-hover');
            this.removeHoverClass(e);
            // this.clearBgColor();
        },
        handleDragEnd(e) {
            let target = e.target;
            let parent = target.parentNode;
            console.log('end', target);
            // removeClass(parent, 'catalog-node-dragging');
            this.removeHoverClass(e);
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
    padding-left 30px
    
    // .catalog-list
    //     padding-left 30px
    
.catalog-node
    display block
    position relative
    font-size 13px
    margin 0
    transition all .2s ease        
    
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
