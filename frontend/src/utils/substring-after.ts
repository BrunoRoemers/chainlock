import isEmpty from "./is-empty";

const substringAfter = (str?: string, fragment?: string) => {
  if (isEmpty(str)) {
    return '';
  }

  if (isEmpty(fragment)) {
    return '';
  }

  const i = str!.indexOf(fragment!);
  if (i < 0) {
    return '';
  }

  return str!.slice(i + fragment!.length);
}

export default substringAfter;
