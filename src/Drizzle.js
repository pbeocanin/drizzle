// Check to see if we are running in react-native.
if (!(typeof navigator != 'undefined' && navigator.product == 'ReactNative')) {
// Load as promise so that async Drizzle initialization can still resolve
  var windowPromise = new Promise((resolve, reject) => {
    window.addEventListener('load', resolve)
  })
}

class Drizzle {
  constructor (options, store) {
    // Variables
    this.contracts = {}
    this.contractList = []
    this.options = options
    this.store = store
    this.web3 = {}

    this.loadingContract = {}

    // Check to see if react-native
    if (typeof navigator !== 'undefined' && navigator.product == 'ReactNative') {
      // Running in react-native, nothing to wait for, just initizalize
      store.dispatch({type: 'DRIZZLE_INITIALIZING', drizzle: this, options})
    }
    else {
      // Not react-native, using default initialization
      windowPromise.then(() => {
        // Begin Drizzle initialization
        store.dispatch({type: 'DRIZZLE_INITIALIZING', drizzle: this, options})
      })
    }
  }

  addContract (contractConfig, events = []) {
    this.store.dispatch({
      type: 'ADD_CONTRACT',
      drizzle: this,
      contractConfig,
      events,
      web3: this.web3
    })
  }

  _addContract (drizzleContract) {
    if (this.contracts[drizzleContract.contractName]) {
      throw `Contract already exists: ${drizzleContract.contractName}`
    }
    this.contracts[drizzleContract.contractName] = drizzleContract
    this.contractList.push(drizzleContract)
  }

  findContractByAddress (address) {
    return this.contractList.find(contract => {
      return contract.address.toLowerCase() === address.toLowerCase()
    })
  }
}

export default Drizzle
