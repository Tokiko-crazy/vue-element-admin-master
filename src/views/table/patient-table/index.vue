<template>
  <!-- <div class="app-container"> -->
  <el-card :body-style="{}" shadow="always" class="card">
    <div class="search" style="padding: 5px 0px">
      <div class="filter-container" style="margin-top:-10px;padding:0px;">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-right: 10px;" @click="handleFilter">
          搜索
        </el-button>
        <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.sex" placeholder="性别" clearable style="width: 90px;margin-right: 10px;" class="filter-item">
          <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input v-model="listQuery.case_number" placeholder="病历号" style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      </div>
      <el-divider>
      </el-divider>
      <div class="" style="height:40px;padding:0px;">
        <el-button class="filter-item" type="primary" icon="el-icon-circle-plus" style="margin-right: 10px;" @click="handleCreate">
          新增
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" style="margin-right: 10px;margin-left: 0px;" @click="handleDownload">
          导出模板
        </el-button>
        <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
          reviewer
        </el-checkbox> -->
      </div>
    </div>
    <!-- //数据表格展示 -->
    <el-table ref="multipleTable" :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 98%;" max-height=" 80%" @sort-change="sortChange" element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
      <el-table-column min-width='100px' type="selection" align="center"></el-table-column>
      <!-- <el-table-column label="SequenceID" prop="id" sortable="custom" align="center" width="180px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.sequence_id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column v-if="true" label="病人id" width="150px" align="center" prop="id" :sortable="'custom'" :sort-orders="['ascending', 'descending']">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="疾病类型" width="150px" align="center">
        <template slot-scope="{row}">
          <div v-if="Array.isArray(row.results)">
            <p v-for="item in row.results">{{ item }}&nbsp&nbsp</p>
          </div>
          <span v-else>{{row.results}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="姓名" width="150px" align="center" prop="name" :sortable="'custom'" :sort-orders="['ascending', 'descending']">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="病历号" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.case_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家庭地址" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Title" min-width="400px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.sequence_id }}</span>
          <el-tag>{{ row.sequence_id | typeFilter }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="操作人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author.username }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" class="el-icon-edit" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" class="el-icon-document" type="primary" @click="handleModifyStatus(row,'published')">
            详情
          </el-button>
          <el-button size="mini" class="el-icon-delete" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- //分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- //提交表单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="form-container">
        <unfixed-thead ref="unfixedthead" :dataForm="temp" :dialogStatus="dialogStatus" @getList="getList" @resetTemp="resetTemp" />
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div> -->

    </el-dialog>
    <el-drawer title="样本信息详情" :with-header="false" :visible.sync="sample_information" direction="rtl" size="60%">
      <!-- <el-container style="padding:0px;"> -->
      <el-header style="text-align: left; font-size: 20px;vertical-align:middle">
        <!-- <i class="el-icon-list" style="margin-right: 15px"></i> -->
        <svg-icon icon-class="table" style="margin-right: 15px" />
        <span style="">样本信息详情</span>
      </el-header>
      <el-divider>
      </el-divider>
      <el-row>
        <el-col :span="24">
          <div class="" style="margin:20px 25px">病人信息</div>
        </el-col>
        <patient-detail v-bind:current_id="current_id" :choooseAble="fasle" :patientHeight="100" />
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="" style="margin:20px 25px">患病详情</div>
        </el-col>
        <disease-detail v-bind:current_id="current_id" :editAble="false" :deleteAble="false" />
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
  deleteArticle,
  fetchArticle,
  fetchArticleInfo,
} from "@/api/patient";
// import myForm from "@/views/table/inline-edit-table";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// import role from "mock/role";
import request from "@/utils/request";
import UnfixedThead from "../components/UnfixedThead";
import DiseaseDetail from "../components/DiseaseDetail";
import PatientDetail from "../components/PatientDetail";

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: {
    Pagination,
    UnfixedThead,
    DiseaseDetail,
    PatientDetail,
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      current_id: {},
      sample_information: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        name: undefined,
        sex: undefined,
        type: undefined,
        sort: {},
        case_number: undefined,
      },
      sexOptions: ["男", "女"],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: 0,
        date: new Date(),
        name: "",
        case_number: "",
        address: "",
        sex: "男",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        sequence_id: [
          {
            required: true,
            message: "SequenceID is required",
            trigger: "blur",
          },
        ],
        collected_date: [
          {
            type: "date",
            required: false,
            message: "collected_date is required",
            trigger: "change",
          },
        ],
        batch: [
          { required: true, message: "batch is required", trigger: "blur" },
        ],
      },
      downloadLoading: false,
      multipleSelection: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.dialogFormVisible = false;
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      fetchArticleInfo({ id: row.id }).then((response) => {
        console.log("响应完成", response.data);
        this.current_id = response.data;
        this.sample_information = true;
        // this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      // this.$message({
      //   message: "操作Success",
      //   type: "error",
      // });
      row.status = status;
    },
    sortChange(data) {
      if (this.$refs.multipleTable) this.$refs.multipleTable.clearSort();
      const { prop, order } = data;
      this.listQuery.sort = {};
      this.listQuery.sort[prop] = order;
      this.handleFilter();
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: 0,
        date: new Date(),
        name: "",
        case_number: "",
        address: "",
        sex: "男",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.unfixedthead.reset();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.author_id = 1; //todo 暂时写死，需要获取当前用户的id
          this.temp.timestamp = new Date();
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
            // this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      // this.$refs.unfixedthead.refreshValue();
      this.$nextTick(() => {
        this.$refs.unfixedthead.refreshValue();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);

          tempData.timestamp = new Date(); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // console.log("时间", tempData.timestamp, this.temp.timestamp);
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$swal({
        // title: "Are you sure?",
        text: "是否删除 [ " + row.name + " ]",
        type: "warning",
        showCancelButton: true,
        icon: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          // const path = `/vue-element-admin/sequences/delete/${row.sequence_id}`;
          deleteArticle(row.id)
            .then((response) => {
              // handle success
              // this.$swal(
              //   "Deleted",
              //   "You successfully deleted this post",
              //   "success"
              // );
              this.$notify({
                title: "Success",
                message: "Delete Successfully",
                type: "success",
                duration: 2000,
              });
              this.list.splice(index, 1);
              // this.$toasted.success('Successed delete the post.', { icon: 'fingerprint' })
              this.getList(); //重新查询列表
            })
            .catch((error) => {
              // handle error
              console.log(error.response.data);
              this.$notify({
                title: "Failed",
                message: "Delete failed",
                type: "error",
                duration: 2000,
              });
            });
        } else {
          // this.$swal("取消led", "The post is safe :)", "error");
          this.$notify({
            title: "取消",
            message: "Delete canceled",
            type: "warning",
            duration: 2000,
          });
        }
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    // handleDownload() {
    //   this.downloadLoading = true;
    //   import("@/vendor/Export2Excel").then((excel) => {
    //     const tHeader = ["timestamp", "title", "type", "importance", "status"];
    //     const filterVal = [
    //       "timestamp",
    //       "title",
    //       "type",
    //       "importance",
    //       "status",
    //     ];
    //     const data = this.formatJson(filterVal);
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: "table-list",
    //     });
    //     this.downloadLoading = false;
    //   });
    // },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = ["病人id","姓名","病历号","性别","出生日期","家庭地址","Actions"];
          const filterVal = [
            "id",
            "title",
            "author",
            "pageviews",
            "display_time",
          ];
          const list = this.multipleSelection;
          console.log("选择的列表", list);
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "测试",
          });
          this.$refs.multipleTable.clearSelection();
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "Please select at least one item",
          type: "warning",
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // formatJson(filterVal) {
    //   return this.list.map((v) =>
    //     filterVal.map((j) => {
    //       if (j === "timestamp") {
    //         return parseTime(v[j]);
    //       } else {
    //         return v[j];
    //       }
    //     })
    //   );
    // },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
<style lang="scss" scoped>
.el-card {
  width: 98%;
  margin: 15px;
  // height: 90%;
  // background-color: #d4e5f7;
}
.el-divider--horizontal {
  margin: -5px 0px 4px 0px;
  width: 98%;
  background: 0 0;
  border-top: 1px dashed #e8eaec;
}
.el-form-item label:after {
  content: "";
  display: inline-block;
  width: 100%;
}

.el-form-item__label {
  text-align: justify;
  height: 50px;
}

.el-form-item.is-required .el-form-item__label:before {
  content: none !important;
}
.sweetAlert {
  width: 70px;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.el-header {
  background-color: #b3c0d1;
  color: rgb(43, 145, 185);
  line-height: 60px;
}
/*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
.el-drawer__body {
  overflow: auto;
}
/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>
