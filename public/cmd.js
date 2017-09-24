// This class is *only* for DAQ stuff, do not include any non DAQ calls in here

// init sequence from crmd manual sans SA 1 - page 22
const initSteps = ['H1', 'H2', 'DG', 'DC', 'DS', 'DT', 'BA', 'TH', 'TI', 'V1', 'V2', 'ST 3 5']
const cmdReturnLen = { 'H1': 20, 'H2': 33, 'DG': 9, 'DC': 1, 'DS': 1, 'DT': 1, 'BA': 3, 'TH': 1, 'TI': 1, 'V1': 32, 'V2': 18, 'ST 3 5': 1 }

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
    // last sent cmd - hackkkk
    this.lastSent = ''
    this.charsNeeded = 0
    this.lastDS = ''
  }
  init () {
    this.socket.on('web-serial-recv', this.handleData.bind(this))
    // this.initIncrement()
  }
  initIncrement () {
    this.sendData(initSteps[this.initStep] + '\r')
  }
  sendData (data) {
    this.lastSent = data.toUpperCase()
    this.socket.emit('web-serial-send', data)
  }
  handleData (data) {
    this.dataLog += data
    // number of carriage returns (\r) in saved data
    /*
    let existNewlines
    if (this.rawSettings[initSteps[this.initStep]] === undefined) {
      this.rawSettings[initSteps[this.initStep]] = ''
      existNewlines = 0
    } else {
      existNewlines = this.rawSettings[initSteps[this.initStep]].split('\r').length - 1
    }

    if (existNewlines < cmdReturnLen[initSteps[this.initStep]]) {
      let a = data.split('\r')
      let linesNeeded = cmdReturnLen[initSteps[this.initStep]] - existNewlines
      for (var i = 0; i < a.length; i++) {
        let nstr = a[i].replace(/\n/g, '\r')
        this.rawSettings[initSteps[this.initStep]] += nstr
        if (i === linesNeeded) {
          this.initStep += 1
          if (this.initStep < initSteps.length) this.initIncrement()
          break
        }
      }
    } else {
      this.initStep += 1
      if (this.initStep < initSteps.length) this.initIncrement()
    }
    */
    if (this.charsNeeded !== 0) {
      let nlog = data.substring(0, this.charsNeeded)
      this.lastDS += nlog
      console.log(nlog)
      if (data.length < this.charsNeeded) {
        this.charsNeeded -= data.length
      } else {
        this.charsNeeded = 0
        this.parseDS()
      }
    } else {
      if (data.indexOf('ST') !== -1 && this.lastSent.indexOf('ST') === -1) {
        let stLocate = data.indexOf('ST')
        if ((data.length - stLocate) > 126) {
          let nlog = data.substring(stLocate, (stLocate + 126))
          this.lastDS = nlog
          console.log(nlog)
          this.parseDS()
        } else {
          this.charsNeeded = 126 - (data.length - stLocate)
          let nlog = data.substring(stLocate, data.length)
          this.lastDS = nlog
          console.log(this.charsNeeded)
          console.log(nlog)
        }
      } else {
        this.lastSent = ''
      }
    }

    this.dataLogCallback(data)
  }
  parseDS () {
    let ds = this.lastDS.substring(this.lastDS.indexOf('DS'), this.lastDS.length)
    let scalars = ds.substring(3, ds.length).split(' ')
    let coincidence = parseInt(scalars[4], 16)
    // RELALY BAD ITS TALKING WITH THE DOM HERE OH MAN OH NO
    document.querySelector('#ds-0').innerText = parseInt(scalars[0], 16)
    document.querySelector('#ds-1').innerText = parseInt(scalars[1], 16)
    document.querySelector('#ds-2').innerText = parseInt(scalars[2], 16)
    document.querySelector('#ds-3').innerText = parseInt(scalars[3], 16)
    document.querySelector('#ds-4').innerText = parseInt(scalars[4], 16)
    addScalarData(coincidence)
    // kjkashdkjas
    console.log(coincidence)
  }
  setGateWidth (ns) {
    if (ns > 655350) throw new Error('Gate width too large')
    let hex = ('0000' + (ns / 10).toString(16).toUpperCase()).slice(-4)
    this.sendData('WC 02 ' + hex.substring(2, 4) + '\rWC 03 ' + hex.substring(0, 2) + '\r')
  }
  setCoincidenceToggleDetectors (coincidence, d0, d1, d2, d3) {
    let toggle = parseInt(('' + (d0 ? 1 : 0) + (d1 ? 1 : 0) + (d2 ? 1 : 0) + (d3 ? 1 : 0)), 2).toString(16).toUpperCase()
    this.sendData('WC 00 ' + coincidence + toggle + '\r')
  }
  setPipelineDelay (ns) {
    if (ns > 1270) throw new Error('Pipeline delay too large')
    let hex = (ns / 10).toString(16).toUpperCase()
    this.sendData('WT 01 00\rWT 02 ' + hex + '\r')
  }
}
