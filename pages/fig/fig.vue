<template>
	<view class="content">
		<view class="gray-box" @click="closeView()" v-if="grayVisible"></view>
		<view class="visible-view" v-if="visible">
			<view class="visible-title">
				<span @click="setIsYear(true)" class="visible-title-item" style="text-align: right;" :class="{'visactive': isYear}">{{years[currentYear]}}</span>
				<span @click="setIsYear(false)" class="visible-title-item" style="text-align: left;" :class="{'visactive': !isYear}">{{currentMonth}}月</span>
			</view>
			<scroll-view :scroll-top="scrollTopVal" show-scrollbar="false" class="visible-content visible-year" v-if="isYear" scroll-y="true">
				<view class="year-item"
					v-for="(year, index) in years"
					:key="index"
					@click="setCurrentYear(index)"
					:class="{'year-active': currentYear == index}">{{year}}</view>
			</scroll-view>
			<view class="visible-content visible-month" v-else>
				<view class="month-item" 
					v-for="(month, index) in months" 
					:key="index"
					@click="setCurrentMonth(index)"
					:class="{'month-active': currentMonth == index + 1}">{{month}}月</view>
			</view>
			<view class="visible-footer">
				<view class="footer-item" @click="closeView()">取消</view>
				<view class="footer-item" @click="enter()">确定</view>
			</view>
		</view>
		<view class="tab">
			<view class="tab-item" @click="showView()">
				<span>{{year}} / {{month}} </span>
			</view>
		</view>
		<view class="book">
			<view class="total">
				<view class="total-item" :class="{'active': payType == 1}" @click="setPayType(1)">
					<span class="total-title">月收入</span>
					<view class="total-num">
						<image class="logo" src="/static/icons/money0.svg" />
						<span>{{sumArray[1]}}</span>
					</view>
				</view>
				<view class="total-item" :class="{'active': payType == 0}" @click="setPayType(0)">
					<span class="total-title">月支出</span>
					<view class="total-num">
						<image class="logo" src="/static/icons/money0.svg" />
						<span>{{sumArray[0]}}</span>
					</view>
				</view>
			</view>
			<view class="detail">
				<view class="detail-item">
					<span class="detail-title">结余</span>
					<view class="detail-num">
						<span class="diff" v-if="sumArray[1].value < sumArray[0].value">-</span>
						<image class="logo" src="/static/icons/money0.svg" />
						<span>{{Math.abs(sumArray[1].value - sumArray[0].value).toFixed(2)}}</span>
					</view>
				</view>
				<view class="detail-middle"></view>
				<view class="detail-item">
					<span class="detail-title">总笔数</span>
					<view class="detail-num">
						<span>{{len}}</span>
					</view>
				</view>
				<view class="detail-middle"></view>
				<view class="detail-item">
					<span class="detail-title">日均额</span>
					<view class="detail-num">
						<image class="logo" src="/static/icons/money0.svg" />
						<span>{{detailData.length ? (sumArray[payType].value / new Date().getDate()).toFixed(2) : 0}}</span>
					</view>
				</view>
			</view>
		</view>
		<view class="charts-box" v-if="sumArray[payType].value > 0">
		    <qiun-data-charts 
		      type="ring" :chartData="chartData" :opts="opts"
		    />
		</view>
		<view class="detail-list" v-if="sumArray[payType].value > 0">
			<view class="detail-list-title">{{payType ?'收入' : '支出'}}排行榜</view>
			<view class="detail-list-item" v-for="(item,index) in detailData" :key="index">
				<view class="detail-list-left" :style="{ backgroundColor: bgColor[payType][item.num_type] }" >
					<image class="detail-list-image" style="width: 1.25em; height: 1.25em;" :src="iconSrc[payType][item.num_type]" />
				</view>
				<view class="detail-list-middle">
					<view class="middle-item" >
						<span class="middle-item-first">{{typeTitle[payType][item.num_type]}}</span>
						<span class="middle-item-second">{{item.percent}}%</span>
					</view>
					<progress stroke-width="4" border-radius="60" :percent="item.percent" :activeColor="bgColor[payType][item.num_type]" active="true" />
				</view>
				<view class="detail-list-right">
					<view class="right-up">
						<image class="logo" style="transform: translateY(0.1em); width: 0.75em; height: 0.75em;" src="/static/icons/money0.svg" />
						<span>{{item.type_sum.toFixed(2)}}</span>
					</view>
					<view class="right-down">{{item.type_num}}笔</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, onMounted, reactive, ref} from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import { useStore } from 'vuex';
	const store = useStore();
	const iconSrc = store.state.iconSrc;
	const bgColor = store.state.bgColor;
	const typeTitle = store.state.typeTitle;
	const weekdayNames = store.state.weekdayNames;
	
	const sumArray = reactive([
		computed(() => store.getters.getSum(year.value, month.value, 0)),
		computed(() => store.getters.getSum(year.value, month.value, 1)),
	]) 
	
	const len = computed(() => store.getters.getLength(year.value, month.value, payType.value))
	
	const year = ref(2023);
	const month = ref(1);
	
	const visible = ref(false);
	const grayVisible = ref(false);
	const showView = () => {visible.value = true; grayVisible.value = true;};
	const closeView = () => {grayVisible.value = false; visible.value = false;};
	
	const scrollTopVal = ref(0);
	const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029];
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	const currentYear = ref(5);
	const setCurrentYear = (index) => {currentYear.value = index};
	const currentMonth = ref(1);
	const setCurrentMonth = (index) => {currentMonth.value = months[index]};
	const isYear = ref(false);
	const setIsYear = (val) => {isYear.value = val};
	const enter = () => {
		year.value = years[currentYear.value];
		month.value = currentMonth.value;
		closeView();
	}
	
	 
	
	
	const payType = ref(0);
	const setPayType = (val) => {payType.value = val};

	const detailData = computed(() => {
		return store.state.bookData.filter((item) => {
				return (new Date(item.time).getFullYear() === year.value) && (new Date(item.time).getMonth() + 1 === month.value) && (item.pay_type == payType.value);
				}).reduce((monthArr, item) => {
					const num_type = item.num_type;
					const index = monthArr.findIndex(dayArr => dayArr.num_type === num_type);
					if (index !== -1 ) {
						let type_sum = Math.round((monthArr[index]['type_sum'] + Number(item.pay_num)) * 100) / 100;
						let percent = Math.round(type_sum / sumArray[payType.value].value * 10000) / 100;
						let type_num = monthArr[index]['type_num'] + 1;
						monthArr[index] = {
							'num_type': num_type,
							'percent': percent,
							'type_sum': type_sum,
							'type_num': type_num
						}
					} else {
						monthArr.push({
							'num_type': num_type,
							'percent': Math.round(item.pay_num / sumArray[payType.value].value * 10000) /100,
							'type_sum': Math.round(Number(item.pay_num) * 100) / 100,
							'type_num': 1
						})
					}
					return monthArr
				}, []).sort((a, b) => b.type_sum - a.type_sum)
	})
	
	const opts = computed(() => {return {
	        color: detailData.value.reduce((arr, item) => {
				       	arr.push(bgColor[payType.value][item.num_type])
				       	return arr
				       }, []),
	        padding: [10,10,10,10],
	        dataLabel: true,
	        enableScroll: false,
	        legend: {
	          show: false
	        },
	        title: {
	          name: payType.value == 0 ? '支出' : '收入',
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
	            labelWidth: 0,
	          }
	        },
	      }})
		  
	const chartData = computed(() => {
		let res = {
		    series: [
		      {
		        data: detailData.value.reduce((arr, item) => {
				       	arr.push({
				       		name: typeTitle[payType.value][item.num_type],
				       		value: item.type_sum
				       	})
				       	return arr
				       }, [])
		      }
		    ]
		  };
		return JSON.parse(JSON.stringify(res));
	});
	
	
	 onLoad((options) => {
	   year.value = Number(options.year);
	   month.value = Number(options.month);
	   payType.value = Number(options.type);
	 })
	  
	onMounted(() => {
		let screenWidth;
		uni.getSystemInfo(({
			success: res => {
				screenWidth = res.windowWidth;
			}
		}))
		currentYear.value = year.value - 2019;
		currentMonth.value = month.value;
		scrollTopVal.value = (13 * (currentYear.value - 2)) * (screenWidth / 100);
	})

</script>

<style scoped>
	.gray-box {
		position: fixed;
		z-index: 2;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.visible-view {
		z-index: 3;
		position: fixed;
		box-sizing: border-box;
		top: 25vh;
		left: 5vw;
		width: 90vw;
		border-radius: 1vw;
	}
	.visible-title {
		display: flex;
		width: 90vw;
		height: 11vh;
		background-color: #617d8b;
	}
	.visible-title-item {
		padding: 0 5vw;
		width: 45vw;
		height: 11vh;
		line-height: 11vh;
		color: #b5c2cb;
		font-size: 10vw;
	}
	.visactive {
		color: #ffffff;
	}
	.visible-content {
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		width: 90vw;
		height: 65vw;
		background-color: #ffffff;
	}
	.visible-year {
		flex-direction: column;
	}
	.year-item {
		width: 90vw;
		height: 13vw;
		text-align: center;
		line-height: 13vw;
		font-size: 5vw;
	}
	.year-active {
		color: #617d8b;
		font-size: 6vw;
	}
	.visible-month {
		padding: 2vh 2vw;
	}
	.month-item {
		box-sizing: border-box;
		width: 21.5vw;
		height: 21.5vw;
		margin-bottom: -1.5vw;
		text-align: center;
		line-height: 21.5vw;
		font-size: 4.5vw;
		border-radius: 50%;
	}
	.month-active {
		background-color: #617d8b;
		color: #ffffff;
	}
	.visible-footer {
		box-sizing: border-box;
		padding-right: 3vw;
		display: flex;
		justify-content: flex-end;
		width: 90vw;
		height: 14vw;
		background-color: #ffffff;
	}
	.footer-item {
		width: 20vw;
		height: 14vw;
		text-align: center;
		line-height: 14vw;
		font-size: 4.0vw;
		color: #617d8b;
		font-weight: bold;
	}
	.tab {
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
		padding-left: 8vw;
		padding-top: 6vh;
		width: 100vw;
		height: 11vh;
		background-color: #ffffff;
		z-index: 1;
	}
	.tab-item {
		display: flex;
		align-items: center;
		width: 30vw;
		height: 5vh;
		background-color: #ffffff;
		z-index: 1;
		font-size: 4vw;
		font-weight: bold;
	}
	.icon {
		margin-top: -0.4em;
		margin-left: 3vw;
		transform: rotate(45deg);
		width: 0.8em;
		height: 0.8em;
	}
	.book {
		margin-top: 12vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.total {
		display: flex;
		box-sizing: border-box;
		padding: 0 10vw;
		justify-content: space-between;
		align-items: center;
		width: 100vw;
		height: 15vh;
	}
	.active {
		background-color: #eeeeee;
	}
	.total-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 2vw;
		width: 35vw;
		height: 9vh;
	}
	.total-title {
		color: gray;
		margin-bottom: 0.8vh;
	}
	.total-num {
		font-size: 6vw;
		font-weight: bold;
	}
	.total-num .logo {
		width: 0.6em; 
		height: 0.6em;
	}
	.detail {
		display: flex;
		box-sizing: border-box;
		padding: 0 2vw;
		justify-content: space-between;
		align-items: center;
		width: 100vw;
		height: 10vh;
	}
	.detail-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 2vw;
		width: 35vw;
		height: 9vh;
	}
	.detail-title {
		color: gray;
		margin-bottom: 0.8vh;
	}
	.detail-num {
		font-size: 5vw;
		font-weight: bold;
		color: #383838;
	}
	.diff {
		font-size: 4vw;
	}
	.detail-num .logo {
		width: 0.6em; 
		height: 0.6em;
	}
	.detail-middle {
		width: 1px;
		height: 6vh;
		background-color: #e6e6e6;
	}
	.middle-item {
		margin-bottom: 1vw;
	}
	.detail-list {
		padding-bottom: 1vh;
	}
	.detail-list-title {
		margin: 2vh 0;
		width: 100vw;
		text-align: center;
		color: darkgray;
	}
	.detail-list-item {
		box-sizing: border-box;
		margin: 2vw 5vw;
		padding: 2vw 5vw;
		width: 90vw;
		height: 14vw;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 1vh;
		border: 1px solid #e6e6e6;
	}
	.detail-list-left {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 10vw;
		height: 10vw;
		border-radius: 50%;
	}
	.detail-list-middle {
		width: 42vw;
		height: 10vw;
	}
	.middle-item-first {
		font-weight: bold;
		font-size: 4vw;
	}
	.middle-item-second {
		padding-left: 2vw;
		font-size: 3.8vw;
		font-weight: bold;
		color: #b0b0b0;
	}
	.detail-list-right {
		padding-left: 1vw;
		width: 19vw;
		height: 10vw;
	}
	.right-up {
		display: flex;
		justify-content: flex-end;
		font-weight: bold;
		font-size: 4vw;
	}
	.right-down {
		text-align: right;
		color: #cbcbcb;
		font-size: 3vw;
	}
	.charts-box {
	    width: 100vw;
	    height: 80vw;
	  }
</style>
