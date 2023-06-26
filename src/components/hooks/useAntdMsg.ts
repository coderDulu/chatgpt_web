import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css'; 

export function useAntd() {
  return {
    $msg: message
  }
}