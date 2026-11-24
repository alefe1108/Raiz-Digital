/** Raiz Digital: edição, recorte e armazenamento do perfil via backend */
const API_BASE = 'http://localhost:3001/api';

const photo=document.getElementById('profilePhoto');
const fileInput=document.getElementById('photoInput');
const photoStatus=document.getElementById('photoStatus');
const saveStatus=document.getElementById('profileSaveStatus');
const nameInput=document.getElementById('nome');
const emailInput=document.getElementById('email');
const overlay=document.getElementById('cropOverlay');
const stage=document.getElementById('cropStage');
const canvas=document.getElementById('cropCanvas');
const ctx=canvas.getContext('2d');
const zoom=document.getElementById('cropZoom');
const zoomValue=document.getElementById('zoomValue');
const defaultPhoto='assets/icons/perfil-padrao.svg';
let image=null,objectUrl=null,scale=1,baseScale=1,offsetX=0,offsetY=0,dragging=false,lastX=0,lastY=0;
let currentToken = null;
let currentUser = null;

// Obtém token do localStorage
function getToken() {
  try {
    return localStorage.getItem('raizDigitalToken');
  } catch (e) {
    return null;
  }
}

// Obtém usuário do localStorage
function getUser() {
  try {
    const userStr = localStorage.getItem('raizDigitalUsuario');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
}

// Faz requisição autenticada para a API
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error('Não autenticado');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro na requisição');
  }

  return data;
}

// Carrega perfil do usuário do backend
async function carregarPerfil() {
  try {
    currentToken = getToken();
    currentUser = getUser();

    if (!currentToken || !currentUser) {
      photoStatus.textContent = 'Faça login para acessar o perfil.';
      return;
    }

    // Preenche com dados do localStorage imediatamente (cache)
    nameInput.value = currentUser.nome || '';
    emailInput.value = currentUser.email || '';
    if (currentUser.foto_perfil) {
      photo.src = currentUser.foto_perfil;
    }

    // Busca dados atualizados do backend
    const data = await apiRequest('/perfil');
    const usuario = data.usuario;

    nameInput.value = usuario.nome || '';
    emailInput.value = usuario.email || '';
    if (usuario.foto_perfil) {
      photo.src = usuario.foto_perfil;
      // Atualiza cache local
      try {
        localStorage.setItem('raizDigitalProfilePhoto', usuario.foto_perfil);
      } catch (e) {}
    }

    // Atualiza localStorage com dados mais recentes
    currentUser = { ...currentUser, ...usuario };
    try {
      localStorage.setItem('raizDigitalUsuario', JSON.stringify(currentUser));
    } catch (e) {}

  } catch (erro) {
    console.error('Erro ao carregar perfil:', erro);
    photoStatus.textContent = 'Erro ao carregar perfil. Use os dados salvos localmente.';
    // Mantém dados do localStorage como fallback
    try {
      const saved = localStorage.getItem('raizDigitalProfilePhoto');
      if (saved) photo.src = saved;
      nameInput.value = localStorage.getItem('raizDigitalProfileName') || '';
      emailInput.value = localStorage.getItem('raizDigitalProfileEmail') || '';
    } catch (e) {}
  }
}

function openCrop(){
  overlay.hidden=false;
  document.body.style.overflow='hidden';
  zoom.focus()
}
function closeCrop(){
  overlay.hidden=true;
  document.body.style.overflow='';
  dragging=false;
  image=null;
  if(objectUrl){
    URL.revokeObjectURL(objectUrl);
    objectUrl=null
  }fileInput.value=''
}
function constrain(){
  if(!image)return;
  const w=image.width*scale,h=image.height*scale;
  offsetX=Math.max(canvas.width-w,Math.min(0,offsetX));
  offsetY=Math.max(canvas.height-h,Math.min(0,offsetY))
}
function render(){
  if(!image)return;
  constrain();
  ctx.clearRect(0,0,320,320);
  ctx.drawImage(image,offsetX,offsetY,image.width*scale,image.height*scale)
}
fileInput.addEventListener('change',()=>{
  const file=fileInput.files?.[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){
    photoStatus.textContent='Escolha uma imagem JPG, PNG ou WebP.';fileInput.value='';return
  }
  if(file.size>8*1024*1024){
    photoStatus.textContent='Escolha uma imagem com até 8 MB.';fileInput.value='';return
  }
  const nextUrl=URL.createObjectURL(file),nextImage=new Image();
  nextImage.onload=()=>{
    if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=nextUrl;image=nextImage;baseScale=Math.max(320/image.width,320/image.height);scale=baseScale;offsetX=(320-image.width*scale)/2;offsetY=(320-image.height*scale)/2;zoom.value='100';zoomValue.textContent='100%';render();openCrop()
  };
  nextImage.onerror=()=>{
    URL.revokeObjectURL(nextUrl);photoStatus.textContent='Não foi possível abrir esta imagem.';fileInput.value=''
  };
  nextImage.src=nextUrl;
});
zoom.addEventListener('input',()=>{
  if(!image)return;const oldW=image.width*scale,oldH=image.height*scale;const centerX=(160-offsetX)/oldW,centerY=(160-offsetY)/oldH;scale=baseScale*Number(zoom.value)/100;offsetX=160-centerX*image.width*scale;offsetY=160-centerY*image.height*scale;zoomValue.textContent=zoom.value+'%';render()
});
stage.addEventListener('pointerdown',e=>{
  if(!image)return;dragging=true;lastX=e.clientX;lastY=e.clientY;stage.setPointerCapture(e.pointerId)
});
stage.addEventListener('pointermove',e=>{
  if(!dragging)return;const rect=stage.getBoundingClientRect();offsetX+=(e.clientX-lastX)*320/rect.width;offsetY+=(e.clientY-lastY)*320/rect.height;lastX=e.clientX;lastY=e.clientY;render()
});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(ev,()=>dragging=false);
document.getElementById('cropApply').addEventListener('click',()=>{
  if(!image)return;render();const output=document.createElement('canvas');output.width=300;output.height=300;const c=output.getContext('2d');c.beginPath();c.arc(150,150,150,0,Math.PI*2);c.clip();c.drawImage(canvas,0,0,300,300);const data=output.toDataURL('image/png');photo.src=data;photoStatus.textContent='Foto ajustada. Clique em "Salvar alterações" para enviar ao servidor.';closeCrop()
});
document.getElementById('cropClose').addEventListener('click',closeCrop);
document.getElementById('cropCancel').addEventListener('click',closeCrop);
overlay.addEventListener('click',e=>{
  if(e.target===overlay)closeCrop()
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!overlay.hidden)closeCrop()
});

// Salva alterações do perfil no backend
document.getElementById('editar').addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(!emailInput.checkValidity()){
    emailInput.reportValidity();
    return
  }

  saveStatus.textContent = 'Salvando...';

  try {
    const fotoBase64 = photo.src.startsWith('data:') ? photo.src : null;

    const data = await apiRequest('/perfil', {
      method: 'PUT',
      body: JSON.stringify({
        nome: nameInput.value.trim(),
        email: emailInput.value.trim(),
        foto_perfil: fotoBase64
      })
    });

    // Atualiza localStorage com dados retornados
    const usuario = data.usuario;
    currentUser = { ...currentUser, ...usuario };
    try {
      localStorage.setItem('raizDigitalUsuario', JSON.stringify(currentUser));
      if (usuario.foto_perfil) {
        localStorage.setItem('raizDigitalProfilePhoto', usuario.foto_perfil);
      }
      localStorage.setItem('raizDigitalProfileName', usuario.nome);
      localStorage.setItem('raizDigitalProfileEmail', usuario.email);
    } catch (e) {}

    saveStatus.textContent = data.mensagem || 'Perfil salvo com sucesso!';
    photoStatus.textContent = fotoBase64 ? 'Foto salva no servidor.' : '';

  } catch (erro) {
    console.error('Erro ao salvar perfil:', erro);
    saveStatus.textContent = 'Erro: ' + erro.message;
    // Fallback: salva localmente
    const ok1 = storeLocal('raizDigitalProfileName', nameInput.value.trim());
    const ok2 = storeLocal('raizDigitalProfileEmail', emailInput.value.trim());
    if (photo.src.startsWith('data:')) {
      storeLocal('raizDigitalProfilePhoto', photo.src);
    }
    saveStatus.textContent += ' (Salvo localmente como backup)';
  }
});

// Função auxiliar para localStorage
function storeLocal(key, value){
  try{
    localStorage.setItem(key,value);
    return true
  }catch(e){
    return false
  }
}

function removeLocal(key){
  try{
    localStorage.removeItem(key)
  }catch(e){
  }
}

document.getElementById('clearProfile').addEventListener('click', async ()=>{
  if(!overlay.hidden)closeCrop();

  try {
    // Tenta limpar no backend enviando valores vazios/padrão
    await apiRequest('/perfil', {
      method: 'PUT',
      body: JSON.stringify({
        nome: '',
        email: currentUser?.email || '',
        foto_perfil: null
      })
    });
  } catch (erro) {
    console.error('Erro ao limpar no backend:', erro);
  }

  // Limpa localStorage
  photo.src = defaultPhoto;
  nameInput.value = '';
  emailInput.value = '';
  fileInput.value = '';
  removeLocal('raizDigitalProfilePhoto');
  removeLocal('raizDigitalProfileName');
  removeLocal('raizDigitalProfileEmail');
  photoStatus.textContent = 'Foto removida.';
  saveStatus.textContent = 'Dados limpos. Clique em "Salvar alterações" para aplicar no servidor.';
});

// Inicializa carregando o perfil
carregarPerfil();
