<template>
  <div class="common-form" v-if="props.length > 0">
    <el-form
      size="small"
      :inline="inline"
      ref="formRef"
      :model="form"
      label-position="right"
      :label-width="formLabelWidth"
      :rules="rules"
      @submit.native.prevent
    >
      <slot name="header"></slot>
      <template v-for="item in props">
        <el-form-item
          :label="item.label"
          :prop="item.prop"
          :key="item.prop"
          :class="item.class"
          v-if="showFormItem(item) && !item.hide"
        >
          <el-input
            v-if="isShow(item, 'input')"
            v-model.trim="form[item.prop]"
            :placeholder="item.placeholder ? item.placeholder : `请输入`"
            :disabled="item.disabled"
            size="small"
            auto-complete="off"
            :suffix-icon="item.sIcon"
            prefix-icon="el-icon-search"
            :maxlength="item.maxLength || 30"
            :rows="item.row"
            :type="item.type ? item.type : 'text'"
            clearable
            :class="{ 'show-word-limit-input': !!item.maxLength }"
            class="wd-202"
          >
            <form-render
              v-if="item.append"
              slot="append"
              :prop="item.prop"
              :row="form"
              :render="item.append"
            ></form-render>
            <span v-if="item.unit">{{ item.unit }}</span>
          </el-input>

          <el-autocomplete
            v-if="isShow(item, 'autocomplete')"
            v-model.trim="form[item.prop]"
            :placeholder="item.placeholder ? item.placeholder : `请输入`"
            :disabled="item.disabled"
            :fetch-suggestions="item.fetchSuggestions"
            size="small"
            auto-complete="off"
            :value-key="item.valueKey || 'value'"
            :suffix-icon="item.sIcon"
            prefix-icon="el-icon-search"
            :maxlength="item.maxLength || 30"
            :rows="item.row"
            :type="item.type ? item.type : 'text'"
            clearable
            :class="{ 'show-word-limit-input': !!item.maxLength }"
            class="wd-202"
          >
            <template slot-scope="{ item }">
              <span>{{ item.label }}</span>
            </template>
            <form-render
              v-if="item.append"
              slot="append"
              :prop="item.prop"
              :row="form"
              :render="item.append"
            ></form-render>
            <span v-if="item.unit">{{ item.unit }}</span>
          </el-autocomplete>

          <el-select
            v-else-if="isShow(item, 'select')"
            size="small"
            v-model="form[item.prop]"
            @change="(val) => changeSelect(val, item)"
            :filterable="item.remoteMethod ? true : item.filterable"
            :remote="item.remoteMethod ? true : false"
            :remote-method="item.remoteMethod"
            :disabled="item.disabled"
            :clearable="
              typeof item.clearable === 'boolean' ? item.clearable : true
            "
            :placeholder="item.placeholder ? item.placeholder : `请选择`"
            :multiple="item.multiple"
            :loading="item.loading"
            class="wd-202"
          >
            <el-option
              v-for="option in item.options"
              :key="option[item.keyProp ? item.keyProp.value : 'value']"
              :label="option[item.keyProp ? item.keyProp.label : 'label']"
              :value="option[item.keyProp ? item.keyProp.value : 'value']"
            ></el-option>
          </el-select>

          <el-cascader
            v-else-if="isShow(item, 'cascader')"
            size="small"
            :disabled="item.disabled"
            :placeholder="
              item.placeholder ? item.placeholder : `请输入${item.label}`
            "
            :options="item.options"
            :props="item.optionProps"
            v-model="form[item.prop]"
            clearable
            class="wd-202"
          ></el-cascader>

          <el-date-picker
            v-else-if="isShow(item, 'datePicker')"
            :disabled="item.disabled"
            v-model="form[item.prop]"
            :type="item.type || 'datetime'"
            :picker-options="item.pickerOptions"
            range-separator="至"
            :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
            :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
            @change="(val) => changeTime(val, item)"
            :placeholder="item.placeholder || '请选择'"
            :start-placeholder="
              item.startPlaceholder ? item.startPlaceholder : '开始时间'
            "
            :end-placeholder="
              item.endPlaceholder ? item.startPlaceholder : '结束时间'
            "
            :clearable="
              typeof item.clearable === 'boolean' ? item.clearable : true
            "
            :default-time="item.type ? ['00:00:00', '23:59:59'] : '00:00:00'"
            size="small"
          ></el-date-picker>

          <el-checkbox-group
            v-else-if="isShow(item, 'checkbox')"
            size="small"
            :disabled="item.disabled"
            v-model="form[item.prop]"
            :min="item.min ? item.min : 0"
            :max="item.max ? item.max : 1000"
          >
            <el-checkbox
              v-for="opt in item.options"
              :label="opt.value"
              :disabled="opt.disabled"
              :key="opt.value"
              :value="opt.value"
              >{{ opt.label }}</el-checkbox
            >
          </el-checkbox-group>

          <el-radio-group
            size="small"
            v-else-if="isShow(item, 'radio')"
            v-model="form[item.prop]"
          >
            <el-radio
              :disabled="item.disabled"
              v-for="radio in item.options"
              :key="radio.label"
              :label="radio.value"
              :value="radio.value"
              >{{ radio.label }}</el-radio
            >
          </el-radio-group>

          <el-radio-group
            size="small"
            v-else-if="isShow(item, 'radioButton')"
            v-model="form[item.prop]"
          >
            <el-radio-button
              :disabled="item.disabled"
              v-for="radio in item.options"
              :key="radio.label"
              :label="radio.value"
              >{{ radio.label }}</el-radio-button
            >
          </el-radio-group>

          <el-switch
            size="small"
            :active-value="item.activeValue"
            :inactive-value="item.inactiveValue"
            v-else-if="isShow(item, 'switch')"
            v-model="form[item.prop]"
          >
          </el-switch>

          <span v-else-if="isShow(item, 'text')" class="text-info">
            {{
              item.formatter
                ? item.formatter(form[item.prop], form)
                : form[item.prop]
            }}
          </span>

          <slot :name="item.prop || 'item'"></slot>

          <div
            v-if="item.tip"
            :class="['common_tip', item.inlineTip && 'inline-tip']"
          >
            {{ item.tip }}
          </div>

          <form-render
            v-if="item.render"
            :prop="item.prop"
            :row="form"
            :render="item.render"
          ></form-render>
        </el-form-item>
      </template>
      <slot name="item"></slot>
    </el-form>
  </div>
</template>

<script>
import FormRender from "./FormRender";

export default {
  components: {
    FormRender,
  },
  props: {
    props: {
      type: Array,
    },
    form: {
      type: Object,
    },
    rules: {
      type: Object,
      default: () => {},
    },
    inline: {
      type: Boolean,
      default: false,
    },
    formLabelWidth: {
      type: String,
      default: "100px",
    },
  },
  data() {
    return {
      headers: {},
    };
  },
  methods: {
    isShow(item, tag) {
      return item.tag === tag;
    },
    changeTime(val, item) {
      if (item && item.changeTime) {
        item.changeTime(val, item);
      }
    },
    changeSelect(val, item) {
      if (item.change) {
        item.change(val);
      }
    },
    showFormItem(item) {
      if (item.show) {
        return !!item.show;
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.text-info {
  display: inline-block;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-form-item {
  margin-right: 36px;
}
.wd-202 {
  width: 202px;
}
</style>
