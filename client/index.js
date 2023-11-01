const axios = require('axios');
const readline = require('readline');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getProof(name) {
  const merkleTree = new MerkleTree(niceList);
  const index = niceList.findIndex(n => n === name);
  return merkleTree.getProof(index);
}

async function main() {
  rl.question('What is your name, sweetheart?\n', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const { data: serverResponse } = await axios.post(`${serverUrl}/gift`, {
        name: input,
        proof: getProof(input)
      });
      console.log({ serverResponse });
      console.error('Next! \n\n');
    } catch (error) {
      console.error('An error occurred:', error);
    }

    // Wait for new input
    main();
  });
};

main();
