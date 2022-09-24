<script setup lang="ts">
import Editor from '../packages/editor.jsx'
import data from '../config/data.json'
import { ref, provide } from 'vue'
import { editorConfig as config} from '../utils/edilor-config.jsx'

const state = ref(data)
provide('config',config)
</script>

<template>
  <div class="home">
    <!-- <Editor :data="state" /> -->
    <Editor v-model="state" /> 
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


