<
<template>
  <div style="margin-top: 10px">
    <div v-if="!start">
      <button style="margin-bottom: 30px" @click="start = true">开始</button>
      <div style="font-size: 12px; color: #333">
        <div>该程序未经过测试，可能会有暗病</div>
        <div>若出现bug,大多数刷新页面可以解决</div>
        <div>若出现无法解决的问题，请联系管理员</div>
        <div>
          该游戏开源，希望多多pr,地址：https://github.com/fangkuai341/game-food
        </div>
      </div>
    </div>
    <div v-else>
      <div>{{ foodsList[index].name }}</div>
      <img :src="getImageUrl(foodsList[index].kImg)" style="height: 100px" />
      <div style="display: flex; flex-wrap: wrap">
        <div
          v-for="(item, indexa) in foodsList[index].children"
          :key="item.id"
          style="
            display: flex;
            width: 50%;
            height: 20vh;
            justify-content: space-around;
            margin-bottom: 8px;
            align-items: center;
          "
        >
          <img :src="getImageUrl(item.img)" alt="" style="height: 100%" />
          <div v-if="foodsList[index].children.length !== indexa + 1">+</div>
          <div v-else></div>
        </div>
      </div>
      <button
        @click="
          router.push({
            name: 'game',
            query: { food: JSON.stringify(foodsList[index]) },
          })
        "
      >
        制作
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { foodsList } from "./data.data";
import { useRouter } from "vue-router";
import { ref } from "vue";
const start = ref(false);
const index = Math.floor(Math.random() * 5);
const router = useRouter();
function getImageUrl(imageName: string) {
  return new URL(`../assets/img/${imageName}`, import.meta.url).href;
}
</script>

<style></style>
