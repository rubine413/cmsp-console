<template>
    <div class="section-brand">
        <Form :model="filterOptions" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="6" :lg="6" :sm="12" :xs="24">                
                    <Form-item label="品牌名称">
                        <Input icon="locked" placeholder=""></Input>                                                   
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="是否热门">                
                        <Select v-model="filterOptions.hot" clearable placeholder="请选择">
                            <Option value="1">热门</Option>
                            <Option value="0">非热门</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="是否隐藏">
                        <Select v-model="filterOptions.hidden" clearable placeholder="请选择">
                            <Option value="1">已隐藏</Option>
                            <Option value="0">未隐藏</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="是否已删除">
                        <Select v-model="filterOptions.deleted" clearable placeholder="请选择">
                            <Option value="1">已删除</Option>
                            <Option value="0">未删除</Option>
                        </Select>
                    </Form-item>
                </Col>
            </Row>
            <Row :gutter="16">
                <Col span="24" class="form-actions">
                    <Form-item>
                       <Button type="primary" icon="search" @click="loadData">查&nbsp;&nbsp;询</Button>
                       <Button type="ghost" icon="refresh">重&nbsp;&nbsp;置</Button>
                   </Form-item>
                </Col>
            </Row>
        </Form>
        <div class="split-line"></div>        
        <div class="section-data">
            <div class="section-data-actions">
                <Button type="ghost" icon="plus-round" @click="brandAdd">添加品牌</Button>
                <Button type="ghost" icon="trash-a">删除品牌</Button>
            </div>
            <div class="section-data-table">
                <Table :columns="dataColumns" :data="dataList" size="small" ref="dataTable"></Table>
            </div>
            <div class="section-data-page">
               <div><Page :total="dataCount" :current="dataPage" :pageSize="15" show-total></Page></div>
            </div>
        </div>
        <Modal v-model="showModal" :title="modalTitle" :width="modalWidth" :mask-closable="false" border @on-ok="brandSave">
            <Brand-Form ref="dataForm"></Brand-Form>
        </Modal>
    </div>
</template>

<script>
import brandService from './../../api/brandService';
import BrandForm from './brandForm';

export default {
    components: { BrandForm },
    data() {
        return {
            dataList: [],
            dataCount: 0,
            dataPage: 1,
            dataColumns: [{
                type: 'selection',
                fixed: 'left',
                width: 60,
                align: 'center'
            }, {
                title: '名称',
                key: 'name',
                fixed: 'left',
                width: 200
            }, {
                title: '拼音',
                key: 'py',
                width: 200
            }, {
                title: '国家',
                key: 'country',
                width: 120
            }, {
                title: '是否热门',
                key: 'hot',
                width: 100
            }, {
                title: '是否隐藏',
                key: 'hidden',
                width: 100
            }, {
                title: '是否删除',
                key: 'deleted',
                width: 100
            }, {
                title: '排序',
                key: 'sort',
                width: 60
            }, {
                title: '创建人',
                key: 'creator',
                width: 200
            }, {
                title: '创建时间',
                key: 'createTime',
                width: 200
            }],
            filterOptions: {
                hot: '',
                hidden: '0',
                deleted: '0'
            },
            showModal: false,
            modalTitle: '添加品牌',
            modalWidth: 900
        };
    },
    methods: {
        loadData() {
            let params = Object.assign({}, this.filterOptions);
            params.current = this.dataPage;
            brandService.list(params).then(res => {
                if (res.data.code === 1) {
                    let data = res.data.data;
                    this.dataPage = data.current;
                    this.dataCount = data.total;
                    this.dataList = data.records;
                }
            });
        },
        brandAdd() {
            this.showModal = true;
        },
        brandSave(obj) {
            let params = this.$refs.dataForm.data;
            brandService.save(params).then(res => {
                console.log(res);
                if (res.data.code === 1) {
                    let data = res.data.data;
                    this.loadData();
                }
            });
        }
    },
    created () {
        this.loadData();
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
