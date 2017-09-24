// This class is *only* for DAQ stuff, do not include any non DAQ calls in here
const initSteps = ['H1', 'H2', 'DG', 'DC', 'DS', 'DT', 'BA', 'TH', 'TI', 'V1', 'V2', 'ST 3 5']
const cmdReturnLen = {
  'H1': 20
}

class DAQControl {
  constructor (socket, dataLogCallback) {
    this.socket = socket
    // raw data log
    this.dataLog = ''
    // latest unparsed sections
    this.rawSettings = {}
    // parsed settings
    this.brdSettings = {}
    // dom data log
    this.dataLogCallback = dataLogCallback
    // init step
    this.initStep = 0
  }
  init () {
    this.socket.on('web-serial-recv', this.handleData.bind(this))
    // init sequence from crmd manual sans SA 1 - page 22
    // this.sendData('H1\rH2\rDG\rDC\rDS\rDT\rBA\rTH\rTI\rV1\rV2\rST 3 5\r')
    this.sendData(initSteps[this.initStep] + '\r')
  }
  sendData (data) {
    this.socket.emit('web-serial-send', data)
  }
  handleData (data) {
    this.dataLog += data
    // number of carriage returns (\r) in saved data
    let existNewlines
    if (this.rawSettings[initSteps[this.initStep]] === undefined) {
      this.rawSettings[initSteps[this.initStep]] = ''
      existNewlines = 0
    } else {
      existNewlines = this.rawSettings[initSteps[this.initStep]].split('\r').length - 1
    }
    console.log('existNewlines:')
    console.log(existNewlines)

    if (existNewlines < cmdReturnLen[initSteps[this.initStep]]) {
      let a = data.split('\r')
      let dataNewlines = a.length - 1
      let linesNeeded = cmdReturnLen[initSteps[this.initStep]] - dataNewlines
      console.log('linesNeeded:')
      console.log(linesNeeded)
      console.log('a:')
      console.log(a)
      for (var i = 0; i < a.length; i++) {
        console.log('i:')
        console.log(i)
        let nstr = a[i].replace(/\n/g, '\r')
        this.rawSettings[initSteps[this.initStep]] += nstr
        if (i === linesNeeded) break
      }
    } else {
      this.initStep += 1
      console.log('initStep incremented')
    }
    console.log('Data processing done')
    // this.rawSettings[initSteps[this.initStep]] += data

    this.dataLogCallback(data)
  }
  setGateWidth (ns) {
    if (ns > 655350) throw new Error('Gate width too large')
    let hex = ('0000' + (ns / 10).toString(16).toUpperCase()).slice(-4)
    this.sendData('WC 02 ' + hex.substring(2, 4) + '\rWC 03 ' + hex.substring(0, 2) + '\r')
  }
}
