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
    headers: { 'user-agent': '[FBAN/FB4A;FBAV/331.0.0.9.105;FBBV/30034644;FBDM/{density=2.96,width=1080,height=2340};FBLC/en_US;FBCR/TELENOR;FBMF/TECNO;FBBD/TECNO;FBPN/com.facebook.katana;FBDV/TECNO;FBSV/9;FBOP/1;FBCA/armeabi-v7a:armeabi;]',
'Accept-Encoding': 'gzip, deflate',
'Accept': '*/*',
'connection': 'keep-alive',
'Authorization': 'OAuth 256002347743983|374e60f8b9bb6b8cbb30f78030438895',
'x-fb-connection-bandwidth': str(random.randint(20000000, 40000000)),
'x-fb-sim-hni': str(random.randint(20000, 40000)),
'x-fb-net-hni': str(random.randint(20000, 40000)),
'X-FB-Connection-Quality': 'EXCELLENT',
'X-FB-Connection-Type': 'MOBILE.EDGE',
'content-encoding': 'gzip,deflate',
'content-type': 'application/x-www-form-urlencoded',
'x-fb-http-engine': 'Liger'}
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
