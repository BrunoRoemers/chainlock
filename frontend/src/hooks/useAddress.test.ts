import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import MetamaskWallet from "../objects/MetamaskWallet";
import useAddress from "./useAddress";
import { RawMetamask } from "./useRawMetamask";

const getMetamaskMock = () => ({
  request: (args: { method: string, params?: any[] }) => Promise.resolve([]),
  on: (event: string, callback: (...args: any[]) => void): void => {},
  removeListener: (event: string, callback: (...args: any[]) => void): void => {},
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('when current address = undefined, useAddress hook should return undefined on load', async () => {
  const metamaskMock = getMetamaskMock();
  const wallet = new MetamaskWallet(metamaskMock as RawMetamask);
  const walletSpy = jest.spyOn(wallet, 'getCurrentAddress');

  walletSpy.mockImplementation(() => Promise.resolve(undefined))

  const { result } = renderHook(() => useAddress(wallet));

  await waitFor(() => {
    expect(result.current).toBe(undefined)
  })
})

test('when current address = asdf, useAddress hook should return asdf on load', async () => {
  const metamaskMock = getMetamaskMock();
  const wallet = new MetamaskWallet(metamaskMock as RawMetamask);
  const walletSpy = jest.spyOn(wallet, 'getCurrentAddress');

  walletSpy.mockImplementation(() => Promise.resolve('asdf'))

  const { result } = renderHook(() => useAddress(wallet));

  await waitFor(() => {
    expect(result.current).toBe('asdf')
  })
})

test('useAddress hook should get the current address on change', async () => {
  const metamaskMock = getMetamaskMock();
  const wallet = new MetamaskWallet(metamaskMock as RawMetamask);
  
  const getCurrentAddressSpy = jest.spyOn(wallet, 'getCurrentAddress');
  getCurrentAddressSpy.mockImplementation(() => Promise.resolve('address-1'));
  
  const registerAddressChangeListenerSpy = jest.spyOn(metamaskMock, 'on');
  let addressChangeCallback: any;
  registerAddressChangeListenerSpy.mockImplementation((event, cb) => {
    addressChangeCallback = cb;
  });

  const { result } = renderHook(() => useAddress(wallet));

  await waitFor(() => expect(result.current).toBe('address-1'))
  expect(registerAddressChangeListenerSpy).toHaveBeenCalledTimes(1)

  act(() => {
    addressChangeCallback(['address-2'])
  })

  expect(result.current).toBe('address-2')
  expect(registerAddressChangeListenerSpy).toHaveBeenCalledTimes(1)
})

test('useAddress hook should remove event listener when unmounted', () => {
  const metamaskMock = getMetamaskMock();
  const addEventListenerSpy = jest.spyOn(metamaskMock, 'on');
  const removeEventListenerSpy = jest.spyOn(metamaskMock, 'removeListener');

  const wallet = new MetamaskWallet(metamaskMock as RawMetamask);

  const { unmount } = renderHook(() => useAddress(wallet));

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);

  unmount()

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
})
