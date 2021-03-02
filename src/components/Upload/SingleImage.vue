<template>
  <el-upload class="upload-demo" action :http-request="handleUpload" :auto-upload="true" accept=".xlsx, .xls" :before-upload="beforeAvatarUpload" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
    <!-- <el-button type="success" @click="handleUpload">提交</el-button> -->
  </el-upload>
</template>
<script>
import { uploadFile } from "@/api/file_upload";
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function, // eslint-disable-line
  },
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleUpload(param) {
      let fileObj = param.file; // 相当于input里取得的files
      let data = new FormData(); // FormData 对象
      data.append("file", fileObj); // 文件对象
      uploadFile(data)
        .then(() => {
          this.$notify({
            title: "上传成功",
            message: "文件已成功上传",
            type: "success",
            duration: 2000,
          });
          this.onSuccess();
        })
        .catch((error) => {
          console.log("错误", error);
          this.$notify({
            title: "失败",
            message: "上传失败",
            type: "fail",
            duration: 2000,
          });
        });
    },
    beforeAvatarUpload(file) {
      if (this.beforeUpload) {
        this.beforeUpload();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
  },
};
</script>
