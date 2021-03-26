import { Component } from 'react'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import './talk.scss'

const tabList = [{ title: '交流贴' }, { title: '就业贴' }]

export default class Talk extends Component {
  state = {
    current: 0
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  render () {
    return (
      <View className='talk'>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          {
            tabList.map((val, index) => (
              <AtTabsPane current={this.state.current} index={index} >
                <View className='content'>
                  jsijsijs{index}
                </View>
              </AtTabsPane>
            ))
          }
        </AtTabs>
      </View>
    )
  }
}
