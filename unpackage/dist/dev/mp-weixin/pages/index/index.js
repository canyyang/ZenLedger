"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
    const deleteVisible = common_vendor.ref(false);
    const showView = () => {
      visible.value = true;
      grayVisible.value = true;
    };
    const closeView = () => {
      grayVisible.value = false;
      visible.value = false;
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
    const chooseItem = (time) => {
      choosedTime.value = time;
      deleteVisible.value = true;
      grayVisible.value = true;
    };
    const deleteItem = () => {
      store.commit("deleteData", choosedTime.value);
      common_vendor.index.setStorage({
        key: "book",
        data: JSON.stringify(store.state.bookData),
        success: () => {
          console.log("删除成功");
        }
      });
      closeView();
    };
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
        c: deleteVisible.value
      }, deleteVisible.value ? {
        d: common_vendor.o(($event) => closeView()),
        e: common_vendor.o(($event) => deleteItem())
      } : {}, {
        f: visible.value
      }, visible.value ? common_vendor.e({
        g: common_vendor.t(years[currentYear.value]),
        h: common_vendor.o(($event) => setIsYear(true)),
        i: isYear.value ? 1 : "",
        j: common_vendor.t(currentMonth.value),
        k: common_vendor.o(($event) => setIsYear(false)),
        l: !isYear.value ? 1 : "",
        m: isYear.value
      }, isYear.value ? {
        n: common_vendor.f(years, (year2, index, i0) => {
          return {
            a: common_vendor.t(year2),
            b: index,
            c: common_vendor.o(($event) => setCurrentYear(index), index),
            d: currentYear.value == index ? 1 : ""
          };
        }),
        o: scrollTopVal.value
      } : {
        p: common_vendor.f(months, (month2, index, i0) => {
          return {
            a: common_vendor.t(month2),
            b: index,
            c: common_vendor.o(($event) => setCurrentMonth(index), index),
            d: currentMonth.value == index + 1 ? 1 : ""
          };
        })
      }, {
        q: common_vendor.o(($event) => closeView()),
        r: common_vendor.o(($event) => enter())
      }) : {}, {
        s: common_vendor.t(year.value),
        t: common_vendor.t(month.value),
        v: common_vendor.o(($event) => showView()),
        w: common_assets._imports_1,
        x: common_vendor.t(inputSum.value),
        y: isInput.value ? 1 : "",
        z: common_vendor.o(($event) => setInput(true)),
        A: common_vendor.o(($event) => [setInput(false), toFigPath(1)]),
        B: common_assets._imports_1,
        C: common_vendor.t(outputSum.value),
        D: isOutput.value ? 1 : "",
        E: common_vendor.o(($event) => setOutput(true)),
        F: common_vendor.o(($event) => [setOutput(false), toFigPath(0)]),
        G: common_vendor.f(monthData.value, (dayArr, index, i0) => {
          return {
            a: common_vendor.t(dayArr.day),
            b: common_vendor.t(dayArr.weekday),
            c: common_vendor.t(dayArr.sum.toFixed(2)),
            d: common_vendor.f(dayArr.detail, (day, i, i1) => {
              return {
                a: common_vendor.unref(iconSrc)[day.pay_type][day.num_type],
                b: common_vendor.unref(bgColor)[day.pay_type][day.num_type],
                c: common_vendor.t(common_vendor.unref(typeTitle)[day.pay_type][day.num_type]),
                d: "/static/icons/money" + day.pay_type + ".svg",
                e: common_vendor.t(day.pay_num),
                f: day.pay_type == 1 ? 1 : "",
                g: common_vendor.o(($event) => chooseItem(day.time), day.time),
                h: day.time
              };
            }),
            e: index
          };
        }),
        H: common_vendor.t(month.value),
        I: common_assets._imports_1,
        J: common_vendor.o(($event) => toAddPath())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
