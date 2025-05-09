// Espera o DOM carregar para garantir que os elementos existem
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM carregado - verificando botões PDF");
  
  // Botão do menu lateral para abrir o PDF
  const pdfBtn = document.querySelector('.pdf-button');
  if (pdfBtn) {
    console.log("Botão PDF encontrado, adicionando evento");
    pdfBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Botão PDF clicado");
      showPDF(e);
    });
  } else {
    console.log("Botão PDF não encontrado no DOM");
  }
});

// Função para mostrar o PDF na janela central
function showPDF(e) {
  e.preventDefault();
  console.log("Função showPDF executada");

  // Caminho relativo ao arquivo HTML principal
  const pdfUrl = './ARQUIVOS.PDF/Curriculo Jesiel Matos.pdf';
  console.log("Tentando carregar PDF:", pdfUrl);

  // Obtém o painel direito
  const rightPanel = document.getElementById('rightPanel');
  if (!rightPanel) {
    console.error("Painel direito não encontrado!");
    return;
  }

  // Esconde a mensagem de boas-vindas quando o PDF for exibido
  const welcomeMessage = rightPanel.querySelector('p[style*="Selecione uma opção"]') || 
                         document.getElementById('welcome-message');
  if (welcomeMessage) {
    welcomeMessage.style.display = 'none';
  }

  // Importante: Remove qualquer mensagem de erro anterior
  const errorMessages = rightPanel.querySelectorAll('p');
  errorMessages.forEach(msg => {
    if (msg.textContent.includes('Conteúdo não encontrado')) {
      msg.remove();
    }
  });

  // Remove TODOS os botões de fechar existentes em qualquer lugar da página
  document.querySelectorAll('.pdf-close-btn').forEach(btn => btn.remove());
  
  // Remove container antigo se existir
  const oldContainer = document.getElementById('pdf-curriculo-container');
  if (oldContainer) {
    oldContainer.remove();
  }
  
  // Remove o botão de fechar antigo se existir
  const oldCloseBtn = document.getElementById('pdf-close-btn-container');
  if (oldCloseBtn) {
    oldCloseBtn.remove();
  }

  // Cria um container principal que conterá tanto o botão quanto o PDF
  const mainContainer = document.createElement('div');
  mainContainer.id = 'pdf-main-container';
  mainContainer.style.display = 'flex';

  
  // Cria um container de largura fixa para alinhar tanto o botão quanto o PDF
  const fixedWidthContainer = document.createElement('div');
  fixedWidthContainer.style.position = 'relative'; // Importante para o posicionamento absoluto do botão
  
  // Cria o botão de fechar apenas para dispositivos móveis
  if (window.innerWidth <= 768) { // Verifica se é um dispositivo móvel
    const closeBtn = document.createElement('button');
    closeBtn.className = 'pdf-close-btn';
    closeBtn.id = 'pdf-only-close-btn'; // ID único para o botão do PDF
    closeBtn.textContent = '✖ Fechar';
    closeBtn.onclick = closePDFPanel;
    closeBtn.style.padding = '6px 14px'; 
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '6px';
    closeBtn.style.backgroundColor = '#222';
    closeBtn.style.color = '#fff';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.cursor = 'pointer';

    // Posicionamento absoluto no canto superior direito
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '1px';
    closeBtn.style.right = '16px';
    closeBtn.style.zIndex = '10';
    
    // Adiciona o botão ao container apenas em dispositivos móveis
    fixedWidthContainer.appendChild(closeBtn);
  }
  
  // Cria novo container para o PDF (sem bordas brancas)
  const container = document.createElement('div');
  container.id = 'pdf-curriculo-container';
  container.style.display = 'flex';

  
  // Cria o iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'pdf-iframe';
  iframe.src = pdfUrl;
  
  // Adiciona o iframe ao container
  container.appendChild(iframe);
  
  // Estrutura hierárquica: fixedWidthContainer contém botão e container
  // Não adiciona o closeBtn porque isso já foi feito condicionalmente acima
  fixedWidthContainer.appendChild(container);
  
  // Adiciona o container de largura fixa ao container principal
  mainContainer.appendChild(fixedWidthContainer);
  
  // Esconde qualquer conteúdo existente com segurança
  const titles = document.querySelectorAll('.content-title');
  const bodies = document.querySelectorAll('.content-body');
  
  if (titles.length > 0) {
    titles.forEach(el => { if (el) el.style.display = 'none'; });
  }
  
  if (bodies.length > 0) {
    bodies.forEach(el => { if (el) el.style.display = 'none'; });
  }
  
  // Adiciona o container principal ao painel direito
  rightPanel.appendChild(mainContainer);
  
  console.log("PDF exibido com sucesso");
}

// Função para fechar a janela do PDF
function closePDFPanel() {
  // Remove o container principal
  const mainContainer = document.getElementById('pdf-main-container');
  if (mainContainer) {
    mainContainer.remove();
  }
  
  // Garante que TODOS os botões de fechar são removidos
  const closeBtn = document.getElementById('pdf-only-close-btn');
  if (closeBtn) {
    closeBtn.remove();
  }
  
  // Remove qualquer outro botão de fechar que possa ter ficado
  document.querySelectorAll('.pdf-close-btn').forEach(btn => {
    btn.remove();
  });
  
  // Verifica se há algum conteúdo visível
  const rightPanel = document.getElementById('rightPanel');
  if (rightPanel) {
    const hasVisibleContent = rightPanel.querySelector('.content-title:not([style*="display: none"])') || 
                              rightPanel.querySelector('.content-body:not([style*="display: none"])');
    
    // Se não houver conteúdo visível, mostra a mensagem de boas-vindas
    if (!hasVisibleContent) {
      // Importa a função se estiver disponível, caso contrário implementa localmente
      if (typeof showWelcomeMessage === 'function') {
        showWelcomeMessage();
      } else {
        // Verifica se a mensagem já existe
        let welcomeMessage = document.getElementById('welcome-message');
        
        // Se não existir, cria uma nova
        if (!welcomeMessage) {
          welcomeMessage = document.createElement('p');
          welcomeMessage.id = 'welcome-message';
          welcomeMessage.textContent = 'Selecione uma opção no menu ao lado 👨‍💻';
          welcomeMessage.style.textAlign = 'center';
          welcomeMessage.style.margin = '2em auto';
          welcomeMessage.style.fontSize = '1.2em';
          welcomeMessage.style.color = '#FFFFFF'; // Alterado de #555 para branco
          
          rightPanel.appendChild(welcomeMessage);
        } else {
          // Se já existir, apenas mostra
          welcomeMessage.style.display = '';
          welcomeMessage.style.color = '#FFFFFF'; // Garante a cor branca
        }
      }
    }
  }
}

// Função para imprimir o PDF
function printPDF() {
  const iframe = document.getElementById('pdf-iframe');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }
}