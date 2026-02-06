/* eslint-disable no-undef */
import fs from 'fs'
import path from 'path'
import PostsPublicTime from '../utils/ParseTime.js'
import chalk from 'chalk'

const template = `---
title: {{title}}
tags: []
date: ${PostsPublicTime(new Date())}
---
`

/**
 * 创建新文章
 * @param {string} title 文章标题
 * @param {object} options 选项
 * @param {boolean} options.simple 是否使用简单模式（直接创建 md 文件）
 * @param {boolean} options.mdx 是否创建 mdx 文件
 */
export default function CreateNewBlog(title, options = {}) {
  const { simple = false, mdx = false } = options
  const ext = mdx ? '.mdx' : '.md'
  const blogDir = path.join(process.cwd(), './src/content/blog')

  try {
    if (simple) {
      // 简单模式：直接在内容文件夹下生成文章名字对应的 md/mdx 文件
      const filePath = path.join(blogDir, title + ext)
      fs.writeFileSync(filePath, template.replace("{{title}}", title))
      console.log(`${chalk.bold.bgGreen(" SUCCESS ")} ${chalk.bold(`文章创建成功：${filePath}`)}`)
    } else {
      // 默认模式：生成一个文章名字文件夹，并在文件夹下添加 assets 文件夹与 index.md/mdx
      const articleDir = path.join(blogDir, title)
      const assetsDir = path.join(articleDir, 'assets')
      const indexPath = path.join(articleDir, 'index' + ext)

      // 创建文章文件夹
      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true })
      }

      // 创建 assets 文件夹
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true })
      }

      // 创建 index.md/mdx 文件
      fs.writeFileSync(indexPath, template.replace("{{title}}", title))
      console.log(`${chalk.bold.bgGreen(" SUCCESS ")} ${chalk.bold(`文章创建成功：${indexPath}`)}`)
      console.log(`${chalk.bold.bgGreen(" SUCCESS ")} ${chalk.bold(`资源文件夹已创建：${assetsDir}`)}`)
    }
  } catch (e) {
    console.log(`${chalk.bold.bgRed(" ERROR ")} ${chalk.bold(`文章创建失败！错误信息：${e}`)}`)
  }
}