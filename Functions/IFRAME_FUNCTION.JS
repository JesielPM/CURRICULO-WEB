document.addEventListener('DOMContentLoaded', () => {
  console.log('[IFRAME_FUNCTION] DOMContentLoaded - Script iniciado.');

  const overlay = document.getElementById('processo-modal-overlay');
  const cartaBtn = document.getElementById('carta-apresentacao-btn');
  const closeBtn = document.getElementById('close-modal-btn'); // Certifique-se que este é o ID correto do botão de fechar no HTML do modal

  if (!overlay) {
    console.error('[IFRAME_FUNCTION] Elemento overlay (processo-modal-overlay) NÃO encontrado.');
  } else {
    console.log('[IFRAME_FUNCTION] Elemento overlay (processo-modal-overlay) encontrado:', overlay);
  }
  if (!cartaBtn) {
    console.warn('[IFRAME_FUNCTION] Botão para abrir o modal (carta-apresentacao-btn) NÃO encontrado.');
  } else {
    console.log('[IFRAME_FUNCTION] Botão para abrir o modal (carta-apresentacao-btn) encontrado:', cartaBtn);
  }
  if (!closeBtn) {
    console.warn('[IFRAME_FUNCTION] Botão para fechar o modal (close-modal-btn) NÃO encontrado no overlay.');
  } else {
    console.log('[IFRAME_FUNCTION] Botão para fechar o modal (close-modal-btn) encontrado:', closeBtn);
  }

  // Função para abrir o modal com animação
  function openModal(e) {
    console.log('[IFRAME_FUNCTION] openModal - Função chamada.');
    if (e) e.preventDefault();
    if (!overlay) {
      console.error('[IFRAME_FUNCTION] openModal - Elemento overlay do modal não encontrado ao tentar abrir.');
      return;
    }
    console.log('[IFRAME_FUNCTION] openModal - Overlay INLINE styles ANTES: display=', overlay.style.display, ', visibility=', overlay.style.visibility);

    // 1. Make the overlay part of the layout and ensure it's ready to be visible
    overlay.style.display = 'flex';
    overlay.style.visibility = 'visible'; // CRUCIAL: Sobrescreve 'hidden' inline de um fechamento anterior
    console.log('[IFRAME_FUNCTION] openModal - Overlay APÓS display/visibility set: display=', overlay.style.display, ', visibility=', overlay.style.visibility);

    // 2. Force a reflow
    console.log('[IFRAME_FUNCTION] openModal - Forçando reflow (offsetWidth).');
    void overlay.offsetWidth;
    console.log('[IFRAME_FUNCTION] openModal - Reflow forçado.');

    // 3. Add 'active' class
    requestAnimationFrame(() => {
      console.log('[IFRAME_FUNCTION] openModal - Dentro do requestAnimationFrame. Adicionando classe "active".');
      overlay.classList.add('active');
      console.log('[IFRAME_FUNCTION] openModal - Classe "active" adicionada. Classes do overlay:', overlay.classList);
      // Log estilos computados após 'active' ser adicionado
      const computedStyles = getComputedStyle(overlay);
      console.log('[IFRAME_FUNCTION] openModal - Overlay COMPUTED styles APÓS active: display=', computedStyles.display, ', visibility=', computedStyles.visibility, ', opacity=', computedStyles.opacity);
    });

    document.body.style.overflow = 'hidden';
    console.log('[IFRAME_FUNCTION] openModal - document.body.style.overflow configurado para "hidden".');
  }

  // Função para fechar o modal com animação
  function closeModal() {
    console.log('[IFRAME_FUNCTION] closeModal - Função chamada.');
    if (!overlay) {
      console.error('[IFRAME_FUNCTION] closeModal - Elemento overlay do modal não encontrado ao tentar fechar.');
      return;
    }

    console.log('[IFRAME_FUNCTION] closeModal - Removendo classe "active". Classes ANTES:', overlay.classList);
    overlay.classList.remove('active'); // Isso deve acionar a transição CSS para opacidade e visibilidade
    console.log('[IFRAME_FUNCTION] closeModal - Classe "active" removida. Classes DEPOIS:', overlay.classList);
    
    requestAnimationFrame(() => { 
        const computedStyles = getComputedStyle(overlay);
        console.log('[IFRAME_FUNCTION] closeModal - Overlay COMPUTED styles APÓS active removed: display=', computedStyles.display, ', visibility=', computedStyles.visibility, ', opacity=', computedStyles.opacity);
    });

    const transitionDuration = parseFloat(getComputedStyle(overlay).transitionDuration) * 1000 || 400;
    console.log('[IFRAME_FUNCTION] closeModal - Duração da transição calculada:', transitionDuration, 'ms.');

    setTimeout(() => {
      console.log('[IFRAME_FUNCTION] closeModal - Dentro do setTimeout (após transição).');
      // Apenas defina display:none. A visibilidade deve ser tratada pela ausência da classe .active via CSS.
      overlay.style.display = 'none'; 
      console.log('[IFRAME_FUNCTION] closeModal - Overlay display set to none. Inline display:', overlay.style.display, 'Inline visibility:', overlay.style.visibility);
      document.body.style.overflow = 'auto'; // Restaurar scroll da página
      console.log('[IFRAME_FUNCTION] closeModal - document.body.style.overflow restaurado para "auto".');
    }, transitionDuration);
  }

  // Adicionar eventos aos botões
  if (cartaBtn) {
    cartaBtn.addEventListener('click', (event) => {
      console.log('[IFRAME_FUNCTION] Evento de clique no cartaBtn (carta-apresentacao-btn) disparado.');
      // openModal chama event.preventDefault() internamente se 'event' for passado
      openModal(event); 
      
      // Impede que o evento se propague para outros listeners (ex: no document, ou listeners mais genéricos
      // que poderiam estar em Transitions.js e que não deveriam tratar este clique específico).
      event.stopPropagation(); 
      console.log('[IFRAME_FUNCTION] Event propagation stopped for cartaBtn click.');
    });
    console.log('[IFRAME_FUNCTION] Event listener adicionado ao cartaBtn.');
  } else {
    // O aviso já foi dado acima
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      console.log('[IFRAME_FUNCTION] Evento de clique no closeBtn (close-modal-btn) disparado.');
      closeModal();
    });
    console.log('[IFRAME_FUNCTION] Event listener adicionado ao closeBtn.');
  } else {
    // O aviso já foi dado acima
  }

  // Fechar também quando clicar fora da área do modal (diretamente no overlay)
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      console.log('[IFRAME_FUNCTION] Evento de clique no overlay disparado. Target:', e.target);
      if (e.target === overlay) { // Garante que o clique foi no overlay e não em seus filhos
        console.log('[IFRAME_FUNCTION] Clique foi diretamente no overlay. Chamando closeModal.');
        closeModal();
      } else {
        console.log('[IFRAME_FUNCTION] Clique foi em um filho do overlay, não no overlay em si.');
      }
    });
    console.log('[IFRAME_FUNCTION] Event listener de clique adicionado ao overlay.');
  }

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      console.log('[IFRAME_FUNCTION] Tecla Escape pressionada e modal está ativo. Chamando closeModal.');
      closeModal();
    }
  });
  console.log('[IFRAME_FUNCTION] Event listener de keydown (Escape) adicionado ao documento.');

  // --- Lógica do Dark Mode para botões ---
  function updateButtonStylesForDarkMode() {
    const darkModeActive = document.body.classList.contains('dark-mode') ||
                           document.body.classList.contains('night-mode') ||
                           document.body.classList.contains('dark-theme') ||
                           document.body.classList.contains('dark') ||
                           document.documentElement.getAttribute('data-theme') === 'dark';

    // Seleciona todos os botões que podem precisar de estilização no dark mode
    const closeButtons = document.querySelectorAll('.close-button, .pdf-close-btn, #close-modal-btn, [aria-label="Fechar"]');

    closeButtons.forEach(button => {
      if (darkModeActive) {
        button.setAttribute('style',
          'background-color: white !important; ' +
          'color: black !important; ' +
          'font-weight: bold !important; ' +
          'border: 1px solid #333 !important;'
        );
        // Ajusta o texto dentro do botão para garantir que fique preto
        // Esta parte pode precisar de ajuste fino dependendo do HTML exato dos seus botões
        const textContent = button.textContent || button.innerText;
        if (textContent.match(/SAIR|Fechar|✖/gi)) {
            // Se o botão já contém um span para o texto, estilize-o.
            // Caso contrário, envolva o texto em um span para estilização.
            // Isso é uma tentativa de preservar ícones que podem ser fontes ou SVGs.
            let textNode = Array.from(button.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "");
            if (textNode) {
                const span = document.createElement('span');
                span.style.color = 'black !important';
                span.textContent = textNode.textContent;
                button.replaceChild(span, textNode);
            } else if (!button.querySelector('span[style*="color: black"]')) { // Evita adicionar múltiplos spans
                 button.innerHTML = button.innerHTML.replace(/(SAIR|Fechar|✖)/gi,
                    '<span style="color: black !important;">$1</span>');
            }
        }

      } else {
        // Restaura os estilos padrão
        button.removeAttribute('style');
        // Remove o span de estilização do dark mode, se existir
        const darkSpan = button.querySelector('span[style*="color: black !important;"]');
        if (darkSpan && darkSpan.parentElement === button) {
            button.innerHTML = button.innerHTML.replace(/<span style="color: black !important;">(SAIR|Fechar|✖)<\/span>/gi, '$1');
        }
      }
    });
  }

  // Executa a atualização de estilos do dark mode imediatamente ao carregar
  updateButtonStylesForDarkMode();

  // Monitora o botão de toggle do dark mode
  const darkModeToggle = document.querySelector('.dark-mode-toggle') ||
                         document.querySelector('#dark-mode-toggle') ||
                         document.querySelector('[data-theme-toggle]');

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      // Atualiza os estilos após um pequeno atraso para garantir que a classe do body tenha mudado
      setTimeout(updateButtonStylesForDarkMode, 50);
    });
  }

  // Observa mudanças de classe no body (para temas aplicados dinamicamente)
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        updateButtonStylesForDarkMode();
        break;
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  console.log('[IFRAME_FUNCTION] Lógica do Dark Mode configurada.');
});