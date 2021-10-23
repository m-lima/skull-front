import { UnexpectedResponseException } from '../model/Exception';

export const getLastModified = (response: Response) => {
  const maybeLastModified = response.headers.get('last-modified');
  if (!maybeLastModified) {
    throw new UnexpectedResponseException('Last-Modified header not present');
  }

  const lastModified = Number(maybeLastModified);
  if (!lastModified) {
    throw new UnexpectedResponseException(
      'Last-Modified header is not a valid time'
    );
  }
  return new Date(lastModified);
};
