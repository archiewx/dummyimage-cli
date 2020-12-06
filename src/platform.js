const path = require('path');
const os = require('os');
const fse = require('fs-extra');

const DUMMY = 'dummy';

exports.saveAsset = (buf) => {
  const base64 = buf.toString('base64');
  const imgBuf = Buffer.from(base64, 'base64');
  const r = Math.random().toString(16).substring(2);
  const now = Date.now();
  const name = `${now}-${r}.png`;
  const basePath = path.resolve(os.tmpdir(), DUMMY);
  if (!fse.existsSync(basePath)) {
    fse.mkdirSync(basePath);
  }
  const filePath = path.resolve(basePath, name);
  fse.writeFileSync(filePath, imgBuf);
  return filePath;
};
