<template>
    <div class="section-brand">
        <Form :model="filterOptions" :label-width="80" class="section-form" ref="searchForm">
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
                       <Button type="primary" icon="search" @click="load">查&nbsp;&nbsp;询</Button>
                       <Button type="ghost" icon="refresh" @click="handleReset">重&nbsp;&nbsp;置</Button>
                   </Form-item>
                </Col>
            </Row>
        </Form>
        <div class="split-line"></div>        
        <div class="section-data">
            <div class="section-data-actions">
                <Button type="ghost" icon="plus-round" @click="add">添加品牌</Button>
                <Button type="ghost" icon="trash-a" :loading="action.deleting" @click="del">
                    <span v-if="!action.deleting">删除</span>
                    <span v-else>删除中...</span>
                </Button>
            </div>
            <div class="section-data-table">
                <Table :columns="dataColumns" :data="dataList" size="small" ref="dataTable" stripe @on-selection-change="dataSelect"></Table>
            </div>
            <div class="section-data-page">
               <div><Page :total="dataCount" :current="dataPage" :pageSize="15" show-total></Page></div>
            </div>
        </div>
        <Modal v-model="showModal" :title="modalTitle" :width="modalWidth" :mask-closable="false" border @on-ok="save">
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
                align: 'center',
                width: 140
            }, {
                title: '是否隐藏',
                key: 'hidden',
                align: 'center',
                width: 140
            }, {
                title: '是否删除',
                key: 'deleted',
                align: 'center',
                width: 140
            }, {
                title: '排序',
                key: 'sort',
                width: 80
            }, {
                title: '创建人',
                key: 'creator',
                align: 'center',
                width: 200
            }, {
                title: '创建时间',
                key: 'createTime',
                align: 'center',
                width: 200
            }],
            filterOptions: {
                hot: '',
                hidden: '0',
                deleted: '0'
            },
            dataSelected: [],
            action: {
                deleting: false
            },
            showModal: false,
            modalTitle: '添加品牌',
            modalWidth: 900
        };
    },
    methods: {
        load() {
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
            // console.log(Pinyin.getFullChars('三 一 重 工'));
            // console.log(Pinyin.getCamelChars('三一重工'));
        },
        add() {
            this.showModal = true;
        },
        save(obj) {
            let params = this.$refs.dataForm.data;
            brandService.save(params).then(res => {
                if (res.data.code === 1) {
                    let data = res.data.data;
                    this.load();
                }
            });
        },
        del() {
            if (this.dataSelected.length === 0) {
                this.$Message.warning('请选择至少一条记录');
                return;
            }
            this.action.deleting = true;
            let params = {
                id: this.dataSelected.join(',')
            };
            brandService.delete(params).then(res => {
                if (res.data.code === 1) {
                    this.$Message.success('操作成功');
                    this.load();
                } else {
                    this.$Message.error(res.data.message);
                }
                this.action.deleting = false;
            });
        },
        dataSelect(selectedObjs) {
            this.dataSelected = selectedObjs.map(obj => {
                return obj.id;
            });
        },
        handleReset () {
            console.log('reset');
            this.$refs.searchForm.resetFields();
        }
    },
    created () {
        this.load();
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
