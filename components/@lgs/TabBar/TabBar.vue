<script setup>
// -- 参考：https://juejin.cn/post/7166139934036721694#heading-3
// -- imports
import TAB1 from "@/static/images/icon_resume.png";
import TAB2 from "@/static/images/icon_ai.png";
import TAB3 from "@/static/images/icon_mine.png";
import TAB1_SEL from "@/static/images/icon_resume_sel.png";
import TAB2_SEL from "@/static/images/icon_ai_sel.png";
import TAB3_SEL from "@/static/images/icon_mine_sel.png";

// -- constants
const tabBar = {
  color: "#cdcdcd",
  selectedColor: "#5398ED",
  borderStyle: "black",
  backgroundColor: "#ffffff",
  list: [
    {
      text: "模板",
      path: "/pages/TabPages/templates",
      iconPath: TAB1,
      selectedIconPath: TAB1_SEL,
    },
    {
      text: "智能AI",
      path: "/pages/TabPages/ai",
      iconPath: TAB2,
      selectedIconPath: TAB2_SEL,
    },
    {
      text: "我的",
      path: "/pages/TabPages/mine",
      iconPath: TAB3,
      selectedIconPath: TAB3_SEL,
    },
  ],
};

// -- props
const props = defineProps({
  /** 当前选中的下标 */
  selected: { type: Number, default: 0 },
});

// -- emits
const emits = defineEmits(["change"]);

// -- events
const switchTab = (item, index) => {
  emits("change", () => {
    uni.switchTab({ url: item.path });
  });
};
</script>

<template>
  <view class="lg-tabBar" :style="`background: ${tabBar.backgroundColor}`">
    <block v-for="(item, index) in tabBar.list" :key="item.path">
      <view class="lg-tabBar__item" @click="switchTab(item, index)">
        <image class="tab_icon" :src="selected === index ? item.selectedIconPath : item.iconPath"></image>
        <view class="tab_label" :style="{ color: selected === index ? tabBar.selectedColor : tabBar.color }">{{ item.text }}</view>
      </view>
    </block>
  </view>
</template>

<style lang="less" scoped>
.lg-tabBar {
  width: 750rpx;
  height: 100rpx;
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #eeeeee;

  &__item {
    flex: 1;
    text-align: center;

    .tab_icon {
      width: 48rpx;
      height: 48rpx;
    }

    .tab_label {
      font-size: 20rpx;
      margin-top: 9rpx;
    }
  }
}
</style>
