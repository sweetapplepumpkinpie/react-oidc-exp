import { Header } from './Header'
import { Footer } from './Footer'

export const Base = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
