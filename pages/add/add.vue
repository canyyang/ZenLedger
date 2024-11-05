<template>
	<view class="content">
		<view class="tab">
			<view class="back" @click="toIndexPath()">
				<image src="/static/icons/back.svg" style="width: 1.4em; height: 1.4em;"/>
			</view>
			<view class="type">
				<view class="type-item" :class="{'select': pay_type == 1}" @click="setPayType(1)">收入</view>
				<view class="type-item" :class="{'select': pay_type == 0}" @click="setPayType(0)">支出</view>
			</view>
			<view class="time">
				<view class="day">{{timeInfo.month}} / {{timeInfo.day}}</view>
				<view class="weekday">{{weekdayNames[timeInfo.weekday]}}</view>
			</view>
		</view>
		<view class="detail">
			<view class="item-left">
				<view class="item-box" :style="{ backgroundColor: bgColor[pay_type][num_type] }">
					<image class="item-logo" style="width: 1.25em; height: 1.25em;" :src="iconSrc[pay_type][num_type]" />
				</view>
				<span>{{typeTitle[pay_type][num_type]}}</span>
			</view>
			<view class="item-right">
				<image class="logo" style="width: 0.7em; height: 0.7em;" src="/static/icons/money0.svg" />
				<span>{{pay_num || '0'}}</span>
			</view>
		</view>
		<view class="num-type">
			<view class="num-type-item" :class="{'active': num_type == index}" v-for="(item, index) in iconSrc[pay_type]" :key="index" @click="setNumType(index)">
				<view class="type-box" :style="{ backgroundColor: bgColor[pay_type][index] }">
					<image class="item-logo" style="width: 7vw; height: 7vw;" :src="item" />
				</view>
				<span class="type-title">{{typeTitle[pay_type][index]}}</span>
			</view>
		</view>
		
		<view class="cal-table">
			<view class="table-left">
				<view v-for="(item, index) in num_list" :key="index" class="table-left-item" @click="addNum(item)">{{item}}</view>
			</view>
			<view class="table-right">
				<view class="table-right-item" @click="delNum()">
					<image src="/static/icons/backspace.svg" alt="delete" style="width: 1.1em; height: 1.1em;" />
				</view>
				<view class="table-right-item" @click="calNum()">+</view>
				<view class="table-right-item table-right-add" :style="{ backgroundColor: bgColor[pay_type][num_type] }">
					<view class="add-item" v-if="isAdding" @click="getSum()">=</view>
					<view class="add-item" v-else @click="addPay()">保存</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, onMounted, reactive, ref } from 'vue';
	import { useStore } from 'vuex';
	const store = useStore();
	const iconSrc = store.state.iconSrc;
	const bgColor = store.state.bgColor;
	const typeTitle = store.state.typeTitle;
	const weekdayNames = store.state.weekdayNames;
	
	const timeInfo = reactive({
		month: 0,
		day: 0,
		weekday: 0
	})
	
	const num_list = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '.'];
	
	const toIndexPath = () => {
		uni.reLaunch({url: '/pages/index/index'});
	}
	
	const pay_type = ref(0);
	const setPayType = (value) => {
		pay_type.value = value; 
		num_type.value = 0;
		pay_num.value = '';
		};
	
	const num_type = ref(0);
	const setNumType = (value) => {num_type.value = value};
	
	const pay_num = ref('');
	const addNum = (num) => {
		if (pay_num.value.length > 12) return;
		if (num == '') return;
		if (num == '.' && (pay_num.value.lastIndexOf('.') > pay_num.value.lastIndexOf('+') || pay_num.value.lastIndexOf('+') == pay_num.value.length - 1)) return;
		if (pay_num.value.includes('.') && pay_num.value.lastIndexOf('.') == pay_num.value.length - 3 && pay_num.value.lastIndexOf('.') > pay_num.value.lastIndexOf('+')) return;
		if (num == '0' && pay_num.value[pay_num.value.length - 1] == '0' && pay_num.value.lastIndexOf('.') > pay_num.value.length - 3) return;
		pay_num.value += num;
	}
	const delNum = () => {
		pay_num.value = pay_num.value.slice(0, pay_num.value.length - 1);
	}
	const calNum = () => {
		if (pay_num.value.lastIndexOf('+') == pay_num.value.length - 1) return;
		if (pay_num.value.includes('+')) {
			const pay_part = pay_num.value.split('+');
			pay_num.value = String((Number(pay_part[0]) + Number(pay_part[1])).toFixed(2))
		}
		pay_num.value += '+';
	}
	const getSum = () => {
		const pay_part = pay_num.value.split('+');
		pay_num.value = String((Number(pay_part[0]) + Number(pay_part[1])).toFixed(2));
	}
	
	const addPay = () => {
		if (pay_num.value == '') return;
		const bookData = {
			time: new Date().getTime(),
			pay_type: pay_type.value,
			num_type: num_type.value,
			pay_num: Number(pay_num.value).toFixed(2)
		}
		store.commit('addData', bookData)
		uni.setStorage({
			key: 'book',
			data: JSON.stringify(store.state.bookData),
			success: () => {
				console.log('添加成功')
			}
		})
		toIndexPath();
	}
	
	const isAdding = computed(() => {
		return pay_num.value.includes('+')
	})
	
	onMounted(() => {
		const nowDate = new Date();
		timeInfo.month = nowDate.getMonth() + 1;
		timeInfo.day = nowDate.getDate() >= 10 ? nowDate.getDate() : '0' + nowDate.getDate();
		timeInfo.weekday = nowDate.getDay();
	})
	
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
	}
	.tab {
		padding: 0 1.5vh;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 6vh;
		width: 100vw;
		height: 6vh;
	}
	.back {
		display: flex;
		align-items: center;
		width: 20vw;
		height: 6vh;
	}
	.type {
		display: flex;
		width: 40vw;
		height: 6vh;
	}
	.type-item {
		box-sizing: border-box;
		width: 20vw;
		height: 6vh;
		text-align: center;
		line-height: 6vh;
		font-size: 5vw;
	}
	.select {
		font-weight: 550;
		border-bottom: 1px solid black;
	}
	.time {
		width: 20vw;
		text-align: center;
	}
	.day {
		font-size: 4vw;
		font-weight: bold;
	}
	.weekday {
		font-size: 3vw;
		color: #999999;
	}
	.detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 4vw;
		width: 90vw;
		margin-top: 2vh;
		height: 8vh;
		border: 1px solid #e6e6e6;
		border-radius: 1vh;
		color: #282323;
		font-weight: bold;
	}
	.item-left {
		display: flex;
		align-items: center;
		color: #4d4d4d;
		font-weight: 550;
		font-size: 2.2vh;
	}
	.item-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4vh;
		height: 4vh;
		border-radius: 50%;
		margin-right: 1vh;
	}
	.item-right {
		display: flex;
		align-items: center;
		font-size: 3vh;
	}
	.num-type {
		margin-top: 2vh;
		display: flex;
		flex-wrap: wrap;
		width: 90vw;
	}
	.num-type-item {
		margin-top: 1vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 22.5vw;
		height: 25vw;
		border-radius: 1vw;
	}
	.active {
		background-color: #eeeeee;
	}
	.type-box {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 4vw;
		width: 5vh;
		height: 5vh;
		border-radius: 50%;
		background-color: #71c9cb;
	}
	.type-title {
		margin-top: 1.5vw;
		font-weight: 550;
		color: #4d4d4d;
		font-size: 2vh;
	}
	.cal-table {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 100vw;
	}
	.table-left {
		display: flex;
		flex-wrap: wrap;
		width: 75vw;
	}
	.table-left-item {
		box-sizing: border-box;
		width: 25vw;
		height: 25vw;
		border: 1px solid #ebebeb;
		text-align: center;
		line-height: 25vw;
		font-size: 2.8vh;
		font-weight: bold;
		color: #232323;
	}
	.table-right {
		display: flex;
		flex-direction: column;
		width: 25vw;
	}
	.table-right-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 25vw;
		border: 1px solid #ebebeb;
		line-height: 25vw;
		font-size: 3.2vh;
		color: #232323;
	}
	.table-right-add {
		height: 50vw;
		color: #ffffff;
		font-size: 2.9vh;
	}
	.add-item {
		width: 25vw;
		height: 50vw;
		text-align: center;
		line-height: 50vw;
	}
</style>
