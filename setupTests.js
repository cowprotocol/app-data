import fetchMock from 'jest-fetch-mock'
import { jest } from '@jest/globals'

global.window = global
global.jest = jest

fetchMock.enableMocks()

jest.setMock('cross-fetch', fetchMock)

