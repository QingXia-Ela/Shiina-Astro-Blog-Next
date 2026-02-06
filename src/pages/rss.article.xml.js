import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt()

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    // 输出的 xml 中的`<title>`字段
    title: 'Shiina’s Blog',
    // 输出的 xml 中的`<description>`字段
    description: 'A humble Astronaut’s guide to the stars',
    // 从端点上下文获取项目“site”
    // https://docs.astro.build/zh-cn/reference/api-reference/#contextsite
    site: context.site,
    // 输出的 xml 中的`<item>`数组
    // 有关使用内容集合和 glob 导入的示例，请参阅“生成`items`”部分
    items: blog.map((post) => ({
      title: post.data.title,
      link: `/blog/${post.slug}/`,
      description: post.data.description,
      pubDate: post.data.date,
      content: sanitizeHtml(parser.render(post.body || ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
    // (可选) 注入自定义 xml
    // customData: `<language>en-us</language>`,
  });
}