// ============================================================
// SUPABASE CONFIG
// ============================================================
const SUPABASE_URL = 'https://meclpcxdlyybjbmhfxru.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GJl4nv43kFDxc_PzAo90qg_zbXMmTiT';

// ============================================================
// DATA ROLES
// ============================================================
const items = [
  {
    id: 1,
    name: "Reseller Package",
    price: 400000,
    features: "Role: Super Developer, Developer, Moderator, Cheater, VIP\nTrusted SELLER BGL/GGL\nGet title [RESELLER] in-game",
    stock: "0/4"
  },
  {
    id: 2,
    name: "Unlimited Block Package",
    price: 200000,
    features: "Role: Developer, Moderator, VIP\nGet title [MIDMAN] in-game\nGet untradable box"
  },
  {
    id: 3,
    name: "Middleman Package",
    price: 250000,
    features: "Role: Moderator, Cheater, VIP\nGet title [UNLI BLOCK] in-game\nIn-game name color: Yellow"
  },
  {
    id: 4,
    name: "Super Developer - Ingame",
    price: 150000,
    features: "Role: Developer, Moderator, Cheater, VIP\nIn-game name color: Dark Orange\nCommands: /color, /e, /entereffect, /freezeall, /killall, /p, /sdsb, /trollnick, /vernick, /warn"
  },
  {
    id: 5,
    name: "Developer - Ingame",
    price: 75000,
    features: "Role: Moderator, Cheater, VIP\nIn-game name color: Yellow\nCommands: /1hit, /banall, /block, /curse, /door, /dsb, /hide, /longmode, /mute, /nick, /pullall, /ssb, /uncurse, /unmute, /weather"
  },
  {
    id: 6,
    name: "Moderator - Ingame",
    price: 50000,
    features: "Role: Cheater, VIP\nIn-game name color: Purple\nCommands: /find, /g, /info, /invis, /magic, /nuke, /snuke, /summon, /togglemods"
  },
  {
    id: 7,
    name: "VIP + Cheater Role",
    price: 25000,
    features: "Role: Cheater, VIP\nIn-game name color: White\nCommands: /rainbow, /tpclick, /v, /valentine, /vsb"
  }
];

// ============================================================
// STATE
// ============================================================
let selectedItem = null;
let orderTimer = null;
let timeLeft = 86400;
let currentUser = null;
let proofFile = null;
let currentOrderId = null;
let supabaseReady = false;
let supabaseClient = null;

// ============================================================
// DOM REFS
// ============================================================
const itemsGrid = document.getElementById('itemsGrid');
const orderBtn = document.getElementById('orderBtn');
const selectedItemDiv = document.getElementById('selectedItem');
const selectedName = document.getElementById('selectedName');
const selectedPrice = document.getElementById('selectedPrice');
const qrisContainer = document.getElementById('qrisContainer');
const qrisImage = document.getElementById('qrisImage');
const timerDisplay = document.getElementById('timer');
const orderStatus = document.getElementById('orderStatus');
const growIdInput = document.getElementById('growId');
const worldNameInput = document.getElementById('worldName');
const emailUserInput = document.getElementById('emailUser');
const proofImage = document.getElementById('proofImage');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const loading = document.getElementById('loading');
const uploadSection = document.getElementById('uploadSection');
const submitProofBtn = document.getElementById('submitProofBtn');

// ============================================================
// FUNCTIONS
// ============================================================
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('show');
  }
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function startTimer() {
  if (orderTimer) clearInterval(orderTimer);
  orderTimer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(orderTimer);
      orderTimer = null;
      timerDisplay.textContent = '⏰ Waktu habis!';
      orderStatus.textContent = '❌ Pesanan kadaluarsa - Pesan ulang';
      orderStatus.style.color = '#ef4444';
      return;
    }
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    timerDisplay.textContent = `⏳ ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, 1000);
}

// ============================================================
// HIDE LOADING
// ============================================================
function hideLoading() {
  if (loading) {
    loading.classList.add('hidden');
  }
}
setTimeout(hideLoading, 3000);

// ============================================================
// SUPABASE INIT
// ============================================================
function initSupabase() {
  try {
    if (typeof window.supabase !== 'undefined') {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      supabaseReady = true;
      console.log('✅ Supabase connected!');
      // Auto-check auth after init
      checkAuthStatus();
      restoreOrderState();
    } else {
      console.warn('⚠️ Supabase library not loaded!');
      // Retry after 1s
      setTimeout(initSupabase, 1000);
    }
  } catch (e) {
    console.error('❌ Supabase error:', e);
    setTimeout(initSupabase, 2000);
  }
}

// ============================================================
// AUTH SYSTEM
// ============================================================
async function checkAuthStatus() {
  if (!supabaseReady || !supabaseClient) {
    return false;
  }
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
      currentUser = user;
      document.getElementById('notLoggedIn').style.display = 'none';
      document.getElementById('loggedIn').style.display = 'flex';
      document.getElementById('userNameDisplay').textContent = user.email.split('@')[0];
      return true;
    } else {
      currentUser = null;
      document.getElementById('notLoggedIn').style.display = 'flex';
      document.getElementById('loggedIn').style.display = 'none';
      return false;
    }
  } catch (e) {
    console.error('Auth error:', e);
    return false;
  }
}

async function handleRegister() {
  if (!supabaseReady) {
    alert('⚠️ Database belum siap. Coba refresh halaman.');
    return;
  }
  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('registerConfirm').value;

  if (!username || !email || !password || !confirm) {
    alert('Semua field harus diisi!');
    return;
  }
  if (password.length < 6) {
    alert('Password minimal 6 karakter!');
    return;
  }
  if (password !== confirm) {
    alert('Password dan konfirmasi tidak sama!');
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: { data: { username: username } }
    });

    if (error) {
      alert('❌ ' + error.message);
    } else {
      alert('✅ Registrasi berhasil! Silakan login.');
      closeModal('registerModal');
      openModal('loginModal');
    }
  } catch (e) {
    alert('❌ Error: ' + e.message);
  }
}

async function handleLogin() {
  if (!supabaseReady) {
    alert('⚠️ Database belum siap. Coba refresh halaman.');
    return;
  }
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Isi email dan password!');
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert('❌ ' + error.message);
    } else {
      closeModal('loginModal');
      location.reload();
    }
  } catch (e) {
    alert('❌ Error: ' + e.message);
  }
}

async function handleLogout() {
  if (supabaseReady && supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  location.reload();
}

function requireAuth() {
  if (!currentUser) {
    alert('⚠️ Silakan login terlebih dahulu!');
    openModal('loginModal');
    return false;
  }
  return true;
}

// ============================================================
// RENDER ITEMS
// ============================================================
function renderItems() {
  if (!itemsGrid) return;
  itemsGrid.innerHTML = items.map(item => `
    <div class="item-card ${selectedItem?.id === item.id ? 'selected' : ''}" data-id="${item.id}">
      <div class="item-body">
        <h3>${item.name}</h3>
        <div class="price">${formatRupiah(item.price)}</div>
        <div class="features">${item.features.replace(/\n/g, '<br>')}</div>
        ${item.stock ? `<div class="stock">Stok: ${item.stock}</div>` : ''}
        ${selectedItem?.id === item.id ? '<div class="selected-badge">✓ Dipilih</div>' : ''}
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const item = items.find(i => i.id === id);
      selectItem(item);
    });
  });
}

function selectItem(item) {
  selectedItem = item;
  renderItems();
  updateCheckout();
}

function updateCheckout() {
  if (selectedItem) {
    selectedItemDiv.style.display = 'block';
    selectedName.textContent = selectedItem.name;
    selectedPrice.textContent = formatRupiah(selectedItem.price);
    orderBtn.textContent = '📦 Pesan Sekarang';
    uploadSection.style.display = 'none';
    submitProofBtn.style.display = 'none';
    orderBtn.disabled = !(growIdInput.value.trim() && worldNameInput.value.trim() && emailUserInput.value.trim());
    qrisContainer.style.display = 'none';
  } else {
    selectedItemDiv.style.display = 'none';
    qrisContainer.style.display = 'none';
    uploadSection.style.display = 'none';
    submitProofBtn.style.display = 'none';
    orderBtn.textContent = 'Pilih item dulu';
    orderBtn.disabled = true;
  }
}

proofImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    proofFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewContainer.style.display = 'block';
      imagePreview.src = ev.target.result;
      submitProofBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// ============================================================
// PLACE ORDER
// ============================================================
async function placeOrder() {
  if (!requireAuth()) return;
  if (!supabaseReady) {
    alert('⚠️ Database belum siap. Coba refresh halaman.');
    return;
  }
  if (!selectedItem) {
    alert('Pilih item dulu!');
    return;
  }
  if (!growIdInput.value.trim() || !worldNameInput.value.trim() || !emailUserInput.value.trim()) {
    alert('Isi semua data!');
    return;
  }

  let proofUrl = null;
  if (proofFile) {
    try {
      proofUrl = await fileToBase64(proofFile);
    } catch (e) {
      console.error('Gagal konversi gambar:', e);
    }
  }

  const orderData = {
    item: selectedItem.name,
    price: formatRupiah(selectedItem.price),
    growId: growIdInput.value.trim(),
    worldName: worldNameInput.value.trim(),
    email: emailUserInput.value.trim(),
    uid: currentUser.id,
    username: currentUser.email.split('@')[0],
    timestamp: Date.now(),
    status: 'pending',
    proofUrl: proofUrl || null
  };

  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .insert([orderData])
      .select();

    if (error) {
      alert('❌ Gagal menyimpan pesanan: ' + error.message);
      return;
    }

    if (data && data.length > 0) {
      currentOrderId = data[0].id;
      localStorage.setItem('currentOrderId', currentOrderId);
      
      qrisContainer.style.display = 'block';
      qrisImage.src = 'img/qris.png';
      qrisImage.onerror = () => { qrisImage.style.display = 'none'; };
      orderStatus.textContent = '⏳ Menunggu pembayaran...';
      orderStatus.style.color = '#f59e0b';
      uploadSection.style.display = 'block';
      submitProofBtn.style.display = 'none';
      orderBtn.textContent = '✅ Pesanan Dibuat';
      orderBtn.disabled = true;
      timeLeft = 86400;
      startTimer();

      // Subscribe ke perubahan status order
      const channel = supabaseClient
        .channel('order-' + currentOrderId)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: 'id=eq.' + currentOrderId
        }, payload => {
          const order = payload.new;
          if (order.status === 'success') {
            orderStatus.textContent = '✅ Pembayaran dikonfirmasi! Role akan segera dikirim.';
            orderStatus.style.color = '#22c55e';
            if (orderTimer) { clearInterval(orderTimer); orderTimer = null; }
            timerDisplay.textContent = '✅ Pesanan Selesai!';
            orderBtn.textContent = '✅ Selesai';
            orderBtn.disabled = true;
            submitProofBtn.style.display = 'none';
          } else if (order.status === 'rejected') {
            orderStatus.textContent = '❌ Pesanan ditolak. Silakan hubungi admin.';
            orderStatus.style.color = '#ef4444';
            if (orderTimer) { clearInterval(orderTimer); orderTimer = null; }
            timerDisplay.textContent = '❌ Ditolak';
            orderBtn.textContent = '❌ Ditolak';
            orderBtn.disabled = true;
            submitProofBtn.style.display = 'none';
          }
        })
        .subscribe();
    }
  } catch (e) {
    alert('❌ Error: ' + e.message);
  }
}

// ============================================================
// SUBMIT PROOF
// ============================================================
async function submitProof() {
  if (!proofFile) {
    alert('Upload bukti transfer dulu!');
    return;
  }
  if (!currentOrderId) {
    alert('Tidak ada pesanan aktif!');
    return;
  }
  if (!supabaseReady) {
    alert('⚠️ Database belum siap. Coba refresh halaman.');
    return;
  }

  try {
    const proofUrl = await fileToBase64(proofFile);
    const { error } = await supabaseClient
      .from('orders')
      .update({ proofUrl: proofUrl, proofUploaded: Date.now() })
      .eq('id', currentOrderId);

    if (error) {
      alert('❌ Gagal upload bukti: ' + error.message);
    } else {
      alert('✅ Bukti berhasil dikirim! Tunggu verifikasi admin.');
      submitProofBtn.style.display = 'none';
      submitProofBtn.textContent = '✅ Terkirim!';
      submitProofBtn.disabled = true;
    }
  } catch (error) {
    alert('❌ Gagal upload bukti: ' + error.message);
  }
}

// ============================================================
// RESTORE ORDER STATE
// ============================================================
async function restoreOrderState() {
  if (!supabaseReady || !supabaseClient) return;
  
  const savedOrderId = localStorage.getItem('currentOrderId');
  if (!savedOrderId) return;

  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', savedOrderId)
      .single();

    if (error || !data) return;

    if (data.status === 'pending') {
      const item = items.find(i => i.name === data.item);
      if (item) {
        selectedItem = item;
        renderItems();
        growIdInput.value = data.growId || '';
        worldNameInput.value = data.worldName || '';
        emailUserInput.value = data.email || '';
        qrisContainer.style.display = 'block';
        qrisImage.src = 'img/qris.png';
        qrisImage.onerror = () => { qrisImage.style.display = 'none'; };
        orderStatus.textContent = '⏳ Menunggu pembayaran...';
        orderStatus.style.color = '#f59e0b';
        uploadSection.style.display = 'block';
        submitProofBtn.style.display = 'none';
        orderBtn.textContent = '✅ Pesanan Dibuat';
        orderBtn.disabled = true;
        startTimer();
      }
    } else if (data.status === 'success') {
      qrisContainer.style.display = 'block';
      orderStatus.textContent = '✅ Pembayaran dikonfirmasi! Role akan segera dikirim.';
      orderStatus.style.color = '#22c55e';
      timerDisplay.textContent = '✅ Pesanan Selesai!';
      orderBtn.textContent = '✅ Selesai';
      orderBtn.disabled = true;
      submitProofBtn.style.display = 'none';
    } else if (data.status === 'rejected') {
      qrisContainer.style.display = 'block';
      orderStatus.textContent = '❌ Pesanan ditolak. Silakan hubungi admin.';
      orderStatus.style.color = '#ef4444';
      timerDisplay.textContent = '❌ Ditolak';
      orderBtn.textContent = '❌ Ditolak';
      orderBtn.disabled = true;
      submitProofBtn.style.display = 'none';
    }
  } catch (e) {
    console.error('Restore error:', e);
  }
}

// ============================================================
// EVENTS
// ============================================================
if (growIdInput) growIdInput.addEventListener('input', updateCheckout);
if (worldNameInput) worldNameInput.addEventListener('input', updateCheckout);
if (emailUserInput) emailUserInput.addEventListener('input', updateCheckout);
if (orderBtn) orderBtn.addEventListener('click', placeOrder);
if (submitProofBtn) submitProofBtn.addEventListener('click', submitProof);

// ============================================================
// INIT
// ============================================================
// Loading pasti hilang (fallback)
setTimeout(hideLoading, 2000);

// Init Supabase
initSupabase();

// Render items
renderItems();
updateCheckout();
