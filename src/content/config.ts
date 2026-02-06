import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.string().optional(),
    description: z.string().optional(),
    index_img: z.string().optional(),
    banner_img: z.string().optional(),
    recommend: z.boolean().optional(),
    draft: z.boolean().optional(),
    url_title: z.string().optional()
  })
})

const friends = defineCollection({
  schema: z.object({
    title: z.string().optional(),
    friends: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          avatar: z.string(),
          description: z.string().optional()
        })
      )
      .optional()
  })
})

export const collections = {
  blog,
  friends
};