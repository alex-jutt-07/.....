const qs = require('querystring');
const axios = require('axios-proxy-fix');
const uuid = require('uuid/v4');
const utils = require('./utils');

async function getToken(email, password) {
  const sim = utils.randBetween(2e4, 4e4);
  let deviceID = uuid();
  let adID = uuid();
  let formData = {
    adid: adID,
    format: 'json',
    device_id: deviceID,
    email: email,
    password: password,
    cpl: 'true',
    family_device_id: deviceID,
    credentials_type: 'device_based_login_password',
    generate_session_cookies: '1',
    error_detail_type: 'button_with_disabled',
    source: 'device_based_login',
    machine_id: utils.randString(24),
    meta_inf_fbmeta: '',
    advertiser_id: adID,
    currently_logged_in_userid: '0',
    locale: 'en_US',
    client_country_code: 'US',
    method: 'auth.login',
    fb_api_req_friendly_name: 'authenticate',
    fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
    api_key: '882a8490361da98702bf97a021ddc14d'
  };
  formData.sig = getSig(utils.sortObj(formData));
  let conf = {
    url: 'https://b-api.facebook.com/method/auth.login',
    method: 'post',
    data: formData,
    transformRequest: [
      function(data, headers) {
        return qs.stringify(data);
      }
    ],
    headers: {"Content-Type": "application/x-www-form-urlencoded","Host": "b-graph.facebook.com","User-Agent":"Dalvik/2.1.0 (Linux; U; Android 10; POT-LX1 Build/HUAWEIPOT-L21) [FBAN/EMA;FBAV/266.0.0.64.124;FBBV/209629367;FBDM/{density=3.375,width=1080,height=2139};FBLC/fr_FR;FBRV/0;FBCR/VOO;FBMF/HUAWEI;FBBD/HUAWEI;FBPN/com.facebook.lite;FBDV/POT-LX1;FBSV/9;FBOP/1;FBCA/arm64-v8a:;]","X-FB-Net-HNI": "45204","X-FB-SIM-HNI": "45201","X-FB-Connection-Type": "MOBILE.LTE","X-Tigon-Is-Retry": "False","x-fb-session-id": "nid=jiZ+yNNBgbwC;pid=Main;tid=132;nc=1;fc=0;bc=0;cid=d29d67d37eca387482a8a5b740f84f62","x-fb-device-group": "5120","X-FB-Friendly-Name": "ViewerReactionsMutation","X-FB-Request-Analytics-Tags": "graphservice","Accept-Encoding": "gzip, deflate","X-FB-HTTP-Engine": "Liger","X-FB-Client-IP": "True","X-FB-Server-Cluster": "True","x-fb-connection-token": "d29d67d37eca387482a8a5b740f84f62","Connection": "Keep-Alive"}
  };
  const resp = await axios(conf);
  return resp.data;
}

function getSig(formData) {
  let sig = '';
  Object.keys(formData).forEach(function(key) {
    sig += `${key}=${formData[key]}`;
  });
  sig = utils.md5(sig + '585aec5b4c27376758abb7ffcb9db2af');
  return sig;
}

module.exports = getToken;
