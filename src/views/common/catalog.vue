<template>
    <div class="catalog-list">
        <div class="catalog-node" v-for="(item, index) in node">
            <div class="catalog-handle" :draggable="!!item.name"
                @dragover.prevent
                @dragstart.stop="handleDragStart"
                @drop.stop="handleDrop"
                @dragenter.stop="handleDragEnter"
                @dragleave.stop="handleDragLeave"
                @dragend.prevent="handleDragEnd">
                {{ item.name }}
            </div>
            <catalog-node :node="item.children"></catalog-node>
        </div>
    </div>
</template>

<script>
export default {
    name: 'catalog-node',
    props: {
        node: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    computed: {},
    methods: {
        handleDragStart(e) {
            console.log(e);
            // this.vm = this; // 设置本组件为当前正在拖动的实例，此举将同步 sync 到所有 TreeNode 实例
            this.$el.style.backgroundColor = 'silver';
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
        handleDragEnter() { // 允许拖放才会显示样式
            // if (!this.isAllowToDrop) return;
            // this.$el.style.backgroundColor = 'yellow';
        },
        handleDragLeave() {
            // this.clearBgColor();
        },
        handleDragEnd() {
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
    line-height 20px
    margin 5px 0
    
.catalog-handle
    display flex
    height 30px
    padding 5px 10px
    color #333
    border 1px solid #ccc
    background #fafafa
    background linear-gradient(top, #fafafa 0%, #eee 100%)
    border-radius 3px

</style>
