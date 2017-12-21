import Vue from 'vue';
import Router from 'vue-router';

import Main from '@/views/Main';
import Login from '@/components/Login';
import Error from '@/components/error';
import admin from '@/views/admin';
import account from '@/views/account';
import advert from '@/views/advert';
import notice from '@/views/notice';
import analyse from '@/views/analyse';
import bill from '@/views/bill';
import list from '@/components/list';
import fault from '@/components/fault';
import message from '@/components/message';
import logs from '@/components/logs';
import feedback from '@/components/feedback';
import userInfo from '@/components/userInfo';
import updatePassword from '@/components/updatePassword';
import indexAd from '@/components/indexAd';
import circle from '@/components/circle';
import dynamicAd from '@/components/dynamicAd';
import recommend from '@/components/recommend';
import indexNotice from '@/components/indexNotice';
import billList from '@/components/billList';
import untreated from '@/components/untreated';
import handled from '@/components/handled';
import analyseInfo from '@/components/analyseInfo';

Vue.use(Router);


export default new Router({
  base: 'sys',
  mode: 'history',
  routes: [
    {
      path: '/home',
      component: Main,
      redirect: '/admin/list',
      children: [
        {
          path: '/admin',
          name: 'admin',
          component: admin,
          redirect: '/admin/list',
          children: [
            {
              path: '/admin/list',
              name: 'list',
              component: list,
            },
            {
              path: '/admin/message',
              name: 'message',
              component: message,
            },
            {
              path: '/admin/logs',
              name: 'logs',
              component: logs,
            },
            {
              path: '/admin/feedback',
              name: 'feedback',
              component: feedback,
            },
            {
              path: '/admin/fault',
              name: 'fault',
              component: fault,
            },
          ],
        },
        {
          path: '/account',
          name: 'account',
          component: account,
          redirect: '/account/userInfo',
          children: [
            {
              path: '/account/userInfo',
              name: 'userInfo',
              component: userInfo,
            },
            {
              path: '/account/updatePassword',
              name: 'updatePassword',
              component: updatePassword,
            },
          ],
        },
        {
          path: '/advert',
          name: 'advert',
          component: advert,
          redirect: '/advert/indexAd',
          children: [
            {
              path: '/advert/indexAd',
              name: 'indexAd',
              component: indexAd,
            },
            {
              path: '/advert/recommend',
              name: 'recommend',
              component: recommend,
            },
            {
              path: '/advert/circle',
              name: 'circle',
              component: circle,
            },
            {
              path: '/advert/dynamicAd',
              name: 'dynamicAd',
              component: dynamicAd,
            },
          ],
        },
        {
          path: '/notice',
          name: 'notice',
          component: notice,
          redirect: '/notice/indexNotice',
          children: [
            {
              path: '/notice/indexNotice',
              name: 'indexNotice',
              component: indexNotice,
            },
          ],
        },
        {
          path: '/analyse',
          name: 'analyse',
          component: analyse,
          redirect: '/analyse/analyseInfo',
          children: [
            {
              path: '/analyse/analyseInfo',
              name: 'analyseInfo',
              component: analyseInfo,
            },
          ],
        },
        {
          path: '/bill',
          name: 'bill',
          component: bill,
          redirect: '/bill/billList/untreated',
          children: [
            {
              path: '/bill/billList',
              name: 'billList',
              component: billList,
              children: [
                {
                  path: '/bill/billList/untreated',
                  name: 'untreated',
                  component: untreated,
                },
                {
                  path: '/bill/billList/handled',
                  name: 'handled',
                  component: handled,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/Login',
      name: 'Login',
      alias: '/', // 别名
      component: Login,
    },
    {
      path: '/error',
      name: 'error',
      component: Error,
    },
  ],
});
