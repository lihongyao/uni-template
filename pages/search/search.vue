<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
import { APP_KEY_SEARCH_HISTORY } from "@/constants";
import LoadMore from "@/components/@lgs/LoadMore/LoadMore.vue";
import NoData from "@/components/@lgs/NoData/NoData.vue";

// -- constants
const placeholderStyle = "font-size: 28rpx; color: #BFBFBF;";

// -- state
const state = reactive({
  /** 搜索关键字 */
  keyword: "",
  /** 搜索历史记录 */
  searchHistories: null,
  /** 热门搜索 */
  searchHot: [],
  /** 搜索结果 */
  searchRes: null,
});
// -- life circles
onLoad(() => {
  getSearchHistories();
  getSearchHot();
});
// -- methods
const getSearchHistories = () => {
  const resp = uni.getStorageSync(APP_KEY_SEARCH_HISTORY);
  if (resp) {
    state.searchHistories = resp;
  }
};

const setSearchHistories = () => {
  // -- 判断本地是否存在搜索历史记录
  if (state.searchHistories) {
    // -- 如果本地存在搜索历史记录
    // -- 判断搜索关键字是否已存在于搜索历史记录表中
    const index = state.searchHistories.findIndex((item) => item === state.keyword);
    if (index === -1) {
      // -- 不存在
      // -- 判断当前历史记录的条数是否大于最大值（默认最多存储8条历史记录）
      if (state.searchHistories.length >= 8) {
        // -- 大于8条记录，则移除最后1条记录，然后将最新的搜索关键字插入到最前面
        state.searchHistories.pop();
        state.searchHistories.unshift(state.keyword);
      } else {
        // -- 小于8条记录，直接将最新的搜索关键字插入到最前面即可
        state.searchHistories.unshift(state.keyword);
      }
    } else {
      // -- 存在
      // -- 移除历史记录中的搜索关键字
      state.searchHistories.splice(index, 1);
      // -- 将当前搜索关键字插入到搜索历史记录的第一项
      state.searchHistories.unshift(state.keyword);
    }
  } else {
    // -- 如果本地不存在，则直接构建数组
    state.searchHistories = [state.keyword];
  }
};
const getSearchHot = async () => {
  state.searchHot = ["香蕉", "西瓜", "哈密瓜", "苹果"];
};

// -- events
const onInput = () => {
  if (!state.keyword) {
    state.searchRes = null;
  }
};

const onClear = () => {
  state.keyword = "";
  state.searchRes = null;
};

const onSearch = async () => {
  if (state.keyword) {
    setSearchHistories();
    uni.setStorageSync(APP_KEY_SEARCH_HISTORY, state.searchHistories);
    // 执行搜索请求
    state.searchRes = [1, 2, 3, 4, 5, 6];
  }
};

const onKeywordItemTap = (keyword) => {
  state.keyword = keyword;
  onSearch();
};
const onClearSearchHistories = () => {
  state.searchHistories = null;
	uni.removeStorageSync(APP_KEY_SEARCH_HISTORY);
};
</script>

<template>
  <view class="page px-40">
    <!-- Search Start -->
    <view class="search-bar-wrap px-40 fixed-top bg-secondary">
      <view class="search-bar rounded-36 pl-24 flex-h-between">
        <image class="icon-48x48" src="@/components/@lgs/SearchBar/images/icon_search.png"></image>
        <input class="uni-input flex-1 pl-20" v-model="state.keyword" placeholder="请输入搜索关键字" confirm-type="search" :placeholder-style="placeholderStyle" @confirm="onSearch" @input="onInput" />
        <view class="close-wrap flex-h-center" @click="onClear">
          <image v-if="state.keyword" class="icon-48x48" src="@/static/images/icon_clear.png"></image>
        </view>
      </view>
    </view>
    <!-- Search End -->

    <!-- Search Res Start -->
    <view v-if="state.searchRes">
      <template v-if="state.searchRes.length > 0">
        <block v-for="(item, index) in state.searchRes" :key="index">
          <view class="search-res-item" />
        </block>
        <LoadMore :hasMore="false" />
      </template>
      <NoData v-else tips="未找到相关内容" />
    </view>
    <!-- Search Res End -->

    <template v-else>
      <!-- history-search Start -->
      <view v-if="state.searchHistories" class="mb-40">
        <view class="text-32 leading-44 text-333333 font-semibold flex-h-between">
          <text>历史搜索</text>
          <image class="icon-32x32" src="@/static/images/icon_delete.png" @click="onClearSearchHistories" />
        </view>
        <view class="flex-h-between flex-wrap">
          <block v-for="(keyword, index) in state.searchHistories" :key="index">
            <view class="search-item text-26 leading-36 text-888888 mt-20" @click="onKeywordItemTap(keyword)">{{ keyword }}</view>
          </block>
        </view>
      </view>
      <!-- history-search End -->

      <!-- hot-search Start -->
      <view v-if="state.searchHot && state.searchHot.length > 0">
        <view class="text-32 leading-44 text-333333 font-semibold flex-h-start">
          <text>热门搜索</text>
          <image class="icon-32x32 ml-10" src="@/static/images/icon_hot.png" />
        </view>
        <view class="flex-h-between flex-wrap">
          <block v-for="(keyword, index) in state.searchHot" :key="index">
            <view class="search-item text-26 leading-36 text-888888 mt-20" @click="onKeywordItemTap(keyword)">{{ keyword }}</view>
          </block>
        </view>
      </view>
      <!-- hot-search End -->
    </template>
  </view>
</template>

<style lang="less" scoped>
.page {
  padding-top: 130rpx;
}

.search-bar-wrap {
  width: 750rpx;
  height: 100rpx;
  z-index: 1;

  .search-bar {
    height: 80rpx;
    background: #f7f7f7;
  }

  .uni-input {
    font-size: 28rpx;
  }

  .close-wrap {
    width: 70rpx;
  }
}

.search-item {
  width: 50%;
}

.search-res-item {
  height: 200rpx;
  background-color: #eee;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  opacity: 0.75;
}
</style>
