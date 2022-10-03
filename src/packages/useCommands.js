import deepcopy from "deepcopy"
import { onUnmounted } from "vue"
import { events } from "./events"

export default function useCommands(data,focusData){
  const state = {
    current: -1 , // 前进后退索引值
    queue: [] , // 存放所有操作指令
    commands: {}, // 操作指令与功能函数映射表 undo: ()=>{}
    commandArray: [], // 存放所有指令
    destroyArray: []
  }
  const registry = (command)=>{
    state.commandArray.push(command)
    state.commands[command.name] = (...arg)=>{
      const { redo, undo } = command.execute(...arg)
      redo()
      if(command.pushQueue){
        let {current, queue} = state
        if(queue.length > 0){
          queue = queue.slice(0, current+1) // 拖拽的过程中有撤销的操作 重新设置queue内容 以当前下标做截取 【1，2，3^，4，5，6】>>>> [1,2,3,xxxx]
          state.queue = queue
        }
        state.queue.push({redo, undo})
        state.current = current + 1
      }
    }
  }

  // 后退/撤销
  registry({
    name: 'undo',
    keyboard: 'ctrl+z',
    execute(){
      return {
        redo(){
          if(state.current === -1){
            return
          }
          const item = state.queue[state.current] // 最新执行的事件对象
          if(item){
            item.undo && item.undo()
            state.current--
          }
        }
      }
    }
  })
  // 前进/重做
  registry({
    name: 'redo',
    keyboard: 'ctrl+y',
    execute(){
      return {
        redo(){
          const item = state.queue[state.current+1] // 找到当前的下一步 还原操作
          if(item){
            item.redo && item.redo()
            state.current++
          }
        }
      }
    }
  })
  // 菜单拖拽
  registry({
    name: 'drag', 
    pushQueue: true, // 可以把事件放到队列中
    init(){
      this.before = null // 记录之前的数据
      // 拖动前记录之前的数据
      const start = ()=> {
        this.before = deepcopy(data.value.blocks)
      }
      // 拖动结束后 执行execute
      const end = ()=> {
        state.commands.drag()
      }
      events.on('start', start)
      events.on('end', end)

      return ()=>{ // 返回注销监听
        events.off('start', start)
        events.off('end', end)
      }
    },
    execute(){
      let before = this.before
      let after = deepcopy(data.value.blocks)
      return {
        redo(){
          data.value = { ...data.value, blocks: after}
        },
        undo(){
          data.value = { ...data.value, blocks: before}
        }
      }
    }
  })
  // 应用json数据 更新整个容器
  registry({
    name: 'updateContainer',
    pushQueue: true,
    execute(newValue){
      let state = {
        before: data.value,
        after: newValue
      }
      return {
        redo(){
          data.value = state.after
        },
        undo(){
          data.value = state.before
        }
      }
    }
  })
  // 应用单个json数据 更新单个组件
  registry({
    name: 'updateBlock',
    pushQueue: true,
    execute(newValue, oldValue){
      let state = {
        before: deepcopy(data.value.blocks),
        after: (()=>{
          let blocks = [...data.value.blocks]
          let index = data.value.blocks.indexOf(oldValue)
          blocks.splice(index,1,newValue)
          return blocks
        })()
      }
      return {
        redo(){
          data.value = {...data.value, blocks: state.after}
        },
        undo(){
          data.value = {...data.value, blocks: state.before}
        }
      }
    }
  })
  // 置顶
  registry({
    name: 'placeTop',
    pushQueue: true,
    execute(){
      let before = deepcopy(data.value.blocks)
      let after = (()=>{
        let { focus, unfocused } = focusData.value
        let maxZIndex = unfocused.reduce((pre,current)=>{
          return Math.max(pre,current.zIndex)
        }, -Infinity) + 1
        focus.forEach(item => {
          item.zIndex = maxZIndex
        })
        return data.value.blocks
      })()
      return {
        redo(){
          data.value = {...data.value, blocks: after}
        },
        undo(){
          data.value = {...data.value, blocks: before}
        }
      }
    }
  })
  // 置底
  registry({
    name: 'placeBottom',
    pushQueue: true,
    execute(){
      let before = deepcopy(data.value.blocks)
      let after = (()=>{
        let { focus, unfocused } = focusData.value
        let minZIndex = unfocused.reduce((pre,current)=>{
          return Math.min(pre,current.zIndex)
        }, Infinity) - 1
        if(minZIndex<0){ // 避免元素zindex过小 在画布下面 无法显示
          minZIndex = Math.abs(minZIndex)
          unfocused.forEach(block => {
            block.zIndex =  block.zIndex + minZIndex
          })
        }
        focus.forEach(item => {
          item.zIndex = minZIndex
        })
        return data.value.blocks
      })()
      return {
        redo(){
          data.value = {...data.value, blocks: after}
        },
        undo(){
          data.value = {...data.value, blocks: before}
        }
      }
    }
  })
  // 
  registry({
    name: 'delete',
    pushQueue: true,
    execute(){
      let state = {
        before: deepcopy(data.value.blocks),
        after: focusData.value.unfocused
      }
      return {
        redo(){
          data.value = {...data.value, blocks: state.after}
        },
        undo(){
          data.value = {...data.value, blocks: state.before}
        },
      }
    }
  })
  
  // 监听快捷键
  const keyboardEvent = ()=>{
    const keyCodes = {
      89: 'y',
      90: 'z'
    }
    const onKeydown = (e)=>{
      const { ctrlKey, keyCode} = e
      if(ctrlKey && keyCodes[keyCode]){
        const keyboardStr = `ctrl+${keyCodes[keyCode]}`
        state.commandArray.forEach(({name,keyboard})=>{
          if(keyboardStr === keyboard){
            state.commands[name]()
            e.preventDefault()
          }
        })
      }
    }
    const init = () =>{
      window.document.addEventListener('keydown',onKeydown)
      return function off(){
        window.document.removeEventListener('keydown',onKeydown)
      }
    }
    return init()
  }

  // 初始化
  ;(()=>{
    state.destroyArray.push(keyboardEvent())
    state.commandArray.forEach(command => {
      if(command.init){
        let off = command.init()
        state.destroyArray.push(off)
      }
    })
  })()
  onUnmounted(()=>{ // 清理events监听的事件
    state.destroyArray.forEach(off => off&&off())
  })

  return state
}