import React from 'react'
import Spinner from './Spinner'
import { screen, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
// test('sanity', () => {
//   expect(true).toBe(false)
// })

describe('Additional Spinner Tests', () => {
  test('Spinner shows loading when true', async () => {
    render(<Spinner on={true} />)

    await expect(screen.getByText('Please wait...')).tobeinthedocument
  })

  test('Spinner does not show loading when false', async () => {
    render(<Spinner on={false} />)

    await expect(screen.findByText('Please wait...')).not.tobeinthedocument
  })
})