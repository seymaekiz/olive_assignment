# olive_assignment

# Design Decisions
1. Used next js in order to proxy the request through an api route and obfuscate the api from the client. Also, keeping everything simple and in language.
2. Used linear backoff to deal with errors on the api route. Considered linear backoff but since the error rate from the api seems to be random uniform and not permanent, linear backoff is better.


# Running
`npm install`
`npm run dev`

or, for prod build:

`npm run build`
`npm run start`
