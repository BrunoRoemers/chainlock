import { renderHook } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import useMetamask from "./useMetamask"

const getMetamaskMock = () => ({ isMetaMask: true })

const loadMetamaskMock = () => {
  const metamaskMock = getMetamaskMock();
  (window as any).ethereum = metamaskMock;
  return metamaskMock;
}

afterEach(() => {
  // tests may set window.ethereum, here we make sure it's unset for the next test
  (window as any).ethereum = undefined
})

test('useMetamask hook should detect metamask synchronously', async () => {
  const metamaskMock = loadMetamaskMock();

  const { result } = renderHook(() => useMetamask());

  expect(result.current).toBe(metamaskMock);

  await act(() => {
    (window as any).ethereum = undefined;
    window.dispatchEvent(new window.Event('ethereum#initialized'));
  })

  // dispatching the event shouldn't change a thing
  expect(result.current).toBe(metamaskMock);
})

test('useMetamask hook should detect metamask asynchronously', async () => {
  const { result } = renderHook(() => useMetamask());

  // window.ethereum is not yet present
  expect(result.current).toBeNull();

  await act(() => {
    window.dispatchEvent(new window.Event('ethereum#initialized'));
  })

  // window.ethereum is not yet present, triggering the event does not change a thing
  expect(result.current).toBeNull();

  const metamaskMock = { isMetaMask: true }
  await act(() => {
    (window as any).ethereum = metamaskMock;
  })

  // window.ethereum is present, but the event is not triggered yet
  expect(result.current).toBeNull();

  await act(() => {
    window.dispatchEvent(new window.Event('ethereum#initialized'));
  })

  // window.ethereum is present and the event has been triggered
  expect(result.current).toBe(metamaskMock);
})
