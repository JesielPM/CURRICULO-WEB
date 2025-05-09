// Script para navegação móvel - versão corrigida
document.addEventListener('DOMContentLoaded', function() {
  console.log("VERS.MOBILE.JS carregado");
  
  // Verificar se é um dispositivo móvel
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    setupMobileNavigation();
    setupMobileWelcomeMessage();
    applyMobilePDFFixes();
    setupSwipeNavigation(); // Adicionar esta linha
  }
  
  // Ajustar ao redimensionar a janela
  window.addEventListener('resize', function() {
    const isMobileNow = window.innerWidth <= 768;
    
    if (isMobileNow && !document.querySelector('.mobile-menu-btn')) {
      setupMobileNavigation();
      setupMobileWelcomeMessage();
      applyMobilePDFFixes();
      setupSwipeNavigation(); // Adicionar esta linha
    } else if (!isMobileNow) {
      resetToDesktopNavigation();
      resetMobileWelcomeMessage();
    }
  });
  
  // Função para configurar navegação móvel com um item por vez
  function setupMobileNavigation() {
    const navMenu = document.querySelector('.nav-menu ul');
    const menuItems = navMenu.querySelectorAll('li');
    
    // Verificar se já configuramos o botão de menu
    if (document.querySelector('.mobile-menu-btn')) {
      return;
    }
    
    // Criar botão de menu (FORA do primeiro item)
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.setAttribute('aria-label', 'Menu');
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    
    // Inserir o botão após a tag <ul> do menu
    navMenu.parentNode.insertBefore(menuBtn, navMenu.nextSibling);
    
    // Posicionar o botão absolutamente em relação ao menu
    setTimeout(() => {
      const firstItem = menuItems[0];
      const rect = firstItem.getBoundingClientRect();
     }, 0);
    
    // Estado inicial: apenas o primeiro item visível
    let activeIndex = 0;
    menuItems.forEach((item, index) => {
      if (index !== activeIndex) {
        item.style.display = 'none';
      } else {
        item.classList.add('active-mobile-item');
      }
    });
    
    // Evento do botão menu
    menuBtn.addEventListener('click', function() {
      // Toggle da classe para o botão
      menuBtn.classList.toggle('active');
      
      const isOpening = !navMenu.classList.contains('menu-open');
      
      if (isOpening) {
        // ABRINDO MENU
        navMenu.classList.add('menu-open');
        
        // Remover qualquer classe de fechamento anterior
        menuItems.forEach(item => item.classList.remove('closing'));
        
        // Mostrar todos os itens
        menuItems.forEach((item, index) => {
          item.style.display = 'block';
          item.style.animationDelay = `${index * 0.05}s`;
        });
      } else {
        // FECHANDO MENU
        // Primeiro, animar o fechamento
        menuItems.forEach((item, index) => {
          if (!item.classList.contains('active-mobile-item') && 
              !item.classList.contains('mobile-active')) {
            item.classList.add('closing');
          }
        });
        
        // Depois de um tempo (suficiente para a animação completar), esconder os itens
        setTimeout(() => {
          navMenu.classList.remove('menu-open');
          
          menuItems.forEach((item, index) => {
            if (index !== activeIndex) {
              item.style.display = 'none';
            }
            item.classList.remove('closing');
          });
        }, 550); // 550ms é ligeiramente maior que a duração da animação mais longa
      }
    });
    
    // NOVA FUNCIONALIDADE: Adicionar evento de clique aos links do menu
    menuItems.forEach((item, index) => {
      const link = item.querySelector('a');
      if (link) {
        link.addEventListener('click', function() {
          // Atualizar o item ativo
          activeIndex = index;
          
          // Se o menu estiver aberto, fechá-lo
          if (navMenu.classList.contains('menu-open')) {
            // Remover classe menu-open
            navMenu.classList.remove('menu-open');
            
            // Remover classe active do botão
            menuBtn.classList.remove('active');
            
            // Ocultar todos os itens exceto o clicado
            menuItems.forEach((menuItem, i) => {
              if (i !== index) {
                menuItem.style.display = 'none';
              } else {
                menuItem.classList.add('active-mobile-item');
                menuItem.style.display = 'block';
              }
            });
          }
        });
      }
    });
  }
  
  // Função para configurar navegação por swipe
  function setupSwipeNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const contentPanel = document.querySelector('.content-panel');
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Elementos que devem responder ao swipe
    const swipeElements = [navMenu, contentPanel];
    
    swipeElements.forEach(element => {
      if (!element) return;
      
      // Evento de toque inicial
      element.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      // Evento de toque final
      element.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    });
    
    function handleSwipe() {
      const menuItems = document.querySelectorAll('.nav-menu ul li');
      if (!menuItems.length) return;
      
      // Encontrar o item ativo atual
      let activeIndex = -1;
      menuItems.forEach((item, index) => {
        if (item.classList.contains('active-mobile-item') || 
            item.classList.contains('mobile-active') ||
            item.style.display === 'block') {
          activeIndex = index;
        }
      });
      
      if (activeIndex === -1) return;
      
      // Calcular a distância e direção do swipe
      const swipeDistance = touchEndX - touchStartX;
      const minSwipeDistance = 50; // Pixels mínimos para considerar um swipe válido
      
      // Se o menu estiver aberto, não trocar de item
      const navMenuUl = document.querySelector('.nav-menu ul');
      if (navMenuUl && navMenuUl.classList.contains('menu-open')) {
        return;
      }
      
      if (Math.abs(swipeDistance) >= minSwipeDistance) {
        // Swipe para a esquerda (próximo item)
        if (swipeDistance < 0) {
          // Cálculo do próximo índice com comportamento de loop
          const nextIndex = (activeIndex < menuItems.length - 1) ? 
                             activeIndex + 1 : 0;
          
          // Simular clique no botão "Próximo" ou mudar diretamente
          const nextBtn = document.querySelector('.mobile-nav-btn.next-btn');
          if (nextBtn) {
            // Se estamos no último item e temos botões, precisamos fazer um loop manual
            if (activeIndex === menuItems.length - 1) {
              // Forçar mudança para o primeiro item
              changeActiveItem(0);
            } else {
              nextBtn.click();
            }
          } else {
            changeActiveItem(nextIndex);
          }
        }
        // Swipe para a direita (item anterior)
        else if (swipeDistance > 0) {
          // Cálculo do índice anterior com comportamento de loop
          const prevIndex = (activeIndex > 0) ? 
                             activeIndex - 1 : menuItems.length - 1;
          
          // Simular clique no botão "Anterior" ou mudar diretamente
          const prevBtn = document.querySelector('.mobile-nav-btn.prev-btn');
          if (prevBtn) {
            // Se estamos no primeiro item e temos botões, precisamos fazer um loop manual
            if (activeIndex === 0) {
              // Forçar mudança para o último item
              changeActiveItem(menuItems.length - 1);
            } else {
              prevBtn.click();
            }
          } else {
            changeActiveItem(prevIndex);
          }
        }
      }
    }
    
    function changeActiveItem(newIndex) {
      const menuItems = document.querySelectorAll('.nav-menu ul li');
      if (!menuItems[newIndex]) return;
      
      // Esconder todos os itens
      menuItems.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('active-mobile-item', 'mobile-active');
      });
      
      // Mostrar o novo item ativo
      menuItems[newIndex].style.display = 'block';
      menuItems[newIndex].classList.add('active-mobile-item');
      
      // Ativar o link do item
      const link = menuItems[newIndex].querySelector('a');
      if (link && link.getAttribute('data-section')) {
        link.click();
      }
    }
  }
  
  // Função para redefinir navegação para desktop
  function resetToDesktopNavigation() {
    // Remover botão do menu
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) menuBtn.remove();
    
    // Remover classes específicas do mobile
    const mobileActiveItems = document.querySelectorAll('.active-mobile-item');
    mobileActiveItems.forEach(item => {
      item.classList.remove('active-mobile-item');
    });
    
    // Redefinir visibilidade dos itens do menu
    const menuItems = document.querySelectorAll('.nav-menu ul li');
    menuItems.forEach(item => {
      item.style.display = '';
      item.style.animation = '';
    });
    
    // Remover classe de menu aberto
    const navMenu = document.querySelector('.nav-menu ul');
    if (navMenu) navMenu.classList.remove('menu-open');
  }
  
  // Funções existentes
  function setupMobileWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      // Salvar o texto original como atributo de dados
      if (!welcomeMessage.getAttribute('data-original-text')) {
        welcomeMessage.setAttribute('data-original-text', welcomeMessage.textContent);
      }
      
      // Alterar o texto para versão mobile
      welcomeMessage.textContent = 'Selecione uma opção no menu acima 👨‍💻';
    }
  }
  
  function resetMobileWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      const originalText = welcomeMessage.getAttribute('data-original-text');
      if (originalText) {
        welcomeMessage.textContent = originalText;
      }
    }
  }
  
  function applyMobilePDFFixes() {
    // Mantido como está no código original
  }
});