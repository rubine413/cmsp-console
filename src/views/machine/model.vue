<template>
    <div class="section-brand">
        <Form :model="filterOptions" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="6" :lg="6" :sm="12" :xs="24">                
                    <Form-item label="型号">
                        <Input v-model="filterOptions.name" icon="locked" placeholder=""></Input>                                                   
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="一级分类">                
                        <Select v-model="filterOptions.categoryRoot" clearable placeholder="请选择" @on-change="fetchChosen">
                            <Option v-for="item in tops" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="二级分类">                
                        <Select v-model="filterOptions.category" clearable placeholder="请选择">
                            <Option v-for="item in subs" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="品牌">                
                        <Select v-model="filterOptions.brand" clearable placeholder="请选择">
                            <Option v-for="item in brands" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="是否热门">                
                        <Select v-model="filterOptions.hot" clearable placeholder="请选择">
                            <Option :value="1">热门</Option>
                            <Option :value="0">非热门</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="是否隐藏">
                        <Select v-model="filterOptions.hidden" clearable placeholder="请选择">
                            <Option :value="1">已隐藏</Option>
                            <Option :value="0">未隐藏</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="是否已删除">
                        <Select v-model="filterOptions.deleted" clearable placeholder="请选择">
                            <Option :value="1">已删除</Option>
                            <Option :value="0">未删除</Option>
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
                <Button type="ghost" icon="plus-round" @click="add">添加</Button>
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
        <Modal v-model="showModal" title="添加型号" :width="modalWidth" :mask-closable="false" border @on-ok="save">
            <Model-Form ref="dataForm"></Model-Form>
        </Modal>
    </div>
</template>

<script>
import categoryService from './../../api/categoryService';
import brandService from './../../api/brandService';
import modelService from './../../api/modelService';
import ModelForm from './modelForm';

export default {
    components: { ModelForm },
    data() {
        return {
            tops: [],
            subs: [],
            brands: [],
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
                title: '型号',
                key: 'name',
                // fixed: 'left',
                width: 150
            }, {
                title: '品牌',
                key: 'brand',
                // fixed: 'left',
                width: 100
            }, {
                title: '一级分类',
                key: 'categoryRootName',
                // fixed: 'left',
                width: 150
            }, {
                title: '二级分类',
                key: 'categoryName',
                width: 150
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
                name: '',
                categoryRoot: 0,
                category: 0,
                brand: 0,
                hot: '',
                hidden: 0,
                deleted: 0,
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
            modelService.list(params).then(res => {
                if (res.data.code === 1) {
                    let data = res.data.data;
                    this.dataPage = data.current;
                    this.dataCount = data.total;
                    this.dataList = data.records;
                }
            });
        },        
        loadTops() {
            categoryService.chosen(0).then(res => {
                if (res.data.code === 1) {
                    this.tops = res.data.data;
                }
            });            
            brandService.chosen().then(res => {
                if (res.data.code === 1) {
                    this.brands = res.data.data;
                }
            });
        },
        add() {
            this.showModal = true;
        },
        save(obj) {
            let params = this.$refs.dataForm.data;
            modelService.save(params).then(res => {
                console.log(res);
                if (res.data.code === 1) {
                    let data = res.data.data;
                    this.load();
                } else {
                    this.$Message.warning(res.data.message);
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
            modelService.delete(params).then(res => {
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
        },
        fetchChosen(id) {
            categoryService.chosen(id).then(res => {
                if (res.data.code === 1) {
                    this.subs = res.data.data;
                }
            });
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
