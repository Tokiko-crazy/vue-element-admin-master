<template>
  <!-- 样本信息 -->
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
          placeholder="Sequence ID"
          style="width: 150px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.gao_lab_id"
          placeholder="GaoLab ID"
          style="width: 150px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.sample_id"
          placeholder="Sample ID"
          style="width: 150px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.introduction"
          placeholder="说明"
          style="width: 150px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.sample_origin"
          placeholder="样品来源"
          style="width: 150px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />

        <el-select
          v-model="listQuery.importance"
          placeholder="疾病类型"
          clearable
          style="width: 105px; margin-right: 10px"
          class="filter-item"
        >
          <el-option
            v-for="item in importanceOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px;margin-right: 10px;">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" /> -->
        <!-- </el-select> -->
        <!-- <el-select v-model="listQuery.sort" style="width: 140px;margin-right: 10px;" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select> -->
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
      <el-table-column label="测序批次" width="150px" align="center">
        <template slot-scope="{ row }">
          <div v-if="Array.isArray(row.results)">
            <p v-for="item in row.results">{{ item }}&nbsp&nbsp</p>
          </div>
          <span v-else>{{ row.results }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="SequenceID"
        prop="sequence_id"
        :sortable="'custom'"
        :sort-orders="['ascending', 'descending']"
        align="center"
        width="180px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.sequence_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SampleID" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sample_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="疾病类型" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.disease_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="样品来源" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sample_origin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="样品来源(省份)" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sample_origin_province }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="采样日期"
        width="150px"
        align="center"
        prop="collected_date"
        :sortable="'custom'"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="{ row }">
          <span>{{ row.collected_date | parseTime("{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="抽血日期"
        width="150px"
        align="center"
        prop="blood_date"
        :sortable="'custom'"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="{ row }">
          <span>{{ row.blood_date | parseTime("{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="GaoLabID" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.gao_lab_id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实验特殊操作备注（样本过滤、浓缩、建库…)"
        width="300px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.special_operation }}</span>
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
          <el-button
            size="mini"
            class="el-icon-document"
            type="primary"
            @click="handleModifyStatus(row, 'published')"
          >
            详情
          </el-button>
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
      <sample-origin
        ref="sampleorigin"
        :dataForm="temp"
        :dialogStatus="dialogStatus"
        @getList="getList"
        @resetTemp="resetTemp"
      />
    </el-dialog>
    <el-drawer
      title="样本信息详情"
      :with-header="false"
      :visible.sync="sample_information"
      direction="rtl"
      size="60%"
    >
      <!-- <el-container style="padding:0px;"> -->
      <el-header
        style="text-align: left; font-size: 20px; vertical-align: middle"
      >
        <!-- <i class="el-icon-list" style="margin-right: 15px"></i> -->
        <svg-icon icon-class="table" style="margin-right: 15px" />
        <span style="">样本信息详情</span>
      </el-header>
      <el-divider> </el-divider>
      <el-row>
        <el-col :span="24">
          <div class="" style="margin: 20px 25px">样本信息</div>
        </el-col>
        <my-forms
          v-bind:current_id="current_id"
          :editAble="false"
          :deleteAble="true"
        />
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="" style="margin: 20px 25px">患病详情</div>
        </el-col>
        <disease-detail
          v-bind:current_id="disease_detail_ids"
          :editAble="false"
          :deleteAble="false"
        />
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="" style="margin: 20px 25px">测序结果详情</div>
        </el-col>
        <result-detail
          v-bind:current_id="patient_detail_ids"
          :editAble="false"
          :deleteAble="false"
        />
      </el-row>
      <!-- </el-container> -->
    </el-drawer>
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
  createArticle,
  updateArticle,
  deleteArticle,
  fetchArticle,
  importExcel,
  uploadFile,
  fetchArticleInfo,
} from "@/api/article";
// import myForm from "@/views/table/inline-edit-table";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// import role from "mock/role";
import request from "@/utils/request";
// import FixedThead from "./dynamic-table/components/FixedThead";
// import FixedTheadCopy from "./dynamic-table/components/FixedTheadCopy";
import MyForms from "../components/MyForms";
import DiseaseDetail from "../components/DiseaseDetail";
import ResultDetail from "../components/ResultDetail";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import UploadComponent from "@/components/Upload/SingleImage";
import SampleOrigin from "../components/SampleOrigin";

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
    SampleOrigin,
    UploadComponent,
    DiseaseDetail,
    ResultDetail,
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
      disease_detail_ids: [], //疾病详情传入疾病id列表
      patient_detail_ids: [],
      current_id: [],
      sample_information: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        sequence_id: undefined,
        gao_lab_id: undefined,
        introduction: undefined,
        sample_origin: undefined,
        type: undefined,
        sort: {
          sequence_id: "descending",
        },
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
        batch: [],
        collected_date: new Date(),
        introduction: "",
        sample_origin: "",
        sequence_id: "",
        id: "",
        sample_origin_province: "",
        // status: "published",
      },
      dialogFormVisible: false,
      dialogExcelVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新建",
        empty: "",
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
      let that = this
      this.dialogFormVisible = false;
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        // Just to simulate the time of the request
        console.log(this.list);
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
      //进入详情页面传参
      fetchArticleInfo({ id: row.sequence_id }).then((res) => {
        const data = res.data;
        this.disease_detail_ids = {
          diseease_id: data.diseease_id,
          parent_id: row.sequence_id,
        };
        this.patient_detail_ids = {
          patient_id: data.patient_id,
          parent_id: row.sequence_id,
        };
        this.current_id = [row.sequence_id];
        this.sample_information = true;
      });
      row.status = status;
    },
    sortChange(data) {
      // alert("chufa");
      console.log("排序字段", data);
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
        id: undefined,
        textMap: "",
        importance: 1,
        remark: "",
        timestamp: Number(new Date()),
        title: "",
        status: "published",
        type: "",
      };
    },
    handleCreate() {
      //新增事件
      this.resetTemp();
      this.$refs.sampleorigin.reset();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.sampleorigin.reset();
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
      this.$nextTick(() => {
        this.$refs.sampleorigin.refreshValue(this.temp);
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
          deleteArticle(row.sequence_id)
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
          const tHeader = ["测序批次", "SequenceID", "SampleID", "说明", "疾病类型","样片来源","样片来源省份","采样日期","抽血日期","GaoLabID","实验特殊操作备注（样本过滤、浓缩、建库…)"];
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
      const sort = this.listQuery.sort.key;
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
      uploadFile(data)
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
/* 全局样式 */
<style>
.el-drawer.rtl {
  overflow: scroll;
}
</style>
