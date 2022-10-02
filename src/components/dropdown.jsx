import { computed, createVNode, defineComponent, inject, onBeforeUnmount, onMounted, provide, reactive, ref, render } from "vue"

export const DropdownItem = defineComponent({
  props:{
    label: String
  },
  setup(props,ctx){
    const state = reactive({
      label: props.label
    })
    const hideDropdown = inject('hideDropdown')
    return ()=>{
      return <div class="dropdown-item" onClick={hideDropdown}>{state.label}</div>
    }
  }
})
const DropdownComponent = defineComponent({
  props: {
    option: { type: Object}
  },
  setup(props,ctx){
    const state = reactive({
      isShow: false,
      option: props.option,
      top: 0,
      left: 0
    })
    ctx.expose({
      showDropdown(option){
        state.isShow = true
        state.option = option
        const { top, left, height } = option.el.getBoundingClientRect()
        console.log(top, left, height);
        state.top = top + height
        state.left = left
      }
    })
    provide('hideDropdown', ()=> state.isShow = false)
    const classss = computed(()=>{
      return [
        'dropdown',
        {
          'dropdown-show': state.isShow
        }
      ]
    })
    const styles = computed(()=>{
      return {
        top: state.top + 'px',
        left: state.left + 'px',
      }
    })
    const el = ref(null)
    const onMousedown = (e)=>{
      if(!el.value.contains(e.target)){ // 点击下拉弹窗外部
        state.isShow = false
      }
    }
    onMounted(()=>{
      // 事件行为是先捕获 再冒泡 之前给block都加了e.stopPropagation()
      document.body.addEventListener('mousedown',onMousedown,true)
    })
    onBeforeUnmount(()=>{
      document.body.removeEventListener('mousedown',onMousedown)
    })
    return ()=>{
      return <div class={classss.value} style={styles.value} ref={el}>
        { state.option.content }
      </div>
    }
  }
})



let vnode
export const $dropdown = (option)=>{
  console.log(' dropdown === ');
  if(!vnode){
    let el = document.createElement('div')
    vnode = createVNode(DropdownComponent,{option})
    render(vnode,el)
    document.body.appendChild(el)
  }
  const { showDropdown } = vnode.component.exposed
  showDropdown(option)
  
}