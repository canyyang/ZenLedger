"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const store = common_vendor.useStore();
    const iconSrc = store.state.iconSrc;
    const bgColor = store.state.bgColor;
    const typeTitle = store.state.typeTitle;
    const weekdayNames = store.state.weekdayNames;
    const timeInfo = common_vendor.reactive({
      month: 0,
      day: 0,
      weekday: 0
    });
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
    const addPay = () => {
      if (pay_num.value == "")
        return;
      const bookData = {
        time: (/* @__PURE__ */ new Date()).getTime(),
        pay_type: pay_type.value,
        num_type: num_type.value,
        pay_num: Number(pay_num.value).toFixed(2)
      };
      store.commit("addData", bookData);
      common_vendor.index.setStorage({
        key: "book",
        data: JSON.stringify(store.state.bookData),
        success: () => {
          console.log("添加成功");
        }
      });
      toIndexPath();
    };
    const isAdding = common_vendor.computed(() => {
      return pay_num.value.includes("+");
    });
    common_vendor.onMounted(() => {
      const nowDate = /* @__PURE__ */ new Date();
      timeInfo.month = nowDate.getMonth() + 1;
      timeInfo.day = nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate();
      timeInfo.weekday = nowDate.getDay();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.o(($event) => toIndexPath()),
        c: pay_type.value == 1 ? 1 : "",
        d: common_vendor.o(($event) => setPayType(1)),
        e: pay_type.value == 0 ? 1 : "",
        f: common_vendor.o(($event) => setPayType(0)),
        g: common_vendor.t(timeInfo.month),
        h: common_vendor.t(timeInfo.day),
        i: common_vendor.t(common_vendor.unref(weekdayNames)[timeInfo.weekday]),
        j: common_vendor.unref(iconSrc)[pay_type.value][num_type.value],
        k: common_vendor.unref(bgColor)[pay_type.value][num_type.value],
        l: common_vendor.t(common_vendor.unref(typeTitle)[pay_type.value][num_type.value]),
        m: common_assets._imports_1,
        n: common_vendor.t(pay_num.value || "0"),
        o: common_vendor.f(common_vendor.unref(iconSrc)[pay_type.value], (item, index, i0) => {
          return {
            a: item,
            b: common_vendor.unref(bgColor)[pay_type.value][index],
            c: common_vendor.t(common_vendor.unref(typeTitle)[pay_type.value][index]),
            d: num_type.value == index ? 1 : "",
            e: index,
            f: common_vendor.o(($event) => setNumType(index), index)
          };
        }),
        p: common_vendor.f(num_list, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => addNum(item), index)
          };
        }),
        q: common_assets._imports_2,
        r: common_vendor.o(($event) => delNum()),
        s: common_vendor.o(($event) => calNum()),
        t: isAdding.value
      }, isAdding.value ? {
        v: common_vendor.o(($event) => getSum())
      } : {
        w: common_vendor.o(($event) => addPay())
      }, {
        x: common_vendor.unref(bgColor)[pay_type.value][num_type.value]
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e8d2fd40"]]);
wx.createPage(MiniProgramPage);
