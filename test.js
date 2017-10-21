/*

# lines of data = 4
FULL DATA:
this is some\r\n
data that is\r\n
not broken up\r\n
weirdly yet\r\n
I'm an extra line yayy\r\n

BROKE: (~ == breakpoint)
~this is so~me\r\n
data that is\r\n~
not broken up\r~\n
weirdly yet~\r\n
I'm an ~extra line yayy\r\n

*/

var rebuild = ''
var brokedata = [
  'this is so',
  'me\r\ndata that is\r\n',
  'not broken up\r',
  '\nweirdly yet',
  '\r\nI\'m an ',
  'extra line yayy\r\n'
]

var dataLines = 4
var linesparsed = 0

function parseLines (data) {
  // delete all carriage returns
  data = data.replace(/\r/g, '')
  for (let i = 0, len = data.length; i < len; i++) {
    // data[i]
    if (linesparsed === dataLines) break // if data lines needed are already parsed
    if (data[i] === '\n') {
      linesparsed += 1
      if (linesparsed === dataLines) { // if all datalines have been parsed, stop parsing
        rebuild += data[i] // add the newline character
        break
      }
    }
    // if not broken, add data
    rebuild += data[i]
  }
}

brokedata.forEach(parseLines)
// DEBUG: replace \n with \\n so that it can be seen in log
rebuild = rebuild.replace(/\n/g, '\\n')
// output built data
console.log(rebuild)
