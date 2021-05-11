import React from 'react'
import { View } from "@tarojs/components"
import './index.scss'

export default class ListCard extends React.Component {
  render(){
    const { style, title, txt } = this.props
    return (
      <View className='list-card' style={{...style}}>
        <View className='title'>{ title || '' }</View>
        <View className='txt'>{ txt || '' }</View>
      </View>
    )
  }
}