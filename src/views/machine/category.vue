<template>
    <div class="section-brand">
        <Form :model="filterOptions" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="6" :lg="6" :xs="12">                
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
                <Col span="24" class="text-right">
                    <Form-item>
                       <Button type="primary">查询</Button>
                       <Button type="ghost">重置</Button>
                   </Form-item>
                </Col>
            </Row>
        </Form>
        <div class="split-line"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filterOptions: {
                hot: '',
                hidden: '',
                deleted: '0'
            }
        };
    },
    computed: {
        tableColumns3() {
            let columns = [];
            if (this.showCheckbox) {
                columns.push({
                    type: 'selection',
                    width: 60,
                    align: 'center'
                });
            }
            if (this.showIndex) {
                columns.push({
                    type: 'index',
                    width: 60,
                    align: 'center'
                });
            }
            columns.push({
                title: '日期',
                key: 'date',
                sortable: true
            });
            columns.push({
                title: '姓名',
                key: 'name'
            });
            columns.push({
                title: '年龄',
                key: 'age',
                sortable: true,
                filters: [{
                    label: '大于25岁',
                    value: 1
                }, {
                    label: '小于25岁',
                    value: 2
                }],
                filterMultiple: false,
                filterMethod(value, row) {
                    if (value === 1) {
                        return row.age > 25;
                    } else if (value === 2) {
                        return row.age < 25;
                    }
                    return false;
                }
            });
            columns.push({
                title: '地址',
                key: 'address',
                filters: [{
                    label: '北京',
                    value: '北京'
                }, {
                    label: '上海',
                    value: '上海'
                }, {
                    label: '深圳',
                    value: '深圳'
                }],
                filterMethod(value, row) {
                    return row.address.indexOf(value) > -1;
                }
            });
            return columns;
        }
    },
    methods: {
        mockTableData1 () {
            let data = [];
            for (let i = 0; i < 10; i++) {
                data.push({
                    name: '商圈' + Math.floor(Math.random() * 100 + 1),
                    status: Math.floor(Math.random() * 3 + 1),
                    portrayal: ['城市渗透', '人群迁移', '消费指数', '生活指数', '娱乐指数'],
                    people: [
                        {
                            n: '客群' + Math.floor(Math.random() * 100 + 1),
                            c: Math.floor(Math.random() * 1000000 + 100000)
                        },
                        {
                            n: '客群' + Math.floor(Math.random() * 100 + 1),
                            c: Math.floor(Math.random() * 1000000 + 100000)
                        },
                        {
                            n: '客群' + Math.floor(Math.random() * 100 + 1),
                            c: Math.floor(Math.random() * 1000000 + 100000)
                        }
                    ],
                    time: Math.floor(Math.random() * 7 + 1),
                    update: new Date()
                });
            }
            return data;
        },
        formatDate (date) {
            const y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d;
        },
        changePage () {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.tableData1 = this.mockTableData1();
        },
        mockTableData2 () {
            let data = [];
            function getNum() {
                return Math.floor(Math.random() * 10000 + 1);
            }
            for (let i = 0; i < 10; i++) {
                data.push({
                    name: '推广名称' + (i + 1),
                    fav: 0,
                    show: getNum(),
                    weak: getNum(),
                    signin: getNum(),
                    click: getNum(),
                    active: getNum(),
                    day7: getNum(),
                    day30: getNum(),
                    tomorrow: getNum(),
                    day: getNum(),
                    week: getNum(),
                    month: getNum()
                });
            }
            return data;
        },
        getTable2Columns () {
            const table2ColumnList = {
                name: {
                    title: '名称',
                    key: 'name',
                    fixed: 'left',
                    width: 200,
                    render: (h, params) => {
                        const fav = this.tableData2[params.index].fav;
                        const style = fav === 0 ? {
                            cursor: 'pointer'
                        } : {
                            cursor: 'pointer',
                            color: '#f50'
                        };

                        return h('div', [
                            h('Icon', {
                                style: style,
                                props: {
                                    type: fav === 0 ? 'ios-star-outline' : 'ios-star'
                                },
                                nativeOn: {
                                    click: () => {
                                        this.toggleFav(params.index);
                                    }
                                }
                            })
                        ]);
                    }
                },
                show: {
                    title: '展示',
                    key: 'show',
                    width: 150,
                    sortable: true
                },
                weak: {
                    title: '唤醒',
                    key: 'weak',
                    width: 150,
                    sortable: true
                },
                signin: {
                    title: '登录',
                    key: 'signin',
                    width: 150,
                    sortable: true
                },
                click: {
                    title: '点击',
                    key: 'click',
                    width: 150,
                    sortable: true
                },
                active: {
                    title: '激活',
                    key: 'active',
                    width: 150,
                    sortable: true
                },
                day7: {
                    title: '7日留存',
                    key: 'day7',
                    width: 150,
                    sortable: true
                },
                day30: {
                    title: '30日留存',
                    key: 'day30',
                    width: 150,
                    sortable: true
                },
                tomorrow: {
                    title: '次日留存',
                    key: 'tomorrow',
                    width: 150,
                    sortable: true
                },
                day: {
                    title: '日活跃',
                    key: 'day',
                    width: 150,
                    sortable: true
                },
                week: {
                    title: '周活跃',
                    key: 'week',
                    width: 150,
                    sortable: true
                },
                month: {
                    title: '月活跃',
                    key: 'month',
                    width: 150,
                    sortable: true
                }
            };

            let data = [table2ColumnList.name];

            this.tableColumnsChecked.forEach(col => data.push(table2ColumnList[col]));

            return data;
        },
        changeTableColumns () {
            this.tableColumns2 = this.getTable2Columns();
        },
        toggleFav (index) {
            this.tableData2[index].fav = this.tableData2[index].fav === 0 ? 1 : 0;
        }
    },
    mounted () {
        this.changeTableColumns();
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
