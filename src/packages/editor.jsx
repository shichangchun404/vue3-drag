import { computed, defineComponent, inject, ref } from "vue";
import './editor.less'
import EditorBlock from "./editor-block";
import useMenuDragger from './useMenuDragger'
import useFocus from "./useFocus";

export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue
      },
      set(newvalue) {
        ctx.emit('update:modelValue', JSON.parse(JSON.stringify(newvalue)))
      }
    })
    const containerStyle = computed(() => {
      return {
        width: data.value.container.width + 'px',
        height: data.value.container.height + 'px'
      }
    })

    const config = inject('config')
    const componentList = config.componentList
    const containerRef = ref(null)

    // 菜单的拖拽
    const { dragStart, dragend } = useMenuDragger(data, containerRef)

    // 获取元素焦点
    const { containerMouseDown, blockMouseDown } = useFocus(data)

    return () => {
      return <div class="editor-wrap">
        {/* 左侧物料区域 可进行拖拽 */}
        <div class="editor-wrap-left">
          {
            componentList.map(component => {
              return (
                <div
                  class="left-block-item"
                  draggable
                  onDragstart={e => dragStart(e, component)}
                  onDragend={e => dragend(e)}
                >
                  <span class="item-label">{component.label}</span>
                  <span class="item-component">{component.preview()}</span>
                </div>
              )

            })
          }

        </div>

        <div class="editor-wrap-mid">
          <div class="menu">编辑工具栏</div>
          <div class="container-wrap">
            <div class="container-layout">
              <div
                class="container"
                style={containerStyle.value}
                ref={containerRef}
                onMousedown={e => containerMouseDown(e)}
              >
                {
                  data.value.blocks.map((block, index) => {
                    return <EditorBlock
                      block={block}
                      class={block.focus ? 'block-focus' : ''}
                      onMousedown={e => blockMouseDown(e, block)}

                    ></EditorBlock>
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