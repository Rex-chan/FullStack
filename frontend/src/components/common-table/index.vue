<template>
  <div class="common-table">
    <slot></slot>
    <el-table
      :data="data"
      v-loading="loading"
      tooltip-effect="light"
      size="small"
      ref="tableRef"
      :border="border"
      :show-header="showHeader"
      :header-row-class-name="
        () => {
          return !this.selectableAll
            ? 'table-th_bg disable-select-all'
            : 'table-th_bg';
        }
      "
      @selection-change="handleSelectionChange"
      style="width: 100%"
      :cell-style="cellStyleMothod"
      :span-method="spanMethod"
      :highlight-current-row="false"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      @current-change="singleSelectChange"
      @sort-change="handleSortChange"
      v-bind="$attrs"
      :height="height"
      :max-height="maxHeight"
      @select="handleSelect"
      @select-all="selectAll"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="selection"
        :class-name="single ? 'single' : ''"
        width="55"
        :fixed="tableColumns[0].fixed"
        :selectable="selectable"
        v-if="
          tableColumns &&
          tableColumns[0].type === 'selection' &&
          !tableColumns[0].hide
        "
      >
      </el-table-column>
      <!-- eslint-disable vue/no-use-v-if-with-v-for -->
      <el-table-column
        v-for="column in tableColumns"
        :key="column.key"
        :prop="column.key"
        :label="column.title"
        :type="column.type"
        :width="column.width"
        :min-width="column.minWidth"
        :sortable="column.sortable"
        :render-header="column.renderHeader"
        :show-overflow-tooltip="
          column.operate ? false : column.showTooltip === false ? false : true
        "
        :fixed="column.fixed"
        :align="column.align || 'left'"
        v-if="column.type !== 'selection' && !column.hide"
      >
        <template slot="header" slot-scope>
          <el-tooltip
            :content="column.content"
            v-if="column.tooltip"
            placement="top"
            effect="light"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>

          <span v-if="column.mustFill" class="must-tips">*</span>

          <input
            v-if="column.isSpecificValue && !disabled"
            v-model="specific"
            size="mini"
            clearable
            placeholder="优惠金额"
            class="specificValueInput"
          />

          <span v-else>
            {{ column.title }}
          </span>

          <el-button
            :style="{
              marginLeft: '8px',
            }"
            v-if="column.btnTxt && !disabled"
            type="primary"
            plain
            size="mini"
            @click="colBtnClick(column.eventName)"
          >
            {{ column.btnTxt }}
          </el-button>
        </template>
        <!--eslint-enable-->
        <template slot-scope="{ row, $index }">
          <!-- 列的slot -->
          <slot
            :name="column.slotName"
            v-if="column.slot"
            :row="row"
            :index="$index"
          ></slot>

          <column-render
            v-else-if="column.render"
            :row="row"
            :index="$index"
            :render="column.render"
          ></column-render>
          <span v-else-if="!column.operate && !column.input && column.key">{{
            formatterRowValue(column, row, $index)
          }}</span>
          <span v-else-if="column.input && column.key">
            <el-input
              v-model="row[column.key]"
              :type="column.type || 'number'"
              size="mini"
              :maxlength="column.maxLength"
              clearable
              :class="{ 'show-word-limit-input': column.showWordLimit }"
              :show-word-limit="column.showWordLimit"
            ></el-input>
          </span>
          <div v-else-if="column.operate">
            <span v-for="(item, idx) in column.setBtns(row, $index)" :key="idx">
              <el-button
                v-if="!item.hide"
                :class="[
                  'operate-button',
                  item.className ? item.className : '',
                ]"
                style="margin: 0 2px"
                :disabled="item.disabled"
                v-bind="$attrs"
                :style="item.style"
                :type="item.type || 'text'"
                size="mini"
                @click="item.handler(row, $index)"
                >{{ item.label }}</el-button
              >
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showPage" class="pager">
      <el-pagination
        :layout="layoutSet"
        :page-size="filter.size"
        :page-sizes="pageSize"
        :pager-count="5"
        :current-page="filter.page"
        background
        :total="total"
        @current-change="currentChange"
        @size-change="sizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import ColumnRender from "./ColumnRender";

export default {
  name: "CommonTable",
  components: {
    ColumnRender,
  },
  props: {
    data: {
      type: Array,
    },
    total: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    filter: {
      type: Object,
    },
    tableColumns: {
      type: Array,
    },
    spanMethod: {
      type: Function,
    },
    summaryMethod: {
      type: Function,
    },
    showPage: {
      type: Boolean,
      default: true,
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: "total, prev, pager, next, sizes, jumper",
    },
    cellStyleMothod: {
      type: Function,
    },
    pageSize: {
      type: Array,
      default() {
        return [5, 10, 20, 30, 50, 100, 200];
      },
    },
    height: {
      type: [Number, String],
    },
    maxHeight: {
      type: [Number, String],
    },
    defaultPlaceholder: {
      type: String,
      default: "",
    },
    specificValue: {
      type: String,
    },
    // 表格是否为单选
    single: {
      type: Boolean,
      default: false,
    },
    // 是否允许选中table所有项
    selectableAll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      checkedKeys: false,
      specific: "",
    };
  },
  computed: {
    layoutSet() {
      return this.layout;
    },
  },
  watch: {
    specificValue() {
      this.specific = this.specificValue;
    },
    specific() {
      if (this.specific !== this.specificValue) {
        this.$emit("updateSpecificValue", this.specific);
      }
    },
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.optionalMark || row.delStatus) {
        return "warning-row";
      }
      return "";
    },
    handleSortChange(val) {
      this.$emit("handleSortChange", val);
    },
    singleSelectChange(val) {
      this.$emit("singleSelectChange", val);
    },
    currentChange(val) {
      console.log("tablecurrentChange");
      this.$emit("currentChange", val);
    },
    sizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleSelectionChange(val) {
      if (!this.single) {
        this.$emit("selectionChange", val);
      }
    },
    handleSelect(selection, row) {
      // 设置只允许单选
      if (this.single && selection.length > 1) {
        // 将其他选中的值为未选中
        selection.slice(0, -1).forEach((item) => {
          this.$refs.tableRef.toggleRowSelection(item, false);
        });
        selection = selection.slice(-1);
      }
      if (this.single) {
        this.$emit("selectionChange", selection);
      }
      this.$emit("handleSelect", selection, row);
    },
    getSummaries(params) {
      const _arr = this.summaryMethod ? this.summaryMethod(params) : [];
      return _arr;
    },
    clearSelection() {
      this.$refs.tableRef.clearSelection();
    },
    toggleRowSelection(row, selected = true) {
      this.$nextTick(() => {
        this.$refs.tableRef.toggleRowSelection(row, selected);
      });
    },
    toggleAllSelection() {
      this.$nextTick(() => {
        this.$refs.tableRef.toggleAllSelection();
      });
    },
    colBtnClick(name) {
      this.$emit(name);
    },
    // 解决表格树全选不能选择children级的checkbox
    selectAll() {
      this.checkedKeys = !this.checkedKeys;

      this.splite(this.data, this.checkedKeys);
    },
    // 解决表格树全选不能选择children级的checkbox
    splite(data, flag) {
      data.forEach((row, index) => {
        if (this.selectable(row, index)) {
          this.$refs.tableRef.toggleRowSelection(row, flag);
        }
        if (row.children != undefined) {
          this.splite(row.children, flag);
        }
      });
    },
    // 给table设置默认值
    formatterRowValue(column, row, $index) {
      const txt = column.formatter
        ? column.formatter(row[column.key], $index, row)
        : row[column.key];
      return this.isEmpty(txt) ? this.defaultPlaceholder : txt;
    },
    isEmpty(txt) {
      return txt === "" || txt === undefined || txt === null;
    },
    selectable(row, index) {
      return this.selectableAll && this.tableColumns[0].selectable
        ? this.tableColumns[0].selectable(row, index)
        : this.selectableAll;
    },
  },
};
</script>

<style lang="scss">
.specificValueInput {
  width: 100px;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 28px;
  line-height: 28px;
  outline: none;
  padding: 0 10px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.common-table {
  .filter-header {
    .el-form {
      float: left;
    }
  }
  .pagination {
    float: right;
    margin-top: 15px;
  }
}
.pager {
  text-align: right;
  margin-top: 20px;
}
tr.table-th_bg,
tr.table-th_bg th {
  background: #fafafa;
  .el-icon-question {
    font-size: 16px;
    margin-right: 5px;
    color: #3a71a8;
  }
  .must-tips {
    color: red;
  }
}
.disable-select-all {
  .el-checkbox {
    display: none;
  }
}
.el-table .warning-row {
  color: #c9c9c9;
}

.common-table {
  .el-table__header {
    .single {
      .el-checkbox {
        display: none;
      }
    }
  }
}
</style>
