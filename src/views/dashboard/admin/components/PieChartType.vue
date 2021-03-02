<template>
  <div id="my_dataviz"></div>
</template>
<script>
import { fetchCoverage } from "@/api/result";
import * as d3 from "d3";
import * as science from "science";
export default {
  name: "vue-line-chart",
  data() {
    return {
      data: [
        75,
        104,
        369,
        300,
        92,
        64,
        265,
        35,
        287,
        69,
        52,
        23,
        287,
        87,
        114,
        114,
        98,
        137,
        87,
        90,
        63,
        69,
        80,
        113,
        58,
        115,
        30,
        35,
        92,
        460,
        74,
        72,
        63,
        115,
        60,
        75,
        31,
        277,
        52,
        218,
        132,
        316,
        127,
        87,
        449,
        46,
        345,
        48,
        184,
        149,
        345,
        92,
        749,
        93,
        9502,
        138,
        48,
        87,
        103,
        32,
        93,
        57,
        109,
        127,
        149,
        78,
        162,
        173,
        87,
        184,
        288,
        576,
        460,
        150,
        127,
        92,
        84,
        115,
        218,
        404,
        52,
        85,
        66,
        52,
        201,
        287,
        69,
        114,
        379,
        115,
        161,
        91,
        231,
        230,
        822,
        115,
        80,
        58,
        207,
        171,
        156,
        91,
        138,
        104,
        691,
        74,
        87,
        63,
        333,
        125,
        196,
        57,
        92,
        127,
        136,
        129,
        66,
        80,
        115,
        87,
        57,
        172,
        184,
        230,
        153,
        162,
        104,
        165,
        1036,
        69,
        196,
        38,
        92,
        162,
        806,
        105,
        69,
        29,
        633,
        102,
        87,
        345,
        58,
        56,
        35,
        49,
        92,
        156,
        58,
        104,
        167,
        115,
        87,
        800,
        87,
        322,
        65,
        149,
        34,
        69,
        69,
        391,
        58,
        58,
        207,
        61,
        253,
        109,
        69,
        57,
        56,
        114,
        58,
        80,
        149,
        287,
        57,
        138,
        92,
        87,
        103,
        230,
        57,
        724,
        50,
        92,
        79,
        92,
        45,
        196,
        29,
        69,
        253,
        173,
        438,
        173,
        218,
        115,
        58,
        92,
        115,
        230,
        87,
        287,
        53,
        80,
        92,
        89,
        4607,
        173,
        96,
        80,
        115,
        104,
        138,
        92,
        48,
        98,
        231,
        127,
        114,
        91,
        115,
        80,
      ],
      // line: "",
    };
  },
  mounted() {
    this.calculatePath();
  },
  methods: {
    calculatePath() {
      const margin = { top: 30, right: 5, bottom: 100, left: 30 },
        width = 350 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      const svg = d3
        .select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // add the x Axis
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 160)
        .attr("text-anchor", "middle")
        .style("font-size", "15")
        .style("fill", "rgba(0, 123, 255, 1)")
        .text("Coverage");
      const x = d3.scaleLinear().domain([-10, 80]).range([0, width]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      const y = d3.scaleLinear().range([height, 0]).domain([0, 0.08]);
      svg.append("g").call(d3.axisLeft(y));

      var kde = this.kernelDensityEstimator(
        this.kernelEpanechnikov(7),
        x.ticks(60)
      );

      //get date
      fetchCoverage().then((response) => {
        this.data = response.data;
        console.log("数据", this.data);
        const G = this.data
          .filter(function (d) {
            return d.type === "G";
          })
          .map(function (d) {
            return d.value;
          });
        const R = this.data
          .filter(function (d) {
            return d.type === "R";
          })
          .map(function (d) {
            return d.value;
          });
        const EXO = this.data
          .filter(function (d) {
            return d.type === "EXO";
          })
          .map(function (d) {
            return d.value;
          });
        // add the y Axis
        var density1 = kde(
          this.data
            .filter(function (d) {
              return d.type === "G";
            })
            .map(function (d) {
              return d.value;
            })
        );
        var density2 = kde(
          this.data
            .filter(function (d) {
              return d.type === "R";
            })
            .map(function (d) {
              return d.value;
            })
        );
        var density3 = kde(
          this.data
            .filter(function (d) {
              return d.type === "EXO";
            })
            .map(function (d) {
              return d.value;
            })
        );

        // Plot the area
        svg
          .append("path")
          .attr("class", "mypath")
          .datum(density1)
          .attr("fill", "#085A9C")
          .attr("opacity", ".6")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .attr("stroke-linejoin", "round")
          .attr(
            "d",
            d3
              .line()
              .curve(d3.curveBasis)
              .x(function (d) {
                return x(d[0]);
              })
              .y(function (d) {
                return y(d[1]);
              })
          );

        // Plot the area
        svg
          .append("path")
          .attr("class", "mypath")
          .datum(density2)
          .attr("fill", "#ef3b2c")
          .attr("opacity", ".6")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .attr("stroke-linejoin", "round")
          .attr(
            "d",
            d3
              .line()
              .curve(d3.curveBasis)
              .x(function (d) {
                return x(d[0]);
              })
              .y(function (d) {
                return y(d[1]);
              })
          );

        // Plot the area
        svg
          .append("path")
          .attr("class", "mypath")
          .datum(density3)
          .attr("fill", "#FF9418")
          .attr("opacity", ".6")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .attr("stroke-linejoin", "round")
          .attr(
            "d",
            d3
              .line()
              .curve(d3.curveBasis)
              .x(function (d) {
                return x(d[0]);
              })
              .y(function (d) {
                return y(d[1]);
              })
          );
        // Handmade legend
        svg
          .append("circle")
          .attr("cx", 10)
          .attr("cy", 180)
          .attr("r", 6)
          .style("fill", "#085A9C");
        svg
          .append("circle")
          .attr("cx", 120)
          .attr("cy", 180)
          .attr("r", 6)
          .style("fill", "#ef3b2c");

        svg
          .append("circle")
          .attr("cx", 240)
          .attr("cy", 180)
          .attr("r", 6)
          .style("fill", "#FF9418");
        svg
          .append("text")
          .attr("x", 20)
          .attr("y", 180)
          .text(`G [${G.length}]`)
          .style("font-size", "15px")
          .attr("alignment-baseline", "middle");
        svg
          .append("text")
          .attr("x", 130)
          .attr("y", 180)
          .text(`R [${R.length}]`)
          .style("font-size", "15px")
          .attr("alignment-baseline", "middle");
        svg
          .append("text")
          .attr("x", 250)
          .attr("y", 180)
          .text(`EXO [${EXO.length}]`)
          .style("font-size", "15px")
          .attr("alignment-baseline", "middle");
      });
    },
    kernelDensityEstimator(kernel, X) {
      return function (V) {
        return X.map(function (x) {
          return [
            x,
            d3.mean(V, function (v) {
              return kernel(x - v);
            }),
          ];
        });
      };
    },
    kernelEpanechnikov(k) {
      return function (v) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
      };
    },
  },
};
</script>
// <style lang="sass" scoped>
// svg
//   margin: 25px
// path
//   fill: none
//   stroke: #76BF8A
//   stroke-width: 3px
// 
</style>