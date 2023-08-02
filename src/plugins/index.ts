import type { App } from 'vue'
import scroll from './vScroll'


const directive: any = {
  scroll,
}

export default {
  install: (app: App) => {
    Object.keys(directive).forEach((value) => {;
      app.directive(value, directive[value])
    })
  }
}
