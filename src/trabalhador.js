const { parentPort, workerData } = require('worker_threads');
const crypto = require('crypto');
const ecc = require('tiny-secp256k1');
const { ECPairFactory } = require('ecpair');
const bitcoin = require('bitcoinjs-lib');

const ECPair = ECPairFactory(ecc);
const conjuntoAlvos = new Set(workerData.alvos);

const TAMANHO_LOTE = 500;

function executarCiclo() {
  while (true) {
    for (let i = 0; i < TAMANHO_LOTE; i++) {
      const bufferPrivado = crypto.randomBytes(32);
      
      const parChaves = ECPair.fromPrivateKey(bufferPrivado, { compressed: true });
      const { address: enderecoCompactado } = bitcoin.payments.p2pkh({ 
        pubkey: parChaves.publicKey 
      });

      if (conjuntoAlvos.has(enderecoCompactado)) {
        parentPort.postMessage({
          tipo: 'alvo_encontrado',
          endereco: enderecoCompactado,
          privHex: bufferPrivado.toString('hex'),
          wif: parChaves.toWIF()
        });
      }
    }

    parentPort.postMessage({
      tipo: 'progresso',
      quantidade: TAMANHO_LOTE
    });
  }
}

executarCiclo();