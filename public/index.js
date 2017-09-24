/* global io DAQControl */

var parser = document.createElement('a')
parser.href = window.location.href
var socket = io(parser.host)
var brdcontrol = new DAQControl(socket, logData)

socket.on('connect', () => {
  console.log('socket.io connected!')
  socket.emit('connType', 'web-client')
  brdcontrol.init()
})

function logData (data) {
  console.log('data recv')
  document.querySelector('.data-log pre').innerText += data
  var el = document.querySelector('.data-log')
  el.scrollTop = el.scrollHeight
}

function cmdSendActivate () {
  brdcontrol.sendData(document.querySelector('.cmd-send paper-input').value + '\r')
  document.querySelector('.cmd-send paper-input').value = ''
}
document.querySelector('.cmd-send paper-button').onclick = cmdSendActivate
document.querySelector('.cmd-send paper-input').onkeydown = (event) => {
  if (event.keyCode === 13 && (event.target.value !== undefined && event.target.value !== '')) cmdSendActivate()
}
