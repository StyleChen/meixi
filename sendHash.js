/* eslint-disable import/no-extraneous-dependencies */
// 自动发送版本号给后台
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const { name } = require('./package.json');

const files = fs.readdirSync('./dist/static/js');

const result = files
  .filter(file => !((file.includes('.map')) || file.includes('.html')))
  .map(file => file.replace(/(\w*-\w*)\.([a-z0-9]*)\.js/, '$1-$2'))
  .reduce((vers, item) => {
    const temp = item.split('.');
    vers.push({
      v: 1, // 版本号
      name: `${name}/js/${temp[0]}`,
      hash: temp[1],
    });
    return vers;
  }, []);

const isTest = process.env.npm_lifecycle_event.includes(':test');

const hostname = isTest ? 'http://192.168.2.22:8050' : 'http://meixiyun.dreamhiway.cn';
fetch(`${hostname}/sys/hash/set`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ model: result }),
})
  .then(res => res.json())
  .then((data) => {
    if (data.success) {
      console.log('success');
    } else {
      console.log(data.msg);
    }
  });

