import deepcopy from "deepcopy";
import { ElButton, ElTag } from "element-plus";
import { computed, defineComponent } from "vue";
import { $tabelDialog } from "../components/tabelDialog";

export default defineComponent({
  props:{
    propConfig: { type: Object},
    modelValue: { type: Array}
  },
  emits: ['update:modelValue'],
  setup(props,ctx){
    const data = computed({
      get(){
        return props.modelValue || []
      },
      set(newValue){
        ctx.emit('update:modelValue', deepcopy(newValue))
      }
    })
    const add = ()=>{
      $tabelDialog({
        propConfig: props.propConfig,
        data: data.value,
        onConfirm(value){
          data.value = value
        }
      })
    }
    return ()=>{
      return <div>
        {/* 下拉框没有数据显示添加按钮 */}
        { (!data || data.value.length === 0) && <ElButton onClick={add}>添加</ElButton> }

        {(data.value || []).map(item => (<ElTag onClick={add}>{item[props.propConfig.table.showKey]}</ElTag>))}
        </div>
    }
  }
})