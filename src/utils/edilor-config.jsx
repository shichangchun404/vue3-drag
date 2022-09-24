import { ElButton, ElInput} from 'element-plus'
function createEditorConfig(){
  let componentList = []
  let componentMap = {}

  return {
    componentList,
    componentMap,
    register(component){
      componentList.push(component)
      componentMap[component.key] = component
    }
  }
}

export let editorConfig = createEditorConfig()

editorConfig.register({
  label: '文本',
  preview: ()=> '预览文本',
  render: ()=> '渲染文本',
  key: 'text'
})

editorConfig.register({
  label: '按钮',
  preview: ()=> <ElButton>预览按钮</ElButton>,
  render: ()=> <ElButton>渲染按钮</ElButton>,
  key: 'button'
})

editorConfig.register({
  label: '输入框',
  preview: ()=> <ElInput placeholder="预览输入框"></ElInput>,
  render: ()=> <ElInput placeholder="渲染输入框"></ElInput>,
  key: 'input'
})