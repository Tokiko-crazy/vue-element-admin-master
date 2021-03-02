<template>
  <div class="chart" ref="chart" style="width: 100%; height: 450px"></div>
</template>

<script>
import echarts from "echarts";
import "echarts/theme/macarons"; // echarts theme
import china from "echarts/map/json/china";
import { fetchOrigin } from "@/api/article";
echarts.registerMap("china", china);
export default {
  name: "chart",
  data() {
    return {
      data: null,
      chart: null,
    };
  },
  mounted() {
    if (!this.chart) {
      this.drawChinaMap();
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    drawChinaMap() {
      this.chart = echarts.init(document.querySelector(".chart"), "macarons");
      this.chart.setOption({
        backgroundColor: "#FFFFFF",
        title: {
          text: "样本来源统计数据",
          x: "center",
          textStyle: {
            fontSize: 30,
            color: "rgba(0, 123, 255, 1)",
          },
        },
        tooltip: {
          trigger: "item",
        },
        toolbox: {
          show: true,
          orient: "vertical",
          right: "20",
          top: "center",
          feature: {
            mark: { show: true },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        // 左侧小导航图标
        visualMap: {
          show: true,
          x: "left",
          y: "center",
          splitList: [
            { start: 10000 },
            { start: 1000, end: 9999 },
            { start: 500, end: 999 },
            { start: 100, end: 499 },
            { start: 10, end: 99 },
            { start: 0, end: 9 },
          ],
          color: [
            "#a50026",
            "#d73027",
            "#f46d43",
            "#fdae61",
            "#fee090",
            "#ffffbf",
            "#f0f0f0",
          ],
        },
        //配置属性
      });
      fetchOrigin().then((response) => {
        this.data = response.data;
        this.chart.setOption({
          series: [
            {
              name: "样本数",
              type: "map",
              mapType: "china",
              roam: false, // 是否可缩放
              label: {
                normal: {
                  show: true, //省份名称
                },
                emphasis: {
                  show: false,
                },
              },
              // 地图默认样式
              itemStyle: {
                normal: {
                  show: true,
                  areaColor: "#CECECE",
                  borderColor: "#FCFCFC",
                  borderWidth: "1",
                },
                emphasis: {
                  show: true,
                  areaColor: "#C8A5DF",
                },
              },
              data: this.data,
            },
          ],
        });
      });
    },
  },
};
</script>

<style scoped>
</style>