const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');
const os = require('os');

const ARQUIVO_ALVOS = path.join(__dirname, '../alvos.txt');
const ARQUIVO_ACHADOS = path.join(__dirname, '../achados.txt');
const NUMERO_THREADS = os.cpus().length;

function carregarAlvos() {
  if (!fs.existsSync(ARQUIVO_ALVOS)) {
    console.error(`[ERRO CRÍTICO] Arquivo de alvos não encontrado em: ${ARQUIVO_ALVOS}`);
    console.error('[!] Crie o arquivo "alvos.txt" contendo um endereço Bitcoin por linha.');
    process.exit(1);
  }

  const linhas = fs.readFileSync(ARQUIVO_ALVOS, 'utf-8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#'));

  return new Set(linhas);
}

function exibirCabecalho(totalAlvos, threads) {
  console.clear();
  console.log('================================================================');
  console.log('            LORD ENCONTRADOR DE CHAVES BITCOIN                  ');
  console.log('      Motor Concorrente de Exploração Criptográfica (Node.js)   ');
  console.log('================================================================');
  console.log(`[+] Núcleos Alocados   : ${threads} workers ativos`);
  console.log(`[+] Alvos Carregados   : ${totalAlvos} endereços únicos`);
  console.log(`[+] Início da Operação : ${new Date().toLocaleString('pt-BR')}`);
  console.log('----------------------------------------------------------------');
  console.log('Status: Executando varredura contínua na curva secp256k1...\n');
}

function iniciar() {
  const alvosSet = carregarAlvos();
  const alvosArray = Array.from(alvosSet);
  exibirCabecalho(alvosArray.length, NUMERO_THREADS);

  let totalChavesVerificadas = 0n;
  const tempoInicio = Date.now();
  let chavesPorSegundo = 0;
  let chavesNoUltimoSegundo = 0;

  setInterval(() => {
    chavesPorSegundo = chavesNoUltimoSegundo;
    chavesNoUltimoSegundo = 0;

    const decorridoSegundos = Math.max(1, Math.floor((Date.now() - tempoInicio) / 1000));
    const mediaGeral = Number(totalChavesVerificadas) / decorridoSegundos;

    process.stdout.write(
      `\r[MONITOR] Total: ${totalChavesVerificadas.toLocaleString('pt-BR')} chaves | Instantâneo: ${chavesPorSegundo.toLocaleString('pt-BR')} chaves/s | Média: ${Math.floor(mediaGeral).toLocaleString('pt-BR')} chaves/s`
    );
  }, 1000);

  for (let i = 0; i < NUMERO_THREADS; i++) {
    const worker = new Worker(path.join(__dirname, 'trabalhador.js'), {
      workerData: { alvos: alvosArray }
    });

    worker.on('message', (dados) => {
      if (dados.tipo === 'progresso') {
        totalChavesVerificadas += BigInt(dados.quantidade);
        chavesNoUltimoSegundo += dados.quantidade;
      } else if (dados.tipo === 'alvo_encontrado') {
        registrarSucesso(dados);
      }
    });

    worker.on('error', (erro) => {
      console.error(`\n[FALHA DE WORKER]: ${erro.message}`);
    });
  }
}

function registrarSucesso(resultado) {
  const logSucesso = `
================================================================
                    ALVO ENCONTRADO!                            
================================================================
Data e Hora      : ${new Date().toLocaleString('pt-BR')}
Endereço Bitcoin : ${resultado.endereco}
Chave Privada HEX: ${resultado.privHex}
Chave WIF        : ${resultado.wif}
================================================================
`;
  console.log('\n' + logSucesso);
  fs.appendFileSync(ARQUIVO_ACHADOS, logSucesso + '\n', 'utf-8');
}

iniciar();