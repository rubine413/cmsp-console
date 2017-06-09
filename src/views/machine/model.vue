<template>
    <div class="section-model">
        <catalog-node :node="catalogs"></catalog-node>
    </div>
</template>

<script>
import catalogNode from './../common/catalog';

export default {
    components: { catalogNode },
    data() {
        return {
            catalogs: [{
                name: 'Item 1',
                children: []
            }, {
                name: 'Item 2',
                children: [{
                    name: 'Item 3',
                    children: []
                }, {
                    name: 'Item 4',
                    children: []
                }, {
                    name: 'Item 5',
                    children: [{
                        name: 'Item 6',
                        children: []
                    }, {
                        name: 'Item 7',
                        children: []
                    }, {
                        name: 'Item 8',
                        children: []
                    }]
                }, {
                    name: 'Item 9',
                    children: []
                }, {
                    name: 'Item 10',
                    children: []
                }]
            }, {
                name: 'Item 11',
                children: []
            }, {
                name: 'Item 12',
                children: []
            }],
            filterOptions: {
                hot: '',
                hidden: '',
                deleted: '0'
            }
        };
    },
    computed: {        
    },
    methods: {        
    },
    mounted () {
    }
};
</script>



<style lang="stylus" scoped>   
@import '../../style/global.styl'

.section-title
    padding 10px
    background #f5f5f5
    margin 15px 0
    p
        font-weight bold
        color #666
        text-indent 12px
        border-left 2px solid $primary-color 
        
    div + &
        margin-top 60px 
.section-desc
    font-size 12px
    text-align right

</style>
