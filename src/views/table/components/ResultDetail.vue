<template>
  <el-card :body-style="{}" shadow="always" class="card" style="backgroud-color:gray">
    <el-table ref="multipleTable" :key="tableKey" v-loading="listLoading" :data="current_list" border fit highlight-current-row style="width: 98%;" max-height=" 80%" @sort-change="sortChange" element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
      <el-table-column min-width='100px' type="selection" align="center"></el-table-column>
      <el-table-column label="id" width="150px" align="center" v-if="true">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测序批次" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.batch }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SequenceID" prop="id" sortable="custom" align="center" width="180px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.sequence_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="NAME" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name_1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Input" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.data_quality_input }}</span>
        </template>
      </el-table-column>
      <el-table-column label="bam" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.data_quality_bam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="bam/Input(%)" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ Number(row.data_quality_bam_input*100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="uniq.bam" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.data_Quality_uniq_bam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="uniq.nodup.bam" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.data_Quality_uniq_nodup_bam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="uniq.nodup.bam/Input(%)" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ Number(row.data_Quality_uniq_nodup_bam_input*100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Coverage(%)" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ Number(row.coverage*100).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" class="el-icon-edit" size="mini" @click="handleUpdate(row)" :disabled="editAble">
            编辑
          </el-button>
          <!-- <el-button size="mini" class="el-icon-document" type="primary" @click="handleModifyStatus(row,'published')">
            详情
          </el-button> -->
          <el-button size="mini" class="el-icon-delete" type="danger" @click="handleDelete(row,$index)" :disabled="deleteAble">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :append-to-body="true">
      <sample-result ref="unfixedthead" :dataForm="temp" :dialogStatus="dialogStatus" @getList="getList" @resetTemp="resetTemp" />
    </el-dialog>
  </el-card>
  <!-- </el-container> -->
</template>

<script>
import { fetchArticle, removeArticle } from "@/api/result";
import SampleResult from "./SampleResult";

export default {
  name: "",
  components: { SampleResult },
  props: ["current_id", "editAble", "deleteAble"],
  data() {
    return {
      tableKey: 0,
      current_list: [],
      listLoading: false,
      showReviewer: false,
      temp: {
        batch: "",
        collected_date: new Date(),
        introduction: "",
        sample_origin: "",
        sequence_id: "",
        id: "",
        // status: "published",
      },
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      multipleSelection: [],
    };
  },
  watch: {
    current_id(val, oldVal) {
      //普通的watch监听
      console.log("读取id", this.current_id);
      this.getList();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchArticle({ ids: this.current_id.patient_id }).then((response) => {
        console.log(response.data);
        this.current_list = response.data.items;

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
      this.sample_information = true;
      this.$message({
        message: "操作Success",
        type: "error",
      });
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
        this.$refs["dataForm"].clearValidate();
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
        this.$refs["dataForm"].clearValidate();
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
            this.current_list.splice(index, 1, this.temp);
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
      this.$confirm("是否移除 [ " + row.id + " ]", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          removeArticle({ result_id: row.id })
            .then((response) => {
              this.$message({
                type: "success",
                message: "移除成功!",
              });
              this.current_list.splice(index, 1);
              // this.current_id.diseease_id = dis_arr;
              // this.getList(); //重新查询列表
            })
            .catch((error) => {
              // handle error
              console.log("疾病信息移除error", error);
              this.$message({
                // title: "Failed",
                message: "移除失败",
                type: "error",
                // duration: 2000,
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "移除取消",
          });
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
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = ["Id", "Title", "Author", "Readings", "Date"];
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
</style>
