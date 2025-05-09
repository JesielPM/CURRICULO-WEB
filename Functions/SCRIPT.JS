// === NAVEGAÇÃO ENTRE SEÇÕES ===
const menuLinks = document.querySelectorAll('.nav-menu a');
const rightPanel = document.getElementById('rightPanel');

// Função para esconder ou remover a mensagem de boas-vindas
function hideWelcomeMessage() {
  const welcomeMessage = rightPanel.querySelector('p[style*="Selecione uma opção"]') || 
                         document.getElementById('welcome-message') ||
                         rightPanel.querySelector('p:not([class])');
  
  if (welcomeMessage) {
    welcomeMessage.remove();
    console.log('Mensagem de boas-vindas removida');
  }
}

function showWelcomeMessage() {
  let welcomeMessage = document.getElementById('welcome-message');
  
  if (!welcomeMessage) {
    welcomeMessage = document.createElement('p');
    welcomeMessage.id = 'welcome-message';
    welcomeMessage.textContent = 'Selecione uma opção no menu ao lado 👨‍💻';
    welcomeMessage.style.textAlign = 'center';
    welcomeMessage.style.margin = '2em auto';
    welcomeMessage.style.fontSize = '1.2em';
    welcomeMessage.style.color = '#FFFFFF';
    
    const rightPanel = document.getElementById('rightPanel');
    if (rightPanel) {
      const visibleContent = rightPanel.querySelectorAll('.content-title, .content-body, #pdf-main-container');
      visibleContent.forEach(el => {
        if (el) el.remove();
      });
      
      rightPanel.appendChild(welcomeMessage);
    }
  } else {
    welcomeMessage.style.display = '';
    welcomeMessage.style.color = '#FFFFFF';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const rightPanel = document.getElementById('rightPanel');
  const menuLinks = document.querySelectorAll('.nav-menu a:not(#carta-apresentacao-btn):not(.pdf-button)');

  const FADE_OUT_DURATION = 300;
  const FADE_IN_DURATION = 500;

  const welcomeMsg = rightPanel.querySelector('p[style*="Selecione uma opção"]');
  if (welcomeMsg && !welcomeMsg.id) {
    welcomeMsg.id = 'welcome-message';
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      menuLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');

      hideWelcomeMessage();

      const targetId = this.getAttribute('data-section');
      const sectionContentSource = document.getElementById(targetId);

      // Selecionar TODOS os elementos de conteúdo existentes para animar a saída
      const existingTitles = rightPanel.querySelectorAll('.content-title');
      const existingBodies = rightPanel.querySelectorAll('.content-body');
      let oldContentExists = (existingTitles.length > 0 || existingBodies.length > 0);

      existingTitles.forEach(title => {
        title.classList.remove('content-transition-in'); // Limpa animação de entrada anterior
        title.classList.add('content-transition-out');
      });
      existingBodies.forEach(body => {
        body.classList.remove('content-transition-in'); // Limpa animação de entrada anterior
        body.classList.add('content-transition-out');
      });

      setTimeout(() => {
        // Remover TODOS os elementos de conteúdo existentes após a animação de saída
        // Isso garante que não haja duplicatas, especialmente em mobile
        rightPanel.querySelectorAll('.content-title').forEach(el => el.remove());
        rightPanel.querySelectorAll('.content-body').forEach(el => el.remove());

        const pdfMainContainer = document.getElementById('pdf-main-container');
        if (pdfMainContainer) pdfMainContainer.style.display = 'none';
        
        const pdfCurriculoContainer = document.getElementById('pdf-curriculo-container');
        if (pdfCurriculoContainer) pdfCurriculoContainer.style.display = 'none';

        if (sectionContentSource) {
          const clone = sectionContentSource.cloneNode(true);
          const titleElem = clone.querySelector('h2');
          let titleHTML = "";
          let bodyHTML = "";

          if (titleElem) {
            let titleText = titleElem.textContent.trim().toUpperCase();
            if (titleText === "SOBRE MIM") titleHTML = '<h2>👤 SOBRE MIM</h2>';
            else if (titleText === "EDUCAÇÃO") titleHTML = '<h2>🎓 EDUCAÇÃO</h2>';
            else if (titleText === "EXPERIÊNCIAS") titleHTML = '<h2>💼 EXPERIÊNCIAS</h2>';
            else if (titleText === "CURSOS") titleHTML = '<h2>📚 CURSOS</h2>';
            else if (titleText === "HABILIDADES") titleHTML = '<h2>⚙️ HABILIDADES</h2>';
            else titleHTML = titleElem.outerHTML;
            titleElem.remove();
            bodyHTML = clone.innerHTML;
          } else {
            bodyHTML = clone.innerHTML;
          }

          const newTitleDiv = document.createElement('div');
          newTitleDiv.className = 'content-title content-loading';
          newTitleDiv.innerHTML = titleHTML;

          const newBodyDiv = document.createElement('div');
          newBodyDiv.className = 'content-body content-loading';
          newBodyDiv.innerHTML = bodyHTML;

          rightPanel.appendChild(newTitleDiv);
          rightPanel.appendChild(newBodyDiv);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              newTitleDiv.classList.remove('content-loading');
              newTitleDiv.classList.add('content-transition-in');

              newBodyDiv.classList.remove('content-loading');
              newBodyDiv.classList.add('content-transition-in');

              setTimeout(() => {
                if (newTitleDiv.parentNode) newTitleDiv.classList.remove('content-transition-in');
                if (newBodyDiv.parentNode) newBodyDiv.classList.remove('content-transition-in');
              }, FADE_IN_DURATION);
            });
          });
        } else {
          const errorP = document.createElement('p');
          errorP.textContent = 'Conteúdo não encontrado para esta seção.';
          errorP.style.textAlign = 'center';
          errorP.style.color = '#FFFFFF';
          errorP.className = 'content-body content-loading'; // Reutiliza a classe para animação
          rightPanel.appendChild(errorP);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              errorP.classList.remove('content-loading');
              errorP.classList.add('content-transition-in');
              setTimeout(() => {
                if(errorP.parentNode) errorP.classList.remove('content-transition-in');
              }, FADE_IN_DURATION);
            });
          });
        }
      }, oldContentExists ? FADE_OUT_DURATION : 0);
    });
  });

  const btnScroll = document.getElementById("btnScroll");
  if (btnScroll) {
    btnScroll.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", () => {
      btnScroll.style.display = (window.pageYOffset > 300) ? "flex" : "none";
    });
    btnScroll.style.display = "none";
  }

  const cartaBtn = document.getElementById('carta-apresentacao-btn');
  const processoModal = document.getElementById('processo-modal-overlay');
  
  if (cartaBtn && processoModal) {
    cartaBtn.addEventListener('click', function(e) {
      e.preventDefault();
      hideWelcomeMessage();
      
      const currentTitle = rightPanel.querySelector('.content-title');
      const currentBody = rightPanel.querySelector('.content-body');
      if (currentTitle) currentTitle.remove();
      if (currentBody) currentBody.remove();

      // Remova ou comente esta linha:
      // processoModal.style.display = 'flex';
    });
  }
  
  if (processoModal) {
    // Seleciona tanto por id quanto por classe
    const closeBtn = processoModal.querySelector('.close-button') || 
                     processoModal.querySelector('#close-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        // Não manipule display ou active aqui!
        showWelcomeMessage();
      });
    }
  }

  const sobreMimLink = document.querySelector('.nav-menu a[data-section="sobre-mim"]');
  if (sobreMimLink) {
    setTimeout(function() {
      sobreMimLink.click();
    }, 100);
  }
});




