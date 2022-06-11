/**
 * Set a state variable to true before executing the callback,
 * and set the state variable back to false when the callback terminates (async).
 */
const lock = (
  setLock: (lock: boolean) => void,
  cb: () => Promise<void>
) => {
  setLock(true)
  cb().finally(() => setLock(false))
}

export default lock
