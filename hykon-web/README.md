# HYKON — Site institucional

Site institucional estático (HTML, CSS e JavaScript puro — sem frameworks, sem build).

## Estrutura de arquivos

```
hykon-site/
├── index.html        → toda a estrutura e o conteúdo do site
├── css/
│   └── styles.css    → identidade visual, layout e responsividade
├── js/
│   └── main.js        → menu mobile, animação do hero, scroll e formulário
└── README.md
```

## Dependências

Nenhuma. O projeto não usa npm, Node.js nem nenhum framework — é HTML/CSS/JS puro.
A única coisa que vem da internet são as fontes do Google Fonts (Unbounded e IBM Plex Sans),
carregadas via `<link>` no `index.html`. Se quiser rodar 100% offline, baixe as fontes e troque
o `<link>` por arquivos locais.

## Como rodar localmente

**Opção 1 — abrir direto no navegador**
Dê duplo clique em `index.html`. Funciona, mas alguns navegadores restringem certos recursos
quando o arquivo é aberto via `file://`, então a opção 2 é a mais recomendada.

**Opção 2 — servidor local simples (recomendado)**

Com Python já instalado (a maioria dos sistemas já tem):
```bash
cd hykon-site
python3 -m http.server 8000
```
Depois acesse **http://localhost:8000** no navegador.

Ou, se preferir Node.js:
```bash
cd hykon-site
npx serve .
```

## Personalização rápida

- **Cores e fontes:** tudo está centralizado nas variáveis CSS no topo de `css/styles.css`
  (bloco `:root`). Trocar `--cyan`, `--violet`, `--bg`, etc. muda a identidade visual inteira.
- **Textos:** edite diretamente em `index.html` — cada seção está comentada
  (`<!-- ======= SEÇÃO ======= -->`) para facilitar a localização.
- **Formulário de contato:** por padrão o formulário só valida os campos no navegador; ele
  **não envia e-mails de verdade** ainda, porque isso exige um backend. Para receber os
  envios, a forma mais rápida é usar um serviço como o [Formspree](https://formspree.io/)
  ou o [EmailJS](https://www.emailjs.com/) — ambos têm um plano gratuito e só exigem trocar
  o `action` do `<form>` ou algumas linhas em `js/main.js`.
- **Links de contato:** troque o número do WhatsApp (`wa.me/55...`), o usuário do Instagram
  e o e-mail em `index.html` (seção `#contato`) e no rodapé.

## Checklist de qualidade já coberto

- [x] Totalmente responsivo (desktop, tablet e celular)
- [x] Menu fixo com versão mobile (hambúrguer)
- [x] Rolagem suave entre seções
- [x] Animações discretas (entrada do hero, revelação ao rolar, hover nos cards)
- [x] Formulário de contato com validação
- [x] Estrutura semântica (header, main, section, footer) e `alt`/`aria-label` nos elementos
      interativos, pensada para acessibilidade e SEO
- [x] Sem dependências externas de build — carregamento rápido
