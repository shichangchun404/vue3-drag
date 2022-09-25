import { computed, defineComponent, inject, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    block: { type: Object}
  },
  setup(props){
    console.log('props.block ', props)
    
    const blockStyle = computed(()=>{
      return {
        top: `${props.block.top}px`,
        left: `${props.block.left}px`,
        zIndex: `${props.block.zIndex}px`,
      }
    })
    const config = inject('config')
    const component = config.componentMap[props.block.key]
    const RenderComponent = component.render()
    const blockRef = new ref(null)
    onMounted(()=>{
  
      if(props.block.alignCenter){
        let { offsetWidth, offsetHeight} = blockRef.value
        console.log(blockRef, offsetWidth, offsetHeight);
        props.block.left =  props.block.left - offsetWidth / 2
        props.block.top =  props.block.top - offsetHeight / 2
        props.block.alignCenter = false
      }
    })


    return ()=> {
      return <div class="block" style={blockStyle.value} ref={blockRef}>
        { RenderComponent }
      </div>
    }
  }
})