import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home Page', () => {
  it('renderiza a saudação padrão', () => {
    render(<Home />)
    // Ajuste o texto conforme o seu page.tsx atual
    expect(screen.getByText(/Bem-vindo/i)).toBeInTheDocument()
  })
})