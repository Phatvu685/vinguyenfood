import './globals.css'
import ScrollAnimator from './components/ScrollAnimator'
import SupportChat from './components/SupportChat'

export const metadata = {
  title: 'Gạo Ngon',
  description: 'Tinh hoa hạt gạo Việt',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <ScrollAnimator />
        {children}
        <SupportChat />
      </body>
    </html>
  )
}
