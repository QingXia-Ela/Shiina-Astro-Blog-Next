#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const BLOG_ROOT = path.resolve('src', 'content', 'blog');
const MD_EXTS = new Set(['.md', '.mdx']);

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function gatherAssets(dir) {
  const assetsRoot = path.join(dir, 'assets');
  const hasAssets = await pathExists(assetsRoot);
  if (!hasAssets) {
    return null;
  }

  const assetPaths = new Set();
  async function walk(currentDir, relativePrefix = '') {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const relPath = relativePrefix
        ? `${relativePrefix}/${entry.name}`
        : entry.name;
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath, relPath);
        continue;
      }
      assetPaths.add(relPath);
    }
  }

  await walk(assetsRoot);
  return assetPaths;
}

function splitSuffix(relativePath) {
  const queryIndex = relativePath.indexOf('?');
  const hashIndex = relativePath.indexOf('#');
  let splitIndex = -1;
  if (queryIndex !== -1) {
    splitIndex = queryIndex;
  }
  if (
    hashIndex !== -1 &&
    (splitIndex === -1 || hashIndex < splitIndex)
  ) {
    splitIndex = hashIndex;
  }
  if (splitIndex === -1) {
    return { main: relativePath, suffix: '' };
  }
  return {
    main: relativePath.slice(0, splitIndex),
    suffix: relativePath.slice(splitIndex),
  };
}

async function updateFile(filePath, assetPaths) {
  const raw = await fs.readFile(filePath, 'utf8');
  const regex = /\/content\/blog\/[^/]+(\/[^\s)"']+)/g;
  let changed = false;

  const replaced = raw.replace(regex, (match, assetSegment) => {
    const trimmed = assetSegment.replace(/^\/+/, '');
    if (!trimmed) {
      return match;
    }

    const { main, suffix } = splitSuffix(trimmed);
    if (!main) {
      return match;
    }

    if (!assetPaths.has(main)) {
      return match;
    }

    changed = true;
    return `./assets/${main}${suffix}`;
  });

  if (changed) {
    await fs.writeFile(filePath, replaced, 'utf8');
    console.log(`更新 ${path.relative('.', filePath)} 中的静态资源引用`);
  }
}

async function processArticle(dirent) {
  if (!dirent.isDirectory()) {
    return;
  }

  const articleDir = path.join(BLOG_ROOT, dirent.name);
  const assetPaths = await gatherAssets(articleDir);
  if (!assetPaths || !assetPaths.size) {
    return;
  }

  const files = await fs.readdir(articleDir, { withFileTypes: true });
  for (const entry of files) {
    if (!entry.isFile()) {
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!MD_EXTS.has(ext)) {
      continue;
    }

    const filePath = path.join(articleDir, entry.name);
    await updateFile(filePath, assetPaths);
  }
}

async function main() {
  const entries = await fs.readdir(BLOG_ROOT, { withFileTypes: true });
  for (const entry of entries) {
    await processArticle(entry);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
