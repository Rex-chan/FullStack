<template>
  <el-dialog
    class="v-dialog"
    :title="title"
    :top="top"
    :visible.sync="show"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="!loading"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <slot name="footer"></slot>
      <template v-if="isConfirmType">
        <el-button
          plain
          icon="el-icon-close"
          :loading="loading"
          @click="handleClose('cancel', 'cancelled')"
          >{{ cancelText }}</el-button
        >
        <el-button
          plain
          type="primary"
          icon="el-icon-check"
          :loading="loading"
          @click="handleClose('confirm', 'confirmed')"
          >{{ confirmText }}</el-button
        >
      </template>
      <el-button
        v-else
        plain
        icon="el-icon-close"
        @click="handleClose('close', 'closed')"
        >{{ closeText }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
/**
 * @type {Object}
 * @description 弹窗类型
 */
const DialogTypes = {
  confirm: 'confirm',
  alert: 'alert'
}

/**
 * v-dialog
 *
 * 通用`el-dialog`弹窗
 *
 * Slots:
 * - `default` 内容
 * - `footer` 底部按钮栏
 *
 * Events:
 *  - `@canceled` 已取消
 *  - `@confirmed` 已确认
 *  - `@closed` 已关闭
 *
 * Callback(props):
 *  - `cancel` 取消前置回调
 *  - `confirm` 确认前置回调
 *
 */
export default {
  name: 'VDialog',
  props: {
    visible: Boolean,
    type: {
      type: String,
      default: 'confirm',
      validator: value => Object.values(DialogTypes).includes(value)
    },
    title: {
      type: String,
      default: '确认'
    },
    top: {
      type: String,
      default: '8vh'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    closeText: {
      type: String,
      default: '关闭'
    },
    // confirm: 取消前置异步回调，返回`false`取消操作
    cancel: Function,
    // confirm: 确认前置异步回调，返回`false`取消操作
    confirm: Function,
    // alert: 关闭前置异步回调，返回`false`取消操作
    close: Function
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    isConfirmType() {
      return this.type === DialogTypes.confirm
    },
    show: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    async handleClose(type, event) {
      this.loading = true

      let shouldClose = true

      // 前置回调
      const handleCb = this[type]
      if (handleCb) {
        try {
          shouldClose = (await handleCb()) !== false
        } catch (e) {
          shouldClose = false
        }
      }

      // 关闭弹窗
      if (event && shouldClose) {
        this.show = false
        this.$emit(event)
      }

      this.loading = false
    }
  },
  deactivated() {
    this.show = false
  }
}
</script>

<style lang="scss">
.v-dialog {
  .el-dialog__body {
    max-height: calc(90vh - 120px);
    padding: 10px 20px;
    overflow-y: auto;
  }
}
</style>
