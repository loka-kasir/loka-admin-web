// Menormalkan MP4 hasil render Remotion (lokakasir-promo/out/tanya-loka.mp4) ke folder kampanye,
// memeriksa syarat video Reels (ValidateSocialVideo + Meta Reels), dan mengekstrak lembar QA.
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

const root = path.resolve(__dirname)
const promo = process.env.LOKA_PROMO_PATH || path.join(root, '..', '..', '..', '..', 'lokakasir-promo')
const source = path.join(promo, 'out', 'tanya-loka.mp4')
const target = path.join(root, 'video.mp4')

if (!fs.existsSync(source)) throw new Error(`Belum dirender: ${source}`)

execFileSync('ffmpeg', [
  '-v', 'error', '-y', '-i', source,
  '-vf', 'scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-g', '60',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
  '-c:a', 'copy', '-movflags', '+faststart', target,
])

const probe = JSON.parse(
  execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', target], { encoding: 'utf8' }),
)
const video = probe.streams.find((s) => s.codec_type === 'video')
const audio = probe.streams.find((s) => s.codec_type === 'audio')
const seconds = Number(probe.format.duration)
const bytes = fs.statSync(target).size
const [num, den] = video.r_frame_rate.split('/').map(Number)
const head = fs.readFileSync(target).subarray(0, 4096)
const moov = head.indexOf('moov')
const mdat = head.indexOf('mdat')

const checks = {
  'H.264': video.codec_name === 'h264',
  yuv420p: video.pix_fmt === 'yuv420p',
  '1080 × 1920': video.width === 1080 && video.height === 1920,
  '30 fps': Math.round(num / den) === 30,
  'durasi 3–60 dtk': seconds >= 3 && seconds <= 60,
  '≤ 100 MB': bytes <= 100 * 1024 * 1024,
  'audio AAC': Boolean(audio) && audio.codec_name === 'aac',
  'moov di awal': moov > 0 && (mdat < 0 || moov < mdat),
  'ftyp MP4': head.subarray(4, 8).toString() === 'ftyp',
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
if (failed.length) throw new Error(`Video tidak lolos validasi: ${failed.join(', ')}`)

// Lembar pratinjau 6 adegan (3×2) untuk pemeriksaan visual.
const qaDir = path.join(root, 'qa')
fs.mkdirSync(qaDir, { recursive: true })
const stamps = ['00:00:00.2', '00:00:08.5', '00:00:19.5', '00:00:28.5', '00:00:35.0', '00:00:39.5']
stamps.forEach((ts, i) => {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', ts, '-i', target, '-frames:v', '1', '-q:v', '2', path.join(qaDir, `scene-${i + 1}.jpg`)])
})
execFileSync('ffmpeg', [
  '-v', 'error', '-y',
  '-i', path.join(qaDir, 'scene-1.jpg'),
  '-i', path.join(qaDir, 'scene-2.jpg'),
  '-i', path.join(qaDir, 'scene-3.jpg'),
  '-i', path.join(qaDir, 'scene-4.jpg'),
  '-i', path.join(qaDir, 'scene-5.jpg'),
  '-i', path.join(qaDir, 'scene-6.jpg'),
  '-filter_complex', 'xstack=inputs=6:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0,scale=1620:-1',
  '-q:v', '2', path.join(root, 'preview-video.jpg'),
])

const report = {
  checked_at: new Date().toISOString(),
  seconds: Number(seconds.toFixed(2)),
  megabytes: Number((bytes / 1048576).toFixed(2)),
  width: video.width,
  height: video.height,
  fps: Math.round(num / den),
  codec: video.codec_name,
  pix_fmt: video.pix_fmt,
  audio: audio.codec_name,
}
fs.writeFileSync(path.join(root, 'video-validation.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report))
