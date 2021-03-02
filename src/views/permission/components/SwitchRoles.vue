<template>
  <div class="app-container">
    <el-table v-loading="Loading" :data="dataList" border fit highlight-current-row style="width: 50%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" label="用户名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" label="用户角色" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.role_id" placeholder="角色" style="width: 90px;margin-right: 10px;" class="filter-item">
              <el-option v-for="(item,rolev) in roleOptions" :key="item" :label="rolev" :value="item" />
            </el-select>
            <!-- <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
              取消
            </el-button> -->
          </template>
          <span v-else>{{ row.role_id | statusFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{row}">
          <el-button v-if="row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">
            确认
          </el-button>
          <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="row.edit=!row.edit">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRoles, updateRole, deleteRole } from "@/api/role";
export default {
  name: "RoleTabele",
  props: ["dataList", "Loading"],
  filters: {
    statusFilter(status) {
      const statusMap = {
        2: "实验员",
        1: "访客",
        3: "管理员",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      // list: null,
      // listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
      },
      roleOptions: {
        访客: 1,
        实验员: 2,
        管理员: 3,
      },
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // const { data } = await getRoles(this.listQuery);
      // const items = data.items;
      this.list = this.dataList.map((v) => {
        this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
        // v.originalTitle = v.title; //  will be used when user click the cancel botton
        return v;
      });
      this.listLoading = false;
    },
    cancelEdit(row) {
      row.title = row.originalTitle;
      row.edit = false;
      this.$message({
        message: "The title has been restored to the original value",
        type: "warning",
      });
    },
    confirmEdit(row) {
      row.edit = false;
      // row.role_id = row.role_id;
      updateRole(row)
        .then((response) => {
          this.$message({
            message: "角色修改成功",
            type: "success",
          });
        })
        .catch({
          message: "角色修改失败",
          type: "fail",
        });
    },
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>