
export default function Drag (props){
     let flags= false
     let position= { x: 0, y: 0 }
     let nx= ''
     let ny= ''
     let dx= ''
     let dy= ''
     let xPum= ''
     let yPum= ''
     let maxW = ''
     let maxH = ''

     const goNext =()=> {
         props.goNext&&props.goNext()
     }

     // 实现移动端拖拽
    const down =(event)=> {
      let default_drag_comp = document.querySelector('#default_drag_comp')
      flags = true
      var touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      maxW = document.body.clientWidth - default_drag_comp.offsetWidth
      maxH = document.body.clientHeight - default_drag_comp.offsetHeight

      position.x = touch.clientX - default_drag_comp.offsetLeft
      position.y = touch.clientY - default_drag_comp.offsetTop
      dx = touch.clientX
      dy = touch.clientY
    }
    const move=(event) =>{
      event.preventDefault()
      let default_drag_comp = document.querySelector('#default_drag_comp')
      if (flags) {
        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        nx = touch.clientX - position.x
        ny = touch.clientY - position.y

        if (nx < 0) {
          nx = 0
        } else if (nx > maxW) {
          nx = maxW
        }

        if (ny < 0) {
          ny = 0
        } else if (ny >= maxH) {
          ny = maxH
        }

        default_drag_comp.style.left = nx + 'px'
        default_drag_comp.style.top = ny + 'px'
        // 阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
        document.addEventListener(
          'touchmove',
          function() {
            // event.preventDefault();
          },
          false
        )
      }
    }
    // 鼠标释放时候的函数
    const end=()=> {
      flags = false
    }


    return (
        <div id="default_drag_comp"
            onClick={e=>goNext(e)}
            onTachstart={e=>down(e)}
            onTouchmove={e=>move(e)}
            onTouchend={e=>end(e)}
        >
        <img src="/img/history-btn.png" alt=""/>
        </div>
    )
}