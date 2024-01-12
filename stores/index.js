import { defineStore } from 'pinia';

export const useStore = defineStore("appStore", {
	// -- 定义状态
	state: () => ({
		count: 0
	}),
	// -- 定义行为
	actions: {
		async increment() {},
		async decrement() {},
	}
});