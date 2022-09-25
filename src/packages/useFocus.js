import { computed } from "vue"

export default function useFocus(data, callback){
  const focusData = computed(() => {
    let focus = []
    let onfocused = []
    data.value.blocks.forEach(block => (block.focus ? focus : onfocused).push(block))
    return { focus, onfocused }
  })
  const containerMouseDown = () => { // 点击容器 失去所有焦点
    clearBlocksFocus()
  }
  const clearBlocksFocus = () => { // 清空所有焦点
    data.value.blocks.forEach(item => item.focus = false)
  }

  const blockMouseDown = (e, block) => {
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
    callback(e)
  }

  return {
    focusData,
    containerMouseDown,
    blockMouseDown
  }
}