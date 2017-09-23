/* global io */
var parser = document.createElement('a')
parser.href = window.location.href
var socket = io(parser.host)
socket.on('connect', () => {
  console.log('socket.io connected!')
  socket.emit('connType', 'web-client')
})

socket.on('web-serial-recv', (data) => {
  console.log('data recv')
  document.querySelector('.data-log pre').innerText += data
  var el = document.querySelector('.data-log')
  el.scrollTop = el.scrollHeight
})

function sendData (data) {
  console.log('data send')
  socket.emit('web-serial-send', data + '\r')
}

function cmdSendActivate () {
  sendData(document.querySelector('.cmd-send paper-input').value)
  document.querySelector('.cmd-send paper-input').value = ''
}
document.querySelector('.cmd-send paper-button').onclick = cmdSendActivate
document.querySelector('.cmd-send paper-input').onkeydown = (event) => {
  if (event.keyCode === 13 && (event.target.value !== undefined && event.target.value !== '')) cmdSendActivate()
}
