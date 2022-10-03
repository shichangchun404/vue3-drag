import { events } from "./events"

export default function useMenuDragger(data,containerRef){
  let currentComponent = null

    const dragenter = (e)=> {
      e.dataTransfer.dropEffect = 'move'
    }
    const dragover = (e)=> {
      e.preventDefault()
    }
    const dragleave = (e)=> {
      e.dataTransfer.dropEffect = 'none'
    }
    const drop = (e)=> {
      let blocks = data.value.blocks
      data.value = { 
        ...data.value, 
        blocks: [
          ...blocks,
          {
            top: e.offsetY,
            left: e.offsetX,
            zIndex: 1,
            key: currentComponent.key,
            alignCenter: true, // 首次拖入后居中展示标志
            props: {},
            model: {}
          }
        ],
      }
    }
    const dragStart = (e,component) => {
      containerRef.value.addEventListener('dragenter', dragenter) // 进入容器
      containerRef.value.addEventListener('dragover', dragover) // 经过容器
      containerRef.value.addEventListener('dragleave', dragleave) // // 离开容器
      containerRef.value.addEventListener('drop', drop) // // 松手时 向容器里添加拖动的组件
      currentComponent = component
      events.emit('start')
    }
    const dragend = (e) => {
      containerRef.value.removeEventListener('dragenter', dragenter) // 进入容器
      containerRef.value.removeEventListener('dragover', dragover) // 经过容器
      containerRef.value.removeEventListener('dragleave', dragleave) // // 离开容器
      containerRef.value.removeEventListener('drop', drop) // // 松手时 向容器里添加拖动的组件
      currentComponent = null
      events.emit('end')
    }

    return {
      dragStart,
      dragend
    }
}