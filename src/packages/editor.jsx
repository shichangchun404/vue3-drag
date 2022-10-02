import { computed, defineComponent, inject, ref } from "vue";
import './editor.less'
import EditorBlock from "./editor-block";
import useMenuDragger from './useMenuDragger'
import useFocus from "./useFocus";
import useBlockDragger from "./useBlockDragger";
import useCommands from "./useCommands";
import deepcopy from "deepcopy";
import { $dialog }  from "../components/dialog";
import { $dropdown, DropdownItem } from "../components/dropdown";

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
      set(newValue) {
        ctx.emit('update:modelValue', deepcopy(newValue))
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

    const previewRef = ref(false) // 是否预览标志
    const fullScreenRef = ref(false) // 全屏预览标志

    // 菜单的拖拽
    const { dragStart, dragend } = useMenuDragger(data, containerRef)

    // 获取元素焦点
    const { containerMouseDown, blockMouseDown,clearBlocksFocus, focusData, lastSelectedBlock } = useFocus(data, previewRef, (e) => {
      // 在容器内部选择元素后 直接拖拽的回调
      mousedown(e)
    })

    // 容器内部拖拽
    const { mousedown, markLine } = useBlockDragger(data, focusData, lastSelectedBlock)

    const { commands } = useCommands(data,focusData)
    const buttons = [
      {label: '撤销', handler: ()=> commands.undo()},
      {label: '重做', handler: ()=> commands.redo()},
      {label: '导入', handler: ()=> {
        $dialog({
          title: '导入JSON数据',
          content: '',
          footer: true,
          onConfirm(content){
            // data.value = JSON.parse(content) // 无法记录前进后退操作
            commands.applyJson(JSON.parse(content))
          }
        })
      }},
      {label: '导出', handler: ()=> {
        $dialog({
          title: '导出JSON数据',
          content: JSON.stringify(data.value),
        })
      }},
      {label: '置顶', handler: ()=> commands.placeTop()},
      {label: '置底', handler: ()=> commands.placeBottom()},
      {label: '删除', handler: ()=> commands.delete()},
      {label: ()=> previewRef.value?'编辑':'预览', handler: ()=> {
        previewRef.value = !previewRef.value
        clearBlocksFocus()
      }},
      {label: ()=>fullScreenRef.value?'返回编辑':'全屏预览', handler: ()=> {
        fullScreenRef.value = !fullScreenRef.value
        clearBlocksFocus()
      }},
    ]

    const onContextMenublock = (e,block)=>{
      console.log(e)
      e.preventDefault()
      $dropdown({
        el: e.target,
        content:<>
          <DropdownItem label="删除" onclick={commands.delete}></DropdownItem>
          <DropdownItem label="置顶" onclick={commands.placeTop}></DropdownItem>
          <DropdownItem label="置低" onclick={commands.placeBottom}></DropdownItem>
          <DropdownItem label="导出" onclick={()=>{
            $dialog({
              title: '导出JSON数据',
              content: JSON.stringify(block),
            })
          }}></DropdownItem>
          <DropdownItem label="导入" onclick={()=>{
             $dialog({
              title: '导入JSON数据',
              content: '',
              footer: true,
              onConfirm(content){
                commands.applyJsonSingleBlock(JSON.parse(content),block)
              }
            })
          }}></DropdownItem>
        </>
      })
    }

    return () => {
      return fullScreenRef.value ? /** 全屏预览 */
      (
        <div class="editor-wrap">
        {/* 左侧物料区域 可进行拖拽 */}
        <div class="editor-wrap-mid">
          {/* 编辑栏区 */}
          <div class="menu menu-fixed">
            <div class="editor-menu-button" onClick={()=>fullScreenRef.value=false}>
              返回编辑
            </div>
          </div>
          {/* 拖拽视图区 */}
          <div class="container-wrap">
            <div class="container-layout">
              <div class="container" style={containerStyle.value}>
                {
                  data.value.blocks.map((block, index) => {
                    return <EditorBlock
                      key={block.key+index}
                      block={block}
                      class='block-preview'
                    ></EditorBlock>
                  })
                }
              </div>
            </div>
          </div>
        </div>
        {/* 属性编辑区 */}
        </div>
      )
      :  /** 正常编辑 */
      (
        <div class="editor-wrap">
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
          {/* 编辑栏区 */}
          <div class="menu">
            {
              buttons.map(item => {
                return <div class="editor-menu-button" onClick={item.handler}>
                  { typeof item.label === 'function' ? item.label() : item.label}
                </div>
              })
            }
          </div>
          {/* 拖拽视图区 */}
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
                      key={block.key+index}
                      block={block}
                      class={[{'block-focus': block.focus}, {'block-preview':previewRef.value} ]}
                      onMousedown={e => blockMouseDown(e, block, index)}
                      onContextmenu={e=> onContextMenublock(e, block)}
                    ></EditorBlock>
                  })
                }
                {markLine.x && <div class='make-line-x' style={{ left: markLine.x + 'px' }}></div>}
                {markLine.y && <div class='make-line-y' style={{ top: markLine.y + 'px' }}></div>}
              </div>
            </div>
          </div>
        </div>
        {/* 属性编辑区 */}
        <div class="editor-wrap-right">右侧属性控制栏</div>
        
      </div>
      )
       
    }
  }
})