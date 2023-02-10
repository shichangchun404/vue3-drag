<script setup lang="ts">
import Editor from '../packages/editor.jsx'
import data from '../config/data.json'
import { ref, provide } from 'vue'
import { editorConfig as config } from '../utils/edilor-config.jsx'
import Range from '../components/range.jsx'
const state = ref(data)
provide('config', config)

const formData = ref({
  username: 'scc',
  password: '123',
  start: 1,
  end: 100,
})
const test = () => {
  console.log('ttt')
}
</script>

<template>
  <div class="home">
    <!-- <Editor :data="state" /> -->
    <Editor v-model="state" :formData="formData" />
    <!-- <Range :start="formData.start" :end="formData.end"></Range>
    <div>{{formData}}</div> -->
  </div>
</template>

<style lang="less">
.home {
  position: fixed;
  top: 10px;
  right: 10px;
  bottom: 10px;
  left: 10px;
  background: #efefef;
}
</style>
