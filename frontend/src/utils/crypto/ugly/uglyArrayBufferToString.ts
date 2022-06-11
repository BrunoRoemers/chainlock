// adapted from: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey#pkcs_8_export
const uglyArrayBufferToString = (ab: ArrayBuffer): string => String.fromCharCode.apply(null, new Uint8Array(ab) as unknown as number[]);

export default uglyArrayBufferToString
