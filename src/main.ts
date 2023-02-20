import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import {appId, secret} from './private';

type BaiduResult = {
  error_code?: string
  error_msg?: string
  from: string
  to: string
  trans_result: Array<{
    src: string,
    dst: string
  }>
}

const generateRandomString = () => (Math.random() + 1).toString(36).substring(7);

export const translate = (word: string) => {
  const salt = generateRandomString();
  let from, to;

  if (/[a-zA-Z]/.test(word[0])) {
    // 英译中
    from = 'en';
    to = 'zh';
  } else {
    // 中译英
    from = 'zh';
    to = 'en';
  }

  const query: string = querystring.stringify({
    q: word,
    from,
    to,
    appid: appId,
    salt: salt,
    sign: md5(appId + word + salt + secret)
  });

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: `/api/trans/vip/translate?${query}`,
    method: 'GET',
  };

  const request = https.request(options, (response) => {
    const chunks: Buffer[] = [];
    response.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      const object: BaiduResult = JSON.parse(string);
      if (object.error_code) {
        console.log(object.error_msg);
        process.exit(1);
      } else {
        const result = object.trans_result[0].dst;
        console.log(result);
        process.exit(0);
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};
