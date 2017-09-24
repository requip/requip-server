/* exported DAQControl */

// This class is *only* for DAQ stuff, do not include any non DAQ calls in here
class DAQControl {
  constructor (socket, dataLogCallback) {
    this.socket = socket
    this.dataLog = ''
    console.log(dataLogCallback)
    this.dataLogCallback = dataLogCallback
  }
  init () {
    this.socket.on('web-serial-recv', this.handleData.bind(this))
    // init sequence from crmd manual sans SA 1
    this.sendData('H1\rH2\rDG\rDC\rDS\rDT\rBA\rTH\rTI\rV1\rV2\rST 3 5\r')
  }
  sendData (data) {
    this.socket.emit('web-serial-send', data)
  }
  handleData (data) {
    this.dataLog += data
    this.dataLogCallback(data)
  }
  static gateWidthCmd (ns) {
    if (ns > 655350) return
    let hex = ('0000' + (ns / 10).toString(16).toUpperCase()).slice(-4)
    return 'WC 02 ' + hex.substring(2, 4) + '\rWC 03 ' + hex.substring(0, 2) + '\r'
  }
}
