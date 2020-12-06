const { program } = require('commander');
const pkg = require('../package.json');
const { defaultOptions, removeHexColorPrefix, downloadDummyImage } = require('./dummy-image');
const ora = require('ora');
const { saveAsset } = require('./platform');

const dummyOptions = defaultOptions;

program
  .name('dummary')
  .usage('[options ...] [dir]')
  .version(pkg.version)
  .option('-d, --debug', '工具调试', false)
  .option('-s, --size <size>', '设置图片的尺寸', defaultOptions.size)
  .option(
    '-c, --color <color>',
    '设置文字颜色',
    (value, prev) => {
      return removeHexColorPrefix(value) || prev;
    },
    defaultOptions.color,
  )
  .option(
    '-bg, --bgcolor <bgcolor>',
    '设置图片背景图颜色',
    (value, prev) => removeHexColorPrefix(value, prev),
    defaultOptions.bgColor,
  )
  .option('-t, --text <text>', '设置文字内容, 默认值: 未设置和尺寸一致', defaultOptions.size)
  .parse(process.argv);

if (program.text) dummyOptions.text = program.text;
if (program.size) {
  dummyOptions.size = program.size;
  dummyOptions.text = program.size;
}
if (program.color) dummyOptions.color = program.color;
if (program.bgcolor) dummyOptions.bgColor = program.bgcolor;

if (program.debug) {
  console.log(
    '[dummy]',
    'size:',
    defaultOptions.size,
    'color:',
    defaultOptions.color,
    'bgcolor:',
    defaultOptions.bgColor,
    'text:',
    defaultOptions.text,
  );
}

invoke();

async function invoke() {
  const spinner = ora('下载中...').start();
  const ctx = { id: null, n: 0, spinner };
  timer('下载中...', ctx);
  try {
    const buf = await downloadDummyImage(dummyOptions);
    clearInterval(ctx.id);
    spinner.stopAndPersist({ symbol: '✔️', text: '下载成功' });
    const filePath = saveAsset(buf, dummyOptions);
    spinner.succeed(`保存成功, 文件路径: ${filePath}, 用时: ${ctx.n}s`);
  } catch (error) {
    spinner.fail(`获取图片失败, 错误信息: ${error.message}`);
    clearInterval(ctx.id);
  }
}

function timer(text, ctx) {
  ctx.id = setInterval(() => {
    ctx.n += 1;
    ctx.spinner.text = text + ctx.n + 's';
  }, 1000);
}
