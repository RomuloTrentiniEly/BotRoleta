const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Abre o navegador
  const page = await browser.newPage();
  await page.goto("https://casino.betfair.com/pt-br/c/roleta"); // Navega até a URL

  // Aguarde a página carregar e a div "results" aparecer
  await page.waitForSelector('.results');

  // Mantenha uma lista para os 8 números iniciais
  let primeirosNumeros = [];
  let geral8 = [];
  let geralTodos = [];
  let geralDuzias = [];
  let geralColunas = [];
  let geralImparOuPar = [];
  let geralPretoOuVermelho = [];

  // Variáveis para rastrear a repetição
  let repeticoesColuna = 0;
  let repeticoesDuzia = 0;
  let repeticoesParImpar = 0;
  let repeticoesPretoVermelho = 0;
  let ultimaEntradaColuna = "";
  let ultimaEntradaDuzia = "";
  let ultimaEntradaParImpar = "";
  let ultimaEntradaPretoVermelho = "";

  while (true) {
    // Encontre todos os elementos com a classe "number" dentro da div "results"
    const numbers = await page.$$eval('.results .number', elements => elements.map(element => element.textContent));

    if (numbers.length > 0) {
      // Verifique se a lista de números mudou desde a última verificação
      const newNumber = numbers[0];
      if (geral8[0] !== newNumber) {
        // Atualize as listas
        geral8 = [newNumber, ...geral8];
        geralTodos.push(newNumber);

        // Verificação de sequência de 6 elementos iguais
        if (verificarSequencia(geralColunas, 6) && ultimaEntradaColuna !== newNumber) {
          console.log(`🚨 Sequência de 6 elementos iguais na COLUNA: ${geralColunas[0]}`);
          console.log(`👑 Entrada: COLUNAS 1 e 2`);
          console.log(`💎 COLUNA REPETIDO: ${geralColunas[0]}`);
          ultimaEntradaColuna = newNumber; // Defina a última entrada para COLUNA
          // Faça a entrada aqui
        }
        if (verificarSequencia(geralDuzias, 6) && ultimaEntradaDuzia !== newNumber) {
          console.log(`🚨 Sequência de 6 elementos iguais na DÚZIA: ${geralDuzias[0]}`);
          console.log(`👑 Entrada: DÚZIAS 1, 2 e 3`);
          console.log(`💎 DÚZIA REPETIDO: ${geralDuzias[0]}`);
          ultimaEntradaDuzia = newNumber; // Defina a última entrada para DÚZIA
          // Faça a entrada aqui
        }
        if (verificarSequencia(geralImparOuPar, 6) && ultimaEntradaParImpar !== newNumber) {
          console.log(`🚨 Sequência de 6 elementos iguais em PAR/ÍMPAR: ${geralImparOuPar[0]}`);
          console.log(`👑 Entrada: PAR/ÍMPAR OPPOSTO`);
          console.log(`💎 PAR/ÍMPAR REPETIDO: ${geralImparOuPar[0]}`);
          ultimaEntradaParImpar = newNumber; // Defina a última entrada para PAR/ÍMPAR
          // Faça a entrada aqui
        }
        if (verificarSequencia(geralPretoOuVermelho, 6) && ultimaEntradaPretoVermelho !== newNumber) {
          console.log(`🚨 Sequência de 6 elementos iguais em PRETO/VERMELHO: ${geralPretoOuVermelho[0]}`);
          console.log(`👑 Entrada: PRETO/VERMELHO OPPOSTO`);
          console.log(`💎 PRETO/VERMELHO REPETIDO: ${geralPretoOuVermelho[0]}`);
          ultimaEntradaPretoVermelho = newNumber; // Defina a última entrada para PRETO/VERMELHO
          // Faça a entrada aqui
        }

        // Verificação da coluna
        let coluna = 0;
        if (newNumber != 0) {
          if (newNumber % 3 === 1) {
            coluna = 1;
          } else if (newNumber % 3 === 2) {
            coluna = 2;
          } else {
            coluna = 3;
          }
          geralColunas.push(coluna); // Adicione à lista de colunas
          // Verifique a repetição
          if (verificarRepeticao(geralColunas, 6) && ultimaEntradaColuna !== coluna) {
            console.log(`🚨 Provável ENTRADA NA COLUNA, ELEMENTO REPETIDO: ${coluna}`);
            console.log(`👑 Entrada: COLUNAS 1 e 2`);
            console.log(`💎 COLUNA REPETIDO: ${coluna}`);
            repeticoesColuna = 1; // Defina a repetição para evitar avisos contínuos
            ultimaEntradaColuna = coluna; // Defina a última entrada para COLUNA
          }
        }

        // Verificação da dúzia
        let duzia = 0;
        if (newNumber != 0) {
          if (newNumber >= 1 && newNumber <= 12) {
            duzia = 1;
          } else if (newNumber >= 13 && newNumber <= 24) {
            duzia = 2;
          } else if (newNumber >= 25 && newNumber <= 36) {
            duzia = 3;
          }
          geralDuzias.push(duzia); // Adicione à lista de dúzias
          // Verifique a repetição
          if (verificarRepeticao(geralDuzias, 6) && ultimaEntradaDuzia !== duzia) {
            console.log(`🚨 Provável ENTRADA NA DÚZIA, ELEMENTO REPETIDO: ${duzia}`);
            console.log(`👑 Entrada: DÚZIAS 1, 2 e 3`);
            console.log(`💎 DÚZIA REPETIDO: ${duzia}`);
            repeticoesDuzia = 1; // Defina a repetição para evitar avisos contínuos
            ultimaEntradaDuzia = duzia; // Defina a última entrada para DÚZIA
          }
        }

        // Verificação par/impar
        let parOuImpar = "0";
        if (newNumber != 0) {
          if (newNumber % 2 === 0) {
            parOuImpar = "Par";
          } else {
            parOuImpar = "Impar";
          }
          geralImparOuPar.push(parOuImpar); // Adicione à lista de par/ímpar
          // Verifique a repetição
          if (verificarRepeticao(geralImparOuPar, 6) && ultimaEntradaParImpar !== parOuImpar) {
            console.log(`🚨 Provável ENTRADA EM PAR/ÍMPAR, ELEMENTO REPETIDO: ${parOuImpar}`);
            console.log(`👑 Entrada: PAR/ÍMPAR OPPOSTO`);
            console.log(`💎 PAR/ÍMPAR REPETIDO: ${parOuImpar}`);
            repeticoesParImpar = 1; // Defina a repetição para evitar avisos contínuos
            ultimaEntradaParImpar = parOuImpar; // Defina a última entrada para PAR/ÍMPAR
          }
        }

        // Verificação vermelho/preto
        let vermelhoOuPreto = "0";
        if (newNumber != 0) {
          const pretos = [2, 4, 6, 8, 11, 13, 15, 17, 20, 22, 24, 26, 29, 33, 35, 31];
          const vermelhos = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 28, 30, 32, 34, 36];
          if (pretos.includes(Number(newNumber))) {
            vermelhoOuPreto = "Preto";
          } else if (vermelhos.includes(Number(newNumber))) {
            vermelhoOuPreto = "Vermelho";
          }
          geralPretoOuVermelho.push(vermelhoOuPreto); // Adicione à lista de preto/vermelho
          // Verifique a repetição
          if (verificarRepeticao(geralPretoOuVermelho, 6) && ultimaEntradaPretoVermelho !== vermelhoOuPreto) {
            console.log(`🚨 Provável ENTRADA NO PRETO/VERMELHO, ELEMENTO REPETIDO: ${vermelhoOuPreto}`);
            console.log(`👑 Entrada: PRETO/VERMELHO OPPOSTO`);
            console.log(`💎 PRETO/VERMELHO REPETIDO: ${vermelhoOuPreto}`);
            repeticoesPretoVermelho = 1; // Defina a repetição para evitar avisos contínuos
            ultimaEntradaPretoVermelho = vermelhoOuPreto; // Defina a última entrada para PRETO/VERMELHO
          }
        }

        // Lidar com o número zero
        if (newNumber === "0") {
          // Adicione 0 às listas gerais
          geralColunas.push(0);
          geralDuzias.push(0);
          geralImparOuPar.push(0);
          geralPretoOuVermelho.push(0);

          // Reinicie as listas gerais
          geralColunas = [];
          geralDuzias = [];
          geralImparOuPar = [];
          geralPretoOuVermelho = [];
        }

        console.log(`Lista Geral: ${geral8}`);
        console.log(`Novo Numero:${newNumber}`);
        console.log(`Coluna: ${coluna}`);
        console.log(`Dúzia: ${duzia}`);
        console.log(`Par/Ímpar: ${parOuImpar}`);
        console.log(`Duzias: ${geralDuzias}`);
        console.log(`Colunas: ${geralColunas}`);
        console.log(`Impar/Par: ${geralImparOuPar}`);
        console.log(`Preto/Vermelho: ${vermelhoOuPreto}`);
        console.log('==================================================================================================')

        // Verifique repetições apenas uma vez
        if (repeticoesColuna === 1) {
          repeticoesColuna = 0; // Redefina a repetição
        }
        if (repeticoesDuzia === 1) {
          repeticoesDuzia = 0; // Redefina a repetição
        }
        if (repeticoesParImpar === 1) {
          repeticoesParImpar = 0; // Redefina a repetição
        }
        if (repeticoesPretoVermelho === 1) {
          repeticoesPretoVermelho = 0; // Redefina a repetição
        }
      }
    }

    // Pausa por 1 segundo antes de verificar novamente (ajuste conforme necessário)
    await page.waitForTimeout(1000);
  }

  // Função para verificar se há uma sequência de elementos iguais
  function verificarSequencia(lista, sequencia) {
    if (lista.length >= sequencia) {
      const ultimoElemento = lista[0];
      if (lista.slice(0, sequencia).every(elemento => elemento === ultimoElemento)) {
        return true;
      }
    }
    return false;
  }

  // Função para verificar repetições em uma lista específica
  function verificarRepeticao(lista, repeticoes) {
    if (lista.length >= repeticoes) {
      const ultimoElemento = lista[0];
      if (lista.slice(0, repeticoes).every(elemento => elemento === ultimoElemento)) {
        return true;
      }
    }
    return false;
  }

  // Feche o navegador quando terminar
  // await browser.close();
})();
