import { test, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { action as loginAction } from '../../app/routes/login'
import { createUser, verifyLogin } from '../../app/models/user.server'

const server = setupServer(
  rest.post('http://localhost:3000/login', async (req, res, ctx) => {
    const request = new Request('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    })

    const response = await loginAction({ request, context: {}, params: {} })

    return res(ctx.json(response))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


test('login flow', async () => {
  // Create a user in the database
  await createUser('test@example.com', 'password')

  // Send a POST request to the login endpoint
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
  })

  // Check that the server responded with a 200 status code
  expect(res.status).toBe(200)

  // Check that the user can log in with the correct password
  const user = await verifyLogin('test@example.com', 'password')
  expect(user).not.toBeNull()

  // Check that the user cannot log in with an incorrect password
  const wrongPasswordUser = await verifyLogin('test@example.com', 'wrongpassword')
  expect(wrongPasswordUser).toBeNull()
})
