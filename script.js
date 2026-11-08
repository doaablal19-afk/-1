// منصة خيرنا - تعمل البيانات محلياً داخل المتصفح
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'khairunaDonations';

function getDonations(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveDonations(items){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const menuBtn = $('menuBtn');
if(menuBtn) menuBtn.addEventListener('click', () => {
  const nav = document.querySelector('nav');
  if(nav) nav.classList.toggle('open');
});

function updateStats(){
  const items = getDonations();
  const count = $('donorCount'), total = $('totalAmount');
  if(count) count.textContent = items.length;
  if(total) total.textContent = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function renderDonations(){
  const body = $('donationRows');
  if(!body) return;
  const items = getDonations();
  body.innerHTML = '';
  
  if(items.length === 0) {
    const emptyState = $('emptyState');
    if(emptyState) emptyState.style.display = 'block';
    updateStats();
    return;
  }

  const emptyState = $('emptyState');
  if(emptyState) emptyState.style.display = 'none';

  items.slice().reverse().forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${Number(item.amount).toLocaleString()} جنيه</td>
      <td>${item.type || 'تبرع عام'}</td>
      <td>${item.date || '-'}</td>
    `;
    body.appendChild(row);
  });
  updateStats();
}

const donationForm = $('donationForm');
if(donationForm){
  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('donorName').value.trim();
    const amount = $('donorAmount').value.trim();
    const type = $('donationType') ? $('donationType').value : 'تبرع عام';

    if(!name || !amount) return;

    const items = getDonations();
    items.push({
      name,
      amount,
      type,
      date: new Date().toLocaleDateString('ar-EG')
    });
    
    saveDonations(items);
    donationForm.reset();
    
    const msg = $('successMessage');
    if(msg) {
      msg.textContent = 'تم تسجيل تبرعك بنجاح. شكراً لك!';
      setTimeout(() => msg.textContent = '', 4000);
    }
    renderDonations();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDonations();
});
