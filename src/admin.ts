import './index.css';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase 配置 - 从环境变量获取
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'shunxi2024';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// 密码验证
let isAuthenticated = false;

function checkAuth(): boolean {
  if (isAuthenticated) return true;
  
  const stored = sessionStorage.getItem('admin_auth');
  if (stored === 'true') {
    isAuthenticated = true;
    return true;
  }
  return false;
}

function showLoginForm() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        <div class="text-center mb-6">
          <div class="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p class="text-gray-500 mt-2">Enter password to access admin panel</p>
        </div>
        <form onsubmit="handleLogin(event)" class="space-y-4">
          <input 
            type="password" 
            id="login-password" 
            placeholder="Password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            required
          />
          <p id="login-error" class="text-red-500 text-sm hidden">Incorrect password. Please try again.</p>
          <button type="submit" class="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium">
            Login
          </button>
        </form>
        <p class="text-center mt-6">
          <a href="/" class="text-gray-500 hover:text-gray-700">← Back to website</a>
        </p>
      </div>
    </div>
  `;
}

(window as any).handleLogin = (e: Event) => {
  e.preventDefault();
  const input = document.getElementById('login-password') as HTMLInputElement;
  const error = document.getElementById('login-error');
  
  if (input.value === adminPassword) {
    sessionStorage.setItem('admin_auth', 'true');
    isAuthenticated = true;
    loadData();
  } else {
    if (error) {
      error.classList.remove('hidden');
    }
    input.value = '';
    input.focus();
  }
};

(window as any).handleLogout = () => {
  sessionStorage.removeItem('admin_auth');
  isAuthenticated = false;
  showLoginForm();
};

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  created_at?: string;
  updated_at?: string;
}

interface Company {
  id: number;
  name: string;
  slogan: string;
  description: string;
  email: string;
  whatsapp: string;
  updated_at?: string;
}

let currentProducts: Product[] = [];
let currentCompany: Company | null = null;
let editingProduct: Product | null = null;
let isEditingCompany = false;

// 访问统计接口
interface VisitStats {
  total: number;
  today: number;
  week: number;
  month: number;
  byPage: { page_path: string; count: number }[];
  byDevice: { device_type: string; count: number }[];
  recentVisits: { page_path: string; created_at: string; device_type: string }[];
}

let visitStats: VisitStats | null = null;

async function loadData() {
  // 检查登录状态
  if (!checkAuth()) {
    showLoginForm();
    return;
  }

  // 加载产品
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (productsError) {
    console.error('Error loading products:', productsError);
  } else {
    currentProducts = products || [];
  }

  // 加载公司信息
  const { data: company, error: companyError } = await supabase
    .from('company')
    .select('*')
    .limit(1)
    .single();

  if (companyError) {
    console.error('Error loading company:', companyError);
  } else {
    currentCompany = company;
  }

  // 加载访问统计
  await loadVisitStats();

  render();
}

// 加载访问统计
async function loadVisitStats() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // 总访问量
    const { count: total } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true });

    // 今日访问
    const { count: today } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart);

    // 本周访问
    const { count: week } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo);

    // 本月访问
    const { count: month } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo);

    // 按页面分组
    const { data: pageVisits } = await supabase
      .from('page_visits')
      .select('page_path');

    const pageCount: Record<string, number> = {};
    (pageVisits || []).forEach(v => {
      pageCount[v.page_path] = (pageCount[v.page_path] || 0) + 1;
    });
    const byPage = Object.entries(pageCount)
      .map(([page_path, count]) => ({ page_path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 按设备类型分组
    const { data: deviceVisits } = await supabase
      .from('page_visits')
      .select('device_type');

    const deviceCount: Record<string, number> = {};
    (deviceVisits || []).forEach(v => {
      deviceCount[v.device_type || 'Unknown'] = (deviceCount[v.device_type || 'Unknown'] || 0) + 1;
    });
    const byDevice = Object.entries(deviceCount)
      .map(([device_type, count]) => ({ device_type, count }))
      .sort((a, b) => b.count - a.count);

    // 最近访问
    const { data: recentVisits } = await supabase
      .from('page_visits')
      .select('page_path, created_at, device_type')
      .order('created_at', { ascending: false })
      .limit(10);

    visitStats = {
      total: total || 0,
      today: today || 0,
      week: week || 0,
      month: month || 0,
      byPage,
      byDevice,
      recentVisits: recentVisits || [],
    };
  } catch (error) {
    console.error('Error loading visit stats:', error);
    visitStats = null;
  }
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-gray-900 text-white py-4 px-6 shadow-lg">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold">Admin Panel</h1>
          <div class="flex items-center gap-4">
            <a href="/" class="text-gray-300 hover:text-white transition-colors">View Website</a>
            <button onclick="handleLogout()" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-8 px-6">
        <!-- Visit Statistics Section -->
        <section class="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Visit Statistics</h2>
          ${visitStats ? `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
                <p class="text-blue-100 text-sm">Total Visits</p>
                <p class="text-3xl font-bold">${visitStats.total}</p>
              </div>
              <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4">
                <p class="text-green-100 text-sm">Today</p>
                <p class="text-3xl font-bold">${visitStats.today}</p>
              </div>
              <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
                <p class="text-purple-100 text-sm">This Week</p>
                <p class="text-3xl font-bold">${visitStats.week}</p>
              </div>
              <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4">
                <p class="text-orange-100 text-sm">This Month</p>
                <p class="text-3xl font-bold">${visitStats.month}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-3 gap-6">
              <!-- Top Pages -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Top Pages</h3>
                <div class="space-y-2">
                  ${visitStats.byPage.length > 0 ? visitStats.byPage.map(p => `
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-gray-600 truncate max-w-[150px]">${p.page_path || '/'}</span>
                      <span class="font-medium text-gray-900">${p.count}</span>
                    </div>
                  `).join('') : '<p class="text-gray-500 text-sm">No data yet</p>'}
                </div>
              </div>
              <!-- Device Types -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Device Types</h3>
                <div class="space-y-2">
                  ${visitStats.byDevice.length > 0 ? visitStats.byDevice.map(d => `
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-gray-600">${d.device_type}</span>
                      <span class="font-medium text-gray-900">${d.count}</span>
                    </div>
                  `).join('') : '<p class="text-gray-500 text-sm">No data yet</p>'}
                </div>
              </div>
              <!-- Recent Visits -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Recent Visits</h3>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  ${visitStats.recentVisits.length > 0 ? visitStats.recentVisits.map(v => `
                    <div class="text-sm">
                      <span class="text-gray-600 truncate max-w-[100px] inline-block">${v.page_path || '/'}</span>
                      <span class="text-gray-400 text-xs ml-2">${new Date(v.created_at).toLocaleString()}</span>
                    </div>
                  `).join('') : '<p class="text-gray-500 text-sm">No visits yet</p>'}
                </div>
              </div>
            </div>
          ` : `
            <p class="text-gray-500">Loading statistics...</p>
          `}
        </section>

        <!-- Company Info Section -->
        <section class="bg-white rounded-xl shadow-md p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Company Information</h2>
            ${!isEditingCompany ? `
              <button onclick="startEditCompany()" class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Edit
              </button>
            ` : ''}
          </div>
          ${currentCompany && !isEditingCompany ? `
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">Company Name</label>
                <p class="text-lg font-medium">${currentCompany.name}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Slogan</label>
                <p class="text-lg">${currentCompany.slogan}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Email</label>
                <p class="text-lg">${currentCompany.email}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">WhatsApp</label>
                <p class="text-lg">${currentCompany.whatsapp}</p>
              </div>
              <div class="md:col-span-2">
                <label class="text-sm text-gray-500">Description</label>
                <p class="text-base">${currentCompany.description}</p>
              </div>
            </div>
          ` : isEditingCompany ? `
            <form onsubmit="saveCompany(event)" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" name="name" value="${currentCompany?.name || ''}" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                  <input type="text" name="slogan" value="${currentCompany?.slogan || ''}" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value="${currentCompany?.email || ''}" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input type="text" name="whatsapp" value="${currentCompany?.whatsapp || ''}" required
                    placeholder="+8612345678901"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows="3" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent">${currentCompany?.description || ''}</textarea>
              </div>
              <div class="flex gap-3">
                <button type="submit" class="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  Save Changes
                </button>
                <button type="button" onclick="cancelEditCompany()" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          ` : '<p class="text-gray-500">No company information found.</p>'}
        </section>

        <!-- Products Section -->
        <section class="bg-white rounded-xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Products (${currentProducts.length})</h2>
            <button onclick="showAddProduct()" class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              + Add Product
            </button>
          </div>

          <!-- Add/Edit Product Form -->
          <div id="product-form" class="hidden mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="text-lg font-semibold mb-4" id="form-title">Add New Product</h3>
            <form onsubmit="saveProduct(event)" class="space-y-4">
              <input type="hidden" name="id" value="" />
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" name="name" id="product-name" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="text" name="price" id="product-price" required placeholder="$99.00"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" name="image" id="product-image" required
                  placeholder="https://example.com/image.jpg"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" id="product-description" rows="3" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"></textarea>
              </div>
              <div class="flex gap-3">
                <button type="submit" class="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  Save Product
                </button>
                <button type="button" onclick="hideProductForm()" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Products List -->
          <div class="space-y-4">
            ${currentProducts.length === 0 ? `
              <p class="text-gray-500 text-center py-8">No products yet. Click "Add Product" to get started.</p>
            ` : currentProducts.map(product => `
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <img src="${product.image}" alt="${product.name}"
                  class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  onerror="this.src='https://via.placeholder.com/80'" />
                <div class="flex-grow min-w-0">
                  <h3 class="font-semibold text-gray-900 truncate">${product.name}</h3>
                  <p class="text-sm text-gray-600 truncate">${product.description}</p>
                  <p class="text-lg font-bold text-gray-900 mt-1">${product.price}</p>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                  <button onclick="editProduct(${product.id})"
                    class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    Edit
                  </button>
                  <button onclick="deleteProduct(${product.id})"
                    class="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                    Delete
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </main>
    </div>
  `;
}

// Company functions
(window as any).startEditCompany = () => {
  isEditingCompany = true;
  render();
};

(window as any).cancelEditCompany = () => {
  isEditingCompany = false;
  render();
};

(window as any).saveCompany = async (e: Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);

  const data = {
    name: formData.get('name') as string,
    slogan: formData.get('slogan') as string,
    description: formData.get('description') as string,
    email: formData.get('email') as string,
    whatsapp: formData.get('whatsapp') as string,
    updated_at: new Date().toISOString(),
  };

  if (currentCompany?.id) {
    const { error } = await supabase
      .from('company')
      .update(data)
      .eq('id', currentCompany.id);

    if (error) {
      alert('Error updating company: ' + error.message);
      return;
    }
  } else {
    const { error } = await supabase
      .from('company')
      .insert(data);

    if (error) {
      alert('Error creating company: ' + error.message);
      return;
    }
  }

  isEditingCompany = false;
  await loadData();
  alert('Company information saved!');
};

// Product functions
(window as any).showAddProduct = () => {
  editingProduct = null;
  const form = document.getElementById('product-form');
  const title = document.getElementById('form-title');
  if (form && title) {
    form.classList.remove('hidden');
    title.textContent = 'Add New Product';
  }
  // Clear form
  (document.getElementById('product-name') as HTMLInputElement).value = '';
  (document.getElementById('product-price') as HTMLInputElement).value = '';
  (document.getElementById('product-image') as HTMLInputElement).value = '';
  (document.getElementById('product-description') as HTMLTextAreaElement).value = '';
};

(window as any).hideProductForm = () => {
  const form = document.getElementById('product-form');
  if (form) {
    form.classList.add('hidden');
  }
  editingProduct = null;
};

(window as any).editProduct = (id: number) => {
  editingProduct = currentProducts.find(p => p.id === id) || null;
  if (!editingProduct) return;

  const form = document.getElementById('product-form');
  const title = document.getElementById('form-title');
  if (form && title) {
    form.classList.remove('hidden');
    title.textContent = 'Edit Product';
  }

  (document.getElementById('product-name') as HTMLInputElement).value = editingProduct.name;
  (document.getElementById('product-price') as HTMLInputElement).value = editingProduct.price;
  (document.getElementById('product-image') as HTMLInputElement).value = editingProduct.image;
  (document.getElementById('product-description') as HTMLTextAreaElement).value = editingProduct.description;
};

(window as any).saveProduct = async (e: Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);

  const data = {
    name: formData.get('name') as string,
    price: formData.get('price') as string,
    image: formData.get('image') as string,
    description: formData.get('description') as string,
    updated_at: new Date().toISOString(),
  };

  if (editingProduct?.id) {
    const { error } = await supabase
      .from('products')
      .update(data)
      .eq('id', editingProduct.id);

    if (error) {
      alert('Error updating product: ' + error.message);
      return;
    }
    alert('Product updated!');
  } else {
    const { error } = await supabase
      .from('products')
      .insert(data);

    if (error) {
      alert('Error adding product: ' + error.message);
      return;
    }
    alert('Product added!');
  }

  (window as any).hideProductForm();
  await loadData();
};

(window as any).deleteProduct = async (id: number) => {
  if (!confirm('Are you sure you want to delete this product?')) return;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Error deleting product: ' + error.message);
    return;
  }

  alert('Product deleted!');
  await loadData();
};

// Initialize
loadData();
