import React, { Component } from 'react'
import {AppContext} from './context'
import './app.scss'
//引入主题样式
import './custom-theme.scss'
class App extends Component {
  constructor(){
    super()
    //全局变量设置
    this.state = {
      userInfo: {},   //记录用户信息
      level: -1,        //用户等级
      studentNum: '',   //用户id，Taro.switchTab切换路由不能传参
      avaterUrl: ''     //当前用户头像
    }
  }

  updateState = (state, val) => {
    try {
      const thisState = this.state
      if(thisState.hasOwnProperty(state)){
        this.setState({
          [state]: val
        })
        return
      }
      throw new ReferenceError(`${state} is not defined in this.state`)
    } catch(e) {
      console.log(e)
    }
    
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    let obj = {
      ...this.state, 
      updateState: this.updateState,
    }
    // console.log(obj)
    return (
      <AppContext.Provider value={obj}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default App
