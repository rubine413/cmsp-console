<template>
    <div class="section-brand">
        <Form :model="filterOptions" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="6" :lg="6" :sm="12" :xs="24">                
                    <Form-item label="分类名称">
                        <Input icon="locked" placeholder=""></Input>                                                   
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="一级分类">                
                        <Select v-model="filterOptions.pid" clearable placeholder="请选择">
                            <Option v-for="item in tops" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
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
                       <Button type="primary" icon="search" @click="search">查&nbsp;&nbsp;询</Button>
                       <Button type="ghost" icon="refresh">重&nbsp;&nbsp;置</Button>
                   </Form-item>
                </Col>
            </Row>
        </Form>
        <div class="split-line"></div>        
        <div class="section-data">
            <div class="section-data-actions">
                <Button type="ghost" icon="plus-round" @click="add">添加分类</Button>
                <Button type="ghost" icon="trash-a" :loading="action.deleting" @click="del">
                    <span v-if="!action.deleting">删除</span>
                    <span v-else>删除中...</span>
                </Button>
            </div>
            <div class="section-data-table">
                <Table :columns="dataColumns" :data="dataList" size="small" ref="dataTable" stripe @on-selection-change="dataSelect"></Table>
            </div>
            <div class="section-data-page">
               <div><Page :total="dataCount" :current="dataPage" :pageSize="10" show-total @on-change="pageChange"></Page></div>
            </div>
        </div>
        <Modal v-model="showModal" title="添加分类" :width="modalWidth" :mask-closable="false" border @on-ok="save">
            <Category-Form ref="dataForm" :tops="tops"></Category-Form>
        </Modal>
    </div>
</template>

<script>
import categoryService from './../../api/categoryService';
import CategoryForm from './categoryForm';

export default {
    components: { CategoryForm },
    data() {
        return {
            tops: [],
            dataList: [],
            dataCount: 0,
            dataPage: 1,
            dataColumns: [{
                type: 'selection',
                // fixed: 'left',
                width: 60,
                align: 'center'
            }, {
                type: 'index',
                // fixed: 'left',
                width: 60,
                align: 'center'
            }, {
                title: '分类名称',
                key: 'name',
                // fixed: 'left',
                width: 150
            }, {
                title: '上级分类',
                key: 'name',
                width: 150,
                render: (h, params) => {
                    let parent = this.tops.filter(item => {
                        return item.id === params.row.pid;
                    });
                    console.log(params);
                    return h('span', parent && parent.length > 0 ? parent[0].name : '-');
                }
            }, {
                title: '拼音',
                key: 'py',
                width: 200
            }, {
                title: '别名',
                key: 'alias',
                width: 120
            }, {
                title: '排序',
                key: 'sort',
                width: 60
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
                // fixed: 'right',
                width: 200
            }, {
                title: '创建时间',
                key: 'createTime',
                align: 'center',                
                // fixed: 'right',
                width: 200
            }],
            filterOptions: {
                hot: '',
                hidden: '0',
                deleted: '0',
                pid: 0
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
            categoryService.list(params).then(res => {
                if (res.data.code === 1) {
                    let data = res.data.data;
                    this.dataPage = data.current;
                    this.dataCount = data.total;
                    this.dataList = data.records;
                }
            });
        },        
        loadTops() {
            categoryService.tops().then(res => {
                if (res.data.code === 1) {
                    this.tops = res.data.data;
                }
            });
        },
        add() {
            this.showModal = true;
        },
        save(obj) {
            let params = this.$refs.dataForm.data;
            categoryService.save(params).then(res => {
                console.log(res);
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
            categoryService.delete(params).then(res => {
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
        search() {
            this.dataPage = 1;
            this.load();
        },
        pageChange(page) {
            this.dataPage = page;
            this.load();
        }
    },
    created () {
        this.load();
        this.loadTops();
    }
};
</script>



<style lang="stylus" scoped>   
@import '../../style/global.styl'


</style>
