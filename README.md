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
