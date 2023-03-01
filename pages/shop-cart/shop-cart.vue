<script setup>
import { onMounted } from "vue";
import Utils from "@/utils";
	
	
	
	// -- life circles
	onMounted(() => {
		Utils.checkLogin()
	})
	
</script>

<template>
	<div class="page">This is ShopCart page </div>
</template>

<style lang="less" scoped></style>
