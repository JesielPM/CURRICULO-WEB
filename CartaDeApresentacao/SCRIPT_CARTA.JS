const sections = ['sec1', 'sec2', 'sec3', 'sec4'];

function toggleSection(id, btn) {
  const section = document.getElementById(id);
  if (!section) return;
  if (section.style.maxHeight && section.style.maxHeight !== '0px') {
    section.style.maxHeight = '0';
    section.classList.remove('open');
    btn.textContent = '📖 Clique aqui para ler';
  } else {
    section.style.maxHeight = section.scrollHeight + 'px';
    section.classList.add('open');
    btn.textContent = '📕 Clique aqui para recolher';
  }
}

// Funções para Expandir e Recolher todas as seções
function expandAll() {
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    sec.style.maxHeight = sec.scrollHeight + 'px';
    sec.classList.add('open');
    const button = sec.parentNode.querySelector('.toggle-button');
    if (button) button.textContent = '📕 Clique aqui para recolher';
  });
}

function collapseAll() {
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    sec.style.maxHeight = '0';
    sec.classList.remove('open');
    const button = sec.parentNode.querySelector('.toggle-button');
    if (button) button.textContent = '📖 Clique aqui para ler';
  });
}

window.addEventListener('resize', () => {
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (sec && sec.style.maxHeight && sec.style.maxHeight !== '0px') {
      sec.style.maxHeight = sec.scrollHeight + 'px';
    }
  });
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Alterna entre modos (Noite e Dia) e define automaticamente conforme o horário local
function toggleMode() {
  document.body.classList.toggle('light-mode');
  const modeButton = document.getElementById("mode-toggle");
  if (document.body.classList.contains("light-mode")) {
    modeButton.textContent = "☀️Modo Dia";
  } else {
    modeButton.textContent = "🌛Modo Noturno";
  }
}

// Função para download do PDF
function downloadPDF() {
  const link = document.createElement('a');
  link.href = '../ARQUIVOS.PDF/Carta_de_Apresentacao-Jesiel_Matos.pdf';
  link.download = 'Carta_de_Apresentacao-Jesiel_Matos.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Função para abrir o PDF em nova aba
function openPDF() {
  window.open('../ARQUIVOS.PDF/Carta_de_Apresentacao-Jesiel_Matos.pdf', '_blank');
}

window.addEventListener('load', function(){
  const hour = new Date().getHours();
  const modeButton = document.getElementById("mode-toggle");
  if (hour >= 7 && hour < 19) { // Modo Dia
    document.body.classList.add("light-mode");
    modeButton.textContent = "☀️Modo Dia";
  } else { // Modo Noite
    document.body.classList.remove("light-mode");
    modeButton.textContent = "🌛Modo Noturno";
  }
});

// Atualiza o ano no rodapé
document.getElementById("currentYear").textContent = new Date().getFullYear();