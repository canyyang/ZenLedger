<template>
	<view class="content">
		<view class="gray-box" @click="closeView()" v-if="grayVisible"></view>
		<view class="delete-box" v-if="deleteVisible">
			<view class="delete-title">提示</view>
			<view>确认删除该交易记录？</view>
			<view class="delete-footer">
				<view class="delete-footer-item" @click="closeView()">取消</view>
				<view class="delete-footer-item" @click="deleteItem()">删除</view>
			</view>
		</view>
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
				<view class="total-item" :class="{'active': isInput}" @touchstart="setInput(true)" @touchend="[setInput(false), toFigPath(1)]">
					<span class="total-title">月收入</span>
					<view class="total-num">
						<image class="logo" src="/static/icons/money0.svg" />
						<span>{{inputSum}}</span>
					</view>
				</view>
				<view class="middle"></view>
				<view class="total-item" :class="{'active': isOutput}" @touchstart="setOutput(true)" @touchend="[setOutput(false), toFigPath(0)]">
					<span class="total-title">月支出</span>
					<view class="total-num">
						<image class="logo" src="/static/icons/money0.svg" />
						<span>{{outputSum}}</span>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="list-group" v-for="(dayArr, index) in monthData" :key="index">
					<view class="list-title">
						<view class="left">
							<span class="day">{{month}}/{{dayArr.day}}</span>
							<span class="weekday">{{dayArr.weekday}}</span>
						</view>
						<view class="right">
							<image class="logo" style="width: 0.75em; height: 0.75em;" src="/static/icons/money0.svg" />
							<span>{{dayArr.sum.toFixed(2)}}</span>
						</view>
					</view>
					<view class="list-item" @longpress="chooseItem(day.time)" v-for="(day, i) in dayArr.detail" :key="day.time">
						<view class="item-left">
							<view class="item-box" :style="{ backgroundColor: bgColor[day.pay_type][day.num_type] }" >
								<image class="item-logo" style="width: 1.25em; height: 1.25em;" :src="iconSrc[day.pay_type][day.num_type]" />
							</view>
							<span>{{typeTitle[day.pay_type][day.num_type]}}</span>
						</view>
						<view class="item-right">
							<image class="logo" style="width: 0.7em; height: 0.7em;" :src="'/static/icons/money' + day.pay_type + '.svg'" />
							<span :class="{ 'highlightnum': day.pay_type == 1 }">{{day.pay_num}}</span>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add" @click="toAddPath()">+</view>
	</view>
</template>

<script setup>
	import { computed, onMounted, reactive, ref, watch } from 'vue';
	import { useStore } from 'vuex';
	const store = useStore();
	const iconSrc = store.state.iconSrc;
	const bgColor = store.state.bgColor;
	const typeTitle = store.state.typeTitle;
	const weekdayNames = store.state.weekdayNames;
	
	const year = ref(2023);
	const month = ref(1);
	
	const visible = ref(false);
	const grayVisible = ref(false);
	const deleteVisible = ref(false);
	const showView = () => {visible.value = true; grayVisible.value = true;};
	const closeView = () => {grayVisible.value = false; visible.value = false; deleteVisible.value = false;};
	
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
	
	const isInput = ref(false);
	const setInput = (val) => {isInput.value = val};
	const isOutput = ref(false);
	const setOutput = (val) => {isOutput.value = val};
	
	
	const monthData = computed(() => {
		return store.state.bookData.filter((item) => {
				return (new Date(item.time).getFullYear() === year.value) && (new Date(item.time).getMonth() + 1 === month.value) ;
			}).reduce((monthArr, item) => {
			const day = new Date(item.time).getDate();
			const weekday = new Date(item.time).getDay();
			const index = monthArr.findIndex(dayArr => dayArr.day === day);
			if (index !== -1 ) {
				if(item.pay_type === 0) monthArr[index]['sum'] += Number(item.pay_num);
				monthArr[index]['detail'].push(item);
			} else {
				monthArr.push({
					day: day,
					weekday: weekdayNames[weekday],
					sum: item.pay_type === 0 ? Number(item.pay_num) : 0,
					detail: [item]
				})
			}
			return monthArr
		}, [])
	})
	
	const inputSum = computed(() => store.getters.getSum(year.value, month.value, 1));
	const outputSum = computed(() => store.getters.getSum(year.value, month.value, 0));
	
	const choosedTime = ref(0); 
	const chooseItem = (time) => {choosedTime.value = time; deleteVisible.value = true; grayVisible.value = true;} 
	const deleteItem = () => {
		store.commit('deleteData', choosedTime.value)
		uni.setStorage({
			key: 'book',
			data: JSON.stringify(store.state.bookData),
			success: () => {
				console.log('删除成功')
			}
		})
		closeView();
		}
	
	onMounted(() => {
		let screenWidth;
		uni.getSystemInfo(({
			success: res => {
				screenWidth = res.windowWidth;
			}
		}))
		const nowDate = new Date();
		year.value = nowDate.getFullYear();
		month.value = nowDate.getMonth() + 1;
		currentYear.value = nowDate.getFullYear() - 2019;
		currentMonth.value = nowDate.getMonth() + 1;
		scrollTopVal.value = (13 * (currentYear.value - 2)) * (screenWidth / 100);
	})
	
	
	const toAddPath = () => {
		uni.navigateTo({url: '/pages/add/add'});
	}
	
	const toFigPath = (type) => {
		uni.navigateTo({url: `/pages/fig/fig?year=${year.value}&month=${month.value}&type=${type}`})
	}
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
	.delete-box {
		box-sizing: border-box;
		position: fixed;
		z-index: 3;
		padding: 4vw;
		width: 86vw;
		left: 7vw;
		top: 39vh;
		background-color: #ffffff;
		border-radius: 1vw;
		
	}
	.delete-title {
		margin-bottom: 3vw;
		font-size: 5vw;
		color: #282323;
		font-weight: bold;
	}
	.delete-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 12vw;
	}
	.delete-footer-item {
		margin-left: 4vw;
		color: #617d8b;
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
		margin-top: 10vh;
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
	.middle {
		width: 1px;
		height: 8vh;
		background-color: #e6e6e6;
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
	.list {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.list-group {
		margin-bottom: 2vh;
		width: 90vw;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.list-title {
		display: flex;
		width: 90vw;
		height: 4vh;
		align-items: center;
		justify-content: space-between;
		font-size: 1.6vh;
	}
	.day {
		color: black;
		font-weight: 600;
		margin-right: 0.5em;
		
	}
	.weekday {
		color: #b3b3b3;
	}
	.right {
		display: flex;
		align-items: center;
		color: #999999;
	}
	.highlightnum {
		color: #ee9280;
	}
	.list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 2vw;
		width: 90vw;
		margin-top: 0.4vh;
		height: 6.8vh;
		border: 1px solid #e6e6e6;
		border-radius: 1vh;
		color: #282323;
		font-size: 2vh;
		font-weight: bold;
	}
	.item-left {
		display: flex;
		align-items: center;
		color: #4d4d4d;
		font-weight: 550;
	}
	.item-right {
		display: flex;
		align-items: center;
	}
	.item-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4vh;
		height: 4vh;
		border-radius: 50%;
		background-color: #71c9cb;
		margin-right: 1vh;
	}
	.add {
		position: fixed;
		bottom: 5vw;
		right: 5vw;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #52a3ce;
		width: 15vw;
		height: 15vw;
		border-radius: 50%;
		color: #fff;
		font-size: 10vw;
		font-weight: lighter;
	}
</style>
