import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import Container from './Container'
import { Footer } from './Footer'
import Header from './Header'

interface Props {
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
})

const LayoutWrapper = ({ children }: Props) => {
  return (
    <Container>
      <div className={`${inter.className} flex h-screen flex-col justify-between font-sans`}>
        <Header />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </Container>
  )
}

export default LayoutWrapper
