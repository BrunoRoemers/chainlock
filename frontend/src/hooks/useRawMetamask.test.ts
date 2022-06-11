import { renderHook } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import useRawMetamask from "./useRawMetamask"

const getMetamaskMock = () => ({ isMetaMask: true })

const loadMetamaskMock = () => {
  const metamaskMock = getMetamaskMock();
  (window as any).ethereum = metamaskMock;
  return metamaskMock;
}

afterEach(() => {
  // tests may set window.ethereum, here we make sure it's unset for the next test
  (window as any).ethereum = undefined

  jest.restoreAllMocks()
})

test('useRawMetamask hook should detect metamask synchronously', async () => {
  const metamaskMock = loadMetamaskMock();

  const { result } = renderHook(() => useRawMetamask());

  expect(result.current).toBe(metamaskMock);

  act(() => {
    (window as any).ethereum = undefined;
    window.dispatchEvent(new window.Event('ethereum#initialized'));
  })

  // dispatching the event shouldn't change a thing
  expect(result.current).toBe(metamaskMock);
})

test('useRawMetamask hook should detect metamask asynchronously', async () => {
  const { result } = renderHook(() => useRawMetamask());

  // window.ethereum is not yet present
  expect(result.current).toBeUndefined();

  act(() => {
    window.dispatchEvent(new window.Event('ethereum#initialized'));
  })

  // window.ethereum is not yet present, triggering the event does not change a thing
  expect(result.current).toBeUndefined();

  const metamaskMock = { isMetaMask: true }
  act(() => {
    (window as any).ethereum = metamaskMock;
  })

  // window.ethereum is present, but the event is not triggered yet
  expect(result.current).toBeUndefined();

  act(() => {
    window.dispatchEvent(new window.Event('ethereum#initialized'));
  })

  // window.ethereum is present and the event has been triggered
  expect(result.current).toBe(metamaskMock);
})

test('useRawMetamask hook should remove event listener when unmounted', () => {
  const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(() => useRawMetamask());

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);

  unmount()

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
})
