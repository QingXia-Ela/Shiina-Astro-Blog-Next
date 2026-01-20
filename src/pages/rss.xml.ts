import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const blog = await getCollection('blog');
  return rss({
    // 输出的 xml 中的`<title>`字段
    title: 'Shiina’s Blog',
    // 输出的 xml 中的`<description>`字段
    description: 'Shiina\'s Blog',
    // 从端点上下文获取项目“site”
    // https://docs.astro.build/zh-cn/reference/api-reference/#contextsite
    site: context.site,
    // 输出的 xml 中的`<item>`数组
    // 有关使用内容集合和 glob 导入的示例，请参阅“生成`items`”部分
    items: blog.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${post.data.title}`,
    })),
    // (可选) 注入自定义 xml
    // customData: `<language>en-us</language>`,
  });
}