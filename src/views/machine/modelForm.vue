<template>
    <div class="section-brand">
        <Form :model="data" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="分类名称" required>
                        <Input v-model="data.name" placeholder="" @on-change="transferPinyin"></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24">
                    <Form-item label="上级分类" required>
                        <Select v-model="data.pid" clearable placeholder="请选择">
                            <Option :value="0">无</Option>
                            <Option v-for="item in tops" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="拼音" required>
                        <Input v-model="data.py" placeholder="" disabled></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="别名">
                        <Input v-model="data.alias" placeholder=""></Input>
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
                            <Option value="1">热门</Option>
                            <Option value="0">非热门</Option>
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
import Pinyin from './../../assets/js/pinyin';

export default {
    props: {
        tops: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            data: {
                name: '',
                hot: '0',
                deleted: '0',
                hidden: '0',
                py: '',
                pid: 0,
                alias: '',
                sort: 0,
                desc: ''
            }
        };
    },
    methods: {
        transferPinyin() {
            this.data.py = Pinyin.getFullChars(this.data.name);
        }
    },
    created () {
    }
};
</script>



<style lang="stylus" scoped>   
@import '../../style/global.styl'

</style>
