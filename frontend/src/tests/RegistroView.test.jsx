import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, test } from 'vitest'
import RegistroView from '../views/RegistroView'

describe('RegistroView Component', () => {
  test('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <RegistroView />
      </BrowserRouter>
    )

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'juan@test.com')
    await user.type(screen.getByLabelText(/^contraseña/i), '123456')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), '654321')

    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
  })
})