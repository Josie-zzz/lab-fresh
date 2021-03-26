import { Component } from 'react'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import './home.scss'
import Card from '../../components/card'

//轮播图，后期有时间可以做成请求后端接口的
const pic = ['pic1.jpeg', 'pic2.jpg', 'pic3.jpg']
const picUrl = pic.map(val => require('../../static/pic/' + val))

//子页面路由
const pages = [
  {
    name: '协会简介',
    icon: 'list',
    path: '/pages/brief/brief'
  },
  {
    name: '协会纳新',
    icon: 'link',
    path: '/pages/fresh/fresh'
  },
  {
    name: '协会竞赛',
    icon: 'lightning-bolt',
    path: '/pages/competition/competition'
  },
  {
    name: '成果展示',
    icon: 'file-code',
    path: '/pages/works/works'
  },
]

export default class Home extends Component {
  state = {
    notice: [
      {
        text: '劳斯莱斯是劳斯莱斯劳斯莱斯劳斯莱斯李老师了',
        time: '2021-3-28'
      },
      {
        text: '劳斯莱斯是劳斯莱斯劳斯莱斯劳斯莱斯李老师了',
        time: '2021-3-28'
      },
      {
        text: '劳斯莱斯是劳斯莱斯劳斯莱斯劳斯莱斯李老师了',
        time: '2021-3-28'
      },
      {
        text: '劳斯莱斯是劳斯莱斯劳斯莱斯劳斯莱斯李老师了',
        time: '2021-3-28'
      }
    ]
  }

  toLink(path){
    Taro.navigateTo({
      url: path
    })
  }

  render () {
    const { notice } = this.state
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
        <Card title='功能展示'>
          <View className='many-page'>
            {
              pages.map((val, index) => {
                let color = '#4e73ba'
                if(index % 2 !== 0){
                  color = '#89acee'
                }

                return (
                  <View className='box' style={{backgroundColor: color}} onClick={() => this.toLink(val.path)}>
                    <AtIcon className='icon' value={val.icon} color='#fff' size='24'></AtIcon>
                    <Text>{val.name}</Text>
                  </View>
                )
              })
            }
          </View>
        </Card>
        <Card title='通知' more='更多' color='#89acee' toGo='/pages/notice/notice'>
          {
            notice.map((val, index) => {
              let borderBottom = 'dashed 1px #e2e2e2c5'
              if(index == notice.length - 1){
                borderBottom = 'none'
              }

              return (
                <View className='text' style={{borderBottom}}>
                  <View className='txt'>{val.text}</View>
                  <View className='time'>{val.time}</View>
                </View>
              )
            })
          }
        </Card>
      </View>
    )
  }
}
