<template>
  <div></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { allFoodType } from "./type.data";
const foodOver = ["pg", "xj", "xl", "cm"];
const allFood = ["pg", "xj", "xl", "cm", "jz", "hg", "lz"];
const nowFood = ref<string[]>([]);
const nowFoodLocation = ref<allFoodType[]>([]);
const generateUniqueValues = () => {
  // 生成一个包含0到400的所有整数的数组
  const allNumbers = Array.from({ length: 381 }, (_, i) => i);

  // 随机打乱数组
  const shuffled = allNumbers.sort(() => 0.5 - Math.random());

  // 筛选出满足条件的值
  let result: any = [];
  for (let i = 0; i < shuffled.length; i++) {
    if (result.length === 3) break;
    if (
      result.length === 0 ||
      result.every((v) => Math.abs(v - shuffled[i]) > 20)
    ) {
      result.push(shuffled[i]);
    }
  }

  // 如果未能找到合适的组合，递归重试
  if (result.length < 3) {
    return generateUniqueValues();
  }

  return result;
};
onMounted(() => {
  nowFood.value.push(foodOver[0]);
  for (let i = 0; i < 2; i++) {
    nowFood.value.push(allFood[Math.floor(Math.random() * 6)]);
  }
  const uniqueValues = generateUniqueValues();
  nowFood.value.forEach((item, index) => {
    nowFoodLocation.value.push({
      [item]: { start: uniqueValues[index], end: uniqueValues[index] + 20 },
    });
  });
  console.log(" nowFoodLocation.value: ", nowFoodLocation.value);
});
</script>

<style lang="less"></style>
