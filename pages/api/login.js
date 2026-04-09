export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body
  if (password === 'brava29nails') {
    res.setHeader('Set-Cookie', `brava_auth=brava29nails; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000`)
    return res.status(200).json({ ok: true })
  }
  return res.status(401).json({ ok: false })
}
