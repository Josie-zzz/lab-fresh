export default {
  pages: [
    'pages/login/login',
    'pages/home/home',
    'pages/me/me',
    'pages/apply/apply',
    'pages/fresh/fresh',
    'pages/competition/competition',
    'pages/works/works',
    'pages/member/member',
    'pages/job/job',
    'pages/direction/direction'
  ],
  window: {
    backgroundTextStyle: 'light',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    borderStyle: 'white',
    selectedColor: '#4e73ba',
    list: [
      {
        pagePath: 'pages/home/home',
        text: '主页',
        iconPath: './static/tabbar/index.png',
        selectedIconPath: './static/tabbar/index2.png',
      },
      {
        pagePath: 'pages/apply/apply',
        text: '功能',
        iconPath: './static/tabbar/talk.png',
        selectedIconPath: './static/tabbar/talk2.png',
      },
      {
        pagePath: 'pages/me/me',
        text: '我',
        iconPath: './static/tabbar/me.png',
        selectedIconPath: './static/tabbar/me2.png',
      }
    ]
  }
}
