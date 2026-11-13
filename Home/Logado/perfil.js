const photo = document.getElementById('profilePhoto');
const fileInput = document.getElementById('photoInput');
const photoStatus = document.getElementById('photoStatus');
const saveStatus = document.getElementById('profileSaveStatus');
const nameInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const overlay = document.getElementById('cropOverlay');
const stage = document.getElementById('cropStage');
const canvas = document.getElementById('cropCanvas');
const ctx = canvas.getContext('2d');
const zoom = document.getElementById('cropZoom');
const zoomValue = document.getElementById('zoomValue');
const defaultPhoto = '../img/perfil-padrao.svg';
let image = null,
    objectUrl = null,
    scale = 1,
    baseScale = 1,
    offsetX = 0,
    offsetY = 0,
    dragging = false,
    lastX = 0,
    lastY = 0;

function store(key, value) {
    try {
        localStorage.setItem(key, value);
        return true
    } catch (e) {
        return false
    }
}

function remove(key) {
    try {
        localStorage.removeItem(key)
    } catch (e) {}
}
try {
    const saved = localStorage.getItem('raizDigitalProfilePhoto');
    if (saved) photo.src = saved;
    nameInput.value = localStorage.getItem('raizDigitalProfileName') || '';
    emailInput.value = localStorage.getItem('raizDigitalProfileEmail') || '';
} catch (e) {}

function openCrop() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    zoom.focus()
}

function closeCrop() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    dragging = false;
    image = null;
    if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null
    }
    fileInput.value = ''
}

function constrain() {
    if (!image) return;
    const w = image.width * scale,
        h = image.height * scale;
    offsetX = Math.max(canvas.width - w, Math.min(0, offsetX));
    offsetY = Math.max(canvas.height - h, Math.min(0, offsetY))
}

function render() {
    if (!image) return;
    constrain();
    ctx.clearRect(0, 0, 320, 320);
    ctx.drawImage(image, offsetX, offsetY, image.width * scale, image.height * scale)
}
fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        photoStatus.textContent = 'Escolha uma imagem JPG, PNG ou WebP.';
        fileInput.value = '';
        return
    }
    if (file.size > 8 * 1024 * 1024) {
        photoStatus.textContent = 'Escolha uma imagem com até 8 MB.';
        fileInput.value = '';
        return
    }
    const nextUrl = URL.createObjectURL(file),
        nextImage = new Image();
    nextImage.onload = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = nextUrl;
        image = nextImage;
        baseScale = Math.max(320 / image.width, 320 / image.height);
        scale = baseScale;
        offsetX = (320 - image.width * scale) / 2;
        offsetY = (320 - image.height * scale) / 2;
        zoom.value = '100';
        zoomValue.textContent = '100%';
        render();
        openCrop()
    };
    nextImage.onerror = () => {
        URL.revokeObjectURL(nextUrl);
        photoStatus.textContent = 'Não foi possível abrir esta imagem.';
        fileInput.value = ''
    };
    nextImage.src = nextUrl;
});
zoom.addEventListener('input', () => {
    if (!image) return;
    const oldW = image.width * scale,
        oldH = image.height * scale;
    const centerX = (160 - offsetX) / oldW,
        centerY = (160 - offsetY) / oldH;
    scale = baseScale * Number(zoom.value) / 100;
    offsetX = 160 - centerX * image.width * scale;
    offsetY = 160 - centerY * image.height * scale;
    zoomValue.textContent = zoom.value + '%';
    render()
});
stage.addEventListener('pointerdown', e => {
    if (!image) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    stage.setPointerCapture(e.pointerId)
});
stage.addEventListener('pointermove', e => {
    if (!dragging) return;
    const rect = stage.getBoundingClientRect();
    offsetX += (e.clientX - lastX) * 320 / rect.width;
    offsetY += (e.clientY - lastY) * 320 / rect.height;
    lastX = e.clientX;
    lastY = e.clientY;
    render()
});
for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) stage.addEventListener(ev, () => dragging = false);
document.getElementById('cropApply').addEventListener('click', () => {
    if (!image) return;
    render();
    const output = document.createElement('canvas');
    output.width = 300;
    output.height = 300;
    const c = output.getContext('2d');
    c.beginPath();
    c.arc(150, 150, 150, 0, Math.PI * 2);
    c.clip();
    c.drawImage(canvas, 0, 0, 300, 300);
    const data = output.toDataURL('image/png');
    photo.src = data;
    photoStatus.textContent = store('raizDigitalProfilePhoto', data) ? 'Foto ajustada e salva neste navegador.' : 'Foto ajustada, mas não foi possível salvá-la neste navegador.';
    closeCrop()
});
document.getElementById('cropClose').addEventListener('click', closeCrop);
document.getElementById('cropCancel').addEventListener('click', closeCrop);
overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCrop()
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) closeCrop()
});
document.getElementById('editar').addEventListener('submit', e => {
    e.preventDefault();
    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return
    }
    const ok1 = store('raizDigitalProfileName', nameInput.value.trim()),
        ok2 = store('raizDigitalProfileEmail', emailInput.value.trim());
    saveStatus.textContent = ok1 && ok2 ? 'Nome e e-mail salvos neste navegador. A integração com a conta ainda será necessária.' : 'Não foi possível salvar os dados neste navegador.'
});
document.getElementById('clearProfile').addEventListener('click', () => {
    if (!overlay.hidden) closeCrop();
    photo.src = defaultPhoto;
    nameInput.value = '';
    emailInput.value = '';
    fileInput.value = '';
    remove('raizDigitalProfilePhoto');
    remove('raizDigitalProfileName');
    remove('raizDigitalProfileEmail');
    photoStatus.textContent = 'Foto removida.';
    saveStatus.textContent = 'Nome, e-mail e foto limpos neste navegador.'
});