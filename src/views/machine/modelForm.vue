<template>
    <div class="section-brand">
        <Form :model="data" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="设备型号" required>
                        <Input v-model="data.name" placeholder=""></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24">
                    <Form-item label="一级分类" required>
                        <Select v-model="data.categoryRootId" clearable placeholder="请选择" @on-change="fetchSubs">
                            <Option :value="0">无</Option>
                            <Option v-for="item in tops" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24">
                    <Form-item label="二级分类" required>
                        <Select v-model="data.categoryId" clearable placeholder="请选择">
                            <Option :value="0">无</Option>
                            <Option v-for="item in subs" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24">
                    <Form-item label="品牌" required>
                        <Select v-model="data.bandId" clearable placeholder="请选择">
                            <Option :value="0">无</Option>
                            <Option v-for="item in brands" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="排序">
                        <Input-number v-model="data.sort" :max="1000" :min="0" :step="1"></Input-number>
                    </Form-item>
                </Col>                
                <Col span="8" :lg="8" :sm="12" :xs="24">
                    <Form-item label="是否热门">
                        <Select v-model="data.hot" clearable placeholder="请选择">
                            <Option :value="1">热门</Option>
                            <Option :value="0">非热门</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24" v-if="data.id">
                    <Form-item label="是否隐藏">
                        <Select v-model="data.hidden" clearable placeholder="请选择">
                            <Option value="0">不隐藏</Option>
                            <Option value="1">隐藏</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24" v-if="data.id">
                    <Form-item label="是否已删除">
                        <Select v-model="data.deleted" clearable placeholder="请选择">
                            <Option value="0">不删除</Option>
                            <Option value="1">删除</Option>
                        </Select>
                    </Form-item>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
import categoryService from './../../api/categoryService';
import brandService from './../../api/brandService';

export default {
    data() {
        return {
            tops: [],
            subs: [],
            brands: [],
            data: {
                name: '',
                categoryRootId: 0,
                categoryId: 0,
                bandId: 0,
                sort: 0,
                hot: 0,
                deleted: 0,
                hidden: 0
            }
        };
    },
    methods: {
        fetchSubs(id) {
            categoryService.chosen(id).then(res => {
                if (res.data.code === 1) {
                    this.subs = res.data.data;
                }
            }); 
        },
        loadChosen() {
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
        }
    },
    created () {
        this.loadChosen();
    }
};
</script>



<style lang="stylus" scoped>   
@import '../../style/global.styl'

</style>
