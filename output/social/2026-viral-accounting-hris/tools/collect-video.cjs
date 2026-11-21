// Menormalkan MP4 hasil render Remotion (lokakasir-promo/out/isu) ke folder posting dan memeriksa
// syarat video yang sama dengan service (ValidateSocialVideo) serta syarat Meta untuk Reels.
// Jalankan setelah render: node tools/collect-video.cjs
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const root = path.join(__dirname, '..')
const promo = process.env.LOKA_PROMO_PATH || path.join(root, '..', '..', '..', '..', 'lokakasir-promo')
const campaign = JSON.parse(fs.readFileSync(path.join(root, 'campaign.json'), 'utf8')).filter(p => p.format === 'video')
const report = []
for (const post of campaign) {
  const source = path.join(promo, 'out', 'isu', `${post.code}.mp4`)
  const target = path.join(root, post.folder, 'video.mp4')
  if (!fs.existsSync(source)) throw new Error(`Belum dirender: ${source}`)
  // Remotion di proyek itu merender dari frame JPEG, sehingga hasilnya yuvj420p (rentang penuh, matriks BT.601).
  // Meta meminta 4:2:0 biasa; di sini dikonversi ke yuv420p rentang TV, BT.709, dengan moov di awal. Audio disalin apa adanya.
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', source,
    '-vf', 'scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-g', '60',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-c:a', 'copy', '-movflags', '+faststart', target])
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', target], { encoding: 'utf8' }))
  const video = probe.streams.find(s => s.codec_type === 'video')
  const audio = probe.streams.find(s => s.codec_type === 'audio')
  const seconds = Number(probe.format.duration)
  const bytes = fs.statSync(target).size
  const [num, den] = video.r_frame_rate.split('/').map(Number)
  const head = fs.readFileSync(target).subarray(0, 4096)
  // `moov` sebelum `mdat` (faststart): Meta membaca metadata tanpa mengunduh seluruh berkas.
  const moov = head.indexOf('moov'), mdat = head.indexOf('mdat')
  const checks = {
    'H.264': video.codec_name === 'h264',
    'yuv420p': video.pix_fmt === 'yuv420p',
    '1080 × 1920': video.width === 1080 && video.height === 1920,
    '30 fps': Math.round(num / den) === 30,
    'durasi 3–60 dtk': seconds >= 3 && seconds <= 60,
    '≤ 100 MB': bytes <= 100 * 1024 * 1024,
    'audio AAC': Boolean(audio) && audio.codec_name === 'aac',
    'moov di awal': moov > 0 && (mdat < 0 || moov < mdat),
    'ftyp MP4': head.subarray(4, 8).toString() === 'ftyp',
  }
  const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
  if (failed.length) throw new Error(`${post.code}: tidak lolos ${failed.join(', ')}`)
  report.push({ code: post.code, seconds: Number(seconds.toFixed(2)), megabytes: Number((bytes / 1048576).toFixed(2)), codec: video.codec_name, audio: audio.codec_name, brand: head.subarray(8, 12).toString() })
}
fs.writeFileSync(path.join(root, 'video-validation.json'), JSON.stringify({ checked_at: new Date().toISOString(), videos: report }, null, 1) + '\n')
console.log(report.map(r => `${r.code}: ${r.seconds} dtk, ${r.megabytes} MB, ${r.codec}/${r.audio}, ${r.brand}`).join('\n'))
