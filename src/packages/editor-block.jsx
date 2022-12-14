import { computed, defineComponent, inject, onMounted, ref } from "vue";
import BlockResize from "./block-resize";

export default defineComponent({
  props: {
    block: { type: Object},
    formData: { type: Object}
  },
  setup(props){
    const blockStyle = computed(()=>{
      return {
        top: `${props.block.top}px`,
        left: `${props.block.left}px`,
        zIndex: props.block.zIndex,
      }
    })
    const config = inject('config')
    
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
      const component = config.componentMap[props.block.key]
      const RenderComponent = component.render({
        size: props.block.hasResize? {width: props.block.width+'px', height: props.block.height+'px'}:{},
        props: props.block.props,
        model: Object.keys(component.model||{}).reduce((prev,modelName)=>{ // {} default
                let propsName = props.block.model[modelName] // { default: 'username'}  >>>> 'username'
                //console.log('propsName ', propsName);
                // console.log('props.formData ', props.formData) // { username: 'scc', password:123}
                prev[modelName] = {
                  modelValue: props.formData[propsName], // 'scc'
                  "onUpdate:modelValue": v => props.formData[propsName] = v
                }
                // console.log('prev ', prev)
                return prev // { default: 'scc'}
              },{})
      })
      const { width, height } = component.resize || {}
      return <div class="block" style={blockStyle.value} ref={blockRef}>
        { RenderComponent }
        { props.block.focus && (width || height) && <BlockResize component={component} block={props.block}></BlockResize>}
      </div>
    }
  }
})