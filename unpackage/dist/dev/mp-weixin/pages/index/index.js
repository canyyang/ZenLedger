"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_tool = require("../../utils/tool.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = common_vendor.useStore();
    const iconSrc = store.state.iconSrc;
    const bgColor = store.state.bgColor;
    const typeTitle = store.state.typeTitle;
    const weekdayNames = store.state.weekdayNames;
    const year = common_vendor.ref(2023);
    const month = common_vendor.ref(1);
    const visible = common_vendor.ref(false);
    const grayVisible = common_vendor.ref(false);
    const detailVisible = common_vendor.ref(false);
    const deleteVisible = common_vendor.ref(false);
    const showView = () => {
      visible.value = true;
      grayVisible.value = true;
    };
    const closeView = () => {
      grayVisible.value = false;
      visible.value = false;
      detailVisible.value = false;
      deleteVisible.value = false;
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
    const isInput = common_vendor.ref(false);
    const setInput = (val) => {
      isInput.value = val;
    };
    const isOutput = common_vendor.ref(false);
    const setOutput = (val) => {
      isOutput.value = val;
    };
    const monthData = common_vendor.computed(() => {
      return store.state.bookData.filter((item) => {
        return new Date(item.time).getFullYear() === year.value && new Date(item.time).getMonth() + 1 === month.value;
      }).reduce((monthArr, item) => {
        const day = new Date(item.time).getDate();
        const weekday = new Date(item.time).getDay();
        const index = monthArr.findIndex((dayArr) => dayArr.day === day);
        if (index !== -1) {
          if (item.pay_type === 0)
            monthArr[index]["sum"] += Number(item.pay_num);
          monthArr[index]["detail"].push(item);
        } else {
          monthArr.push({
            day,
            weekday: weekdayNames[weekday],
            sum: item.pay_type === 0 ? Number(item.pay_num) : 0,
            detail: [item]
          });
        }
        return monthArr;
      }, []);
    });
    const inputSum = common_vendor.computed(() => store.getters.getSum(year.value, month.value, 1));
    const outputSum = common_vendor.computed(() => store.getters.getSum(year.value, month.value, 0));
    const choosedTime = common_vendor.ref(0);
    const showItem = (time) => {
      choosedTime.value = time;
      detailVisible.value = true;
      grayVisible.value = true;
    };
    const chooseItem = (time) => {
      choosedTime.value = time;
      deleteVisible.value = true;
      grayVisible.value = true;
    };
    const deleteItem = () => {
      store.commit("deleteData", choosedTime.value);
      common_vendor.index.setStorage({
        key: "book",
        data: JSON.stringify(store.state.bookData)
      });
      closeView();
    };
    const currentItem = common_vendor.computed(() => {
      console.log(store.state.bookData.find((item) => item.time === choosedTime.value));
      return store.state.bookData.find((item) => item.time === choosedTime.value);
    });
    common_vendor.onMounted(() => {
      let screenWidth;
      common_vendor.index.getSystemInfo({
        success: (res) => {
          screenWidth = res.windowWidth;
        }
      });
      const nowDate = /* @__PURE__ */ new Date();
      year.value = nowDate.getFullYear();
      month.value = nowDate.getMonth() + 1;
      currentYear.value = nowDate.getFullYear() - 2019;
      currentMonth.value = nowDate.getMonth() + 1;
      scrollTopVal.value = 13 * (currentYear.value - 2) * (screenWidth / 100);
    });
    const toEditPath = () => {
      common_vendor.index.navigateTo({ url: `/pages/add/add?time=${choosedTime.value}` });
    };
    const toAddPath = () => {
      common_vendor.index.navigateTo({ url: "/pages/add/add" });
    };
    const toFigPath = (type) => {
      common_vendor.index.navigateTo({ url: `/pages/fig/fig?year=${year.value}&month=${month.value}&type=${type}` });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: grayVisible.value
      }, grayVisible.value ? {
        b: common_vendor.o(($event) => closeView())
      } : {}, {
        c: detailVisible.value
      }, detailVisible.value ? common_vendor.e({
        d: common_vendor.t(common_vendor.unref(typeTitle)[currentItem.value.pay_type][currentItem.value.num_type]),
        e: common_vendor.t(currentItem.value.pay_num),
        f: common_vendor.t(new Date(currentItem.value.time).getFullYear()),
        g: common_vendor.t(new Date(currentItem.value.time).getMonth() + 1),
        h: common_vendor.t(new Date(currentItem.value.time).getDate()),
        i: common_vendor.t(common_vendor.unref(utils_tool.filterNum)(new Date(currentItem.value.time).getHours())),
        j: common_vendor.t(common_vendor.unref(utils_tool.filterNum)(new Date(currentItem.value.time).getMinutes())),
        k: currentItem.value.remark != ""
      }, currentItem.value.remark != "" ? {
        l: common_vendor.t(currentItem.value.remark)
      } : {}, {
        m: common_assets._imports_0,
        n: common_vendor.o(($event) => toEditPath(choosedTime.value))
      }) : {}, {
        o: deleteVisible.value
      }, deleteVisible.value ? {
        p: common_vendor.o(($event) => closeView()),
        q: common_vendor.o(($event) => deleteItem())
      } : {}, {
        r: visible.value
      }, visible.value ? common_vendor.e({
        s: common_vendor.t(years[currentYear.value]),
        t: common_vendor.o(($event) => setIsYear(true)),
        v: isYear.value ? 1 : "",
        w: common_vendor.t(currentMonth.value),
        x: common_vendor.o(($event) => setIsYear(false)),
        y: !isYear.value ? 1 : "",
        z: isYear.value
      }, isYear.value ? {
        A: common_vendor.f(years, (year2, index, i0) => {
          return {
            a: common_vendor.t(year2),
            b: index,
            c: common_vendor.o(($event) => setCurrentYear(index), index),
            d: currentYear.value == index ? 1 : ""
          };
        }),
        B: scrollTopVal.value
      } : {
        C: common_vendor.f(months, (month2, index, i0) => {
          return {
            a: common_vendor.t(month2),
            b: index,
            c: common_vendor.o(($event) => setCurrentMonth(index), index),
            d: currentMonth.value == index + 1 ? 1 : ""
          };
        })
      }, {
        D: common_vendor.o(($event) => closeView()),
        E: common_vendor.o(($event) => enter())
      }) : {}, {
        F: common_vendor.t(year.value),
        G: common_vendor.t(month.value),
        H: common_vendor.o(($event) => showView()),
        I: common_assets._imports_1,
        J: common_vendor.t(inputSum.value),
        K: isInput.value ? 1 : "",
        L: common_vendor.o(($event) => setInput(true)),
        M: common_vendor.o(($event) => [setInput(false), toFigPath(1)]),
        N: common_assets._imports_1,
        O: common_vendor.t(outputSum.value),
        P: isOutput.value ? 1 : "",
        Q: common_vendor.o(($event) => setOutput(true)),
        R: common_vendor.o(($event) => [setOutput(false), toFigPath(0)]),
        S: common_vendor.f(monthData.value, (dayArr, index, i0) => {
          return {
            a: common_vendor.t(dayArr.day),
            b: common_vendor.t(dayArr.weekday),
            c: common_vendor.t(dayArr.sum.toFixed(2)),
            d: common_vendor.f(dayArr.detail, (day, i, i1) => {
              return {
                a: common_vendor.unref(iconSrc)[day.pay_type][day.num_type],
                b: common_vendor.unref(bgColor)[day.pay_type][day.num_type],
                c: common_vendor.t(day.num_type == 7 ? day.remark || common_vendor.unref(typeTitle)[day.pay_type][day.num_type] : common_vendor.unref(typeTitle)[day.pay_type][day.num_type]),
                d: "/static/icons/money" + day.pay_type + ".svg",
                e: common_vendor.t(day.pay_num),
                f: day.pay_type == 1 ? 1 : "",
                g: common_vendor.o(($event) => showItem(day.time), day.time),
                h: common_vendor.o(($event) => chooseItem(day.time), day.time),
                i: day.time
              };
            }),
            e: index
          };
        }),
        T: common_vendor.t(month.value),
        U: common_assets._imports_1,
        V: common_vendor.o(($event) => toAddPath())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
