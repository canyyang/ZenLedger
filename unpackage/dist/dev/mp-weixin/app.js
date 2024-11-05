"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/fig/fig.js";
  "./pages/add/add.js";
}
const _sfc_main = {
  onLaunch() {
    common_vendor.index.getStorage({
      key: "book",
      success: (res) => {
        if (res.data) {
          console.log("initialize book data");
          console.log(res.data);
          this.$store.commit("initData", [...JSON.parse(res.data)]);
        }
      },
      fail: (err) => {
        common_vendor.index.setStorage({
          key: "book",
          data: JSON.stringify([]),
          success: () => {
            console.log("添加成功");
          }
        });
      }
    });
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
