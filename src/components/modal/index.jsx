import React from 'react'
import {  AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { View, Button } from '@tarojs/components'

export default (props) => {
  const {
    isOpened = false,
    header = '还没有标题',
    contentDOM = <View>还没内容</View>,
    onOk = () => {},
    onCancel = () => {}
  } = props
  return (
    <AtModal isOpened={isOpened}>
      <AtModalHeader>{ header }</AtModalHeader>
      <AtModalContent>
        { contentDOM }
      </AtModalContent>
      <AtModalAction> <Button onClick={onCancel}>取消</Button> <Button onClick={onOk}>确定</Button> </AtModalAction>
    </AtModal>
  )
}