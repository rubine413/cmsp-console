<template>
    <div class="section-brand">
        <Form :model="data" :label-width="80" class="section-form">
            <Row :gutter="16">
                <Col span="8" :lg="8" :sm="12" :xs="24">
                    <Form-item label="上级字典" required>
                        <Select v-model="data.pid" clearable placeholder="请选择" @on-change="changeNames">
                            <Option :value="0">无</Option>
                            <Option v-for="item in names" :value="item.id" :key="item">{{ item.dictNameDesc }}</Option>
                        </Select>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="字典名称" required>
                        <Input v-model="data.dictName" placeholder="名称"></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="字典描述">
                        <Input v-model="data.dictNameDesc" placeholder="描述"></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="字典键" required>
                        <Input v-model="data.dictKey" placeholder=""></Input>
                    </Form-item>
                </Col>
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="字典值" required>
                        <Input v-model="data.dictValue" placeholder=""></Input>
                    </Form-item>
                </Col>                
                <Col span="8" :lg="8" :xs="12">
                    <Form-item label="排序">
                        <Input-number v-model="data.sort" :max="1000" :min="0" :step="1"></Input-number>
                    </Form-item>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
import dictService from './../../api/dictService';

export default {
    props: {
        names: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            ditcNames: [],
            data: {
                name: '',
                pid: 0,
                dictName: '',
                dictNameDesc: '',
                dictKey: '',
                dictValue: '',
                sort: 0
            }
        };
    },
    methods: {
        changeNames(value) {
            if (value === 0) {
                this.data.dictName = '';
                this.data.dictNameDesc = '';
            } else {
                let item = this.names.filter(obj => {
                    return value === obj.id;
                })[0];
                this.data.dictName = item.dictName;
                this.data.dictNameDesc = item.dictNameDesc;
            }
        }
    },
    created () {
    }
};
</script>



<style lang="stylus" scoped>   
@import '../../style/global.styl'

</style>
