document.addEventListener('DOMContentLoaded', function() {
  // Verificar se é um dispositivo móvel
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    initMobileMenu();
  }
  
  // Reinicializar o menu quando a janela for redimensionada
  window.addEventListener('resize', function() {
    const currentlyMobile = window.innerWidth <= 768;
    
    if (currentlyMobile && !document.querySelector('.mobile-nav-controls')) {
      initMobileMenu();
    } else if (!currentlyMobile) {
      resetToDesktopMenu();
    }
  });
  
  function initMobileMenu() {
    const menuItems = document.querySelectorAll('.nav-menu ul li');
    let currentIndex = 0;
    
    // Esconder todos os itens
    menuItems.forEach(item => {
      item.classList.remove('mobile-active');
      item.style.display = 'none';
    });
    
    // Mostrar apenas o primeiro item
    menuItems[currentIndex].classList.add('mobile-active');
    menuItems[currentIndex].style.display = 'block';
    
    // Criar botões de navegação se ainda não existirem
    if (!document.querySelector('.mobile-nav-controls')) {
      const navControls = document.createElement('div');
      navControls.className = 'mobile-nav-controls';
      
      const prevBtn = document.createElement('button');
      prevBtn.className = 'mobile-nav-btn prev-btn';
      prevBtn.textContent = '◀ Anterior';
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'mobile-nav-btn next-btn';
      nextBtn.textContent = 'Próximo ▶';
      
      navControls.appendChild(prevBtn);
      navControls.appendChild(nextBtn);
      
      // Inserir os botões após a lista do menu
      const navMenu = document.querySelector('.nav-menu ul');
      navMenu.parentNode.insertBefore(navControls, navMenu.nextSibling);
      
      // Ativar o conteúdo do primeiro item automaticamente
      setTimeout(() => {
        const firstLink = menuItems[0].querySelector('a');
        if (firstLink) firstLink.click();
      }, 200);
      
      // Função para navegar para o item anterior
      prevBtn.addEventListener('click', function() {
        // Esconder o item atual
        menuItems[currentIndex].classList.remove('mobile-active');
        menuItems[currentIndex].style.display = 'none';
        
        // Atualizar o índice (com loop circular)
        currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        
        // Mostrar o novo item
        menuItems[currentIndex].classList.add('mobile-active');
        menuItems[currentIndex].style.display = 'block';
        
        // Clicar no link do item para mostrar o conteúdo
        const link = menuItems[currentIndex].querySelector('a');
        if (link) link.click();
      });
      
      // Função para navegar para o próximo item
      nextBtn.addEventListener('click', function() {
        // Esconder o item atual
        menuItems[currentIndex].classList.remove('mobile-active');
        menuItems[currentIndex].style.display = 'none';
        
        // Atualizar o índice (com loop circular)
        currentIndex = (currentIndex + 1) % menuItems.length;
        
        // Mostrar o novo item
        menuItems[currentIndex].classList.add('mobile-active');
        menuItems[currentIndex].style.display = 'block';
        
        // Clicar no link do item para mostrar o conteúdo
        const link = menuItems[currentIndex].querySelector('a');
        if (link) link.click();
      });
    }
  }
  
  function resetToDesktopMenu() {
    // Remover botões de navegação
    const navControls = document.querySelector('.mobile-nav-controls');
    if (navControls) {
      navControls.remove();
    }
    
    // Restaurar todos os itens do menu
    const menuItems = document.querySelectorAll('.nav-menu ul li');
    menuItems.forEach(item => {
      item.classList.remove('mobile-active');
      item.style.display = '';
    });
  }
});