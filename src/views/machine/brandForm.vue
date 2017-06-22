<template>
    <div class="section-brand">
        <Form :model="data" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="品牌名称" required>
                        <Input v-model="data.name" placeholder="" @on-change="transferPinyin"></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="品牌拼音" required>
                        <Input v-model="data.py" placeholder="" disabled></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="英文名称">
                        <Input v-model="data.enName" placeholder=""></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24">
                    <Form-item label="所在国家" required>
                        <Select v-model="data.country" clearable placeholder="请选择">
                            <Option value="1">热门</Option>
                            <Option value="0">非热门</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="联系电话">
                        <Input v-model="data.telephone" icon="ios-telephone" placeholder=""></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="邮箱">
                        <Input v-model="data.email" icon="email" placeholder=""></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="邮编">
                        <Input v-model="data.zipcode" icon="code" placeholder=""></Input>
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
                <Col span="24">
                    <Form-item label="地址">
                        <Input v-model="data.address" icon="location" placeholder=""></Input>
                    </Form-item>
                </Col>
                <Col span="24">
                    <Form-item label="品牌描述">
                        <Input v-model="data.desc" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="输入品牌描述..."></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24" v-if="data.id">
                    <Form-item label="是否隐藏">
                        <Select v-model="data.hidden" clearable placeholder="请选择">
                            <Option :value="0">不隐藏</Option>
                            <Option :value="1">隐藏</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :sm="12" :xs="24" v-if="data.id">
                    <Form-item label="是否已删除">
                        <Select v-model="data.deleted" clearable placeholder="请选择">
                            <Option :value="0">不删除</Option>
                            <Option :value="1">删除</Option>
                        </Select>
                    </Form-item>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
import brandService from './../../api/brandService';

import Pinyin from './../../assets/js/pinyin';

export default {
    props: {
        value: {
            type: Object,
            default: null
        }
    },
    watch: {
        data: {
            handler (newValue) {
                this.$emit('input', newValue);
            },
            deep: true            
        },
        value: {
            handler (newValue) {
                this.data = newValue || this.initValue();
            },
            deep: true
        }
    },
    data() {
        return {
            data: this.value || this.initValue()
        };
    },
    methods: {
        initValue() {
            return {
                id: null,
                name: '',
                hot: 0,
                deleted: 0,
                hidden: 0,
                py: '',
                enName: '',
                country: '',
                telephone: '',
                email: '',
                zipcode: '',
                address: '',
                sort: 0,
                desc: ''
            };
        },
        transferPinyin() {
            this.data.py = Pinyin.getFullChars(this.data.name);
        }
    },
    created () {}
};
</script>
