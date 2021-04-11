import { Component } from 'react'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import './home.scss'
import Card from '@/components/card'
import {AppContext} from '@/context'

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
  {
    name: '就业管理',
    icon: 'credit-card',
    path: '/pages/job/job'
  },
]

export default class Home extends Component {
  static contextType = AppContext

  state = {
  }

  toLink(path){
    Taro.navigateTo({
      url: path
    })
  }

  componentDidMount(){
    const {studentNum, updateUser} =this.context
    Taro.request({
      url: `http://127.0.0.1:3009/login/info?studentNum=${studentNum}`,
      success(res){
        const {status, userInfo} = res.data
        if(status){
          updateUser(userInfo)
        }
      }
    })
  }

  render () {
    const {  } = this.state
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
                    <View className='left'>
                      <AtIcon className='icon' value={val.icon} color='#fff' size='24'></AtIcon>
                      <Text>{val.name}</Text>
                    </View>
                    <AtIcon value='chevron-right' size='30' color='#fff'></AtIcon>
                  </View>
                )
              })
            }
          </View>
        </Card>
      </View>
    )
  }
}
