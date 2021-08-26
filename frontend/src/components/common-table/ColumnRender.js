// table column的函数化组件
export default {
  functional: true,
  inheritAttrs: false,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    return ctx.props.render(h, ctx.props.row, ctx.props.index)
  }
}
