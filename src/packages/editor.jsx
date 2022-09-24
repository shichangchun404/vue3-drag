import { defineComponent } from "vue";
import './editor.less'

export default defineComponent({
  props: {
    data: { type: Object}
  },
  setup(props, ctx){
    console.log(props.data);
    return ()=>{
      return <div class="editor-wrap">
        <div class="editor-wrap-left">左侧物料</div>
        <div class="editor-wrap-mid">
          <div class="menu">菜单栏</div>
          <div class="container">内容区域</div>
        </div>
        <div class="editor-wrap-right">右侧属性控制栏</div>
      </div>
    }
  }
})