const shell = require('shelljs')
const semver = require('semver')
const inquirer = require('inquirer')
const chalk = require('chalk')
const getConfig = require('./config')
const config = getConfig('production')
const newVersionType = {
  type: 'list',
  name: 'newVersion',
  message: `请选择提交的版本号，当前版本：${config.version}`,
  choices: [
    {
      name: `v${semver.inc(config.version, 'patch')}: Release Patch Version`,
      value: 'patch',
    },
    {
      name: `v${semver.inc(config.version, 'minor')}: Release Minor Version`,
      value: 'minor',
    },
    {
      name: `v${semver.inc(config.version, 'major')}: Release Major Version`,
      value: 'major',
    },
  ],
}
const comfirmType = {
  type: 'confirm',
  name: 'confirm',
  message: '确定发布当前版本？',
  default: true,
}
const Log = str => {
  console.log(str)
}

const run = async () => {
  const env = process.env.NODE_ENV
  let host
  // if (env === 'production') {
  //   host = '111.231.81.103'   //线上
  // } else {
  //   host = '118.25.68.71'     // 开发
  // }
  const { newVersion } = await inquirer.prompt([newVersionType])
  let version = semver.inc(config.version, newVersion)

  let commitMessage = `publish ${config.name}: v${version}`
  Log(`您即将发布:    ${chalk.bgRed(commitMessage)}`)
  const { confirm } = await inquirer.prompt([comfirmType])
  if (confirm) {
    shell.exec(`npm version ${version} --no-git-tag-version`)
    shell.exec(`del /S  /F /Q product`)
    shell.exec(
      '.\\node_modules\\.bin\\webpack --config webpack.production.config.js --progress'
    )
    shell.exec('del product.tar.gz')
    shell.exec('tar -zcvf product.tar.gz product')
    shell.exec(`scp product.tar.gz root@118.25.68.71:/root/fontStatic`)
  } else {
    console.log('bye bye ~~')
  }
}
run()
