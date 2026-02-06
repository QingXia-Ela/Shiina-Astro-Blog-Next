# Shiina-Astro-Blog-Next

这是一个模仿 [AstroLetter](https://astroletter-preview.pages.dev/) 风格的博客，基于 [Astro](https://astro.build/) 框架开发。

## 为什么要做这个框架

https://github.com/QingXia-Ela/Shiina-Astro-Blog?tab=readme-ov-file#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E5%BA%9F%E5%BC%83%E9%A1%B9%E7%9B%AE

## 现框架区别

- 砍掉了搜索功能（其实只是不想做）
- 优化了静态资源存储（统一放到 content 下，可以走 sharp 库的内置优化）
- 精简了样式，并且砍掉主题，只保留黑夜模式（我确实觉得白天模式没必要存在）

## 对博客文章文件结构约定

建议是参考一般前端工程目录来决定，因为博客内容本质上也算是一个页面，一个页面就会存在一般页面所需的静态资源，其次 Astro 是支持 mdx 的，这意味着脚本等 feature 也可以使用，更贴近于做页面的感觉了。不过一般来说你只需要一个静态资源文件夹，因此我建议一个文章文件夹的目录是这样安排：

```
+ src
  + content
    + blog
      + ...
      + Post                // 文章名字
        + assets            // 静态资源
        + components        // 页面使用的组件
        + layout            // 页面独有布局
        + style             // 页面样式
        + store             // 需要在页面内进行状态共享或状态传递时使用
        - api.ts            // 接口
        - constants.ts      // 页面常量
        - index.md          // 文章本体
```

## 项目克隆

```
git clone https://github.com/QingXia-Ela/Shiina-Astro-Blog.git
cd ./Shiina-Astro-Blog
pnpm i
```

## 启动项目

```
pnpm dev
```

## 新建一篇文章

```
pnpm blog new <文章标题> -sx
```

其中包含参数：
- `s` 会直接在 content/blog 下创建文章对应的 md 文件
- `x` 会创建文章对应的 mdx 文件，默认是 md 文件

## 构建

```
pnpm build
```

