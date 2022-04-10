const https = require('https');
const fs = require('fs')

/** You can modify vars here **/
let maxResult = 100
let twitId = '' // Set ID of twit
let outputFileName = './output.txt'
let bearer = ''
/** End of vars to modify **/


const options = {
  hostname: 'api.twitter.com',
  path: '/2/tweets/search/recent?max_results='+maxResult+'&sort_order=recency&query=conversation_id:'+twitId+'&tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id',
  method: 'GET',
  headers: {
    'Authorization': bearer,
  }
}

fs.writeFile(outputFileName, "", err => {})
callBackCall()

let totalAccount = 0
let totalResponse = 0
function processResult(result) {
  let self = this

  result.forEach(function (elem) {
    totalResponse++
    const regex = /@[a-zA-Z0-9]* /g;
    const found = elem.text.match(regex);

    if(found !== false && found !== null) {
      found.forEach(function (tag) {
        totalAccount++

        fs.appendFile(outputFileName, tag + '\n', err => {
          if (err) {
            console.error(err)
            return
          }
        })
      })
    }

  })
}


function callBackCall(next) {

  let self = this

  if(next != undefined && next != "" && next != null) {
    options.path = '/2/tweets/search/recent?max_results='+maxResult+'&sort_order=recency&query=conversation_id:'+twitId+'&tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id&next_token=' + next
  }

  callAPI(function (next, result) {

    processResult(result)

    if(next != undefined && next != "" && next != null) {
      callBackCall(next)
    } else {
      console.log("this is the end, total account: " + totalAccount + ", total response: " + totalResponse)
    }

  })
}


function callAPI(callback) {
  let self = this
  const req = https.request(options, res => {
    if(res.statusCode !== 200) {
      console.log(`statusCode: ${res.statusCode}`)
    }

    let dataResult = ""
    res.on('data', d => {
      dataResult += d
    })
    req.on('error', error => {
      console.error("error")
      console.error(error)
    })
    res.on('end', function () {
      let json = JSON.parse(dataResult);
      console.log(json.meta.next_token)

      callback(json.meta.next_token, json.data)
    });
  })

  req.end()
}
