"use strict";
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  state: {
    bookData: [],
    iconSrc: (
      // [['/static/icons/food.svg', '/static/icons/subway.svg', '/static/icons/milk.svg', '/static/icons/fun.svg',
      [
        [
          "/static/icons/food.svg",
          "/static/icons/subway.svg",
          "/static/icons/snack.svg",
          "/static/icons/milk.svg",
          "/static/icons/hospital.svg",
          "/static/icons/room.svg",
          "/static/icons/love.svg",
          "/static/icons/other.svg"
        ],
        // '/static/icons/hospital.svg', '/static/icons/study.svg',  '/static/icons/room.svg', '/static/icons/love.svg'],
        ["/static/icons/lab.svg", "/static/icons/home.svg", "/static/icons/work.svg", "/static/icons/reimburse.svg"]
      ]
    ),
    bgColor: [
      [
        "#0ABAB5",
        "#87CEEB",
        "#007C92",
        "#006B77",
        "#4682B4",
        "#B0E0E6",
        "#AFEEEE",
        "#20B2AA"
      ],
      ["#97a489", "#7c8c6f", "#b6c5b2", "#e0e5df"]
    ],
    typeTitle: [
      ["三餐", "交通", "零食", "奶茶", "医疗", "日用", "幸福", "其他"],
      // [['三餐', '交通', '零食', '娱乐', '医疗', '学费', '日用', '幸福'], 
      ["工资", "家庭", "兼职", "报销"]
    ],
    weekdayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  },
  mutations: {
    initData(state, bookData2) {
      state.bookData = bookData2;
    },
    addData(state, [book, needSort]) {
      while (state.bookData.findIndex((item) => item.time === book.time) > -1) {
        bookData = {
          ...book,
          time: book.time + 1
        };
      }
      state.bookData.unshift(book);
      if (needSort) {
        state.bookData.sort((a, b) => b.time - a.time);
      }
    },
    editData(state, book) {
      state.bookData = state.bookData.map((item) => {
        if (item.time == book.time) {
          return book;
        }
        return item;
      });
    },
    deleteData(state, time) {
      state.bookData = state.bookData.filter((item) => item.time != time);
    }
  },
  getters: {
    getLength: (state) => (year, month, pay_type) => {
      return state.bookData.filter(
        (item) => new Date(item.time).getFullYear() === year && new Date(item.time).getMonth() + 1 === month && item.pay_type == pay_type
      ).length;
    },
    getSum: (state) => (year, month, pay_type) => {
      const filterArr = state.bookData.filter(
        (item) => new Date(item.time).getFullYear() === year && new Date(item.time).getMonth() + 1 === month && item.pay_type == pay_type
      );
      return Number(filterArr.reduce((sum, item) => {
        return sum + Number(item.pay_num);
      }, 0).toFixed(2));
    }
  }
});
exports.store = store;
