import { computed, ref } from "vue"

export default function useFocus(data, previewRef, callback){
  const selectIndex = ref(-1) // 最后一个选中的索引值
  const lastSelectedBlock = computed(()=>{ // 最后一个选中的元素 用于做辅助线的参考元素B
    return data.value.blocks[selectIndex.value]
  })

  const focusData = computed(() => {
    let focus = []
    let unfocused = []
    data.value.blocks.forEach(block => (block.focus ? focus : unfocused).push(block))
    return { focus, unfocused }
  })
  const containerMouseDown = () => { // 点击容器 失去所有焦点
    if(previewRef.value){
      return
    }
    clearBlocksFocus()
    selectIndex.value = -1
  }
  const clearBlocksFocus = () => { // 清空所有焦点
    data.value.blocks.forEach(item => item.focus = false)
  }

  const blockMouseDown = (e, block, index) => {
    if(previewRef.value){
      return
    }
    e.preventDefault()
    e.stopPropagation()
    // 给元素对象添加一个选中标志 focus
    if (e.shiftKey) { // 按住shift进行多选 
      if(focusData.value.focus.length < 2){ // 多选一个时 再次点击不取消
        block.focus = true
      } else {
        block.focus = !block.focus
      }
      
    } else {
      if (!block.focus) {
        clearBlocksFocus()
        block.focus = true
      }
    }
    selectIndex.value = index
    callback(e)
  }

  return {
    lastSelectedBlock,
    focusData,
    containerMouseDown,
    blockMouseDown,
    clearBlocksFocus
  }
}