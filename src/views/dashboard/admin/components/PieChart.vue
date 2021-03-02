<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { fetchDiseaseType } from "@/api/article";

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
        { value: 320, name: "Industries" },
        { value: 240, name: "Technology" },
        { value: 149, name: "Forex" },
        { value: 100, name: "Gold" },
        { value: 59, name: "Forecasts" },
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
      fetchDiseaseType()
        .then((response) => {
          this.data = response.data;
          console.log("数据在这", this.data);
          this.chart.setOption({
            // title: {
            //   text: "疾病类型统计数据",
            //   x: "center",
            //   textStyle: {
            //     fontSize: 30,
            //     color: "rgba(0, 123, 255, 1)",
            //   },
            // },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            // legend: {
            //   left: "left",
            //   bottom: "10",
            //   data: this.data,
            // },
            series: [
              {
                name: "疾病类型统计",
                type: "pie",
                roseType: "radius",
                radius: "25%",
                center: "50%",
                data: this.data,
                animationEasing: "cubicInOut",
                animationDuration: 2600,
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
