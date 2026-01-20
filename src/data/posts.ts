export type Post = {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  cover: string;
};

export const posts: Post[] = [
  {
    title: "TypeScript 入门：提升 JavaScript 开发体验",
    excerpt:
      "了解 TypeScript 如何通过更强的类型系统与工具链，让日常开发更稳定、更易维护。",
    date: "2024-07-01",
    author: "Astro Writer",
    cover: "01 10",
  },
  {
    title: "Web 设计演进：从静态到动态",
    excerpt: "回顾 Web 设计的发展脉络，探索界面与交互的关键转变。",
    date: "2024-07-08",
    author: "Astro Writer",
    cover: "02 11",
  },
  {
    title: "色彩理论基础：打造和谐界面",
    excerpt: "从配色原则到对比关系，掌握提升界面观感的核心要点。",
    date: "2024-07-15",
    author: "Astro Writer",
    cover: "03 12",
  },
  {
    title: "敏捷方法论：让项目更高效",
    excerpt: "用更清晰的节奏管理团队协作，快速推进需求落地。",
    date: "2024-07-22",
    author: "Astro Writer",
    cover: "04 13",
  },
  {
    title: "机器学习入门：开发者必修课",
    excerpt: "用通俗视角理解机器学习如何影响现代软件产品。",
    date: "2024-07-29",
    author: "Astro Writer",
    cover: "05 14",
  },
  {
    title: "RESTful API 设计指南",
    excerpt: "用一致的规范与结构让 API 更易用、更可靠。",
    date: "2024-08-05",
    author: "Astro Writer",
    cover: "06 15",
  },
  {
    title: "可持续设计：创意行业新趋势",
    excerpt: "关注环保与社会责任，打造更长久的创意价值。",
    date: "2024-08-12",
    author: "Astro Writer",
    cover: "07 16",
  },
  {
    title: "体验设计的重要性",
    excerpt: "以用户为中心的设计原则如何影响产品满意度。",
    date: "2024-08-19",
    author: "Astro Writer",
    cover: "08 17",
  },
];

export const recommendedPosts: Post[] = [
  {
    title: "产品体验复盘：从数据到洞察",
    excerpt: "通过定量与定性结合的方法，打造更精准的产品优化方向。",
    date: "2024-06-20",
    author: "Astro Writer",
    cover: "09 18",
  },
  {
    title: "设计系统搭建指南",
    excerpt: "把组件、规范与流程统一起来，让团队协作更高效。",
    date: "2024-06-25",
    author: "Astro Writer",
    cover: "10 19",
  },
  {
    title: "高效前端工作流",
    excerpt: "从工程化到自动化，提升开发与交付的效率。",
    date: "2024-06-30",
    author: "Astro Writer",
    cover: "11 20",
  },
  {
    title: "可访问性设计基础",
    excerpt: "理解无障碍设计的关键原则，让产品更具包容性。",
    date: "2024-07-03",
    author: "Astro Writer",
    cover: "12 21",
  },
  {
    title: "增长设计：驱动产品价值",
    excerpt: "将增长思维融入体验设计，形成可持续的增长策略。",
    date: "2024-07-06",
    author: "Astro Writer",
    cover: "13 22",
  },
  {
    title: "内容策略与信息架构",
    excerpt: "优化信息层级与内容表达，提升用户理解效率。",
    date: "2024-07-09",
    author: "Astro Writer",
    cover: "14 23",
  },
];
