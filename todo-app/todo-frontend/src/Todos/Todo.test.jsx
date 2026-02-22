import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import Todo from './Todo'

describe('Todo component', () => {
  test('shows not done state and handles complete action', async () => {
    const deleteTodo = vi.fn()
    const completeTodo = vi.fn()
    const todo = { _id: '1', text: 'Write tests', done: false }

    const user = userEvent.setup()

    render(
      <Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
    )

    expect(screen.getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByText('This todo is not done')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /set as done/i }))

    expect(completeTodo).toHaveBeenCalledTimes(1)
    expect(completeTodo).toHaveBeenCalledWith(todo)
    expect(deleteTodo).not.toHaveBeenCalled()
  })
})
