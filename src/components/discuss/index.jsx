import React from 'react'
import { View, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import avater from '../../static/avater/20.png'
import pinglun from '../../static/pinglun.png'
import dianzan from '../../static/dianzan.png'
import './index.scss'

export default (props) => {
  let avatarUrl = avater

  return (
    <View className='discuss'>
      <View className='top'>
        <View className='left'>
          <AtAvatar circle image={avatarUrl}></AtAvatar>
          <View>OreO</View>
        </View>
        <View  className='right'>2021-4-4</View>
      </View>
      <View className='middle'>
      jdskdjskdjksdjjksdjskj哈哈jksdjjksdjskj
      </View>
      <View className='bottom'>
        <View>300</View>
        <Image src={pinglun}></Image>
        <View>900</View>
        <Image src={dianzan}></Image>
      </View>
    </View>
  )
}