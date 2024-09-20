<template>
  <div style="margin-top: 20px">
    <div>
      <div style="display: flex; position: relative; height: 30px">
        <div
          v-for="(item, index) in foodOver"
          :key="index"
          class="foodAnm"
          style="top: 0"
        >
          <img
            :src="getImageUrl(item.kImg)"
            alt=""
            style="width: 60px; margin-left: 10px"
          />
        </div>
      </div>
      <div
        style="width: 70px; height: 70px; background: blue; margin-top: 60px"
      ></div>
    </div>

    <div
      style="
        height: 20px;
        width: 400px;
        background: #66aaee;
        position: relative;
        margin-top: 30px;
      "
    >
      <div
        v-for="(item, index) in nowFoodLocation"
        :key="index"
        style="
          height: 20px;
          width: 20px;

          position: absolute;
        "
        :style="{
          backgroundColor: colorList[Math.floor(Math.random() * 12)],
          left: item[Object.keys(item)[0]].start + 'px',
        }"
      >
        <div>
          <img
            :src="
              getImageUrl(
                allFood.find((food) => food.id === Object.keys(item)[0]).kImg
              )
            "
            alt=""
            style="height: 50px; position: absolute; top: 100%; left: -50%"
          />
          <div style="width: 100px; position: absolute; top: 70px; left: -50%">
            {{ allFood.find((food) => food.id === Object.keys(item)[0]).name }}
          </div>
        </div>
      </div>
      <div
        style="width: 2px; height: 20px; background: yellow; position: absolute"
        class="zhizheng"
        ref="zhizhengRef"
      ></div>
    </div>
    <button style="margin-top: 100px" @mousedown="click">点击</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { allFoodType } from "./type.data";
import { allFood, colorList } from "./data.data";
import { useRoute } from "vue-router";
const route = useRoute();
const food = JSON.parse(route.query.food);
const foodOver = food.children; //食材顺序

const nowFoodNUmber = ref<number>(0); //当前食材
const nowFoodLocation = ref<allFoodType[]>([]); //当前食材位置和食材
const errorCount = ref<number>(0); //错误次数
const zhizhengRef = ref<HTMLElement | null>(null);
function getImageUrl(imageName: string) {
  return new URL(`../assets/img/${imageName}`, import.meta.url).href;
}
const generateUniqueValues = (count: number) => {
  // 生成一个包含0到400的所有整数的数组
  const allNumbers = Array.from({ length: 381 }, (_, i) => i);

  // 随机打乱数组
  const shuffled = allNumbers.sort(() => 0.5 - Math.random());

  // 筛选出满足条件的值
  let result: number[] = [];
  for (let i = 0; i < shuffled.length; i++) {
    if (result.length === count) break; // 生成指定个数后停止
    if (
      result.length === 0 ||
      result.every((v) => Math.abs(v - shuffled[i]) > 20)
    ) {
      result.push(shuffled[i]);
    }
  }

  // 如果未能找到合适的组合，递归重试
  if (result.length < count) {
    return generateUniqueValues(count); // 根据需求递归重试
  }

  return result;
};

const removeKeyAndRandomValueFromArray = (arr, keyToRemove) => {
  // 删除指定的键
  const updatedArray = arr
    .map((item) => {
      if (item[keyToRemove]) {
        delete item[keyToRemove];
      }
      return item;
    })
    .filter((item) => Object.keys(item).length > 0); // 过滤掉空对象

  // 随机选择一个对象并删除
  if (updatedArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * updatedArray.length);
    updatedArray.splice(randomIndex, 1); // 删除随机对象
  }

  return updatedArray;
};
const isInRange = (value: number, rangeStart: number, rangeEnd: number) => {
  return value >= rangeStart && value <= rangeEnd;
};

const checkValuesInRange = (
  uniqueValues: number[],
  startValues: number[]
): boolean => {
  return uniqueValues.some((uniqueValue) =>
    startValues.some((startValue) =>
      isInRange(uniqueValue, startValue - 20, startValue + 20)
    )
  );
};
const click = () => {
  //判断点击是否是正确的
  const left = zhizhengRef.value.offsetLeft;
  //获取正确的范围，和失败的范围
  const key = foodOver[nowFoodNUmber.value].id; // 将 'pg' 存储在变量中
  const correctArray = nowFoodLocation.value
    .filter((item) => item[key])
    .map((item) => ({
      start: item[key].start,
      end: item[key].end,
    }));
  const failArray = nowFoodLocation.value.reduce((acc, item) => {
    // 获取对象的键
    const itemKey = Object.keys(item)[0];

    // 只处理不包含 'pg' 的对象
    if (itemKey !== key) {
      const { start, end } = item[itemKey];
      acc.push({ start, end });
    }
    return acc;
  }, []);

  console.log(left, correctArray, failArray);

  for (let i = 0; i < correctArray.length; i++) {
    if (isInRange(left, correctArray[i].start, correctArray[i].end)) {
      console.log("成功");
      success();
      return;
    }
  }
  for (let i = 0; i < failArray.length; i++) {
    if (isInRange(left, failArray[i].start, failArray[i].end)) {
      console.log("失败");
      error();
      return;
    }
  }
};
const generateUniqueValuesUntilValid = (
  startValues: number[],
  count: number
): number[] => {
  let uniqueValues = generateUniqueValues(count);

  // 循环调用generateUniqueValues，直到uniqueValues中的所有值都不在startValues-20到startValues+20的范围内
  while (checkValuesInRange(uniqueValues, startValues)) {
    uniqueValues = generateUniqueValues(count);
  }

  return uniqueValues;
};
const success = () => {
  //最后一步正确点击
  //动画，将top设置为0
  document.querySelectorAll(".foodAnm")[nowFoodNUmber.value].style.position =
    "absolute";
  document.querySelectorAll(".foodAnm")[nowFoodNUmber.value].style.top =
    "100px";

  if (nowFoodNUmber.value >= foodOver.length - 1) {
    console.log("成功");
    return;
  }
  //1.去除nowFoodLocation的当前食材和其中一个食材
  nowFoodLocation.value = removeKeyAndRandomValueFromArray(
    nowFoodLocation.value,
    foodOver[nowFoodNUmber.value].id
  );

  //下一个食材
  nowFoodNUmber.value++;
  //加入下一个食材和一个新的食材
  //1.获取不能写的位置和当前的个数（遍历）
  const nowLength = nowFoodLocation.value.length;
  let newUniqueValues;
  if (nowLength) {
    const startValues = nowFoodLocation.value.map(
      (item) => Object.values(item)[0].start
    );
    newUniqueValues = generateUniqueValuesUntilValid(
      startValues,
      3 - nowLength
    );
  } else {
    newUniqueValues = generateUniqueValues(3);
  }

  let nowFood = [];
  nowFood.push(foodOver[nowFoodNUmber.value].id);
  for (let i = 0; i < 3 - nowLength - 1; i++) {
    nowFood.push(allFood[Math.floor(Math.random() * 6)].id);
  }

  //获取uniqueValues是否在startValues-20到startValues+20之内，如果在重新生成

  nowFood.forEach((item, index) => {
    nowFoodLocation.value.push({
      [item]: {
        start: newUniqueValues[index],
        end: newUniqueValues[index] + 20,
      },
    });
  });
  console.log(JSON.stringify(nowFoodLocation.value));
};
const error = () => {
  //重新获取
  errorCount.value++;
  nowFoodLocation.value = [];
  let nowFood = [];
  nowFood.push(foodOver[nowFoodNUmber.value].id);
  for (let i = 0; i < 2; i++) {
    nowFood.push(allFood[Math.floor(Math.random() * 6)].id);
  }
  const uniqueValues = generateUniqueValues(3);
  nowFood.forEach((item, index) => {
    nowFoodLocation.value.push({
      [item]: { start: uniqueValues[index], end: uniqueValues[index] + 20 },
    });
  });
  console.log(JSON.stringify(nowFoodLocation.value));
};
onMounted(() => {
  let nowFood = [];
  nowFood.push(foodOver[0].id);
  for (let i = 0; i < 2; i++) {
    nowFood.push(allFood[Math.floor(Math.random() * 6)].id);
  }
  const uniqueValues = generateUniqueValues(3);
  nowFood.forEach((item, index) => {
    nowFoodLocation.value.push({
      [item]: { start: uniqueValues[index], end: uniqueValues[index] + 20 },
    });
  });
  console.log(JSON.stringify(nowFoodLocation.value));
});
</script>

<style>
.zhizheng {
  animation: zhizheng 8s linear infinite;
}
.foodAnm {
  transition: all 1s linear;
}
@keyframes zhizheng {
  0% {
    left: 0;
  }
  50% {
    left: 400px;
  }
  100% {
    left: 0;
  }
}
</style>
