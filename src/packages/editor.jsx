import { computed, defineComponent, inject, ref } from "vue";
import './editor.less'
import EditorBlock from "./editor-block";

export default defineComponent({
  props: {
    modelValue: { type: Object}
  },
  emits: ['update:modelValue'],
  setup(props, ctx){
    const data = computed({
      get(){
        return props.modelValue
      },
      set(newvalue){
        ctx.emit('update:modelValue', JSON.parse(JSON.stringify(newvalue)))
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

    const containerRef = ref(null)
    let currentComponent = null

    const dragenter = (e)=> {
      // console.log('dragentter ...')
      e.dataTransfer.dropEffect = 'move'
    }
    const dragover = (e)=> {
      // console.log('dragmove ...')
      e.preventDefault()
      
    }
    const dragleave = (e)=> {
      // console.log('dragleave ...')
      e.dataTransfer.dropEffect = 'move'
    }
    const drop = (e)=> {
      console.log('drop ...')
      let blocks = data.value.blocks
      data.value = { 
        ...data.value, 
        blocks: [
          ...blocks,
          {
            top: e.offsetY,
            left: e.offsetX,
            zIndex: 1,
            key: currentComponent.key
          }
        ],
        

      }
    }
    const dragStart = (e,component) => {
      console.log('dragStart ', component);
      containerRef.value.addEventListener('dragenter', dragenter) // 进入容器
      containerRef.value.addEventListener('dragover', dragover) // 经过容器
      containerRef.value.addEventListener('dragleave', dragleave) // // 离开容器
      containerRef.value.addEventListener('drop', drop) // // 松手时 向容器里添加拖动的组件
      currentComponent = component
    }
    return ()=>{
      return <div class="editor-wrap">
        {/* 左侧物料区域 可进行拖拽 */}
        <div class="editor-wrap-left">
          {
            componentList.map(component => {
              return (
                <div class="left-block-item" 
                  draggable
                  onDragstart={ e => dragStart(e, component) }
                >
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
              <div class="container" style={containerStyle.value} ref={containerRef}>
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