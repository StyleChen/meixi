import Vue from 'vue';
import iView from 'iview';
import Vddl from 'vddl';
import VueDND from 'awe-dnd';
import 'iview/dist/styles/iview.css';
import Resource from 'vue-resource';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(Resource);
Vue.use(iView);
Vue.use(VueDND);
Vue.use(Vddl);
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
