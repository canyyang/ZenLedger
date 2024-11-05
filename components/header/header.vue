<template>
    <view>
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
    			<image src="/static/icons/down.svg" class="icon" />
    		</view>
    	</view>
    	<view class="book">
    		<view class="total">
    			<view class="total-item" :class="{'active': isInput}" @touchstart="setInput(true)" @touchend="setInput(false)">
    				<span class="total-title">月收入</span>
    				<view class="total-num">
    					<image class="logo" src="/static/icons/money0.svg" />
    					<span>{{inputSum}}</span>
    				</view>
    			</view>
    			<view class="middle"></view>
    			<view class="total-item" :class="{'active': isOutput}" @touchstart="setOutput(true)" @touchend="setOutput(false)">
    				<span class="total-title">月支出</span>
    				<view class="total-num">
    					<image class="logo" src="/static/icons/money0.svg" />
    					<span>{{outputSum}}</span>
    				</view>
    			</view>
    		</view>
    	</view>
    </view>
</template>

<script>
    export default {
        name:"myCard",
        data() {
            return {
                content: "这是组件内容"
            };
        }
    }
</script>

<style>
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
</style>