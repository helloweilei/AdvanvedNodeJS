const KeyGrip = require('keygrip');
const Buffer = require('safe-buffer').Buffer;

const keys = require('../../config/keys');

module.exports = (user) => {
  const session = Buffer.from(JSON.stringify({
    passport: { user: user._id.toString() },
  })).toString('base64');

  const keyGrip = new KeyGrip([keys.cookieKey]);
  const sig = keyGrip.sign(`session=${session}`);

  return { session, sig };
}