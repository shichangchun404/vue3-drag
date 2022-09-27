import { reactive } from "vue"

export default function useBlockDragger(focusData, lastSelectedBlock){
  let blockState = {
    startX: 0,
    startY: 0,
  }
  let markLine = reactive({
    x: null,
    y: null
  })
  const mousedown =(e)=>{
    let { width: BWidth, height: BHeight} = lastSelectedBlock.value
    let prositions =  focusData.value.focus.map(({top,left})=>({top,left}))
    blockState = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: lastSelectedBlock.value.left,
      startTop: lastSelectedBlock.value.top,
      prositions,
      lines: (()=>{
        const {unfocused} = focusData.value
        let lines = {
          x:[], // x轴参考线 |
          y:[]  // y轴参考线 -
        }
        unfocused.forEach(block => {
          let {top:ATop, left: ALeft,width:AWidth,height:AHeight} = block
          // 上下对齐
          lines.y.push({showTop:ATop, top:ATop}) // 顶对顶 当AB顶对齐时 辅助线以A的top值为参考线 B距离top值为ATop
          lines.y.push({showTop:ATop, top:ATop-BHeight}) // 顶对底 当A顶对B底时 辅助线以A的top值为参考线 B距离top值为（ATop-BHeight）
          lines.y.push({showTop:ATop+AHeight, top:ATop+AHeight-BHeight}) // 底对底
          lines.y.push({showTop:ATop+AHeight, top:ATop+AHeight}) // 底对顶
          lines.y.push({showTop:ATop+AHeight/2, top:ATop+AHeight/2 - BHeight/2}) // 中对中
          // 左右对齐
          lines.x.push({showLeft:ALeft, left:ALeft}) // 左对左 
          lines.x.push({showLeft:ALeft, left: ALeft-BWidth}) // 左对右
          lines.x.push({showLeft:ALeft+AWidth, left: ALeft+AWidth}) // 右对左
          lines.x.push({showLeft:ALeft+AWidth, left: ALeft+AWidth-BWidth}) // 右对右
          lines.x.push({showLeft:ALeft+AWidth/2, left: ALeft+AWidth/2-BWidth/2}) // 中对中
        })
        return lines
      })()
    }
    document.addEventListener('mousemove',mousemove)
    document.addEventListener('mouseup',mouseup)
  }
  const mousemove = (e)=> {
    let {clientX: moveX, clientY: moveY} = e

    // 计算当前移动元素最新的left与top值 去参考线里找最近的
    // 鼠标移动后位置 - 鼠标移动前位置 + left
    let left = moveX - blockState.startX + blockState.startLeft 
    let top = moveY -  blockState.startY + blockState.startTop

    // 计算y轴上的横线 找出距离元素5px时 显示y轴的线 并且吸边
    let y = null
    for(let i=0;i<blockState.lines.y.length;i++){
      let {showTop: s, top: t} = blockState.lines.y[i]
      if(Math.abs(t-top)<5){
        y = s // 辅助线显示的位置
        moveY = blockState.startY - blockState.startTop + t // 吸边
        break
      }
    }
    // 计算y轴上的横线 找出距离元素5px时 显示y轴的线
    let x = null
    for(let i=0;i<blockState.lines.x.length;i++){
      let {showLeft: s, left: l} = blockState.lines.x[i]
      if(Math.abs(l-left)<5){
        x = s
        moveX = blockState.startX - blockState.startLeft + l
        break
      }
    }
    markLine.x = x
    markLine.y = y

    let durX = moveX - blockState.startX
    let durY = moveY -  blockState.startY

    focusData.value.focus.forEach((block,index)=>{
      let l = blockState.prositions[index].left + durX
      let t = blockState.prositions[index].top + durY
      block.left = l
      block.top = t
    })
   
  }
  const mouseup = ()=> {
    document.removeEventListener('mousemove',mousemove)
    document.removeEventListener('mouseup',mouseup)
    markLine.x = null
    markLine.y = null
  }

  return {
    markLine,
    mousedown
  }
}