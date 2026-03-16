document.addEventListener('DOMContentLoaded', () => {

    const bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.05; // Ajuste o volume para 50% para não ser muito alto

    const clickSound = document.getElementById('click-sound');

    // Função para tocar o som de clique
    function playClick() {
        // Reinicia o áudio para o início (caso ela clique muito rápido)
        clickSound.currentTime = 0; 
        clickSound.play();
    }

    // Seleciona TODOS os botões da página e adiciona o som automaticamente
    document.querySelectorAll('button').forEach(botao => {
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

    const palavrasAmorosas = ["AMOR"];
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

    function iniciarTimer() {
        clearInterval(timerInterval);
        document.getElementById('seconds').innerText = tempoRestante;
        timerInterval = setInterval(() => {
            tempoRestante--;
            document.getElementById('seconds').innerText = tempoRestante;
            if (tempoRestante <= 0) {
                proximaPalavra("O tempo acabou! Tente esta nova palavra.");
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
            document.getElementById('word-display').classList.add('shake');
            setTimeout(() => document.getElementById('word-display').classList.remove('shake'), 500);
            
            if (erros >= 3) {
                proximaPalavra("Quase! Vamos tentar outra palavra?");
            } else {
                atualizarDisplayForca();
            }
        }
    }

    function proximaPalavra(mensagem) {
        alert(mensagem);
        iniciarForca(); // Reinicia com nova palavra
    }

    function vitoriaFase1() {
        clearInterval(timerInterval);
        alert("Você conseguiu, meu amor! Fase 1 concluída. ❤️");
        
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
            setTimeout(() => {
                carta1.classList.remove('flip');
                carta2.classList.remove('flip');
                cartasSelecionadas = [];
                bloqueado = false;
            }, 1000);
        }
    }

    function vitoriaFase2() {
        alert("Incrível! Nossa sintonia é perfeita. Fase 2 concluída! ❤️");
        
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

    // Verifica a senha digitada no input
    document.getElementById('btn-unlock-final').addEventListener('click', () => {
        const resposta = document.getElementById('final-answer').value.toLowerCase().trim();
        
        // Usamos toLowerCase() e trim() para evitar erros de letra maiúscula ou espaço extra
        if (resposta === "eu te amo") {
            mostrarFinalFeliz();
        } else {
            alert("A senha está correta? Procure melhor o segredo... ❤️");
        }
    });

    function mostrarFinalFeliz() {
        // Esconde o modal
        document.getElementById('final-modal').style.display = 'none';
        
        // Você pode criar uma tela final ou apenas um alerta caprichado
        alert("Parabéns, meu amor! Você completou toda a jornada. Minha vida é muito mais feliz com você ao meu lado. Te amo eternamente! ❤️");
    }
});