<template>
    <div class="func-config-box">
        <!-- 功能的参数配置 -->
        <van-cell-group v-for="configItem in configModalObject.config" :key="configItem.desc" :title="configItem.desc">
            <van-field v-for="configItemItem in configItem.config" :key="configItemItem.name" label-width="70%"
                :label="configItemItem.desc" :rules="[{ required: true, message: '必填' }]">
                <template v-if="'integer' === configItemItem.type" #input>
                    <div class="van-field__body">
                        <input type="number" v-model="configItemItem.value" class="van-field__control" />
                    </div>
                </template>
                <template v-else-if="'switch' === configItemItem.type" #input>
                    <van-switch v-model="configItemItem.value" size="16" />
                </template>
                <template v-else-if="'list' === configItemItem.type" #input>
                    <div class="configItemValue" @click="showItemConfigList($event, configItemItem)">
                        {{ configItemItem.value }}
                    </div>
                </template>
                <template v-else-if="'scheme' === configItemItem.type" #input>
                    <div class="configItemValue" @click="showItemConfigScheme($event, configItemItem)">
                        {{ configItemItem.value }}
                    </div>
                </template>
                <template v-else-if="'text' === configItemItem.type" #input>
                    <div class="van-field__body">
                        <input type="text" v-model="configItemItem.value" class="van-field__control" />
                    </div>
                </template>
                <!-- <template v-else-if="'time' === configItemItem.type" #input>
          <div
            class="configItemValue"
            @click="showDateTimePicker($event, configItemItem)"
          >
            {{ configItemItem.value }}
          </div>
        </template> -->
            </van-field>
        </van-cell-group>

        <!-- 功能的参数里面的list下拉单选 -->
        <van-popup v-model:show="configItemItemShowPicker" position="bottom">
            <van-picker show-toolbar :columns="configItemItemPickerList" @confirm="configItemItemPickerConfirm"
                @cancel="configItemItemShowPicker = false" :default-index="curItemItemIndex" />
        </van-popup>

        <van-popup v-model:show="schemePicker" position="bottom">
            <van-picker show-toolbar :columns="schemeList" @confirm="schemeListConfirm"
                @cancel="schemePicker = false" />
        </van-popup>
    </div>
</template>
<script setup>
import { merge } from '@/common/tool';
import { reactive, ref } from "vue";
const props = defineProps({
    show: Boolean,
    configModalObject: Object,
    showStop: Boolean,
});

const configItemItemShowPicker = ref(false);
const configItemItemPickerList = ref([]);
const curItemItemIndex = ref(10);
const curItemItem = ref(null);

const schemePicker = ref(false);
const schemeList = ref([]);

function showItemConfigList(e, configItemItem) {
    configItemItemPickerList.value = configItemItem.data.map(item => ({ text: item, value: item }));
    curItemItem.value = configItemItem;
    curItemItemIndex.value = configItemItemPickerList.value.indexOf(configItemItem.value);
    configItemItemShowPicker.value = true;
}

function configItemItemPickerConfirm({ selectedOptions }) {
    curItemItem.value.value = selectedOptions[0].text;
    configItemItemShowPicker.value = false;
}

async function showItemConfigScheme(e, configItemItem) {
    let schemeListA = await AutoWeb.autoPromise('getSchemeList');

    let groupNames = ['全部', ...await AutoWeb.autoPromise('getGroupNames')];
    if (props.showStop) {
        groupNames.unshift('__内置方案__');
    }
    let groupScheme = groupNames.map(item => ({ text: item, value: item, children: getSchemeNamesByGroupName(item, schemeListA) }));

    schemeList.value = groupScheme;
    curItemItem.value = configItemItem;
    schemePicker.value = true;
}

function getSchemeNamesByGroupName(groupName, schemeNames) {
    const left = merge([], schemeNames);
    if (groupName === '全部') {
        return left.map(item => ({ text: item.schemeName, value: item.schemeName }));
    } else if (groupName === '__内置方案__') {
        return [{ text: '__停止脚本__', value: '__停止脚本__' }
        , { text: '__返回上个方案__', value: '__返回上个方案__' }]
    }
    // 1. 根据groupName过滤
    const filterd = [];
    // console.log(groupName);
    for (let i = 0; i < left.length; i++) {
        if (left[i].groupName === groupName) {
            filterd.push(left[i]);
            left.splice(i, 1);
            i--;
        }
    }
    return filterd.map(item => ({ text: item.schemeName, value: item.schemeName }));
}

function schemeListConfirm({ selectedOptions }) {
    curItemItem.value.value = selectedOptions[1].value;
    schemePicker.value = false;
}

</script>


<style scoped>
.configItemValue {
    width: 100%;
    /* text-align: right; */
}

.func-config-box .van-cell,
.func-config-box .van-cell-group__title {
    font-size: 12px;
}

.func-config-box .van-cell {
    padding: 5px 16px;
}

.func-config-box .van-cell-group__title {
    padding: 10px 16px 2px 16px;
    color: #1989fa;
}
</style>