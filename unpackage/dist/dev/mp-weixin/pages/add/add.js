"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_tool = require("../../utils/tool.js");
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const store = common_vendor.useStore();
    const iconSrc = store.state.iconSrc;
    const bgColor = store.state.bgColor;
    const typeTitle = store.state.typeTitle;
    const weekdayNames = store.state.weekdayNames;
    const visible = common_vendor.ref(false);
    const grayVisible = common_vendor.ref(false);
    const showView = () => {
      if (isEdit.value == 0) {
        visible.value = true;
        grayVisible.value = true;
      }
    };
    const closeView = () => {
      grayVisible.value = false;
      visible.value = false;
    };
    const isMonth = common_vendor.ref(true);
    const setIsMonth = (val) => {
      isMonth.value = val;
    };
    const currentMonth = common_vendor.ref(0);
    const currentDay = common_vendor.ref(0);
    const setCurrentMonth = (val) => {
      currentMonth.value = val;
    };
    const setCurrentDay = (val) => {
      currentDay.value = val;
    };
    const scrollTopVal = common_vendor.ref(0);
    const month = common_vendor.ref(1);
    const day = common_vendor.ref(1);
    const days = common_vendor.computed(() => {
      const date = /* @__PURE__ */ new Date();
      const year = date.getFullYear();
      const lastDayOfMonth = new Date(year, currentMonth.value, 0);
      return lastDayOfMonth.getDate();
    });
    const weekday = common_vendor.computed(() => {
      const date = /* @__PURE__ */ new Date();
      date.setMonth(month.value - 1);
      date.setDate(day.value);
      return date.getDay();
    });
    const enter = () => {
      month.value = currentMonth.value;
      day.value = currentDay.value;
      closeView();
    };
    const isEdit = common_vendor.ref(0);
    const num_list = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "."];
    const toIndexPath = () => {
      common_vendor.index.reLaunch({ url: "/pages/index/index" });
    };
    const pay_type = common_vendor.ref(0);
    const setPayType = (value) => {
      pay_type.value = value;
      num_type.value = 0;
      pay_num.value = "";
    };
    const num_type = common_vendor.ref(0);
    const setNumType = (value) => {
      num_type.value = value;
    };
    const pay_num = common_vendor.ref("");
    const addNum = (num) => {
      if (pay_num.value.length > 12)
        return;
      if (num == "")
        return;
      if (num == "." && (pay_num.value.lastIndexOf(".") > pay_num.value.lastIndexOf("+") || pay_num.value.lastIndexOf("+") == pay_num.value.length - 1))
        return;
      if (pay_num.value.includes(".") && pay_num.value.lastIndexOf(".") == pay_num.value.length - 3 && pay_num.value.lastIndexOf(".") > pay_num.value.lastIndexOf("+"))
        return;
      if (num == "0" && pay_num.value[pay_num.value.length - 1] == "0" && pay_num.value.lastIndexOf(".") > pay_num.value.length - 3)
        return;
      pay_num.value += num;
    };
    const delNum = () => {
      pay_num.value = pay_num.value.slice(0, pay_num.value.length - 1);
    };
    const calNum = () => {
      if (pay_num.value.lastIndexOf("+") == pay_num.value.length - 1)
        return;
      if (pay_num.value.includes("+")) {
        const pay_part = pay_num.value.split("+");
        pay_num.value = String((Number(pay_part[0]) + Number(pay_part[1])).toFixed(2));
      }
      pay_num.value += "+";
    };
    const getSum = () => {
      const pay_part = pay_num.value.split("+");
      pay_num.value = String((Number(pay_part[0]) + Number(pay_part[1])).toFixed(2));
    };
    const remark = common_vendor.ref("");
    const addPay = () => {
      if (pay_num.value == "")
        return;
      let needSort = false;
      if (isEdit.value == 0) {
        let date = /* @__PURE__ */ new Date();
        if (date.getMonth() !== month.value - 1) {
          date.setMonth(month.value - 1);
          needSort = true;
        }
        if (date.getDate() !== day.value) {
          date.setDate(day.value);
          needSort = true;
        }
        const bookData = {
          time: date.getTime(),
          pay_type: pay_type.value,
          num_type: num_type.value,
          pay_num: Number(pay_num.value).toFixed(2),
          remark: remark.value
        };
        console.log(bookData);
        store.commit("addData", [bookData, needSort]);
        console.log("添加成功");
      } else {
        const bookData = {
          time: isEdit.value,
          pay_type: pay_type.value,
          num_type: num_type.value,
          pay_num: Number(pay_num.value).toFixed(2),
          remark: remark.value
        };
        store.commit("editData", bookData);
        console.log("修改成功");
      }
      common_vendor.index.setStorage({
        key: "book",
        data: JSON.stringify(store.state.bookData)
      });
      toIndexPath();
    };
    const isAdding = common_vendor.computed(() => {
      return pay_num.value.includes("+");
    });
    common_vendor.onLoad((options) => {
      let nowDate;
      if (options && options.time) {
        isEdit.value = Number(options.time);
        const item = store.state.bookData.find((item2) => item2.time == options.time);
        pay_type.value = item.pay_type;
        num_type.value = item.num_type;
        pay_num.value = item.pay_num;
        nowDate = new Date(Number(options.time));
      } else {
        nowDate = /* @__PURE__ */ new Date();
      }
      currentMonth.value = nowDate.getMonth() + 1;
      month.value = nowDate.getMonth() + 1;
      currentDay.value = nowDate.getDate();
      day.value = nowDate.getDate();
    });
    common_vendor.onMounted(() => {
      let screenWidth;
      common_vendor.index.getSystemInfo({
        success: (res) => {
          screenWidth = res.windowWidth;
        }
      });
      scrollTopVal.value = 13 * (currentDay.value - 3) * (screenWidth / 100);
      scrollTopVal.value = scrollTopVal.value > 0 ? scrollTopVal.value : 0;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: grayVisible.value
      }, grayVisible.value ? {
        b: common_vendor.o(($event) => closeView())
      } : {}, {
        c: visible.value
      }, visible.value ? common_vendor.e({
        d: common_vendor.t(currentMonth.value),
        e: common_vendor.o(($event) => setIsMonth(true)),
        f: isMonth.value ? 1 : "",
        g: common_vendor.t(currentDay.value),
        h: common_vendor.o(($event) => setIsMonth(false)),
        i: !isMonth.value ? 1 : "",
        j: isMonth.value
      }, isMonth.value ? {
        k: common_vendor.f(12, (month2, k0, i0) => {
          return {
            a: common_vendor.t(month2),
            b: month2,
            c: common_vendor.o(($event) => setCurrentMonth(month2), month2),
            d: currentMonth.value == month2 ? 1 : ""
          };
        })
      } : {
        l: common_vendor.f(days.value, (day2, k0, i0) => {
          return {
            a: common_vendor.t(day2),
            b: day2,
            c: common_vendor.o(($event) => setCurrentDay(day2), day2),
            d: currentDay.value == day2 ? 1 : ""
          };
        }),
        m: scrollTopVal.value
      }, {
        n: common_vendor.o(($event) => closeView()),
        o: common_vendor.o(($event) => enter())
      }) : {}, {
        p: common_assets._imports_0$1,
        q: common_vendor.o(($event) => toIndexPath()),
        r: pay_type.value == 1 ? 1 : "",
        s: common_vendor.o(($event) => setPayType(1)),
        t: pay_type.value == 0 ? 1 : "",
        v: common_vendor.o(($event) => setPayType(0)),
        w: common_vendor.t(common_vendor.unref(utils_tool.filterNum)(month.value)),
        x: common_vendor.t(common_vendor.unref(utils_tool.filterNum)(day.value)),
        y: common_vendor.t(common_vendor.unref(weekdayNames)[weekday.value]),
        z: common_vendor.o(($event) => showView()),
        A: common_vendor.unref(iconSrc)[pay_type.value][num_type.value],
        B: common_vendor.unref(bgColor)[pay_type.value][num_type.value],
        C: common_vendor.t(common_vendor.unref(typeTitle)[pay_type.value][num_type.value]),
        D: common_assets._imports_1,
        E: common_vendor.t(pay_num.value || "0"),
        F: common_vendor.f(common_vendor.unref(iconSrc)[pay_type.value], (item, index, i0) => {
          return {
            a: item,
            b: common_vendor.unref(bgColor)[pay_type.value][index],
            c: common_vendor.t(common_vendor.unref(typeTitle)[pay_type.value][index]),
            d: num_type.value == index ? 1 : "",
            e: index,
            f: common_vendor.o(($event) => setNumType(index), index)
          };
        }),
        G: remark.value,
        H: common_vendor.o(($event) => remark.value = $event.detail.value),
        I: common_vendor.f(num_list, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => addNum(item), index)
          };
        }),
        J: common_assets._imports_2,
        K: common_vendor.o(($event) => delNum()),
        L: common_vendor.o(($event) => calNum()),
        M: isAdding.value
      }, isAdding.value ? {
        N: common_vendor.o(($event) => getSum())
      } : {
        O: common_vendor.o(($event) => addPay())
      }, {
        P: common_vendor.unref(bgColor)[pay_type.value][num_type.value]
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e8d2fd40"]]);
wx.createPage(MiniProgramPage);
