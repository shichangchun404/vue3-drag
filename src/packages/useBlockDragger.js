export default function useBlockDragger(focusData){
  let blockState = {
    startX: 0,
    startY: 0,
  }
  const mousedown =(e)=>{
    let prositions =  focusData.value.focus.map(({top,left})=>({top,left}))
    blockState = {
      startX: e.clientX,
      startY: e.clientY,
      prositions
    }
    document.addEventListener('mousemove',mousemove)
    document.addEventListener('mouseup',mouseup)
  }
  const mousemove = (e)=> {
    let {clientX:moveX,clientY:moveY} = e
    let durX = moveX - blockState.startX
    let durY = moveY -  blockState.startY
    focusData.value.focus.forEach((block,index)=>{
      block.left = blockState.prositions[index].left + durX
      block.top = blockState.prositions[index].top + durY
    })
  }
  const mouseup = ()=> {
    document.removeEventListener('mousemove',mousemove)
    document.removeEventListener('mouseup',mouseup)
  }

  return {
    mousedown
  }
}