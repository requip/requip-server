# rEQUIP - Remote (online) EQUIP-like GUI for QuarkNet Detectors

## Road map (in no particular order atm)
* Finish DAQControl system + move DAQControl to requip-client (for best on the fly data reading)
* Create update system to ensure requip-client is always up to date
* Create rPi imaging system/distribute images
* Data analysis + parsing
    * Export an easily readable format (setup info + counter id and event timestamp)
* Scalability
    * Create unified system for requip-server, user accounts and multiple client connections
    * Simple client association system (DAQ serial no. based?)
        * "hit RE button on detector to verify that it's yours" or something
* State management
    * redux or something - allow for instant resuming of the web interface state in event of a browser disconnet
* Detector profile management
    * have profiles for detector setups basically
* More friendly UI (friendly interface for confusing operations)
    * right now it's just a copy of REQUP
* Assisted plateauing (detector calibration) interface + fully automatic barometer calibration
* Built in explanation of board operation (maybe?)
