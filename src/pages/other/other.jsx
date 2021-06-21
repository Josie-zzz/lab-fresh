import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button } from "@tarojs/components"
import { AtButton, AtTextarea, AtMessage, AtModal } from 'taro-ui'
import {AppContext} from '@/context'
import { URL } from '@/url'
import './other.scss'

export default class Competition extends React.Component {
  static contextType = AppContext

  constructor(){
    super()
    let { params: {_id} } = getCurrentInstance().router
    let isEdit = _id ? false : true

    this.state = {
      title: '',      //编辑的标题
      txt: '',        //编辑的内容
      detail: null,   //显示详情的内容
      isOpenedDel: false,  //是否显示删除框 
      isEdit,        //是否是添加文字状态，否则就是展示文章状态
      isUpdate: false,    //是否在修改，和添加用的是一个编辑
    }
  }

  componentDidMount(){
    const {params: {_id}} = getCurrentInstance().router
    if(_id){
      Taro.request({
        url: URL.compData,
        data: {
          _id
        },
        method: 'GET',
        success: (res) => {
          const {status, errmsg, comp} = res.data
          if(status){
            this.setState({
              detail: comp[0]
            })
          }
        }
      })
    }
  }

  //修改state
  updateState = (key, val) => {
    this.setState({
      [key]: val
    })
  }

  //提交表单信息
  submitComp = () => {
    const { title, txt, isUpdate, detail} = this.state
    const {params: {type}} = getCurrentInstance().router
    const { userInfo } = this.context
    if(!title){
      Taro.atMessage({
        message: '请填写标题',
        type: 'warning',
      })
      return
    } else if(!txt){
      Taro.atMessage({
        message: '请填写内容',
        type: 'warning',
      })
      return
    }
    //需要判断当前是否是编辑，否则就新增
    if(isUpdate){
      Taro.request({
        url: URL.compUpd,
        method: 'POST',
        data: {
          _id: detail._id,
          comp: {
            title,
            txt,
            modifiter: userInfo.name,
            updTime: Date.now().toString()
          }
        },
        success: (res) => {
          const { status, errmsg} = res.data
          if(status){
            Taro.atMessage({
              message: errmsg,
              type: 'success',
            })
            //添加成功后跳转回去
            setTimeout(() => {
              let index = 'works'
              if(type == 1){
                index = 'competition'
              }
              Taro.navigateBack({
                url: `/pages/${index}/${index}`,
              })
            }, 1000)
          }
        }
      })
      return 
    }
    Taro.request({
      url: URL.compAdd,
      method: 'POST',
      data: {
        comp: {
          type,
          title,
          txt,
          creator: userInfo.name,
          studentNum: userInfo.studentNum,
          createTime: Date.now().toString()
        }
      },
      success: (res) => {
        const { status, errmsg} = res.data
        if(status){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          //添加成功后跳转回去
          setTimeout(() => {
            let index = 'works'
            if(type == 1){
              index = 'competition'
            }
            Taro.navigateBack({
              url: `/pages/${index}/${index}`,
            })
          }, 1000)
        }
      }
    })
  }

  //删除文章
  delArticle = () => {
    const { detail } = this.state
    const {params: {type}} = getCurrentInstance().router
    
    Taro.request({
      url: URL.compDel,
      data: {
        _id: detail._id
      },
      success: (res) => {
        const { status, errmsg} = res.data
        if(status){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          //添加成功后跳转回去
          setTimeout(() => {
            let index = 'works'
            if(type == 1){
              index = 'competition'
            }
            Taro.navigateBack({
              url: `/pages/${index}/${index}`,
            })
          }, 1000)
        }
      }
    })
    
  }

  //编辑文章
  updArticle = () => {
    const { detail } = this.state
    this.setState({
      isEdit: true,
      isUpdate: true,
      title: detail.title,
      txt: detail.txt,
    })
  }

  render(){
    const { title, txt, detail, isOpenedDel, isEdit } = this.state
    let { params: { type, studentNum} } = getCurrentInstance().router
    const { level, studentNum: studentNum2 } = this.context
    
    //有_id是查询，没有是展示
    if(!isEdit){
      console.log(detail)
      return detail ? (
        <View className='other'>
          <AtMessage /> 
          <View className='at-article'>
            <View className='at-article__h1' style={{marginTop: 0, paddingTop: '30rpx'}}>
              {detail.title}
            </View>
            <View className='at-article__info' style={{color: '#908e8e'}}>
              {changeTime(detail.createTime)}&nbsp;&nbsp;&nbsp;{detail.creator}
            </View>
            {
              detail.modifiter && detail.updTime && (
                <View className='at-article__info' style={{color: '#908e8e'}}>
                  最后的修改：{changeTime(detail.updTime)}&nbsp;&nbsp;&nbsp;{detail.modifiter}
                </View>
              )
            }
            <View className='at-article__p' style={{fontSize: '30rpx'}}>
              {detail.txt}
            </View>
          </View>
          {
            (level == 1 || studentNum2 == studentNum) && (
              <>
                <Button type='warn' className='del' 
                  onClick={() => {
                    this.setState({
                      isOpenedDel: true
                    })
                  }}>删除</Button>
                <Button type='primary' className='update' onClick={this.updArticle}>修改</Button>
              </>
            )
          }
          {/* 删除成员 */}
          <AtModal
            isOpened={isOpenedDel}
            cancelText='取消'
            confirmText='确认'
            onConfirm={ this.delArticle }
            onCancel={ () => {
              this.setState({
                isOpenedDel: false
              })
            }}
            content={`你确定要删除这篇文章吗？`}
          />
        </View>
      ) : (<View>稍等，正在请求中...</View>)
    } else {
      return (
        <View className='other'>
          <AtMessage />
          <View style={{padding: 10}}>标题：</View>
          <AtTextarea
            value={title}
            onChange={(val) => {
              this.updateState('title', val)
            }}
            count
            height={50}
            maxLength={20}
            placeholder='输入标题'
          />
          <View  style={{padding: 10}}>内容：</View>
          <AtTextarea
            value={txt}
            count
            maxLength={1000}
            height={500}
            onChange={(val) => {
              this.updateState('txt', val)
            }}
            placeholder='输入添加的内容'
          />
          <AtButton type='primary' onClick={this.submitComp}>提交</AtButton>
        </View>
      )
    }
    
  }
}

//处理时间函数
function changeTime (str) {
  let d = new Date(+str)
  let year = d.getFullYear()
  let mounth = d.getMonth() + 1
  let day = d.getDate()
  let hour = d.getHours()
  let min = d.getMinutes()

  return `${year}-${mounth}-${day} ${hour}:${min}`
}