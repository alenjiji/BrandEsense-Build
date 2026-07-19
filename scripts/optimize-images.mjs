/**
 * Generates web-sized WebP variants next to the originals (originals untouched).
 * The source art is print-scale (works posters are 4500px wide but render at
 * ~420px), which is the main cause of slow loads.
 *
 *   node scripts/optimize-images.mjs
 */
import sharp from 'sharp'
import { readdir, mkdir, stat, copyFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(process.cwd(), 'public')

// dir -> max width the asset is ever rendered at (x2 for retina)
const TARGETS = [
  { dir: 'works', width: 1100, quality: 78 },
  { dir: 'hero/Sreedharan', width: 1400, quality: 80 },
  { dir: 'hero/v-gaurd', width: 1400, quality: 80 },
  { dir: 'hero/synthite', width: 1400, quality: 80 },
  { dir: 'hero/prasad-yogi', width: 1400, quality: 80 },
  { dir: 'video_section', width: 1800, quality: 80 },
  { dir: 'bg', width: 1920, quality: 72 },
]

const kb = (n) => `${Math.round(n / 1024)}kb`

async function run() {
  let before = 0
  let after = 0

  for (const { dir, width, quality } of TARGETS) {
    const srcDir = path.join(ROOT, dir)
    const outDir = path.join(ROOT, 'opt', dir)
    await mkdir(outDir, { recursive: true })

    // walk nested folders too (works/ now has a subfolder per client)
    let entries
    try {
      entries = await readdir(srcDir, { withFileTypes: true, recursive: true })
    } catch {
      continue
    }
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => path.relative(srcDir, path.join(e.parentPath ?? e.path, e.name)))

    for (const file of files) {
      if (!/\.(webp|png|jpe?g)$/i.test(file)) continue
      const src = path.join(srcDir, file)
      const out = path.join(outDir, file.replace(/\.(png|jpe?g)$/i, '.webp'))
      await mkdir(path.dirname(out), { recursive: true })

      const input = sharp(src, { failOn: 'none' })
      const meta = await input.metadata()
      const srcSize = (await stat(src)).size
      before += srcSize

      await input
        .resize({ width: Math.min(width, meta.width || width), withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toFile(out)

      let outSize = (await stat(out)).size

      // Re-encoding can inflate already-tight files — keep the original then.
      if (outSize >= srcSize && /\.webp$/i.test(file)) {
        await copyFile(src, out)
        outSize = srcSize
        console.log(`${dir}/${file}  kept original ${kb(srcSize)}`)
      } else {
        console.log(
          `${dir}/${file}  ${meta.width}px ${kb(srcSize)} -> ${Math.min(width, meta.width)}px ${kb(outSize)}`,
        )
      }
      after += outSize
    }
  }

  console.log(`\nTOTAL ${kb(before)} -> ${kb(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
