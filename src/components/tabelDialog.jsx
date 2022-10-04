import deepcopy from "deepcopy"
import { ElButton, ElDialog, ElInput, ElTable, ElTableColumn, ElTabs } from "element-plus"
import { createVNode, defineComponent, reactive, render } from "vue"

const TabelDialogComponent = defineComponent({
  props:{
    option: { type: Object}
  },
  setup(props, ctx){
    const state = reactive({
      isShow: false,
      option: props.option,
      editData: [] // [{label:'',value: ''}]
    })
    const methods = {
      show(option){
        state.isShow = true
        state.option = option
        state.editData = deepcopy(option.data)
      }
    }
    ctx.expose(methods)

    const add = ()=> {
      state.editData.push({})
    }
    const reset = ()=> {}
    const deleteItem =({$index,row})=>{
      state.editData.splice($index,1)
    }
    const oncancle = ()=> {
      state.isShow = false
    }
    const onconfirm = ()=> {
      state.isShow = false
      state.option.onConfirm(state.editData)
    }
    return ()=>{
      return <ElDialog v-model={state.isShow} title={state.option.propConfig.label}>
        {
          {
            default(){
              return <div>
                <div>
                  <ElButton onClick={add}>添加</ElButton><ElButton onClick={reset}>重置</ElButton>
                </div>
                <div>
                  <ElTable data={state.editData}>
                    <ElTableColumn type="index" label="序号"></ElTableColumn>
                    {
                      state.option.propConfig.table.options.map((item,index)=>{
                        return <ElTableColumn label={item.label}>
                          {
                            {
                              default({row}){
                                return <ElInput v-model={row[item.field]}></ElInput>
                              }
                            }
                          }
                        </ElTableColumn>
                      })
                    }
                    <ElTableColumn label="操作">
                      {
                        {
                          default(item){
                            return  <ElButton type="danger" onClick={()=>deleteItem(item)}>删除</ElButton>
                          }
                        }
                      }
                     
                    </ElTableColumn>
                  </ElTable>
                </div>
               
              </div>
            },
            footer(){
              return <div>
                <ElButton onClick={oncancle}>取消</ElButton>
                <ElButton type="primary" onClick={onconfirm}>确认</ElButton>
              </div>
            }
          }
        }
      </ElDialog>
    }
  }
})



let vnode
export const $tabelDialog = (option)=>{
  if(!vnode){
    let el = document.createElement('div')
    vnode = createVNode(TabelDialogComponent, {option})
    render(vnode, el)
    document.body.appendChild(el)
  }
  const { show } =  vnode.component.exposed
  show(option)
}