import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, test } from 'vitest'
import LoginView from '../views/LoginView'

describe('LoginView Component', () => {
  test('muestra mensaje de error con un correo inválido', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <LoginView />
      </BrowserRouter>
    )

    const inputEmail = screen.getByLabelText(/correo electrónico/i)
    const botonSubmit = screen.getByRole('button', { name: /ingresar/i })

    await user.type(inputEmail, 'correosinAt')
    await user.click(botonSubmit)

    expect(screen.getByText(/ingrese un correo válido/i)).toBeInTheDocument()
  })

  test('muestra mensaje de error cuando la contraseña tiene menos de 6 caracteres', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <LoginView />
      </BrowserRouter>
    )

    const inputEmail = screen.getByLabelText(/correo electrónico/i)
    const inputPass = screen.getByLabelText(/contraseña/i)
    const botonSubmit = screen.getByRole('button', { name: /ingresar/i })

    await user.type(inputEmail, 'cliente@test.com')
    await user.type(inputPass, '123')
    await user.click(botonSubmit)

    expect(screen.getByText(/la contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument()
  })
})