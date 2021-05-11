import { AtButton, AtIcon } from 'taro-ui'
import './index.scss'

export default (props) => {
  const {
    onClick = () => {}
  } = props
  return (
    <AtButton type='primary' className='add-member' onClick={ onClick }><AtIcon value='add' size='35' color='#fff'></AtIcon></AtButton>
  )
}