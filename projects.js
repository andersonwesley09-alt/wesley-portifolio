const header=document.querySelector('.header');
const menuButton=document.getElementById('menu-button');
const navMenu=document.getElementById('nav-menu');
const themeButton=document.getElementById('theme-button');
const scrollTopButton=document.getElementById('scroll-top');
const grid=document.getElementById('projects-grid');
const status=document.getElementById('projects-status');

function setMenu(open){navMenu.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');const icon=menuButton.querySelector('i');icon.classList.toggle('fa-bars',!open);icon.classList.toggle('fa-xmark',open);}
menuButton.addEventListener('click',()=>setMenu(!navMenu.classList.contains('open')));
navMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

function handleScroll(){header.classList.toggle('scrolled',window.scrollY>30);scrollTopButton.classList.toggle('show',window.scrollY>500)}
window.addEventListener('scroll',handleScroll,{passive:true});
scrollTopButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

function updateTheme(){const light=document.body.classList.contains('light-theme');themeButton.querySelector('i').className=light?'fa-solid fa-sun':'fa-solid fa-moon';themeButton.setAttribute('aria-pressed',String(light));themeButton.setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');}
const savedTheme=localStorage.getItem('portfolio-theme');if(savedTheme)document.body.classList.toggle('light-theme',savedTheme==='light');else if(window.matchMedia?.('(prefers-color-scheme: light)').matches)document.body.classList.add('light-theme');updateTheme();themeButton.addEventListener('click',()=>{const light=document.body.classList.toggle('light-theme');localStorage.setItem('portfolio-theme',light?'light':'dark');updateTheme()});

const LOCAL_PROJECTS = [{"slug":"controle-de-avarias","kicker":"Projeto em destaque","type":"Sistema Web","title":"Controle de Avarias","description":"Sistema para registrar e acompanhar avarias, baixas e devoluções, com autenticação, módulos operacionais, dashboards e histórico.","details":"Sistema desenvolvido para organizar o fluxo de avarias e transformar registros operacionais em informações mais fáceis de acompanhar.","points":["Login e controle de acesso","Gestão de avarias e operações","Dashboards, tarefas e auditoria","Persistência em PostgreSQL"],"tech":["HTML","CSS","JavaScript","Node.js","PostgreSQL"],"preview_html":"<div class=\"mock-dashboard project-preview-dashboard\"><div class=\"mock-sidebar\"></div><div class=\"mock-main\"><div class=\"mock-title\"></div><div class=\"mock-cards\"><span></span><span></span><span></span></div><div class=\"mock-chart\"></div></div></div>","published":true},{"slug":"controle-de-trocas","kicker":"Operação","type":"Aplicação desktop","title":"Controle de Trocas","description":"Aplicação para registrar trocas, fornecedores e produtos, com importação de Excel, histórico, comprovantes e backup automático.","details":"Aplicação criada para registrar trocas com rapidez e rastreabilidade, relacionando fornecedores e produtos e gerando documentação da operação.","points":["Cadastro e busca de fornecedores","Produtos vinculados ao fornecedor","Importação de planilhas Excel","Histórico e comprovantes","Backup automático do banco"],"tech":["Python","SQLite","Excel","PDF"],"image":"assets/controle-trocas.png","image_alt":"Tela do sistema Controle de Trocas","published":true},{"slug":"plataforma-de-gestao","kicker":"Sistemas internos","type":"Plataforma","title":"Plataforma de Gestão","description":"Plataforma modular para operações internas, reunindo estoque, almoxarifado, pedidos, RH, dashboards e relatórios.","details":"Plataforma modular para concentrar diferentes processos operacionais em um único ambiente, com dados persistidos e geração de relatórios.","points":["Módulos de estoque e almoxarifado","Pedidos e processos internos","Recursos para RH","Dashboards e indicadores","Relatórios em PDF e Excel"],"tech":["Node.js","PostgreSQL","JavaScript","PDF","Excel"],"preview_html":"<div class=\"project-placeholder\"><i class=\"fa-solid fa-layer-group\"></i></div>","published":true},{"slug":"automacao-de-pdfs","kicker":"Processamento de documentos","type":"Automação","title":"Automação de PDFs","description":"Automação para separar documentos de grandes PDFs, identificar funcionários e gerar arquivos individuais organizados.","details":"Automação para processar PDFs extensos, identificar documentos e gerar arquivos individuais padronizados.","points":["Processamento de PDFs extensos","Identificação por nome/CPF quando disponível","Geração de arquivos individuais","Padronização dos nomes dos arquivos"],"tech":["Python","PyPDF2 / pdfplumber","PDF"],"preview_html":"<div class=\"project-placeholder\"><i class=\"fa-solid fa-file-pdf\"></i></div>","published":true}];

function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}

function projectCard(p,i){const image=p.image?`<img src="${esc(p.image)}" alt="${esc(p.image_alt||p.title)}" loading="lazy">`:p.preview_html||`<div class="project-placeholder"><i class="fa-solid fa-code"></i></div>`;const tech=(p.tech||[]).map(t=>`<span>${esc(t)}</span>`).join('');const link=p.link?`<a class="icon-button" href="${esc(p.link)}" target="_blank" rel="noopener" aria-label="Abrir projeto ${esc(p.title)}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`:`<button class="icon-button project-detail-btn" type="button" data-index="${i}" aria-label="Ver detalhes de ${esc(p.title)}"><i class="fa-solid fa-arrow-right"></i></button>`;return `<article class="project-card reveal"><div class="project-image">${image}<span class="project-type">${esc(p.type||'Projeto')}</span></div><div class="project-content"><div class="project-header"><div><span class="project-kicker">${esc(p.kicker||'Projeto')}</span><h2>${esc(p.title)}</h2></div>${link}</div><p>${esc(p.description)}</p><div class="project-tech">${tech}</div></div></article>`}

async function loadProjects(){
  let data;
  try {
    // No GitHub Pages/servidor HTTP, o JSON é a fonte oficial e pode ser alterado pelo painel administrativo.
    // Ao abrir projetos.html diretamente como arquivo local (file://), o navegador pode bloquear fetch().
    // Nesse caso usamos uma cópia embutida para a página continuar funcionando normalmente.
    if (window.location.protocol === 'file:') throw new Error('file-protocol-fallback');
    const res = await fetch('data/projects.json',{cache:'no-store'});
    if (!res.ok) throw new Error('HTTP '+res.status);
    data = await res.json();
  } catch (err) {
    data = {projects: LOCAL_PROJECTS};
  }

  const projects=(Array.isArray(data.projects)?data.projects:[]).filter(project=>project.published!==false);
  grid.innerHTML=projects.map(projectCard).join('');
  status.textContent=projects.length?`${projects.length} projetos`:'Nenhum projeto publicado ainda.';
  status.classList.remove('error');

  const obs=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
  }),{threshold:.08});
  grid.querySelectorAll('.reveal').forEach(e=>obs.observe(e));
  grid.querySelectorAll('.project-detail-btn').forEach(btn=>btn.addEventListener('click',()=>openModal(projects[Number(btn.dataset.index)])));
}

function openModal(p){const modal=document.createElement('div');modal.className='modal open';modal.setAttribute('aria-hidden','false');modal.innerHTML=`<div class="modal-backdrop"></div><div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="dynamic-modal-title"><button class="modal-close" type="button" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button><span class="section-tag">${esc(p.kicker||'Projeto')}</span><h2 id="dynamic-modal-title">${esc(p.title)}</h2><p>${esc(p.details||p.description||'')}</p><div class="modal-columns"><div><h3>O que foi feito</h3><ul>${(p.points||[]).map(x=>`<li><i class="fa-solid fa-check"></i>${esc(x)}</li>`).join('')}</ul></div><div><h3>Tecnologias</h3><div class="project-tech">${(p.tech||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div></div></div></div>`;document.body.appendChild(modal);document.body.classList.add('modal-open');const close=()=>{modal.remove();document.body.classList.remove('modal-open')};modal.querySelector('.modal-close').focus();modal.querySelector('.modal-close').addEventListener('click',close);modal.querySelector('.modal-backdrop').addEventListener('click',close);document.addEventListener('keydown',function onKey(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',onKey)}})}

document.getElementById('year').textContent=new Date().getFullYear();handleScroll();loadProjects();