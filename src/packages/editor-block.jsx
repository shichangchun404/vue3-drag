import { computed, defineComponent, inject } from "vue";

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
    return ()=> {
      return <div class="block" style={blockStyle.value}>
        { RenderComponent }
      </div>
    }
  }
})