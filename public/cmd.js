// This class is *only* for DAQ stuff, do not include any non DAQ calls in here
class DAQControl {
  constructor (socket, dataLogCallback) {
    this.socket = socket
    // raw data log
    this.dataLog = ''
    // init steps
    this.initSteps = ['H1', 'H2', 'DG', 'DC', 'DS', 'DT', 'BA', 'TH', 'TI', 'V1', 'V2', 'ST 3 5']
    // latest unparsed sections
    this.rawSettings = {}
    // parsed settings
    this.brdSettings = {}
    // dom data log
    this.dataLogCallback = dataLogCallback
  }
  init (step) {
    this.socket.on('web-serial-recv', this.handleData.bind(this))
    // init sequence from crmd manual sans SA 1 - page 22
    // this.sendData('H1\rH2\rDG\rDC\rDS\rDT\rBA\rTH\rTI\rV1\rV2\rST 3 5\r')
    this.sendData('H1\r')
  }
  sendData (data) {
    this.socket.emit('web-serial-send', data)
  }
  handleData (data) {
    this.dataLog += data
    this.dataLogCallback(data)
  }
  setGateWidth (ns) {
    if (ns > 655350) throw new Error('Gate width too large')
    let hex = ('0000' + (ns / 10).toString(16).toUpperCase()).slice(-4)
    this.sendData('WC 02 ' + hex.substring(2, 4) + '\rWC 03 ' + hex.substring(0, 2) + '\r')
  }
}
