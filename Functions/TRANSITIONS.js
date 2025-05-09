// Função melhorada para gerenciar transições de conteúdo
function transitionContent(callback) {
  const title = document.querySelector('.content-title');
  const body = document.querySelector('.content-body');

  if (!title || !body) {
    console.error('Elementos .content-title ou .content-body não encontrados.');
    if (typeof callback === 'function') callback();
    return;
  }

  // 1. Limpa classes anteriores e reseta opacidade (se manipulada via style)
  title.classList.remove('content-transition-in', 'content-transition-out', 'content-loading');
  body.classList.remove('content-transition-in', 'content-transition-out', 'content-loading');
  title.style.opacity = '';
  body.style.opacity = '';

  // 2. Aplica a animação de fade-out ao conteúdo atual
  title.classList.add('content-transition-out');
  body.classList.add('content-transition-out');

  // 3. Após a conclusão da animação de fade-out
  setTimeout(() => {
    // 3a. Remove a classe de fade-out.
    title.classList.remove('content-transition-out');
    body.classList.remove('content-transition-out');

    // 3b. Adiciona 'content-loading' para garantir opacidade 0 ANTES do callback.
    // A classe .content-loading deve ter 'opacity: 0;' no CSS.
    title.classList.add('content-loading');
    body.classList.add('content-loading');

    // 3c. Atualiza o conteúdo (executa o callback).
    // Neste ponto, os elementos estão invisíveis devido à classe 'content-loading'.
    if (typeof callback === 'function') {
      callback();
    }

    // 3d. Prepara para o fade-in usando requestAnimationFrame aninhado.
    // O primeiro rAF garante que as atualizações do DOM (do callback) e
    // a classe 'content-loading' (opacity: 0) sejam processadas pelo navegador.
    requestAnimationFrame(() => {
      // O segundo rAF é para remover 'content-loading' e adicionar 'content-transition-in'.
      // Isso dá ao navegador um ciclo de pintura para reconhecer o estado de opacidade 0
      // antes de iniciar a nova animação, que também começa com opacidade 0.
      requestAnimationFrame(() => {
        title.classList.remove('content-loading');
        body.classList.remove('content-loading');

        title.classList.add('content-transition-in');
        body.classList.add('content-transition-in');

        // 3e. Limpeza: Remove a classe 'content-transition-in' após a sua animação concluir.
        setTimeout(() => {
          title.classList.remove('content-transition-in');
          body.classList.remove('content-transition-in');
        }, 500); // Duração da animação fadeIn (0.5s)
      });
    });
  }, 300); // Duração da animação fadeOut (0.3s)
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('.content-title'); // Definir title aqui se for usado no exemplo do callback
  const body = document.querySelector('.content-body');   // Definir body aqui se for usado no exemplo do callback

  const menuLinks = document.querySelectorAll('.nav-menu a');
  if (menuLinks.length > 0) {
    menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const clickedLink = this;
        const href = clickedLink.getAttribute('href') || '#'; 
        
        menuLinks.forEach(menuLink => menuLink.classList.remove('active'));
        clickedLink.classList.add('active');
        
        transitionContent(() => {
          // Exemplo de como o callback atualizaria o conteúdo.
          // Substitua isso pela sua lógica real de carregamento de conteúdo.
          if (title) title.innerHTML = 'Novo Título para ' + (href === '#' ? 'Página Inicial' : href.substring(1));
          if (body) body.innerHTML = 'Novo conteúdo carregado para ' + (href === '#' ? 'Página Inicial' : href.substring(1)) + '. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...';
        });
      });
    });
  }
});