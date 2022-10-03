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

const createInputProps = (label)=>({ type: 'input', label})
const createColorProps = (label)=>({ type: 'color', label})
const createSelectProps = (label,options)=>({ type: 'select', label, options})

export let editorConfig = createEditorConfig()
editorConfig.register({
  label: '文本',
  preview: ()=> '预览文本',
  render: ({props})=> <span style={ {color: props.color, fontSize: props.size}}> { props.text || '默认文字'}</span>,
  key: 'text',
  props: {
    text: createInputProps('文本内容'),
    color: createColorProps('文字颜色'),
    size: createSelectProps('文字大小', [
      {label: '12px', value: '12px'},
      {label: '14px', value: '14px'},
      {label: '16px', value: '16px'},
      {label: '18px', value: '18px'},
      {label: '20px', value: '20px'}
    ]),
  }
})

editorConfig.register({
  label: '按钮',
  preview: ()=> <ElButton>预览按钮</ElButton>,
  render: ({props})=> <ElButton type={ props.type} size={ props.size}>{props.text}</ElButton>,
  key: 'button',
  props: {
    text: createInputProps('按钮内容'),
    type: createSelectProps('按钮类型', [
      {label: '基础', value: 'primary'},
      {label: '成功', value: 'success'},
      {label: '警告', value: 'warning'},
      {label: '危险', value: 'danger'},
      {label: '文本', value: 'text'}
    ]),
    size: createSelectProps('按钮大小', [
      {label: '默认', value: 'default'},
      {label: '中等', value: 'middle'},
      {label: '小', value: 'small'},
      {label: '极小', value: 'mini'},
    ]),
  }
})

editorConfig.register({
  label: '输入框',
  preview: ()=> <ElInput placeholder="预览输入框"></ElInput>,
  render: ()=> <ElInput placeholder="渲染输入框"></ElInput>,
  key: 'input'
})