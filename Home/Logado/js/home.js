/** Raiz Digital: menu de perfil, leitor de QR Code e gerenciamento de sessão */
const API_BASE = 'http://localhost:3001/api';

const profileBtn=document.querySelector('#profileBtn'),profileMenu=document.querySelector('#profileMenu');
if(profileBtn){
  profileBtn.addEventListener('click',()=>{
    const opening=profileMenu.hidden;profileMenu.hidden=!opening;profileBtn.setAttribute('aria-expanded',String(opening))
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest('.profile')){
      profileMenu.hidden=true;profileBtn.setAttribute('aria-expanded','false')
    }
  })
}
const desktopOverlay=document.getElementById('desktopOverlay'),scanOverlay=document.getElementById('scanOverlay');
let scanner=null,scanning=false;
function isMobile(){
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)|| (navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<900)
}
function show(el){
  if(!el)return;
  el.hidden=false;
  document.body.style.overflow='hidden';
  el.querySelector('button')?.focus()
}
function hide(el){
  if(!el)return;
  el.hidden=true;
  document.body.style.overflow='';
  if(el===scanOverlay)stopScanner()
}
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>hide(document.getElementById(btn.dataset.close))));
[desktopOverlay,scanOverlay].forEach(el=>el?.addEventListener('click',e=>{
  if(e.target===el)hide(el)
}));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    hide(desktopOverlay);hide(scanOverlay);if(profileMenu)profileMenu.hidden=true
  }
});
document.querySelectorAll('[data-scan]').forEach(btn=>btn.addEventListener('click',()=>{
  if(!isMobile()){
    show(desktopOverlay);return
  }show(scanOverlay);startScanner()
}));
function status(text){
  const el=document.querySelector('#scanStatus');
  if(el)el.textContent=text
}
function loadScannerLibrary(){
  return new Promise((resolve,reject)=>{
    if(window.Html5Qrcode){
      resolve();return
    }const s=document.createElement('script');s.src='https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';s.onload=resolve;s.onerror=()=>reject(new Error('Não foi possível carregar o leitor. Verifique sua conexão.'));document.head.append(s)
  })
}
async function startScanner(){
  if(scanning)return;
  scanning=true;
  status('Preparando câmera...');
  try{
    if(!window.isSecureContext){
      throw Error('Abra o site por HTTPS para permitir acesso à câmera.')
    }await loadScannerLibrary();
    if(!scanning)return;
    scanner=new Html5Qrcode('reader',{
      verbose:false
    });
    await scanner.start({
      facingMode:'environment'
    },{
      fps:10,qrbox:{
        width:220,height:220
      }
    },decoded=>{
      if(!scanning)return;status('QR Code encontrado!');handleQR(decoded)
    },()=>{
    });
    status('Aponte a câmera para um QR Code.')
  }catch(e){
    status(e.message?.includes('Permission')||e.name==='NotAllowedError'?'Permissão da câmera negada. Autorize nas configurações do navegador e tente novamente.':(e.message||'Não foi possível abrir a câmera.'));
    scanning=false
  }
}
async function stopScanner(){
  scanning=false;
  const old=scanner;
  scanner=null;
  if(old){
    try{
      await old.stop()
    }catch(e){
    }try{
      old.clear()
    }catch(e){
    }
  }const r=document.querySelector('#reader');
  if(r)r.innerHTML='<div class="corners" aria-hidden="true"></div>'
}
async function handleQR(value){
  scanning=false;
  await stopScanner();
  let url;
  try{
    url=new URL(value,location.href);
    if(!['http:','https:'].includes(url.protocol))throw Error('unsupported')
  }catch(e){
    status('Código inválido: não contém um endereço de página válido.');
    return
  }
  if(url.origin!==location.origin){
    if(!confirm('O QR Code aponta para outro site: '+url.hostname+'. Deseja abrir?')){
      status('Leitura cancelada. Feche e abra o leitor para tentar novamente.');
      return
    }
  }
  location.href=url.href
}

// Funções de autenticação
function getToken() {
  try {
    return localStorage.getItem('raizDigitalToken');
  } catch (e) {
    return null;
  }
}

function getUser() {
  try {
    const userStr = localStorage.getItem('raizDigitalUsuario');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem('raizDigitalToken');
    localStorage.removeItem('raizDigitalUsuario');
    localStorage.removeItem('raizDigitalProfilePhoto');
    localStorage.removeItem('raizDigitalProfileName');
    localStorage.removeItem('raizDigitalProfileEmail');
  } catch (e) {}
}

// Logout real
document.querySelector('#logoutBtn')?.addEventListener('click',()=>{
  if (confirm('Tem certeza que deseja sair da conta?')) {
    clearSession();
    window.location.href = '../../../Raiz-Digital-Home/Login/index.html';
  }
});

// Atualiza o avatar do cabeçalho usando a foto do usuário logado
function updateNavProfilePhoto(){
  const img=document.getElementById('navProfilePhoto');
  if(!img)return;

  const user = getUser();
  let saved = null;

  try {
    saved = localStorage.getItem('raizDigitalProfilePhoto');
  } catch (e) {}

  // Prioriza foto do backend (via user object), depois localStorage
  const foto = (user && user.foto_perfil) || saved;

  if(foto){
    img.src = foto;
    img.hidden = false;
    img.parentElement.classList.add('has-photo')
  }
  else{
    img.removeAttribute('src');
    img.hidden = true;
    img.parentElement.classList.remove('has-photo')
  }
}

// Verifica se usuário está logado ao carregar a página
function verificarSessao() {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    // Redireciona para login se não estiver autenticado
    window.location.href = '../../../Raiz-Digital-Home/Login/index.html';
    return false;
  }

  // Atualiza avatar
  updateNavProfilePhoto();
  return true;
}

// Inicialização
if (verificarSessao()) {
  updateNavProfilePhoto();
}

window.addEventListener('pageshow', () => {
  if (verificarSessao()) {
    updateNavProfilePhoto();
  }
});

window.addEventListener('storage', e => {
  if (e.key === 'raizDigitalProfilePhoto' || e.key === 'raizDigitalUsuario') {
    updateNavProfilePhoto();
  }
  // Se token foi removido em outra aba, redireciona
  if (e.key === 'raizDigitalToken' && e.newValue === null) {
    window.location.href = '../../../Raiz-Digital-Home/Login/index.html';
  }
});
