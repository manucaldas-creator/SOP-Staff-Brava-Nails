import './globals.css'

export const metadata = {
  title: 'Brava Staff Hub',
  description: 'Internal knowledge base for Brava Nails team',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
