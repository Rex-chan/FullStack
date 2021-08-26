<template>
  <div class="query-table-wrap">
    <div class="search-head" v-if="searchConfig">
      <slot name="header">
        <div class="filter-content">
          <slot name="table-top-orders"></slot>
          <slot name="search">
            <common-form
              ref="CommonFormRef"
              :props="props"
              :form="filterForm"
              :form-label-width="formLabelWidth"
              :inline="true"
              :rules="rules"
            >
              <el-form-item slot="item">
                <el-button
                  size="small"
                  @click="handleQuery(true)"
                  type="primary"
                  v-if="canView"
                  >查询</el-button
                >
                <el-button size="small" @click="handleReset" v-if="canEdit"
                  >重置</el-button
                >
              </el-form-item>
            </common-form>
          </slot>
          <slot name="deal">
            <div
              v-if="!single"
              class="table-header-bar"
              :class="{ active: selectedList.length > 0 }"
            >
              <span v-if="selectedList.length > 0"
                ><i class="el-icon-info"></i>已选择<em class="text-tips">{{
                  selectedList.length
                }}</em
                >项</span
              >
              <div class="add-btn fl" v-if="searchConfig.optBtns">
                <div
                  class="add-btn-one"
                  :key="index"
                  v-for="(item, index) in searchConfig.optBtns"
                >
                  <el-button
                    v-if="
                      (!item.tag || item.tag === 'button') &&
                      (!item.onlyBatch ||
                        (item.onlyBatch && selectedList.length > 0)) &&
                      !item.hide
                    "
                    size="mini"
                    @click="tableHandler(item)"
                    :type="item.type || 'primary'"
                    >{{ item.label }}<i :class="item.icon" v-if="item.icon"></i
                  ></el-button>
                  <el-dropdown
                    v-else-if="
                      item.tag === 'dropdown' && selectedList.length > 0
                    "
                    @command="item.handler"
                    :placement="item.placement || 'bottom'"
                    :trigger="item.trigger || 'hover'"
                  >
                    <el-button :type="item.type || 'primary'" size="small"
                      >{{ item.label
                      }}<i class="el-icon-arrow-down el-icon--right"></i
                    ></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(dropdown, i) in item.dropdownList"
                        :key="i"
                        :command="dropdown.command"
                        >{{ dropdown.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </slot>
    </div>
    <slot name="table-top"></slot>
    <common-table
      ref="CommonTableRef"
      :loading="tableObj.loading"
      :default-placeholder="defaultPlaceholder"
      :layout="layout"
      :height="height"
      :table-columns="tableColumns"
      :total="tableObj.total"
      :border="border"
      :show-header="showHeader"
      :data="listData"
      :show-page="showPage"
      :span-method="spanMethod"
      :cell-style-mothod="cellStyleMothod"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
      :filter="filter"
      :single="single"
      @singleSelectChange="singleSelectChange"
      @handleSortChange="handleSortChange"
      @sizeChange="sizeChange"
      @selectionChange="selectionChange"
      @currentChange="currentChange"
      :selectableAll="selectableAll"
    >
      <template
        v-slot:[item.slotName]="{ row }"
        v-for="(item, index) in tableColumns"
      >
        <slot
          :name="item.slotName"
          v-if="item.slot"
          :row="row"
          :index="index"
        ></slot>
      </template>
    </common-table>
  </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import CommonTable from "../common-table/index.vue";
import CommonForm from "../common-table-form/index.vue";

export default {
  components: { CommonTable, CommonForm },
  props: {
    tableColumns: { type: Array, default: () => [] },
    searchConfig: { type: Object, default: () => {} },
    searchParams: { type: Object, default: () => {} },
    watchSearchParams: { type: Object, default: () => {} },
    initFilter: { type: Object, default: () => {} },
    data: { type: Array, default: () => [] },
    spanMethod: { type: Function, default: undefined },
    cellStyleMothod: { type: Function, default: undefined },
    proxyQuery: { type: Function, default: undefined },
    isDefaultQuery: { type: Boolean, default: false },
    border: { type: Boolean, default: false },
    showHeader: { type: Boolean, default: true },
    proxyData: { type: Function, default: undefined },
    showPage: { type: Boolean, default: true },
    url: { type: String, default: "" },
    isDelayRequest: { type: Boolean, default: false },
    isRefresh: { type: Boolean, default: false },
    isDefaultSelect: { type: Boolean, default: false },
    defaultSelected: { type: Array, default: () => [] },
    selectItemKey: { type: String, default: "id" },
    layout: {
      type: String,
      default: "total, prev, pager, next, sizes, jumper",
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    summaryMethod: {
      type: Function,
      default: undefined,
    },
    canView: {
      type: Boolean,
      default: true,
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
    height: {
      type: [Number, String],
    },
    defaultPlaceholder: {
      type: String,
      default: "",
    },
    single: {
      type: Boolean,
    },
    // 是否允许选中table所有项
    selectableAll: {
      type: Boolean,
      default: true,
    },
    // 在查询前格式化查询参数
    formatterSearchParams: {
      type: Function,
    },
    // 查询是否清除选中状态
    needClearSelect: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      listData: this.data || [],
      filter: {
        size: 10,
        page: 1,
      },
      tableObj: {
        list: [],
        loading: false,
        total: 0,
      },
      filterForm: {},
      selectedList: [],
    };
  },
  computed: {
    props() {
      return this.searchConfig.props || [];
    },
    rules() {
      return this.searchConfig.rules || {};
    },
    addBtn() {
      return this.searchConfig.addBtn || {};
    },
    formLabelWidth() {
      return this.searchConfig.formLabelWidth || "100px";
    },
  },
  methods: {
    sizeChange(val) {
      this.filter.size = val;
      let filters = Object.assign({}, this.filterForm);
      if (this.proxyQuery) {
        this.proxyQuery(filters);
      }
      this.getList(filters);
    },
    currentChange(val) {
      this.filter.page = val;
      let filters = Object.assign({}, this.filterForm);
      if (this.proxyQuery) {
        this.proxyQuery(filters);
      }
      this.getList(filters);
    },
    singleSelectChange(val) {
      this.$emit("singleSelectChange", val);
    },
    getFilters() {
      return this.filterForm;
    },
    tableHandler(item) {
      let filters = Object.assign({}, this.filterForm);
      if (this.proxyQuery) {
        this.proxyQuery(filters);
      }
      item.handler(filters, this.selectedList);
    },
    /**
     * 监听选中行变化，记录历史
     **/
    selectionChange(val) {
      let notSelectedList = [];
      this.listData.map((v) => {
        let item = val.find(
          (vv) => vv[this.selectItemKey] === v[this.selectItemKey]
        );
        if (!item) {
          notSelectedList.push(v);
        }
      });
      // 去除未选中行
      notSelectedList.map((v) => {
        let index = this.selectedList.findIndex(
          (s) => s[this.selectItemKey] === v[this.selectItemKey]
        );
        if (index !== -1) {
          this.selectedList.splice(index, 1);
        }
      });
      // 增加新行
      val.map((v) => {
        let index = this.selectedList.findIndex(
          (s) => s[this.selectItemKey] === v[this.selectItemKey]
        );
        if (index === -1) {
          this.selectedList.push(v);
        }
      });
      this.$emit("selectionChange", this.selectedList);
    },
    clearSelections() {
      this.$refs.CommonTableRef.clearSelection();
      this.selectedList = [];
    },

    async getList(filters) {
      this.tableObj.loading = true;
      setTimeout(() => {
        this.tableObj.loading = true;
      }, 50);
      setTimeout(() => {
        this.tableObj.loading = false;
      }, 300);
      let params = {
        ...this.filter,
        ...this.filterForm,
        ...this.searchParams,
        ...this.watchSearchParams,
      };
      // 父级通过proxyQuery对filters进行处理
      if (filters) {
        params = Object.assign({}, params, filters);
      }
      // 在请求前格式化请求数据
      if (this.formatterSearchParams) {
        params = this.formatterSearchParams(params);
      }

      // 如果默认增加筛选条件
      if (this.isDefaultQuery && this.proxyQuery) {
        let defaultFilter = this.proxyQuery(filters || {});
        params = Object.assign({}, params, defaultFilter);
      }
      try {
        let res = await axios.get(this.url, { params });
        // 父级通过proxyData对data进行处理
        if (this.proxyData) {
          res = this.proxyData(res);
          if (!res) {
            return;
          }
          // this.listData = data.content
          // this.tableObj.total = data.totalElements
        }

        const { content, totalElements } = res.data.data;
        this.listData = Array.isArray(content) ? content : [];
        this.tableObj.total = totalElements;

        // 判断删除末页时候，总页数少于当前页，取最后一页
        // let total =
        //   (res.totalPages
        //     ? res.totalPages
        //     : Math.ceil(res.totalElements / res.size)) || 1;

        // if (total < this.filter.page) {
        //   this.currentChange(total);
        // }
        this.$emit("getTblData", res);
        // 设置默认选中
        this.defaultSelect();
        this.tableObj.loading = false;
      } catch (e) {
        this.tableObj.loading = false;
      }
    },
    /**
     * 设置表格行默认选中
     **/
    defaultSelect() {
      this.selectedList.map((v) => {
        this.listData.map((vv) => {
          if (v[this.selectItemKey] === vv[this.selectItemKey]) {
            this.$refs.CommonTableRef.toggleRowSelection(vv, true);
          }
        });
      });
    },
    /**
     * 重置为默认选中状态
     **/
    resetDefaultSelect() {
      if (this.needClearSelect) {
        this.$refs.CommonTableRef.clearSelection();
      }
      this.selectedList = [];
      this.handleDefaultSelectedList();
      this.defaultSelect();
    },
    handleQuery(resetPage) {
      if (resetPage) {
        this.filter.page = 1;
      }
      let filters = Object.assign({}, this.filterForm);
      if (this.proxyQuery) {
        filters = this.proxyQuery(filters);
      }
      this.getList(filters);
      if (this.needClearSelect) {
        this.clearSelections();
      }
    },
    /**
     * 重置表格和过滤条件
     **/
    handleReset() {
      this.filter = {
        page: 1,
        size: 10,
      };
      this.filterForm = Object.assign({}, this.initFilter);
      this.$emit("reset");
      // this.getList()
    },
    handleResetFilter() {
      this.filter = {
        page: 1,
        size: 10,
      };
      this.filterForm = Object.assign({}, this.initFilter);
    },
    /**
     * 处理默认选中数据兼容
     * defaultSelected number[] | object[]
     **/
    handleDefaultSelectedList() {
      let arr = [];
      if (this.defaultSelected && typeof this.defaultSelected[0] !== "object") {
        this.defaultSelected.map((v) => {
          let item = this.listData.find((vv) => vv[this.selectItemKey] === v);
          if (item) {
            arr.push(item);
          }
        });
      } else {
        (this.defaultSelected || []).map((v) => {
          if (v) {
            arr.push(v);
          }
        });
        // arr = this.defaultSelected;
      }

      this.selectedList = this.selectedList.concat(arr);
      this.defaultSelect();
    },
    setFilterForm(filter) {
      this.filterForm = Object.assign({}, this.filterForm, filter);
    },

    handleSortChange(val) {
      let obj = {};
      if (val.order === "descending") {
        obj[val.prop] = "desc";
      } else {
        obj[val.prop] = "asc";
      }
      this.filter.page = 1;
      this.getList(obj);
    },
  },
  mounted() {
    this.filterForm = Object.assign({}, this.initFilter);
    if (this.url && !this.isDelayRequest) {
      this.handleDefaultSelectedList();
      this.getList();
    }
  },
  watch: {
    isRefresh(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getList();
        this.clearSelections();
      }
    },
    isDefaultSelect(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.handleDefaultSelectedList();
      }
    },
    initFilter: {
      handler() {
        this.filterForm = Object.assign({}, this.initFilter);
      },
      deep: true,
    },
    data() {
      this.listData = this.data;
    },
    watchSearchParams: {
      handler(newVal) {
        this.getList();
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.table-header-bar {
  width: 100%;
  line-height: 40px;
  padding: 0 15px;
  border: 1px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 13px;
  color: #444;
  &.active {
    background: rgba(231, 245, 249, 1);
    border: 1px solid rgba(23, 158, 201, 0.5);
  }
  .el-icon-info {
    color: rgba(23, 158, 201, 1);
    font-size: 13px;
    margin-right: 4px;
  }
  em.text-tips {
    color: rgba(23, 158, 201, 1);
    font-style: normal;
    display: inline-block;
    margin: 0 3px;
  }

  .add-btn {
    margin-bottom: 20px;
    // margin-left: 10px;
    .add-btn-one {
      margin-right: 15px;
      display: inline-block;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
.query-table-wrap {
  padding-bottom: 2px;
}
</style>
