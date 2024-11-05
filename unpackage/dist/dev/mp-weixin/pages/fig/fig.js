"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  _easycom_qiun_data_charts2();
}
const _easycom_qiun_data_charts = () => "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  _easycom_qiun_data_charts();
}
const _sfc_main = {
  __name: "fig",
  setup(__props) {
    const store = common_vendor.useStore();
    const iconSrc = store.state.iconSrc;
    const bgColor = store.state.bgColor;
    const typeTitle = store.state.typeTitle;
    store.state.weekdayNames;
    const sumArray = common_vendor.reactive([
      common_vendor.computed(() => store.getters.getSum(year.value, month.value, 0)),
      common_vendor.computed(() => store.getters.getSum(year.value, month.value, 1))
    ]);
    const len = common_vendor.computed(() => store.getters.getLength(year.value, month.value, payType.value));
    const year = common_vendor.ref(2023);
    const month = common_vendor.ref(1);
    const visible = common_vendor.ref(false);
    const grayVisible = common_vendor.ref(false);
    const showView = () => {
      visible.value = true;
      grayVisible.value = true;
    };
    const closeView = () => {
      grayVisible.value = false;
      visible.value = false;
    };
    const scrollTopVal = common_vendor.ref(0);
    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const currentYear = common_vendor.ref(5);
    const setCurrentYear = (index) => {
      currentYear.value = index;
    };
    const currentMonth = common_vendor.ref(1);
    const setCurrentMonth = (index) => {
      currentMonth.value = months[index];
    };
    const isYear = common_vendor.ref(false);
    const setIsYear = (val) => {
      isYear.value = val;
    };
    const enter = () => {
      year.value = years[currentYear.value];
      month.value = currentMonth.value;
      closeView();
    };
    const payType = common_vendor.ref(0);
    const setPayType = (val) => {
      payType.value = val;
    };
    const detailData = common_vendor.computed(() => {
      return store.state.bookData.filter((item) => {
        return new Date(item.time).getFullYear() === year.value && new Date(item.time).getMonth() + 1 === month.value && item.pay_type == payType.value;
      }).reduce((monthArr, item) => {
        const num_type = item.num_type;
        const index = monthArr.findIndex((dayArr) => dayArr.num_type === num_type);
        if (index !== -1) {
          let type_sum = Math.round((monthArr[index]["type_sum"] + Number(item.pay_num)) * 100) / 100;
          let percent = Math.round(type_sum / sumArray[payType.value].value * 1e4) / 100;
          let type_num = monthArr[index]["type_num"] + 1;
          monthArr[index] = {
            "num_type": num_type,
            "percent": percent,
            "type_sum": type_sum,
            "type_num": type_num
          };
        } else {
          monthArr.push({
            "num_type": num_type,
            "percent": Math.round(item.pay_num / sumArray[payType.value].value * 1e4) / 100,
            "type_sum": Math.round(Number(item.pay_num) * 100) / 100,
            "type_num": 1
          });
        }
        return monthArr;
      }, []).sort((a, b) => b.type_sum - a.type_sum);
    });
    const opts = common_vendor.computed(() => {
      return {
        color: detailData.value.reduce((arr, item) => {
          arr.push(bgColor[payType.value][item.num_type]);
          return arr;
        }, []),
        padding: [10, 10, 10, 10],
        dataLabel: true,
        enableScroll: false,
        legend: {
          show: false
        },
        title: {
          name: payType.value == 0 ? "支出" : "收入",
          fontSize: 20,
          color: "#555555"
        },
        // tooltipShow: false,
        dataLabel: false,
        extra: {
          ring: {
            ringWidth: 50,
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 0
          }
        }
      };
    });
    const chartData = common_vendor.computed(() => {
      let res = {
        series: [
          {
            data: detailData.value.reduce((arr, item) => {
              arr.push({
                name: typeTitle[payType.value][item.num_type],
                value: item.type_sum
              });
              return arr;
            }, [])
          }
        ]
      };
      return JSON.parse(JSON.stringify(res));
    });
    common_vendor.onLoad((options) => {
      year.value = Number(options.year);
      month.value = Number(options.month);
      payType.value = Number(options.type);
    });
    common_vendor.onMounted(() => {
      let screenWidth;
      common_vendor.index.getSystemInfo({
        success: (res) => {
          screenWidth = res.windowWidth;
        }
      });
      currentYear.value = year.value - 2019;
      currentMonth.value = month.value;
      scrollTopVal.value = 13 * (currentYear.value - 2) * (screenWidth / 100);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: grayVisible.value
      }, grayVisible.value ? {
        b: common_vendor.o(($event) => closeView())
      } : {}, {
        c: visible.value
      }, visible.value ? common_vendor.e({
        d: common_vendor.t(years[currentYear.value]),
        e: common_vendor.o(($event) => setIsYear(true)),
        f: isYear.value ? 1 : "",
        g: common_vendor.t(currentMonth.value),
        h: common_vendor.o(($event) => setIsYear(false)),
        i: !isYear.value ? 1 : "",
        j: isYear.value
      }, isYear.value ? {
        k: common_vendor.f(years, (year2, index, i0) => {
          return {
            a: common_vendor.t(year2),
            b: index,
            c: common_vendor.o(($event) => setCurrentYear(index), index),
            d: currentYear.value == index ? 1 : ""
          };
        }),
        l: scrollTopVal.value
      } : {
        m: common_vendor.f(months, (month2, index, i0) => {
          return {
            a: common_vendor.t(month2),
            b: index,
            c: common_vendor.o(($event) => setCurrentMonth(index), index),
            d: currentMonth.value == index + 1 ? 1 : ""
          };
        })
      }, {
        n: common_vendor.o(($event) => closeView()),
        o: common_vendor.o(($event) => enter())
      }) : {}, {
        p: common_vendor.t(year.value),
        q: common_vendor.t(month.value),
        r: common_vendor.o(($event) => showView()),
        s: common_assets._imports_1,
        t: common_vendor.t(sumArray[1]),
        v: payType.value == 1 ? 1 : "",
        w: common_vendor.o(($event) => setPayType(1)),
        x: common_assets._imports_1,
        y: common_vendor.t(sumArray[0]),
        z: payType.value == 0 ? 1 : "",
        A: common_vendor.o(($event) => setPayType(0)),
        B: sumArray[1].value < sumArray[0].value
      }, sumArray[1].value < sumArray[0].value ? {} : {}, {
        C: common_assets._imports_1,
        D: common_vendor.t(Math.abs(sumArray[1].value - sumArray[0].value).toFixed(2)),
        E: common_vendor.t(len.value),
        F: common_assets._imports_1,
        G: common_vendor.t(detailData.value.length ? (sumArray[payType.value].value / (/* @__PURE__ */ new Date()).getDate()).toFixed(2) : 0),
        H: sumArray[payType.value].value > 0
      }, sumArray[payType.value].value > 0 ? {
        I: common_vendor.p({
          type: "ring",
          chartData: chartData.value,
          opts: opts.value
        })
      } : {}, {
        J: sumArray[payType.value].value > 0
      }, sumArray[payType.value].value > 0 ? {
        K: common_vendor.t(payType.value ? "收入" : "支出"),
        L: common_vendor.f(detailData.value, (item, index, i0) => {
          return {
            a: common_vendor.unref(iconSrc)[payType.value][item.num_type],
            b: common_vendor.unref(bgColor)[payType.value][item.num_type],
            c: common_vendor.t(common_vendor.unref(typeTitle)[payType.value][item.num_type]),
            d: common_vendor.t(item.percent),
            e: item.percent,
            f: common_vendor.unref(bgColor)[payType.value][item.num_type],
            g: common_vendor.t(item.type_sum.toFixed(2)),
            h: common_vendor.t(item.type_num),
            i: index
          };
        }),
        M: common_assets._imports_1
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c7009475"]]);
wx.createPage(MiniProgramPage);
