// import something here
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

export default ({ app, router, Vue }) => {
  Vue.use(VueLodash, { lodash: lodash })
}
