<template>
  <!-- 样本测序结果 -->
  <!-- <div class="app-container"> -->
  <el-card :body-style="{}" shadow="always" class="card">
    <div class="search" style="padding: 5px 0px">
      <div class="filter-container" style="margin-top: -10px; padding: 0px">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          style="margin-right: 10px"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <el-input
          v-model="listQuery.sequence_id"
          placeholder="测序ID"
          style="width: 200px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.batch"
          placeholder="测序批次"
          style="width: 200px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.name_1"
          placeholder="NAME"
          style="width: 200px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <el-divider> </el-divider>
      <div class="" style="height: 40px; padding: 0px">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-circle-plus"
          style="margin-right: 10px"
          @click="handleCreate"
        >
          新增
        </el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          style="margin-right: 10px; margin-left: 0px"
          @click="handleDownload"
        >
          导出模板
        </el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-upload2"
          style="margin-right: 10px; margin-left: 0px"
          @click="dialogExcelVisible = true"
        >
          导入
        </el-button>
        <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
          reviewer
        </el-checkbox> -->
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 98%"
      max-height=" 80%"
      @sort-change="sortChange"
      element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        min-width="100px"
        type="selection"
        align="center"
      ></el-table-column>
      <el-table-column label="id" width="150px" align="center" v-if="true">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测序批次" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.batch }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="SequenceID"
        prop="id"
        sortable="custom"
        align="center"
        width="180px"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.sequence_id }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="结果id" prop="id" sortable="custom" align="center" width="180px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template> -->
      <!-- </el-table-column> -->
      <el-table-column label="NAME" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name_1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Input" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.data_quality_input }}</span>
        </template>
      </el-table-column>
      <el-table-column label="bam" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.data_quality_bam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="bam/Input(%)" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ Number(row.data_quality_bam_input * 100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="uniq.bam" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.data_Quality_uniq_bam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="uniq.nodup.bam" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.data_Quality_uniq_nodup_bam }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="uniq.nodup.bam/Input(%)"
        width="180px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{
            Number(row.data_Quality_uniq_nodup_bam_input * 100).toFixed(2)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Coverage(%)" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ Number(row.coverage * 100).toFixed(2) }}</span>
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
      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            class="el-icon-edit"
            size="mini"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <!-- <el-button size="mini" class="el-icon-document" type="primary" @click="handleModifyStatus(row,'published')">
            详情
          </el-button> -->
          <el-button
            size="mini"
            class="el-icon-delete"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <sample-result
        ref="unfixedthead"
        :dataForm="temp"
        :dialogStatus="dialogStatus"
        @getList="getList"
        @resetTemp="resetTemp"
      />
    </el-dialog>
    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">提交</el-button>
      </span>
    </el-dialog> -->
    <el-dialog :visible.sync="dialogExcelVisible">
      <upload-excel-component
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      />
    </el-dialog>
  </el-card>
</template>

<script>
import {
  fetchList,
  // fetchPv,
  createArticle,
  updateArticle,
  deleteArticle,
  fetchArticle,
  importExcel,
  resultUploadFile,
} from "@/api/result";
// import myForm from "@/views/table/inline-edit-table";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// import role from "mock/role";
import request from "@/utils/request";
// import FixedThead from "./dynamic-table/components/FixedThead";
// import FixedTheadCopy from "./dynamic-table/components/FixedTheadCopy";
import MyForms from "../components/MyForms";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import SampleResult from "../components/SampleResult";

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
    MyForms,
    UploadExcelComponent,
    SampleResult,
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
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        }
      }, 1000);
    };
    return {
      current_list: [],
      sample_information: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sequence_id: undefined,
        importance: undefined,
        type: undefined,
        name_1: undefined,
        batch: undefined,
        sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: 0,
        name_1: "",
        data_quality_input: "",
        data_quality_bam: "",
        data_quality_bam_input: "",
        data_Quality_uniq_bam: "",
        data_Quality_uniq_nodup_bam: "",
        data_Quality_uniq_nodup_bam_input: "",
        coverage: "",
        sequence_id: "",
      },
      dialogFormVisible: false,
      dialogExcelVisible: false,
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
      tableData: [],
      tableHeader: [],
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
      fetchArticle(row.sequence_id).then((response) => {
        console.log("响应完成", response.data);
        this.current_list = response.data;
        console.log("传递给子组件", this.current_list);
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
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
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
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: Number(new Date()),
        title: "",
        status: "published",
        type: "",
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
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
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
        text: "是否删除 [ " + row.sequence_id + " ]",
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
    // handleFetchPv(pv) {
    //   fetchPv(pv).then((response) => {
    //     this.pvData = response.data.pvData;
    //     this.dialogPvVisible = true;
    //   });
    // },
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
   
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = ["id","测序批次","NAME","Input","bam","bam/Input(%)","uniq.bam","uniq.nodup.bam","uniq.nodup.bam/Input(%)","Coverage(%)","Actions"];
          const filterVal = [
            "id",
            "title",
            "author",
            "pageviews",
            "display_time",
          ];
          const list = this.multipleSelection;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "测试",
          });
          this.$refs.multipleTable.clearSelection();
          this.downloadLoading = false;
        });
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
    beforeUpload(file) {
      //上传文件之前的检查文件是否大于1M
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (isLt1M) {
        this.$notify({
          title: "导入中",
          message: "导入需等待一小段时间",
          type: "warning",
          duration: 2000,
        });
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    handleSuccess(rawFile) {
      // this.listLoading = true;
      this.dialogExcelVisible = false;
      this.downloadLoading = true;
      let data = new FormData(); // FormData 对象
      data.append("file", rawFile); // 文件对象
      resultUploadFile(data)
        .then(() => {
          // this.dialogExcelVisible = false;
          this.downloadLoading = false;
          this.$notify({
            title: "上传成功",
            message: "文件已上传成功^-^",
            type: "success",
            duration: 2000,
          });
          this.getList();
        })
        .catch((error) => {
          console.log("错误", error);
          // this.listLoading = false;
          this.downloadLoading = false;
          this.$notify({
            title: "失败",
            message: "文件上传失败-|-",
            type: "fail",
            duration: 2000,
          });
        });
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
</style>
