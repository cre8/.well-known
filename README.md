# did-web
A simple repository that publish a did document on github via the [did:web method](https://w3c-ccg.github.io/did-method-web/)

Thanks to github we can use git for the version control system. This application serves a static did document, so queries like `?verionId=` or `?versiontime=` will not work according to the  [w3c did spec](https://www.w3.org/TR/did-core/#did-parameters).

A CICD workflow will publish the `did.json` file:

```
did id -> resolved url to github age-> file in github repository 
did:web:cre8.github.io -> cre8.github.io/.well-known/did.json -> https://github.com/cre8/.well-known/blob/main/did.json
did:web:cre8.github.io:example -> cre8.github.io/example/did.json -> https://github.com/cre8/example/blob/main/did.json
did:web:cre8.github.io:example:.well-known -> cre8.github.io/example/.well-known/did.json -> https://github.com/cre8/example/blob/main/.well-known/did.json
did:web:cre8.github.io:example:product:1234 -> cre8.github.io/example/product/1234/did.json -> https://github.com/cre8/example/blob/main/product/1234/did.json
```

## Update
In case you want to update your did document, you need to update the did.json file. This will replace the did file and cloud break older signed credentials since the verifier is not able to reqeust the older did.json file with the old key.

# Clone repository

To use this for your own did:web, you need to do the following steps:
- click on "use this as template" to generate your own repository based on this repo
- activate pages: go to settings -> pages -> Source and select Github Actions
- push your did.json to the repository
- the CICD will publish your did document on the github pages


# Known issues
## resolvers return 404
In case your did docuent is not well formatted, some resolvers like the universal resolver will fail to validate the did document and will return a 404.
Example
```
{
  "id": "did:web:cre8.github.io",
  "verificationMethod": [
    {
      "id": "did:web:cre8.github.io#key-0",
      "type": "JsonWebKey2020",
      "controller": "did:web:cre8.github.io",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "0-e2i2_Ua1S5HbTYnVB0lj2Z2ytXu2-tYmDFf8f5NjU"
      }
    },
    {
      "id": "did:web:cre8.github.io#key-1",
      "type": "JsonWebKey2020",
      "controller": "did:web:cre8.github.io",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "X25519",
        "x": "9GXjPGGvmRq9F6Ng5dQQ_s31mfhxrcNZxRGONrmH30k"
      }
    },
    {
      "id": "did:web:cre8.github.io#key-2",
      "type": "JsonWebKey2020",
      "controller": "did:web:cre8.github.io",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-256",
        "x": "38M1FDts7Oea7urmseiugGW7tWc3mLpJh6rKe7xINZ8",
        "y": "nDQW6XZ7b_u2Sy9slofYLlG03sOEoug3I0aAPQ0exs4"
      }
    },
  ],
  "authentication": [
    "did:web:cre8.github.io#key-0",
    "did:web:cre8.github.io#key-2"
  ],
  "assertionMethod": [
    "did:web:cre8.github.io#key-0",
    "did:web:cre8.github.io#key-2"
  ],
  "keyAgreement": [
    "did:web:cre8.github.io#key-1", 
    "did:web:cre8.github.io#key-2"
  ]
}
```

When we are looking at the end ob the object `verificationMethod`, we have a comma after the last inserted key. Some JSON parser will parse it anyway, but not all validators. 
This CICD is not validating the input yet, so you have to be careful using it.

The CICD will validate all `did.json` files an checks if the id of the document on the root level match. It will NOT check if your did document is valid (e.g. it will not check if the id matches with the ones in the verification method's keys.
