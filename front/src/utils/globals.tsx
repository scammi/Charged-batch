

type GLOBALS = {
  INFURA_APIKEY: string;
  CONTRACT_ADDRESSES: {
    chargedBatch: any,
    soul: any,
  };
}
const GLOBALS: GLOBALS = {
  INFURA_APIKEY:  "aebcaf12b8f848048529c2682a65917e",
  CONTRACT_ADDRESSES: {
    chargedBatch: {
      // 1: '',
      5: '0xbF186023E9d324c415c86FbbEF7Fd708FD9c9dBa',
      31337: '0x433ac291e9f1E584C4c40CeAD8930cfC1b9a85E1',
    },
    soul: {
      5: '0x0A9Fca0B935853378adCba890a0Dbe03d01D2D09',
      31337: '0xc43402733040ab5342c09474d8A5DaA9b5B5E17a',
    }
  }
};


export { GLOBALS };