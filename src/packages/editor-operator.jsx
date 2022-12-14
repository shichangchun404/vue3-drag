import deepcopy from "deepcopy";
import { ElButton, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect, selectV2InjectionKey } from "element-plus";

import { computed, defineComponent, inject, reactive, watch } from "vue";
import TabelEditor from "./tabel-editor";

export default defineComponent({
  props:{
    block: { type: Object}, // 当前选中元素
    data: { type: Object}, // 当前所有数据
    updateContainer: { type: Function }, // 更新整个容器
    updateBlock: { type: Function }, // 更新单个组件
  },
  setup(props,ctx){
    
    const config = inject('config')
    const state = reactive({
      editData: null
    })
    const reset = ()=>{
      if(!props.block){
        state.editData = deepcopy(props.data.container)
      }else{
        state.editData = deepcopy(props.block)
      }
    }
    watch(()=> props.block, reset, { immediate: true})
    const apply = ()=>{
      if(!props.block){
        props.updateContainer({...props.data,container: state.editData})
      }else{
        props.updateBlock(state.editData,props.block)
      }
    }
    return ()=>{
      let content = []
      if(props.block){
        let component = config.componentMap[props.block.key]
        if(component && component.props){ // [ ['key',obj], ['key',obj]]
          let list = Object.entries(component.props)
          content.push(
            list.map(([propName, propConfig])=>{
              return <ElFormItem label={propConfig.label}>
                {
                  {
                    input(){ return <ElInput v-model={state.editData.props[propName]}></ElInput> } ,
                    color(){ return <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>},
                    select(){ return <ElSelect v-model={state.editData.props[propName]}>
                      {
                        propConfig.options.map(opt => {
                          return <ElOption label={opt.label} value={opt.value}></ElOption>
                        })
                      }
                    </ElSelect>},
                    tabel(){ return <TabelEditor propConfig={propConfig} v-model={state.editData.props[propName]}></TabelEditor>}
                  }[propConfig.type]()
                }
              </ElFormItem>
            })
          )
        }
        if(component && component.model){
          let list =  Object.entries(component.model)
          content.push(list.map(([modelName, label])=>{
            return <ElFormItem label={label}>
              <ElInput v-model={state.editData.model[modelName]}></ElInput>
            </ElFormItem>
          }))
        }
      }else{
        content.push(
          <>
            <ElFormItem label='容器宽度'>
              <ElInputNumber v-model={state.editData.width}></ElInputNumber>
            </ElFormItem>
            <ElFormItem label='容器高度'>
              <ElInputNumber v-model={state.editData.height}></ElInputNumber>
            </ElFormItem>
          </>
        )
  
      }
      return (
        <ElForm labelPosition='top'>
          { content }
          <ElFormItem>
            <ElButton type="primary" onClick={apply}>应用</ElButton>
            <ElButton onClick={reset}>取消</ElButton>
          </ElFormItem>
        </ElForm>
      )
    }
  }
})