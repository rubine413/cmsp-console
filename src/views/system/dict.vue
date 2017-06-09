<template>
    <div class="section-dict">
        <Form :model="filterOptions" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="字典名称">                
                        <Select v-model="filterOptions.dictName" clearable placeholder="请选择">
                            <Option v-for="item in dictNames" :value="item.dictName" :key="item">{{ item.dictNameDesc }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="6" :lg="6" :sm="12" :xs="24">
                    <Form-item label="状态">
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
               <div><Page :total="dataCount" :current="dataPage" :pageSize="15" show-total></Page></div>
            </div>
        </div>
        <Modal v-model="showModal" :title="modalTitle" :width="modalWidth" :mask-closable="false" border @on-ok="save">
            <Dict-Form ref="dataForm" :names="dictNames"></Dict-Form>
        </Modal>
    </div>
</template>

<script>
import dictService from './../../api/dictService';
import DictForm from './dictForm';

export default {
    components: { DictForm },
    data() {
        return {
            dictNames: [],
            dataList: [],
            dataCount: 0,
            dataPage: 1,
            dataColumns: [{
                type: 'selection',
                width: 60,
                align: 'center'
            }, {
                title: '名称',
                key: 'dictName'
            }, {
                title: '描述',
                key: 'dictNameDesc'
            }, {
                title: '字典键',
                align: 'center',
                key: 'dictKey'
            }, {
                title: '字典值',
                align: 'center',
                key: 'dictValue'
            }, {
                title: '状态',
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
                width: 200
            }, {
                title: '创建时间',
                key: 'createTime',
                align: 'center',
                width: 200
            }],
            dataSelected: [],
            filterOptions: {
                dictName: '',
                deleted: '0'
            },
            action: {
                deleting: false
            },
            showModal: false,
            modalTitle: '添加字典',
            modalWidth: 900
        };
    },
    methods: {
        load() {
            let params = Object.assign({}, this.filterOptions);
            params.current = this.dataPage;
            dictService.list(params).then(res => {
                if (res.data.code === 1) {
                    let data = res.data.data;
                    this.dataPage = data.current;
                    this.dataCount = data.total;
                    this.dataList = data.records;
                }
            });
        },
        loadNames() {
            dictService.names().then(res => {
                console.log(res);
                if (res.data.code === 1) {
                    this.dictNames = res.data.data;
                }
            });
        },
        add() {
            this.showModal = true;
        },
        save(obj) {
            let params = this.$refs.dataForm.data;
            dictService.save(params).then(res => {
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
            dictService.delete(params).then(res => {
                if (res.data.code === 1) {
                    this.$Message.success('操作成功');
                    this.load();
                    this.loadNames();
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
        }
    },
    created () {
        this.load();
        this.loadNames();
    }
};
</script>



<style lang="stylus" scoped>   
@import '../../style/global.styl'

</style>
