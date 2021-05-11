import { Component } from 'react'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtTimeline, AtCard } from 'taro-ui'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import './home.scss'
import { Card } from '@/components'
import {AppContext} from '@/context'
import { URL} from '@/url'

//轮播图，后期有时间可以做成请求后端接口的
const pic = ['pic1.jpeg', 'pic2.jpg', 'pic3.jpg']
const picUrl = pic.map(val => require('../../static/pic/' + val))

export default class Home extends Component {
  static contextType = AppContext

  state = {
    brief: '', 
    history: null,
    group: null, 
    standard: null
  }

  toLink(path){
    Taro.navigateTo({
      url: path
    })
  }

  componentDidMount(){
    // const {studentNum, updateState} = this.context
    

    // 请求简介数据
    Taro.request({
      url: URL.brief,
      success: (res) => {
        const {brief} = res.data
        delete brief._id
        this.setState({
          ...brief, 
          history: [...brief.history, {
            time: '至今',
            content: '协会不断注入新鲜血液， 协会的故事还在继续...'
          }]
        })
      } 
    })
    
    
  }

  render () {
    const { brief, history, group, standard } = this.state
    let items = null
    if(history){
      items = history.map(val => ({
        title: val.content,
        content: [val.time]
      }))
    }
    return (
      <View className='home'>
        <Swiper
          className='test-h'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay>
          {
            picUrl.map(v => (
              <SwiperItem>
                <Image src={v} style={{width: '100%', height: '100%'}} />
              </SwiperItem>
            ))
          }
        </Swiper>
          <Card title='协会简介'>
            <View className='at-article__p at-article__jianjie'>
              {brief}
            </View>
          </Card>
          <Card title='协会发展史'>
            {
              items && (
                <AtTimeline 
                  pending 
                  style={{fontSize: '30rpx'}}
                  items={items}></AtTimeline>
              )
            }
          </Card>
          <Card title='小组简介'>
            {
              group && group.map(v => (<AtCard
                title={v.name}
              >
                <View className='group'>{v.content}</View>
              </AtCard>))
            }
          </Card>
          <Card title='协会规章制度'>
          {
              standard && standard.map((v, index) => (
                <View className='standard'>{index + 1 + '. ' + v}</View>
              ))
            }
          </Card>
      </View>
    )
  }
}
