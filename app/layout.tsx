import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] })

// Define metadata for the application, which includes title and description.
export const metadata: Metadata = {
  title: {
    // Default title is set to the application's name from siteConfig.
    default: siteConfig.name,

    // Template for constructing the title, including a placeholder '%s'
    // which can be replaced with dynamic content. It appends the application's name.
    template: `%s | ${siteConfig.name}`
  },

  // Description is set to the application's description from siteConfig.
  description: siteConfig.description,
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg"
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
