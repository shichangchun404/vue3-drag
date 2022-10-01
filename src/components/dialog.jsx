import { ElButton, ElDialog, ElInput } from "element-plus";
import { createVNode, defineComponent, reactive, render } from "vue";

const DilaogComponent = defineComponent({
  props:{
    option: { type: Object}
  },
  setup(props,ctx){
    const state = reactive({
      option: props.option,
      isShow: false
    })
    ctx.expose({ // 暴露给外界组件内部的方法
      showDialog(option){
        state.option = option
        state.isShow = true
      }
    })
    const onCancle = ()=>{
      state.isShow = false
    }
    const onConfirm = ()=>{
      state.option.onConfirm && state.option.onConfirm(state.option.content)
      state.isShow = false
    }
    return ()=>{
      return <ElDialog v-model={state.isShow} title={state.option.title}>
        {
          {
            default: ()=> <ElInput v-model={state.option.content} rows={10} type="textarea"></ElInput>,
            footer: ()=>{
              return state.option.footer&&<div>
                <ElButton type="primary" onClick={onConfirm}>应用</ElButton>
                <ElButton onClick={onCancle}>取消</ElButton>
              </div>
            }
          }
        }
      </ElDialog>
    }
  }
})

let vnode
export const $dialog = (option)=>{
  if(!vnode){ // 只创建一个
    let el = document.createElement('div')
    vnode = createVNode(DilaogComponent,{option})
    render(vnode,el)
    document.body.appendChild(el)
  }
  let { showDialog } = vnode.component.exposed
  showDialog(option)

}