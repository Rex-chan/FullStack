<template>
  <div class="staff-container">
    <searchTable
      ref="searchTable"
      :searchConfig="searchConfig"
      :url="url"
      :tableColumns="tableColumns"
    >
    </searchTable>
    <centerDialog
      :title="dialogModal.title"
      :visible.sync="dialogModal.show"
      :confirm="confirm"
      type="confirm"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="200px"
        :inline="false"
        size="small"
        :disabled="dialogModal.type === 'check'"
      >
        <el-form-item label="姓名" prop="staffsName">
          <el-input
            v-model="form.staffsName"
            placeholder="请输入姓名"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="staffsSex">
          <el-select
            v-model="form.staffsSex"
            placeholder="请选择性别"
            style="width: 300px"
          >
            <el-option
              v-for="(item, index) in ['男', '女']"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学历程度" prop="education">
          <el-select
            v-model="form.education"
            placeholder="请选择学历程度"
            style="width: 300px"
          >
            <el-option
              v-for="(item, index) in [
                '中专',
                '高中',
                '大专',
                '本科',
                '硕士研究生',
                '博士研究生',
              ]"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期" prop="entryDate">
          <el-date-picker
            v-model="form.entryDate"
            type="date"
            style="width: 300px"
            format="yyyy 年 MM 月 dd 日"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select
            v-model="form.department"
            placeholder="请选择部门"
            style="width: 300px"
          >
            <el-option
              v-for="(item, index) in ['总经办', '行政部', '研发部']"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="station">
          <el-input
            v-model="form.station"
            placeholder="请输入岗位"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input
            v-model="form.phoneNumber"
            placeholder="请输入联系电话"
            :maxlength="11"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="现居住地" prop="position">
          <el-input
            v-model="form.position"
            placeholder="请输入现居住地"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
            v-model="form.remark"
            :maxlength="100"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </centerDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import searchTable from "../../components/search-table";
import centerDialog from "../../components/cneterDialog";
import axios from "@/utils/axios";
import moment from "moment";
export default {
  name: "staff",
  components: { searchTable, centerDialog },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      url: "/api/staffs/query",
      dialogModal: {
        title: "新增员工",
        show: false,
        type: "add",
      },
      searchConfig: {
        // formLabelWidth: "50px",
        // props: [
        //   {
        //     tag: "input",
        //     label: "姓名:",
        //     key: "staffsName",
        //     prop: "staffsName",
        //   },
        //   {
        //     tag: "input",
        //     label: "性别:",
        //     key: "staffsSex",
        //     prop: "staffsSex",
        //   },
        // ],
        optBtns: [
          {
            label: "新增",
            type: "primary",
            tag: "button",
            handler: () => {
              this.dialogModal = {
                title: "新增员工",
                show: true,
                type: "add",
              };
              this.$nextTick(() => {
                this.$refs["form"].resetFields();
                this.form = {
                  staffsName: null,
                  staffsSex: null,
                  entryDate: null,
                  department: null,
                  station: null,
                  education: null,
                  phoneNumber: null,
                  position: null,
                  remark: null,
                };
              });
            },
          },
        ],
      },
      tableColumns: [
        {
          title: "名称",
          key: "staffsName",
        },
        {
          title: "性别",
          key: "staffsSex",
          render(h, row) {
            return h("span", row.staffsSex ? "女士" : "男士");
          },
        },
        {
          title: "入职日期",
          key: "entryDate",
          render(h, row) {
            return h("span", moment(row.entryDate).format("YYYY-MM-DD"));
          },
        },
        {
          title: "部门",
          key: "department",
          render(h, row) {
            return h("span", ["总经办", "行政部", "研发部"][row.department]);
          },
        },
        {
          title: "学历程度",
          key: "education",
          render(h, row) {
            return h(
              "span",
              ["中专", "高中", "大专", "本科", "硕士研究生", "博士研究生"][
                row.education
              ]
            );
          },
        },
        {
          title: "联系电话",
          key: "phoneNumber",
        },
        {
          title: "岗位",
          key: "station",
        },
        {
          title: "操作",
          operate: true,
          setBtns: (row, index) => {
            return [
              {
                label: "查看",
                handler: () => {
                  this.dialogModal = {
                    title: "员工信息",
                    show: true,
                    type: "check",
                  };
                  this.form = row;
                },
              },
              {
                label: "编辑",
                handler: () => {
                  this.dialogModal = {
                    title: "编辑员工信息",
                    show: true,
                    type: "update",
                  };
                  this.form = row;
                },
              },
              {
                label: "删除",
                style: "color:red",
                handler: () => {
                  this.$confirm("是否确认删除？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                  })
                    .then(() => {
                      axios({
                        url: `/api/staffs/remove?id=${row._id}`,
                        method: "DELETE",
                      }).then((res) => {
                        console.log(res);
                        if (res.data.ret) {
                          this.$message({
                            message: "删除成功",
                            type: "success",
                          });
                          this.$refs.searchTable.handleQuery();
                        } else {
                          this.$message.error(res.data.datamessage);
                        }
                      });
                    })
                    .catch(() => {});
                },
              },
            ];
          },
        },
      ],
      form: {
        staffsName: null,
        staffsSex: null,
        entryDate: null,
        department: null,
        station: null,
        education: null,
        phoneNumber: null,
        position: null,
        remark: null,
      },
      rules: {
        staffsName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        staffsSex: [
          { required: true, message: "请选择性别", trigger: "change" },
        ],
        education: [
          { required: true, message: "请选择学历程度", trigger: "change" },
        ],
        entryDate: [
          {
            required: true,
            message: "请选择入职日期",
            trigger: "change",
          },
        ],
        department: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        station: [{ required: true, message: "请输入岗位", trigger: "blur" }],
        phoneNumber: [
          {
            required: true,
            validator: checkPhone,
            trigger: ["blur", "change"],
          },
        ],
        position: [
          { required: true, message: "请输入现居住地", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    confirm() {
      if (this.dialogModal.type === "check") return;
      let flag = false;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogModal.type === "add") {
            axios({
              url: "/api/staffs/add",
              method: "POST",
              params: this.form,
            }).then((res) => {
              if (res.data.ret) {
                this.$message({
                  message: "创建成功",
                  type: "success",
                });
                this.$refs.searchTable.handleQuery();
                this.dialogModal.show = false;
                flag = true;
              } else {
                this.$message.error("员工重复创建");
                flag = false;
              }
            });
          } else if (this.dialogModal.type === "update") {
            axios({
              url: "/api/staffs/update",
              method: "patch",
              params: this.form,
            }).then((res) => {
              if (res.data.ret) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.$refs.searchTable.handleQuery();
                this.dialogModal.show = false;
                flag = true;
              } else {
                this.$message.error("修改失败");
                flag = false;
              }
            });
          }
        } else {
          flag = false;
        }
      });
      return flag;
    },
  },
};
</script>
<style lang="scss">
.staff-container {
  padding: 20px 0;
  // .form {
  //   text-align: center;
  // }
}
</style>
