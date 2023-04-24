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
    headers: {
      'x-fb-connection-bandwidth': utils.randBetween(2e7, 3e7),
      'x-fb-sim-hni': sim,
      'x-fb-net-hni': sim,
      'x-fb-connection-quality': 'EXCELLENT',
      'x-fb-connection-type': 'MOBILE.EDGE',
      'user-agent':
        '[FBAN/FB4A;FBAV/277.0.0.19.117;FBPN/com.facebook.katana;FBLC/en_GB;FBBV/451745221;FBCR/ZONG;FBMF/vivo;FBBD/vivo;FBDV/POCO;FBSV/9;FBCA/armeabi-v7a:armeabi;FBDM/{density=2.0,width=,height=1430};]',
      'content-type': 'application/x-www-form-urlencoded',
      'x-fb-http-engine': 'Liger'
    }
  };
  const resp = await axios(conf);
  return resp.data;
}

function getSig(formData) {
  let sig = '';
  Object.keys(formData).forEach(function(key) {
    sig += `${key}=${formData[key]}`;
  });
  sig = utils.md5(sig + '62f8ce9f74b12f84c123cc23437a4a32');
  return sig;
}

module.exports = getToken;
