<script>
	export default {
		onLaunch() {
			//#ifdef APP-PLUS
				plus.navigator.closeSplashscreen()
			// #endif
			uni.getStorage({
				key: 'book',
				success: (res) => {
					if (res.data) {
						console.log('initialize book data');
						console.log(res.data)
						this.$store.commit('initData', [...JSON.parse(res.data)]);
					}
				},
				fail: (err) => {
					uni.setStorage({
						key: 'book',
						data: JSON.stringify([]),
						success: () => {
							console.log('添加成功')
						}
					})
				}
			})
		},
	}
</script>

<style>
.content {
	width: 100vw;
	height: 100vh;
	font-family: Helvetica Neue,Helvetica,Roboto,Segoe UI,Arial,sans-serif;
}
/* 去除scroll滚动条 */
::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
	background-color: transparent;
}
</style>
