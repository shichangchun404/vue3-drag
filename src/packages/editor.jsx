import { computed, defineComponent, inject } from "vue";
import './editor.less'
import EditorBlock from "./editor-block";

export default defineComponent({
  props: {
    modelValue: { type: Object}
  },
  setup(props, ctx){
    const data = computed({
      get(){
        return props.modelValue
      }
    })
    

    const containerStyle = computed(()=>{
      return {
        width: data.value.container.width + 'px',
        height: data.value.container.height + 'px'
      }
    })

    console.log('containerStyle ', containerStyle);
    const config = inject('config')
    const componentList = config.componentList

    return ()=>{
      return <div class="editor-wrap">
        <div class="editor-wrap-left">
          {
            componentList.map(component => {
              return (
                <div class="left-block-item">
                  <span class="item-label">{component.label}</span>
                  <span class="item-component">{component.preview()}</span>
                </div>
              )
               
            })
          }
          
        </div>
        <div class="editor-wrap-mid">
          <div class="menu">菜单栏</div>
          <div class="container-wrap">
            <div class="container-layout">
              <div class="container" style={containerStyle.value}>
                {
                  data.value.blocks.map((block,index) => {
                    return <EditorBlock block={block}></EditorBlock>
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div class="editor-wrap-right">右侧属性控制栏</div>
      </div>
    }
  }
})