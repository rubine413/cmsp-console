<template>
    <div class="catalog-list">
        <div class="catalog-node" v-for="(item, index) in node">
            <div class="catalog-handle" ref="handle" :data-index="index" @mouseenter.stop="handleMouseOver" @mouseup.stop="handleMouseUp">{{ item.name }}</div>
            <catalog-node :node="item.children" :active.sync="activeNode" v-if="item.children && item.children.length > 0" :level="level + 1"></catalog-node>
        </div>
    </div>
</template>

<script>
import { addClass, removeClass, hasClass } from './../../assets/js/dom';
import draggable from './../../assets/js/draggable';

export default {
    name: 'catalog-node',
    props: {
        level: {
            type: Number,
            default: 1
        },
        active: {
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
        }
    },
    watch: {
        activeNode() {
            this.$emit('update:active', this.activeNode);
        }
    },
    data() {
        return {
            activeNode: this.active
        };
    },
    computed: {},
    methods: {
        bindEvents() {
            this.$nextTick(function () {
                let handles = this.$refs.handle;
                [].forEach.call(handles, handle => {
                    var dragState = {};
                    var parent = handle.parentNode;
                    var main = document.querySelector('#contentMain');

                    draggable(handle, {
                        start: event => {
                            let index = handle.getAttribute('data-index');
                            this.activeNode = this.node[index];
                            let handleRect = handle.getBoundingClientRect(); 
                            let nodeRect = parent.getBoundingClientRect();
                            dragState = {
                                start: new Date(),
                                startLeft: event.pageX,
                                startTop: event.pageY,
                                node: this.node[index],
                                handleRect,
                                nodeRect
                            };
                            
                            console.log(handleRect, nodeRect);
                            // parent.style.width = clientRect.width + 'px';
                            // parent.style.height = clientRect.height + 'px';
                            // parent.style.left = event.pageX + 'px';
                            // parent.style.top = event.pageY + 'px';
                            console.log('start', event);
                        },
                        drag: event => {
                            let pageX = event.pageX;
                            let pageY = event.pageY;
                            if (Math.abs(pageX - dragState.startLeft) < 5 && Math.abs(pageY - dragState.startTop) < 5) {
                                return;
                            }
                            console.log('drag', event);
                            dragState.dragging = true;
                            
                            let catalogNode = handle.parentNode;
                            addClass(catalogNode, 'catalog-node-dragging');
                            // let placeholder = document.querySelector('.catalog-node-placeholder');
                            // if (!placeholder) {
                            //     placeholder = document.createElement('div');
                            //     placeholder.className = 'catalog-node catalog-node-placeholder';
                            //     catalogNode.parentNode.insertBefore(placeholder, catalogNode);
                            // }
                            let allHandles = main.querySelectorAll('.catalog-handle');
                            [].forEach.call(allHandles, obj => {
                                let rect = obj.getBoundingClientRect();
                                let objLeft = rect.left;
                                if (rect.left <= pageX && rect.right >= pageX && rect.top <= pageY && rect.bottom >= pageY) {
                                    addClass(obj, 'draghover');
                                } else {
                                    removeClass(obj, 'draghover');
                                }
                            });
                                                      
                            let dragNode = document.querySelector('#dragNode');
                            if (!dragNode) {
                                dragNode = document.createElement('div');
                                dragNode.id = 'dragNode';
                                dragNode.style.width = dragState.nodeRect.width + 'px';
                                document.body.appendChild(dragNode);
                            }
                            dragNode.innerHTML = handle.parentNode.outerHTML;

                            dragNode.style.left = (event.pageX + 2) + 'px';
                            dragNode.style.top = (event.pageY + 2) + 'px';                           
                            // addClass(parent, 'catalog-node-dragging');
                            dragState.left = event.pageX;
                            dragState.top = event.pageY;
                            // console.log('drag', event);
                        },
                        end: event => {
                            console.log('end', event);
                            if (dragState.dragging) {
                                let pageX = event.pageX;
                                let pageY = event.pageY;
                                let allHandles = main.querySelectorAll('.catalog-handle');
                                [].forEach.call(allHandles, obj => {
                                    let rect = obj.getBoundingClientRect();
                                    let objLeft = rect.left;
                                    if (rect.left <= pageX && rect.right >= pageX && rect.top <= pageY && rect.bottom >= pageY) {
                                        addClass(obj, 'draghover');
                                    } else {
                                        removeClass(obj, 'draghover');
                                    }
                                });
                                document.querySelector('#dragNode').remove();
                            }
                            // removeClass(parent, 'catalog-node-dragging');
                            dragState.dragging = false;
                            this.activeNode = null;
                        }
                    });
                });   
            });
        },
        handleDragStart(e) {
            let target = e.target;
            let parent = target.parentNode;
            let clientRect = parent.getBoundingClientRect();
            console.log('handleDragStart', clientRect);
            parent.style.width = clientRect.width + 'px';
            parent.sytle.height = clientRect.height + 'px';
            parent.style.left = clientRect.left + 'px';
            parent.style.top = clientRect.top + 'px';
            addClass(parent, 'catalog-node-dragging');


            // this.vm = this; // 设置本组件为当前正在拖动的实例，此举将同步 sync 到所有 TreeNode 实例
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
            let parent = target.parentNode;
            let clientRect = parent.getBoundingClientRect();
            console.log('handleDragEnter', clientRect);
        },
        handleDragLeave() {
            // this.clearBgColor();
        },
        handleMouseOver(e) {
            if (this.activeNode && this.activeNode.name) {
                console.log('handleMouseOver');
                // document.querySelector('.catalog-node-placeholder').remove();
                // addClass(e.target, 'draghover');
            }
        },
        handleMouseUp(e) {
            if (this.activeNode && this.activeNode.name) {
                console.log('handleMouseUp');
                // removeClass(e.target, 'draghover');
            }
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
    mounted() {
        this.bindEvents();
    }
};
</script>


<style lang="stylus">   
@import '../../style/global.styl'

#dragNode
    position absolute
    left 0
    top 0
    
    .catalog-node-dragging
        display block
    
    .catalog-list
        padding-left 30px

.catalog-list
    display block
    // position relative
    margin 0
    padding 0
        
    .catalog-list
        padding-left 30px
    
.catalog-node
    display block
    position relative
    font-size 13px
    line-height 20px
    margin 5px 0
    
    &.catalog-node-placeholder
        border-radius 3px
        background #009af2
        height 30px
    
.catalog-handle
    display flex
    height 30px
    padding 5px 10px
    color #333
    border 1px solid #ccc
    background #fafafa
    background linear-gradient(top, #fafafa 0%, #eee 100%)
    border-radius 3px
    cursor default
    
    &.draghover
        border-color #009af2

.catalog-node-dragging
    display none
</style>
