/* global io DAQControl Chart */

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
  document.querySelector('.data-log pre').innerHTML += data
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

function gateWidthFieldCall () {
  brdcontrol.setGateWidth(document.querySelector('#gate-set').value)
}
document.querySelector('#trig-upd-button').onclick = gateWidthFieldCall
document.querySelector('#gate-set').onkeydown = (event) => {
  if (event.keyCode === 13 && (event.target.value !== undefined && event.target.value !== '')) gateWidthFieldCall()
}

// function gateWidthFieldCall () {
//   brdcontrol.setGateWidth(document.querySelector('#gate-set').value)
// }
// document.querySelector('#trig-upd-button').onclick = gateWidthFieldCall
// document.querySelector('#gate-set').onkeydown = (event) => {
//   if (event.keyCode === 13 && (event.target.value !== undefined && event.target.value !== '')) gateWidthFieldCall()
// }

function showControls () {
  document.querySelector('.control-contain').setAttribute('style', '')
  document.querySelector('.analysis-contain').setAttribute('style', 'display: hidden;')
  analysisShowing = false
}
var analysisShowing = false
var analysisHasShown = false
var dsChart
var dsChartLine
function showAnalysis () {
  if (!analysisHasShown) {
    dsChart = new Chart(document.getElementById('canvas').getContext('2d'))
    analysisHasShown = true
  }
  dsChartLine = dsChart.Line(lineChartData, {
    animation: false
  })
  analysisShowing = true
  document.querySelector('.control-contain').setAttribute('style', 'display: none;')
  document.querySelector('.analysis-contain').setAttribute('style', '')
}
document.querySelector('#controls-tab').onclick = showControls
document.querySelector('#analysis-tab').onclick = showAnalysis

// chartjs
var lineChartData = {
  labels: [],
  datasets: [{
    label: 'Coincidence rate',
    fillColor: 'rgba(255,255,255,0)',
    strokeColor: 'rgba(16,133,135,1)',
    pointColor: 'rgba(16,133,135,1)',
    pointStrokeColor: '#fff',
    pointHighlightFill: '#fff',
    pointHighlightStroke: 'rgba(16,133,135,1)',
    data: []
  }]

}
function addScalarData (hits) {
  let dat = new Date()
  lineChartData.labels.push(dat.getMinutes().toString())
  lineChartData.datasets[0].data.push(hits.toString())
  if (analysisShowing) {
    dsChartLine = dsChart.Line(lineChartData, {
      animation: false
    })
  }
}
