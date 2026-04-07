export const metadata = {
  title: 'ESCO Lab: OSC Safety',
  description: 'OSC Construction Safety Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
