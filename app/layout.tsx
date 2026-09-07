import './globals.css'
import RiceParticles from './components/RiceParticles'

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
        <RiceParticles />
        {children}
      </body>
    </html>
  )
}
