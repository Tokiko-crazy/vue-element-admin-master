<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { fetchBeiZhu } from "@/api/article";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "252px",
    },
  },
  data() {
    return {
      chart: null,
      data: [
        { value: 235, name: "未浓缩" },
        { value: 274, name: "已浓缩" },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      fetchBeiZhu()
        .then((response) => {
          this.data = response.data;
          console.log("数据11", this.data);
          this.chart.setOption({
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            series: [
              {
                name: "实验特殊操作备注",
                type: "pie",
                radius: "25%",
                data: this.data,
              },
            ],
          });
        })
        .catch((erro) => {
          console.log("获取数据失败");
        });
    },
  },
};
</script>
