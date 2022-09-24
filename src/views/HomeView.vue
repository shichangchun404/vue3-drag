<script setup lang="ts">
import Editor from '../packages/editor.jsx'
import data from '../config/data.json'
import { ref } from '@vue/reactivity'
const state = ref(data)
</script>

<template>
  <div class="home">
    <Editor :data="state" />
  </div>
</template>

<style lang="less">
.home{
  position: fixed;
  top: 10px;
  right: 10px;
  bottom: 10px;
  left: 10px;
  background: #efefef;
}
</style>


