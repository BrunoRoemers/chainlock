import { useEffect, useState } from 'react'

export interface RawMetamask {
  isMetaMask: true,
  request: (args: {method: string, params?: any[]}) => Promise<any>,
  on: (event: string, callback: (...args: any[]) => void) => void,
  removeListener: (event: string, callback: (...args: any[]) => void) => void,
}

/**
 * Check if the given object is metamask.
 * @param obj the object that needs to be tested.
 * @returns true if the given object is metamask, false otherwise.
 */
const isMetamask = (obj: any) => !!obj && obj.isMetaMask === true

/**
 * Get metamask via the "ethereum" global variable.
 * @returns the metamask object, or null if not found.
 */
const getMetamaskFromWindow = () => {
  const { ethereum } = window as any;
  return isMetamask(ethereum) ? ethereum : null;
}

/**
 * React hook for getting access to metamask.
 * @returns metamask, or null of not (yet) present.
 */
const useRawMetamask = (): RawMetamask | null => {
  // NOTE: getMetamaskFromWindow() will only be called during initial render
  const [ metamask, setMetamask ] = useState<RawMetamask | null>(() => getMetamaskFromWindow());

  // listen for async metamask
  // NOTE: this effect is only ran when the component mounts
  //       and cleaned up when the component unmounts
  //       (empty dependency array)
  useEffect(() => {
    // NOTE: keep reference to function instance so it can be deregistered
    const listener = () => {
      const mm = getMetamaskFromWindow();
      if (mm !== metamask) {
        setMetamask(mm);
      }
    }

    if (metamask === null) {
      window.addEventListener('ethereum#initialized', listener);
    }

    return () => window.removeEventListener('ethereum#initialized', listener);
  }, [metamask])

  return metamask;
}

export default useRawMetamask
