// 1. Declaramos as funções FORA para que todo o seu script consiga usá-las
let playClick, playLose, playGameOver, playFaseConcluida;

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÃO DA MÚSICA DE FUNDO ---
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.volume = 0.03; // Reduzi para 3% (quase um sussurro, ideal para o iPhone)
    }

    // --- CONFIGURAÇÃO DOS EFEITOS (VOLUME NO MÁXIMO) ---
    const clickSound = document.getElementById('click-sound');
    const loseSound = document.getElementById('lose-sound');
    const gameOverSound = document.getElementById('game-over-sound');
    const faseConluidaSound = document.getElementById('fase-concluida-sound')

    // Definimos volumes máximos para os efeitos "cortarem" a música
    if (clickSound) clickSound.volume = 1.0;
    if (loseSound) loseSound.volume = 0.3;
    if (gameOverSound) gameOverSound.volume = 0.5;
    if (faseConluidaSound) gameOverSound.volume = 0.1;

    // --- DEFINIÇÃO DAS FUNÇÕES DE PLAY ---
    playClick = () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log("Erro ao tocar click:", e));
        }
    };

    playLose = () => {
        if (loseSound) {
            loseSound.currentTime = 0;
            loseSound.play().catch(e => console.log("Erro ao tocar lose:", e));
        }
    };

    playGameOver = () => {
        if (gameOverSound) {
            gameOverSound.currentTime = 0;
            gameOverSound.play().catch(e => console.log("Erro ao tocar game-over:", e));
        }
    };

    playFaseConcluida = () => {
        if (faseConluidaSound) {
            faseConluidaSound.currentTime = 0;
            faseConluidaSound.play().catch(e => console.log("Erro ao tocar faseconcluida:", e));
        }
    };

    // --- APLICAÇÃO AUTOMÁTICA NOS BOTÕES ---
    document.querySelectorAll('button, .level-node').forEach(botao => {
        botao.addEventListener('click', playClick);
    });

    // Seletores
    const btnStart = document.getElementById('btn-start');
    const btnBack = document.getElementById('btn-back-to-start');
    const startScreen = document.getElementById('start-screen');
    const mapScreen = document.getElementById('map-screen');
    const levels = document.querySelectorAll('.level-node');

    // Função para trocar de tela
    function changeScreen(from, to) {
        from.classList.remove('active');
        to.classList.add('active');
    }

    // Eventos
    btnStart.addEventListener('click', () => {
        bgMusic.play().catch(error => {
            console.log("O navegador bloqueou o áudio inicial:", error);
        });
        changeScreen(startScreen, mapScreen);
    });

    btnBack.addEventListener('click', () => {
        changeScreen(mapScreen, startScreen);
    });

    // Clique nas fases para iniciar o jogo correspondente
    levels.forEach(level => {
        level.addEventListener('click', () => {
            playClick();
            // Só permite clicar se a fase estiver desbloqueada
            if (level.classList.contains('unlocked')) {
                const id = level.getAttribute('data-level');

                if (id == "1") {
                    iniciarForca(); // Chama a função que criamos para a Fase 1
                } else if (id == "2") {
                    iniciarMemoria();
                } else if (id == "3") {
                    iniciarMisterio();
                }
            } else {
                // Feedback visual caso ela tente clicar em uma fase bloqueada
                // Vamos usar a classe 'shake' que já temos no CSS para dar um charminho
                level.classList.add('shake');
                setTimeout(() => level.classList.remove('shake'), 500);
            }
        });
    });

    // Corações Flutuantes
    function createHeart() {
        const container = document.querySelector('.floating-hearts');
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = Math.random() * 15 + 10 + 'px';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's';
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 4000);
    }

    setInterval(createHeart, 400);


    // Configurações da Fase 1

    const palavrasAmorosas = [
        "AMOR",
        "VIDA",       
        "DOCE",       
        "BEIJO",      
        "LINDA",      
        "AFETO",  
        "DENGO",
        "UNIAO",
        "AMADA",
        "PAIXAO",
        "ABRACO",
        "ETERNO",
        "SINCERA",
        "SORRISO",
        "DESTINO",
        "CARINHO",
        "QUERIDA"
    ]
    let palavraAtual = "";
    let letrasAdivinhadas = [];
    let erros = 0;
    let tempoRestante = 30;
    let timerInterval;

    // Função para iniciar a Fase 1
    function iniciarForca() {
        erros = 0;
        letrasAdivinhadas = [];
        tempoRestante = 30;
        
        // Escolhe palavra aleatória
        palavraAtual = palavrasAmorosas[Math.floor(Math.random() * palavrasAmorosas.length)];
        
        atualizarDisplayForca();
        gerarTeclado();
        iniciarTimer();
        
        const start = document.querySelector('.screen.active');
        const forca = document.getElementById('game-phase-1');
        start.classList.remove('active');
        forca.classList.add('active');
    }

    function mostrarAviso(texto, elementoId = 'game-feedback') {
        const feedback = document.getElementById(elementoId);
        if (!feedback) return; // Segurança caso o ID não exista

        feedback.innerText = texto;
        feedback.classList.add('show');

        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
    }

    function iniciarTimer() {
        clearInterval(timerInterval);
        document.getElementById('seconds').innerText = tempoRestante;
        
        timerInterval = setInterval(() => {
            tempoRestante--;
            document.getElementById('seconds').innerText = tempoRestante;
            
            if (tempoRestante <= 0) {
                clearInterval(timerInterval);
                
                // 1. Toca o som de Game Over
                playGameOver();
                
                // 2. Mostra o aviso na tela (não bloqueia nada!)
                mostrarAviso("O tempo acabou! tenta de novo amor ❤️");
                
                // 3. Espera um pouquinho para ela ler e já troca a palavra
                setTimeout(() => {
                    proximaPalavra(); 
                }, 1500);
            }
        }, 1000);
    }

    function atualizarDisplayForca() {
        // Exibe corações
        const vidasUI = "❤️".repeat(3 - erros) + "🖤".repeat(erros);
        document.getElementById('lives').innerText = vidasUI;

        // Exibe palavra oculta
        const display = palavraAtual.split('').map(letra => 
            letrasAdivinhadas.includes(letra) ? letra : "_"
        ).join(" ");
        document.getElementById('word-display').innerText = display;

        // Checar Vitória
        if (!display.includes("_")) {
                setTimeout(() => {
                    vitoriaFase1();
                }, 300); // 300 milissegundos são suficientes para o olho humano ver a letra
            }
    }

    function gerarTeclado() {
        const keyboard = document.getElementById('keyboard');
        keyboard.innerHTML = '';
        const letras = "ABCDEfGHIJKLMNOPQRSTUVWXYZ".toUpperCase().split('');

        
        letras.forEach(l => {
            const btn = document.createElement('button');
            btn.classList.add('key');
            btn.innerText = l;
            btn.onclick = () => {
                playClick(); // Toca o som aqui!
                verificarLetra(l, btn);
            };
            keyboard.appendChild(btn);
        });
    }

    function verificarLetra(letra, botao) {
        botao.disabled = true;
        if (palavraAtual.includes(letra)) {
            letrasAdivinhadas.push(letra);
            atualizarDisplayForca();
        } else {
            erros++;
            playLose();
            document.getElementById('word-display').classList.add('shake');
            setTimeout(() => document.getElementById('word-display').classList.remove('shake'), 500);
            
            if (erros >= 3) {
                playGameOver();
                mostrarAviso("ôh meu amor, tenta de novo! ❤️");
                proximaPalavra();
            } else {
                atualizarDisplayForca();
            }
        }
    }

    function proximaPalavra() {
        iniciarForca(); // Reinicia com nova palavra
    }

    function vitoriaFase1() {
        clearInterval(timerInterval);
        playFaseConcluida();
        
        mostrarVitoria(
            "Você conseguiu, meu amor!", 
            "Sua inteligência me encanta tanto quanto seu sorriso. A Fase 1 foi concluída com sucesso! ❤️", 
            () => {
                // Tudo que acontecia depois do OK do alert vai aqui
                document.getElementById('level-1').classList.add('completed');
                const lv2 = document.getElementById('level-2');
                lv2.classList.remove('locked');
                lv2.classList.add('unlocked');
                document.getElementById('line-1-2').classList.add('filled');
                voltarAoMapa();
            }
        );
        
        // 1. Marca a fase 1 como completada (o pulso vai sumir daqui)
        const lv1 = document.getElementById('level-1');
        lv1.classList.add('completed');

        // 2. Desbloqueia a fase 2 (o pulso vai aparecer aqui por causa do CSS)
        const lv2 = document.getElementById('level-2');
        lv2.classList.remove('locked');
        lv2.classList.add('unlocked');
        
        document.getElementById('line-1-2').classList.add('filled');
        voltarAoMapa();
        
        voltarAoMapa();
    }

    const voltarAoMapa = () => {
        // 1. Para o cronômetro da forca caso ele esteja rodando
        if (typeof timerInterval !== 'undefined') {
            clearInterval(timerInterval);
        }

        // 2. Remove o estado ativo de todas as telas
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // 3. Ativa o mapa
        const mapScreen = document.getElementById('map-screen');
        if (mapScreen) {
            mapScreen.classList.add('active');
        }
    };

    document.querySelectorAll('.btn-back').forEach(botao => {
        botao.addEventListener('click', voltarAoMapa);
    });




    // Configurações da Fase 2
    const iconesMemoria = ['❤️', '💍', '🌹', '🍷', '🍫', '✈️', '🎬', '🏠'];
    let cartasSelecionadas = [];
    let paresEncontrados = 0;
    let bloqueado = false;

    // Seletor do botão de sair da Fase 2
    const btnExitMemory = document.getElementById('btn-exit-memory');
    if(btnExitMemory) btnExitMemory.addEventListener('click', voltarAoMapa);

    function iniciarMemoria() {
        paresEncontrados = 0;
        cartasSelecionadas = [];
        bloqueado = false;
        document.getElementById('matches').innerText = "0";

        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';

        // Duplicar ícones para criar pares e embaralhar
        const deck = [...iconesMemoria, ...iconesMemoria]
            .sort(() => Math.random() - 0.5);

        deck.forEach(icone => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.icon = icone;

            card.innerHTML = `
                <div class="card-front">${icone}</div>
                <div class="card-back">?</div>
            `;

            card.addEventListener('click', () => {
                playClick(); // Toca o som ao virar a carta!
                virarCarta.call(card); 
            });
            grid.appendChild(card);
        });

        // Troca de tela
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('game-phase-2').classList.add('active');
    }

    function virarCarta() {
        if (bloqueado || this.classList.contains('flip') || this.classList.contains('matched')) return;

        this.classList.add('flip');
        cartasSelecionadas.push(this);

        if (cartasSelecionadas.length === 2) {
            checarPar();
        }
    }

    function checarPar() {
        bloqueado = true;
        const [carta1, carta2] = cartasSelecionadas;

        if (carta1.dataset.icon === carta2.dataset.icon) {
            carta1.classList.add('matched');
            carta2.classList.add('matched');
            paresEncontrados++;
            document.getElementById('matches').innerText = paresEncontrados;
            cartasSelecionadas = [];
            bloqueado = false;

            if (paresEncontrados === iconesMemoria.length) {
                setTimeout(vitoriaFase2, 500);
            }
        } else {
            playLose();
            
            setTimeout(() => {
                carta1.classList.remove('flip');
                carta2.classList.remove('flip');
                cartasSelecionadas = [];
                bloqueado = false;
                
            }, 1000);
            
        }
    }

    function vitoriaFase2() {
        playFaseConcluida();
        mostrarVitoria(
            "Que memória em!", 
            "Nós iremos construir muitas memórias juntos. A fase 2 foi concluida! ❤️", 
            () => {
                document.getElementById('level-2').classList.add('completed');
                const lv3 = document.getElementById('level-3');
                lv3.classList.remove('locked');
                lv3.classList.add('unlocked');
                document.getElementById('line-2-3').classList.add('filled');
                voltarAoMapa();
            }
        );
        
        // 1. Marca a fase 2 como completada
        const lv2 = document.getElementById('level-2');
        lv2.classList.add('completed');

        // 2. Desbloqueia a fase 3
        const lv3 = document.getElementById('level-3');
        lv3.classList.remove('locked');
        lv3.classList.add('unlocked');
        
        document.getElementById('line-2-3').classList.add('filled');
        voltarAoMapa();
    }







    // Configurações da Fase 3
    let itensAchados = 0;

    function iniciarMisterio() {
        itensAchados = 0;
        document.querySelectorAll('.hidden-item').forEach(item => {
            item.classList.remove('found');
            item.dataset.found = "false";
            // Posição aleatória para os itens
            item.style.top = Math.random() * 70 + 10 + "%";
            item.style.left = Math.random() * 70 + 10 + "%";
        });

        const container = document.getElementById('flashlight-container');
        const darkness = document.getElementById('darkness');

        // Função para mover a lanterna (Mouse e Touch)
        const moverLanterna = (e) => {
            const rect = container.getBoundingClientRect();
            // Pega a posição do mouse ou do toque
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;

            darkness.style.setProperty('--x', `${x}px`);
            darkness.style.setProperty('--y', `${y}px`);

            checarItens(x, y);
        };

        container.addEventListener('mousemove', moverLanterna);
        container.addEventListener('touchmove', moverLanterna);

        // Troca de tela
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('game-phase-3').classList.add('active');
    }

    function checarItens(lx, ly) {
        document.querySelectorAll('.hidden-item').forEach(item => {
            if (item.dataset.found === "true") return;

            const rect = item.getBoundingClientRect();
            const containerRect = document.getElementById('flashlight-container').getBoundingClientRect();
            const ix = rect.left - containerRect.left + rect.width / 2;
            const iy = rect.top - containerRect.top + rect.height / 2;

            // Se a luz (lx, ly) estiver perto do item (ix, iy)
            const distancia = Math.sqrt((lx - ix)**2 + (ly - iy)**2);

            if (distancia < 60) {
                item.classList.add('found');
                item.dataset.found = "true";
                itensAchados++;
                
                if (itensAchados === 3) {
                    setTimeout(() => {
                        playFaseConcluida();
                        document.getElementById('final-modal').style.display = 'flex';
                    }, 1000);
                }
            }
        });
    }

    // Coloque dentro do seu DOMContentLoaded ou onde estão os eventos da Fase 3:

    const btnEscondido = document.getElementById('btn-escondido-amor');
    const passwordHint = document.getElementById('password-hint');

    // Mostra a senha quando o coração oculto é clicado
    btnEscondido.addEventListener('click', () => {
        passwordHint.style.display = 'block';
        btnEscondido.style.opacity = '1'; // Faz o coração brilhar ao ser achado
    });

    document.getElementById('btn-unlock-final').addEventListener('click', () => {
        const resposta = document.getElementById('final-answer').value.toLowerCase().trim();
        
        if (resposta === "Eu te amo") {
            mostrarFinalFeliz();
        } else {
            playLose(); 
            
            mostrarAviso("Senha errada amor! ❤️", "final-feedback");
            
            const input = document.getElementById('final-answer');
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    });

    function mostrarFinalFeliz() {
        // 1. Esconde o modal da senha
        document.getElementById('final-modal').style.display = 'none';
        document.getElementById('flashlight-container').style.display = 'none';

        // 2. Mostra a tela do baú
        const celebrationScreen = document.getElementById('celebration-screen');
        celebrationScreen.style.display = 'flex';
        celebrationScreen.classList.add('active');

        // 3. Configura o clique no baú
        const chest = document.getElementById('chest-container');
        chest.addEventListener('click', () => {
            // Abre o baú visualmente
            chest.classList.add('open');


            // Espera a tampa abrir para soltar o vídeo
            setTimeout(() => {
                iniciarVideoFinal();
            }, 800);
        });
    }

    function iniciarVideoFinal() {
        const videoOverlay = document.getElementById('video-overlay');
        const video = document.getElementById('final-video');
        const bgMusic = document.getElementById('bg-music');

        // Para a música de fundo para não atrapalhar o vídeo
        if (bgMusic) bgMusic.pause();

        // Mostra o container do vídeo com transição
        videoOverlay.style.display = 'block';
        setTimeout(() => videoOverlay.style.opacity = '1', 50);

        // Toca o vídeo
        video.play();

        // Botão para fechar o vídeo se ela quiser ver o mapa de novo
        document.getElementById('btn-close-video').onclick = () => {
            video.pause();
            videoOverlay.style.opacity = '0';
            setTimeout(() => {
                videoOverlay.style.display = 'none';
                if (bgMusic) bgMusic.play(); // Volta a música
            }, 1000);
        };
    }





    // 1. Função para disparar a chuva de corações
    function chuvaDeCoracoes() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createHeart(); 
            }, i * 50);
        }
    }

    // 2. Função para mostrar o Modal de Vitória
    function mostrarVitoria(titulo, mensagem, callbackAoFechar) {
        const modal = document.getElementById('victory-modal');
        document.getElementById('victory-title').innerText = titulo;
        document.getElementById('victory-message').innerText = mensagem;
        
        modal.style.display = 'flex';
        chuvaDeCoracoes();
    
        const btn = document.getElementById('btn-victory-continue');
        
        const novoBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(novoBtn, btn);

        novoBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            if (callbackAoFechar) callbackAoFechar();
        });
    }
});