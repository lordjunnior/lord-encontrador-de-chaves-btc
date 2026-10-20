New-Item -ItemType Directory -Force -Path .\assets

@'
# Lord Encontrador de Chaves BTC

![Linguagem](https://img.shields.io/badge/Runtime-Node.js%2020+-339933?style=for-the-badge&logo=node.js)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-green?style=for-the-badge)
![Arquitetura](https://img.shields.io/badge/Modelo-Worker%20Threads-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Est%C3%A1vel-brightgreen?style=for-the-badge)

Mecanismo concorrente em Node.js de alta performance para varredura, inspeção de entropia e validação de chaves privadas contra endereços da rede Bitcoin (P2PKH).

---

## Demonstração Visual

<div align="center">
  <img src="assets/demonstracao.gif" alt="Demonstração do Lord Encontrador de Chaves BTC" width="850">
</div>

---

## Visão Geral e Arquitetura

O **Lord Encontrador de Chaves BTC** foi desenvolvido para extrair o rendimento máximo da CPU no ambiente Node.js. Utilizando o módulo nativo `worker_threads`, o sistema distribui a derivação da curva elíptica `secp256k1` e dos algoritmos de dispersão criptográfica `SHA-256` e `RIPEMD-160` por todos os núcleos físicos e lógicos da máquina.

### Destaques de Engenharia

* **Paralelismo Real:** Divisão da carga de trabalho entre threads dedicadas, evitando gargalos de processamento.
* **Telemetria no Console:** Taxa de chaves por segundo instantânea e média consolidada com atualização limpa de terminal.
* **Busca O(1) com Tabela Hash:** Estrutura baseada em conjuntos na memória para checagem instantânea de colisões, mesmo contra centenas de milhares de endereços simultâneos.
* **Gravação Atômica de Resultados:** Persistência imediata no arquivo `achados.txt` com endereço, chave privada em formato Hexadecimal e formato WIF.

---

## Estrutura do Projeto

| Arquivo / Diretório | Finalidade |
| :--- | :--- |
| `src/index.js` | Orquestrador das threads de trabalho e exibição de telemetria |
| `src/trabalhador.js` | Loop isolado de derivação matemática na curva secp256k1 |
| `alvos.txt` | Lista de endereços públicos Bitcoin pesquisados |
| `achados.txt` | Arquivo gerado automaticamente quando um endereço for identificado |
| `assets/demonstracao.gif` | Registro visual da ferramenta em execução no terminal |

---

## Instalação e Execução

### Pré-requisitos

* **Node.js** (versão 18.0 ou superior recomendada)
* **npm** (gerenciador de pacotes)

### Passo a Passo

1. Instale as dependências criptográficas necessárias:
```bash
npm install