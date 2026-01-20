#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const BLOG_ROOT = path.resolve('src', 'content', 'blog');
const PUBLIC_BLOG_ROOT = path.resolve('public', 'content', 'blog');
const MARKDOWN_EXTS = new Set(['.md', '.mdx']);
const ASSET_DIRS = new Set(['assets', 'components', 'styles']);

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[\s'"`·‑–—−_()（）-]/g, '');
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function safeReadDir(target) {
  try {
    return await fs.readdir(target, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function moveDirectoryContents(src, dest) {
  const entries = await safeReadDir(src);
  if (!entries.length) {
    return;
  }

  await fs.mkdir(dest, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (await pathExists(destPath)) {
      console.warn(`[WARN] 跳过已有文件或目录 ${destPath}`);
      continue;
    }
    await fs.rename(srcPath, destPath);
    console.log(`移动 ${srcPath} -> ${destPath}`);
  }
}

async function gatherArticleEntries() {
  const dirents = await safeReadDir(BLOG_ROOT);
  const list = [];
  for (const entry of dirents) {
    if (entry.isDirectory()) {
      list.push({
        type: 'dir',
        name: entry.name,
        normalized: normalizeName(entry.name),
      });
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!MARKDOWN_EXTS.has(ext)) {
      continue;
    }
    const base = path.basename(entry.name, ext);
    list.push({
      type: 'file',
      name: entry.name,
      base,
      ext,
      normalized: normalizeName(base),
    });
  }
  return list;
}

async function ensureArticleDirectory(article) {
  if (article.type === 'dir') {
    return article.name;
  }

  const targetDir = path.join(BLOG_ROOT, article.base);
  await fs.mkdir(targetDir, { recursive: true });

  const sourcePath = path.join(BLOG_ROOT, article.name);
  const targetPath = path.join(targetDir, `index${article.ext}`);

  if (!(await pathExists(sourcePath))) {
    if (await pathExists(targetPath)) {
      return article.base;
    }
    throw new Error(`未找到源文件 ${sourcePath}`);
  }

  if (await pathExists(targetPath)) {
    console.warn(`[WARN] ${targetPath} 已经存在，原文件 ${sourcePath} 将被移除`);
    await fs.rm(sourcePath);
  } else {
    await fs.rename(sourcePath, targetPath);
    console.log(`移动 ${sourcePath} -> ${targetPath}`);
  }

  return article.base;
}

async function reorganizeDirectory(dirName) {
  const dirPath = path.join(BLOG_ROOT, dirName);
  if (!(await pathExists(dirPath))) {
    console.warn(`[WARN] 目录 ${dirPath} 不存在，跳过`);
    return;
  }

  let entries = await safeReadDir(dirPath);
  const markdownEntries = entries.filter(
    (entry) =>
      entry.isFile() && MARKDOWN_EXTS.has(path.extname(entry.name).toLowerCase())
  );

  let mainFile = markdownEntries.find(
    (entry) => !entry.name.toLowerCase().startsWith('index.')
  );
  if (!mainFile && markdownEntries.length) {
    mainFile = markdownEntries[0];
  }

  if (mainFile) {
    const ext = path.extname(mainFile.name);
    const indexName = `index${ext}`;
    if (mainFile.name !== indexName) {
      const srcPath = path.join(dirPath, mainFile.name);
      const destPath = path.join(dirPath, indexName);
      if (!(await pathExists(destPath))) {
        await fs.rename(srcPath, destPath);
        console.log(`重命名 ${srcPath} -> ${destPath}`);
      } else {
        console.warn(`[WARN] ${destPath} 已存在，跳过重命名`);
      }
      entries = await safeReadDir(dirPath);
    }
  } else {
    console.warn(`[WARN] ${dirName} 目录缺少 markdown/mdx 文件`);
  }

  const assetsPath = path.join(dirPath, 'assets');
  await fs.mkdir(assetsPath, { recursive: true });
  entries = await safeReadDir(dirPath);

  for (const entry of entries) {
    const currentPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (ASSET_DIRS.has(entry.name)) {
        continue;
      }
      const destPath = path.join(assetsPath, entry.name);
      if (await pathExists(destPath)) {
        console.warn(`[WARN] ${destPath} 已存在，跳过 ${entry.name}`);
        continue;
      }
      await fs.rename(currentPath, destPath);
      console.log(`移动目录 ${currentPath} -> ${destPath}`);
      continue;
    }

    if (entry.isFile()) {
      const lowerName = entry.name.toLowerCase();
      if (lowerName.startsWith('index.')) {
        continue;
      }
      const destPath = path.join(assetsPath, entry.name);
      if (await pathExists(destPath)) {
        console.warn(`[WARN] ${destPath} 已存在，跳过 ${entry.name}`);
        continue;
      }
      await fs.rename(currentPath, destPath);
      console.log(`移动文件 ${currentPath} -> ${destPath}`);
    }
  }
}

function findMatchingArticle(folderName, articles) {
  const normalizedFolder = normalizeName(folderName);
  const exactMatches = articles.filter(
    (article) => article.normalized === normalizedFolder
  );

  if (exactMatches.length === 1) {
    return exactMatches[0];
  }
  if (exactMatches.length > 1) {
    return exactMatches.find((article) => article.type === 'dir') ?? exactMatches[0];
  }

  const partialMatches = articles.filter(
    (article) =>
      normalizedFolder.includes(article.normalized) ||
      article.normalized.includes(normalizedFolder)
  );
  if (partialMatches.length === 1) {
    return partialMatches[0];
  }
  if (partialMatches.length > 1) {
    return partialMatches.find((article) => article.type === 'dir') ?? partialMatches[0];
  }
  return null;
}

async function processPublicAssets() {
  const publicEntries = await safeReadDir(PUBLIC_BLOG_ROOT);
  if (!publicEntries.length) {
    console.log('未找到 public/content/blog 目录或目录为空');
    return;
  }

  let articles = await gatherArticleEntries();

  for (const entry of publicEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const match = findMatchingArticle(entry.name, articles);
    if (!match) {
      console.warn(`[WARN] 未找到匹配的文章 ${entry.name}`);
      continue;
    }

    const articleDirName = await ensureArticleDirectory(match);
    await reorganizeDirectory(articleDirName);

    const assetsDir = path.join(BLOG_ROOT, articleDirName, 'assets');
    await fs.mkdir(assetsDir, { recursive: true });

    const srcAssets = path.join(PUBLIC_BLOG_ROOT, entry.name);
    await moveDirectoryContents(srcAssets, assetsDir);
    await fs.rm(srcAssets, { recursive: true, force: true });
    console.log(`已清理 ${srcAssets}`);

    articles = await gatherArticleEntries();
  }
}

async function main() {
  console.log('开始整理 src/content/blog 目录结构');

  const initialDirs = (await gatherArticleEntries())
    .filter((entry) => entry.type === 'dir')
    .map((entry) => entry.name);

  for (const dirName of initialDirs) {
    await reorganizeDirectory(dirName);
  }

  await processPublicAssets();

  console.log('文章目录结构整理完成');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
