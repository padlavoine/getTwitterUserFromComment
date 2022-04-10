# getTwitterUserFromComment

This script get all @user account from a twitter post

## How to use

Edit index.js and set your bearer token and twitId to process
```javascript

/** You can modify vars here **/
let maxResult = 100
let twitId = '' // Set ID of a twitter post
let outputFileName = './output.txt'
let bearer = '' // Set bearer token
/** End of vars to modify **/
```

Use it:
```bash
npm install
node index.js
```
