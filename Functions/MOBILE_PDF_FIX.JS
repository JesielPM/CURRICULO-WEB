document.addEventListener('DOMContentLoaded', function() {
    // Verifica se é um dispositivo móvel
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log("Dispositivo móvel detectado - aplicando correções para PDF");
        
        // Posiciona a mensagem de boas-vindas equidistante
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            function positionWelcomeMessage() {
                const pdfButton = document.querySelector('.pdf-button');
                const footer = document.querySelector('.bottom-bar');
                
                if (pdfButton && footer) {
                    const pdfButtonRect = pdfButton.getBoundingClientRect();
                    const footerRect = footer.getBoundingClientRect();
                    
                    // Calcula posição média entre o botão PDF e o rodapé
                    const midPoint = (pdfButtonRect.bottom + footerRect.top) / 2;
                    const windowCenter = window.innerHeight / 2;
                    const offset = midPoint - windowCenter;
                    
                    welcomeMessage.style.top = `calc(50% + ${offset}px)`;
                }
            }
            
            // Posiciona na carga inicial e quando a janela for redimensionada
            positionWelcomeMessage();
            window.addEventListener('resize', positionWelcomeMessage);
        }
        
        // CORREÇÃO 1: Proteger o bloco que gera os botões de contato
        try {
            const container = document.querySelector('.personal-info');
            if (container !== null) {
                console.log("Container .personal-info encontrado - iniciando geração dos botões");
                
                const elementos = Array.from(container.querySelectorAll('p'));
                
                let telefone = elementos.find(p => p.textContent.includes("📞"));
                let endereco = elementos.find(p => p.textContent.includes("📍"));
                let email = elementos.find(p => p.textContent.includes("✉") || p.textContent.includes("@"));
                
                if (telefone && endereco && email) {
                    console.log("Elementos de contato encontrados e processados");
                }
            }
        } catch (error) {
            console.error("Erro ao processar informações de contato:", error);
        }
        
        // Encontra o botão PDF no menu
        const pdfBtn = document.querySelector('.pdf-button') || 
                      document.querySelector('a[href*="Currículo"]') ||
                      document.querySelector('[onclick*="showPDF"]');
        
        if (pdfBtn) {
            console.log("Botão PDF encontrado, adicionando evento específico para mobile");
            
            // Clona e substitui o botão para remover eventos antigos
            const clone = pdfBtn.cloneNode(true);
            pdfBtn.parentNode.replaceChild(clone, pdfBtn);
            
            // Adiciona novo evento otimizado para mobile
            clone.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Carregando PDF para dispositivo móvel");
                
                // CORREÇÃO 2: Usar caminho relativo completo com base na origem do documento
                // Obter o caminho base da página atual
                const basePath = window.location.pathname;
                const baseDir = basePath.substring(0, basePath.lastIndexOf('/'));
                
                // Construir caminhos para o PDF, adicionando ./ no início para garantir que é relativo ao diretório atual
                const pdfUrl = './ARQUIVOS.PDF/Curriculo Jesiel Matos.pdf';
                
                console.log("Tentando carregar PDF de:", pdfUrl);
                
                // Cria container para exibição do PDF em tela cheia
                const mainContainer = document.createElement('div');
                mainContainer.id = 'mobile-pdf-container';
                mainContainer.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                `;
                
                // Botão de fechar
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '✖ Fechar';
                closeBtn.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    padding: 10px 15px;
                    background: #222;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    z-index: 10000;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                `;
                
                // Botão para download do PDF
                const downloadBtn = document.createElement('a');
                downloadBtn.href = pdfUrl;
                downloadBtn.download = 'Curriculo Jesiel Matos.pdf';
                // Contenedor específico para o PDF com fundo branco
                const pdfContainer = document.createElement('div');
                pdfContainer.style.cssText = `
                    width: 90%;
                    height: 80%;
                    background: white;
                    border-radius: 8px;
                    margin-top: 60px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                `;
                
                // Adicionar mensagem de carregamento
                const loadingMsg = document.createElement('div');
                loadingMsg.textContent = "Carregando PDF...";
                loadingMsg.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #333;
                    font-size: 18px;
                    z-index: 5;
                `;
                pdfContainer.appendChild(loadingMsg);
                
                // CORREÇÃO 3: Não usar imagem para testar existência do arquivo
                // Carregar PDF diretamente
                loadPDF(pdfUrl);
                
                function loadPDF(url) {
                    // Usar object em vez de iframe para melhor compatibilidade
                    const pdfObject = document.createElement('object');
                    pdfObject.data = url;
                    pdfObject.type = 'application/pdf';
                    pdfObject.style.cssText = `
                        width: 100%;
                        height: 100%;
                        border: none;
                        position: relative;
                        z-index: 2;
                    `;
                    
                    // Fallback para iframe caso object não funcione
                    pdfObject.innerHTML = `
                        <iframe src="${url}" style="width:100%; height:100%; border:none;">
                            Este navegador não suporta PDFs. Por favor, baixe o arquivo para visualizá-lo.
                        </iframe>
                    `;
                    
                    // Quando o objeto carregar, remover mensagem de carregamento
                    pdfObject.onload = function() {
                        if (pdfContainer.contains(loadingMsg)) {
                            pdfContainer.removeChild(loadingMsg);
                        }
                        console.log("PDF carregado com sucesso");
                    };
                    
                    // Se após 3 segundos não carregar, mostrar botão de download
                    setTimeout(function() {
                        if (pdfContainer.contains(loadingMsg)) {
                            // Mostrar opção de download se o carregamento demorar
                            pdfContainer.innerHTML = `
                                <div style="text-align: center; padding: 20px;">
                                    <h3>Não foi possível exibir o PDF</h3>
                                    <p>Seu dispositivo pode não suportar visualização direta de PDF.</p>
                                    <a href="${url}" download="Curriculo Jesiel Matos.pdf" 
                                       style="display: inline-block; background: #4CAF50; color: white; 
                                             padding: 15px 25px; text-decoration: none; border-radius: 4px; 
                                             margin-top: 20px; font-weight: bold;">
                                        Baixar PDF
                                    </a>
                                </div>
                            `;
                        }
                    }, 3000);
                    
                    pdfContainer.appendChild(pdfObject);
                }
                
                // Evento de fechar
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(mainContainer);
                });
                
                // Adicionar elementos ao container principal
                mainContainer.appendChild(closeBtn);
                mainContainer.appendChild(downloadBtn);
                mainContainer.appendChild(pdfContainer);
                
                // Adicionar container ao body
                document.body.appendChild(mainContainer);
                document.body.classList.add('pdf-active');
                
                console.log("PDF mobile carregado");
            });
        } else {
            console.log("Botão PDF não encontrado");
        }
    }
});