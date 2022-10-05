import { defineComponent } from "vue";

export default defineComponent({
  props:{
    block: { type: Object},
    component: { type: Object}
  },
  setup(props){
    let { width, height} = props.component.resize || {}
    let state = {
      direction: {},
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startLeft:0,
      startTop:0
    }
    const mousemove = (e)=>{
      const { clientX:moveX, clientY:moveY} = e
      const x = moveX - state.startX
      const y = moveY - state.startY
      // console.log('moveX, moveY ', moveX, moveY)
      // console.log('x,y', x,y)
      let left, top, width ,height;
      if(state.direction.horizontal==='left'){ // 朝左拉伸
        width = state.startWidth - x
        left = state.startLeft + x
        props.block.width = width
        props.block.left = left
      }
      if(state.direction.horizontal==='right'){ // 朝左拉伸
        width = state.startWidth + x
        props.block.width = width
      }
      if(state.direction.vertical==='top'){ // 朝左拉伸
        height = state.startHeight - y
        top = state.startTop + y
        props.block.height = height
        props.block.top = top
      }
      if(state.direction.vertical==='bottom'){ // 朝左拉伸
        height = state.startHeight + y
        props.block.height = height
      }
      props.block.hasResize = true
    }
    const mouseup = ()=>{
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }
    const onMousedown = (e, direction)=>{
      e.stopPropagation()
      const { clientX, clientY} = e
      state = {
        direction: direction,
        startX: clientX,
        startY: clientY,
        startWidth: props.block.width,
        startHeight: props.block.height,
        startLeft: props.block.left,
        startTop: props.block.top
      }
      document.addEventListener('mousemove',mousemove)
      document.addEventListener('mouseup', mouseup)
    }
    
    return ()=>{
      return <>
      {width && <>
        <div class="resize resize-left" onMousedown={(e)=>onMousedown(e, {horizontal: 'left', vertical: 'center'})}></div>
        <div class="resize resize-right" onMousedown={(e)=>onMousedown(e, {horizontal: 'right', vertical: 'center'})}></div>
      </>}
      {height && <>
        <div class="resize resize-top" onMousedown={(e)=>onMousedown(e, {horizontal: 'center', vertical: 'top'})}></div>
        <div class="resize resize-bottom" onMousedown={(e)=>onMousedown(e, {horizontal: 'center', vertical: 'bottom'})}></div>
      </>}

      { width && height && <>
        <div class="resize resize-left-top"  onMousedown={(e)=>onMousedown(e, {horizontal: 'left', vertical: 'top'})}></div>
        <div class="resize resize-right-top"  onMousedown={(e)=>onMousedown(e, {horizontal: 'right', vertical: 'top'})}></div>
        <div class="resize resize-left-bottom"  onMousedown={(e)=>onMousedown(e, {horizontal: 'left', vertical: 'bottom'})}></div>
        <div class="resize resize-right-bottom"  onMousedown={(e)=>onMousedown(e, {horizontal: 'right', vertical: 'bottom'})}></div>
      </>

      }
      </>
    }
  }
})