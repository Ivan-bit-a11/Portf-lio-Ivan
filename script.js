// =====================================================
// CONFIGURAÇÃO DO EMAILJS (SUA PUBLIC KEY AQUI ↓)
// =====================================================
(function () {
    // INSIRA SUA PUBLIC KEY DO EMAILJS AQUI:
    // Vá em: EmailJS Dashboard → Account → API Keys → Public Key
    // Copie a chave que começa com "user_" e cole abaixo:
    emailjs.init("l2vm_lilzc3RwloMe");
})();

// =====================================================
// FUNÇÕES DE NAVEGAÇÃO E MENU
// =====================================================

// Menu mobile toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
}

// Fechar menu ao clicar em um link
if (navLinks) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenu) {
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
});

// =====================================================
// SMOOTH SCROLL PARA TODOS OS LINKS ÂNCORA
// =====================================================
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll para todos os links com href começando com #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Fechar menu mobile se aberto
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileMenu) {
                        mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }

                // Calcular posição considerando o header fixo
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;

                // Scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Atualizar URL sem recarregar a página
                history.pushState(null, null, targetId);
            }
        });
    });

    // Garantir que a foto carregue corretamente
    const profilePhoto = document.querySelector('.real-photo');
    const fallbackIcon = document.querySelector('.fallback-icon');

    if (profilePhoto) {
        // Verifica se a foto carregou
        if (profilePhoto.complete && profilePhoto.naturalHeight !== 0) {
            profilePhoto.classList.add('loaded');
        } else {
            // Se não carregar, mostra mensagem no console
            profilePhoto.addEventListener('error', function () {
                console.log('Foto não carregada. Verifique o caminho ou nome do arquivo.');
                if (fallbackIcon) {
                    fallbackIcon.style.display = 'flex';
                }
            });

            // Tenta carregar novamente
            profilePhoto.addEventListener('load', function () {
                this.classList.add('loaded');
            });
        }
    }
});

// =====================================================
// FUNÇÃO PARA ENVIO DE EMAIL (FORMULÁRIO DE CONTATO)
// =====================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mostrar estado de carregamento
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            // 1. Coletar dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                date: new Date().toLocaleString('pt-MZ', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
                year: new Date().getFullYear(),
                user_ip: 'Não disponível'
            };

            // 2. Validar formulário
            if (!validateForm(formData)) {
                showNotification('❌ Por favor, preencha todos os campos corretamente.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            // 3. Enviar usando EmailJS
            const response = await emailjs.send(
                // INSIRA SEU SERVICE ID AQUI:
                'service_knkcmdr',

                // INSIRA SEU TEMPLATE ID AQUI:
                'template_xk8ey9i',

                formData
            );

            // 4. Sucesso
            console.log('✅ Email enviado com sucesso:', response);
            showNotification('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            contactForm.reset();

        } catch (error) {
            // 5. Erro
            console.error('❌ Erro ao enviar email:', error);
            showNotification('❌ Erro ao enviar mensagem. Tente novamente ou entre em contato pelo email.', 'error');

        } finally {
            // 6. Restaurar botão
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Função para validar formulário
function validateForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        return false;
    }

    if (!data.subject || data.subject.trim().length < 3) {
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        return false;
    }

    return true;
}

// Função para validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// =====================================================
// SISTEMA DE NOTIFICAÇÕES
// =====================================================
function showNotification(message, type) {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Adicionar ao corpo
    document.body.appendChild(notification);

    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Fechar notificação após 5 segundos
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 5000);

    // Fechar ao clicar no botão
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });

    // Fechar ao clicar na notificação
    notification.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-close')) {
            clearTimeout(autoClose);
            closeNotification(notification);
        }
    });
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// =====================================================
// ANIMAÇÕES AO SCROLL
// =====================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.skill-category, .timeline-content, .info-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Animar barras de habilidades quando visíveis
const skillBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillLevel = entry.target.querySelector('.skill-level');
            if (skillLevel) {
                const width = skillLevel.style.width;
                skillLevel.style.width = '0';

                setTimeout(() => {
                    skillLevel.style.transition = 'width 1.5s ease-in-out';
                    skillLevel.style.width = width;
                }, 300);

                skillBarsObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

// Observar barras de habilidades
document.querySelectorAll('.skill-item').forEach(item => {
    skillBarsObserver.observe(item);
});

// =====================================================
// FUNÇÃO PARA TESTE RÁPIDO
// =====================================================
// Teste se os botões estão funcionando
console.log('Portfólio carregado!');
console.log('Botão "Entre em Contato" deve funcionar agora.');
console.log('Clique nele para ir para a seção de contato.');