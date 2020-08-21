//@ts-nocheck
import * as JwksClient from 'jwks-rsa';

const { ArgumentError } = JwksClient;

const handleSigningKeyError = (err, cb) => {
  // If we didn't find a match, can't provide a key.
  if (err && err.name === 'SigningKeyNotFoundError') {
    return cb(null);
  }
  return cb(err);
};

export default function jwtSecretMiddleware(options) {
  if (options === null || options === undefined) {
    throw new ArgumentError(
      'An options object must be provided when initializing jwtSecretMiddlewar',
    );
  }

  const client = JwksClient(options);
  const onError = options.handleSigningKeyError || handleSigningKeyError;
  return (request, decoded, callback) => {
    // if decoded is null, token is not present or is invalid
    if (!decoded) {
      return callback(new Error('Invalid token'), null);
    }
    // Only RS256 is supported.
    if (decoded.header.alg !== 'RS256') {
      return callback(new Error('Only RS256 is supported'), null);
    }

    client.getSigningKey(decoded.header.kid, (err, key) => {
      if (err) {
        return onError(err, newError => callback(newError, null));
      }
      //@ts-ignore
      return callback(null, key.publicKey || key.rsaPublicKey);
    });

  }
};


