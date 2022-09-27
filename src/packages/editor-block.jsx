import { computed, defineComponent, inject, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    block: { type: Object}
  },
  setup(props){
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
      let { offsetWidth, offsetHeight} = blockRef.value
      if(props.block.alignCenter){
        props.block.left =  props.block.left - offsetWidth / 2
        props.block.top =  props.block.top - offsetHeight / 2
        props.block.alignCenter = false
      }
      props.block.width = offsetWidth
      props.block.height = offsetHeight
    })

    return ()=> {
      return <div class="block" style={blockStyle.value} ref={blockRef}>
        { RenderComponent }
      </div>
    }
  }
})