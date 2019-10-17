const fs = require('fs');

const dateFormat = require('dateformat');

const convertDateToPtBr = date => {
    try {
      return dateFormat(new Date(date), 'dd/mm/yyyy');
    } catch (err) {
         return undefined;
    }
};

const convertCurrencyToPtBr = value => {
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'brl' })
        .format(value)
    } catch (err) {
        return undefined;
    }
};

tablePrepareWithForEach = obj => {
    const tableStructure = [];
    obj.forEach(current => {
        tableStructure.push({
            parlamentar: current.nomeParlamentar,
            gasto:  convertCurrencyToPtBr(current.valorDocumento),
            data: convertDateToPtBr(current.dataEmissao)
        });
    });
    return tableStructure;
};

tablePrepareWithMap = obj => {
    return obj.map(current => {
        return {
            parlamentar: current.nomeParlamentar,
            gasto:  convertCurrencyToPtBr(current.valorDocumento),
            data: convertDateToPtBr(current.dataEmissao)
        };
    });
};

const getFile = filePath => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, fileContents) => {
        try {
            resolve(JSON.parse(fileContents).dados);
        } catch(err) {
            reject(`Ops, verifique o erro: ${err}`);
        }
        });
    });
};

getFile('base-json/despesas-parlamentares.json')
    .then((value) => {
        // Tabela com .forEach()
        console.table(tablePrepareWithForEach(value));
        // Tabela com .map()
        console.table(tablePrepareWithMap(value));
    });