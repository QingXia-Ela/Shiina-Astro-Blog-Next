#! /usr/bin/env node
/* eslint-disable no-undef */
import CreateNewBlog from "./command/new.js";
import GetCommands from "./command/command.js";
import cp from 'child_process'
import chalk from "chalk";
const [_1, _2, command, ...args] = process.argv

switch (command) {
  case 'new':
    // 解析参数：支持 -sx / -xs / -s -x 等写法
    const flagSet = new Set()
    const titleArgs = []
    for (const arg of args) {
      if (arg.startsWith('-') && arg.length > 1) {
        for (const flag of arg.slice(1)) {
          flagSet.add(flag)
        }
      } else {
        titleArgs.push(arg)
      }
    }
    const title = titleArgs.join("-")
    CreateNewBlog(title, { simple: flagSet.has('s'), mdx: flagSet.has('x') })
    break;
  case 'build':
    cp.exec("astro build").stdout.on("data", (data) => {
      console.log(`${data}`);
    })
    break;
  case 'server':
    cp.exec(`astro dev --host ${args.join(" ")}`).stdout.on("data", (data) => {
      console.log(`${data}`);
    })
    break;

  default:
    console.log(chalk.bold.bgRed(" ERROR ") + chalk.bold(" 未知指令！可以查看以下指令列表进行指令执行："))
    GetCommands()
    // cp.execSync()
    break;
}
