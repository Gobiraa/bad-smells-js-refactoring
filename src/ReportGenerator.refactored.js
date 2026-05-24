const LIMITES = {
  PRIORIDADE_ADMIN: 1000,
  MAXIMO_USER: 500
};

class CsvReportStrategy {
  generate(user, items) {
    let report = 'ID,NOME,VALOR,USUARIO\n';
    let total = 0;

    for (const item of items) {
      report += `${item.id},${item.name},${item.value},${user.name}\n`;
      total += item.value;
    }

    report += `\nTotal,,\n${total},,\n`;
    return report.trim();
  }
}

class HtmlReportStrategy {
  generate(user, items) {
    let report = '<html><body>\n<h1>Relatório</h1>\n';
    report += `<h2>Usuário: ${user.name}</h2>\n<table>\n`;
    report += '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';
    
    let total = 0;

    for (const item of items) {
      const trTag = item.priority ? '<tr style="font-weight:bold;">' : '<tr>';
      report += `${trTag}<td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
      total += item.value;
    }

    report += `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    return report.trim();
  }
}

export class ReportGenerator {
  constructor(database) {
    this.db = database;
    this.strategies = {
      'CSV': new CsvReportStrategy(),
      'HTML': new HtmlReportStrategy()
    };
  }

  generateReport(reportType, user, items) {
    const itensProcessados = this.#filtrarEPrepararItens(user, items);
    
    const strategy = this.strategies[reportType];
    if (!strategy) return '';

    return strategy.generate(user, itensProcessados);
  }

  #filtrarEPrepararItens(user, items) {
    const itensFiltrados = [];

    for (const item of items) {
      const itemProcessado = { ...item }; 

      if (user.role === 'ADMIN') {
        itemProcessado.priority = itemProcessado.value > LIMITES.PRIORIDADE_ADMIN;
        itensFiltrados.push(itemProcessado);
      } 
      else if (user.role === 'USER' && itemProcessado.value <= LIMITES.MAXIMO_USER) {
        itensFiltrados.push(itemProcessado);
      }
    }

    return itensFiltrados;
  }
}