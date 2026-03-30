import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  sort_order: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  category_id: number | null;
  sort_order?: number;
}

interface ProductVariant {
  id: number;
  product_id: number;
  color_name: string;
  color_code: string;
  image: string;
}

interface ProductSize {
  id: number;
  product_id: number;
  size_name: string;
  dimensions: string;
  price_adjustment: string;
  sort_order: number;
}

interface Company {
  id: number;
  name: string;
  slogan: string;
  description: string;
  email: string;
  whatsapp: string;
}

export async function initApp(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  // 显示加载状态
  app.innerHTML = `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading...</p>
      </div>
    </div>
  `;

  // 加载数据
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
  const { data: products } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
  const { data: companyData } = await supabase.from('company').select('*').limit(1).single();

  const company: Company = companyData || {
    name: 'Jinhua Shunxi',
    slogan: 'Professional Pet Supplies Manufacturer',
    description: 'Professional pet supplies manufacturer.',
    email: 'sales1pet@163.com',
    whatsapp: '+8615735169721',
  };

  const categoryList: Category[] = categories || [];
  const productList: Product[] = products || [];

  // 检查URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const categorySlug = urlParams.get('category');
  const productId = urlParams.get('product');

  if (productId) {
    // 显示产品详情页
    await renderProductDetailPage(app, parseInt(productId), categoryList, productList, company);
  } else if (categorySlug) {
    // 显示分类页
    renderCategoryPage(app, categorySlug, categoryList, productList, company);
  } else {
    // 显示首页
    renderHomePage(app, categoryList, productList, company);
  }
}

function renderHomePage(app: HTMLElement, categories: Category[], products: Product[], company: Company): void {
  const uncategorizedProducts = products.filter(p => !p.category_id);

  app.innerHTML = `
    ${renderWhatsAppButton(company.whatsapp)}
    
    <!-- Header Banner -->
    <header class="relative min-h-[600px] md:min-h-[700px] flex flex-col overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="/banner.jpg" alt="Dog and owner" class="w-full h-full object-cover object-top" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
      </div>
      <div class="relative z-10 max-w-6xl mx-auto px-4 flex flex-col items-center pt-4">
        <p class="text-4xl md:text-5xl lg:text-6xl text-white animate-fade-in font-bold uppercase tracking-wide">WE LOVE PETS</p>
      </div>
      <div class="relative z-10 w-full px-8 md:px-16 lg:px-24 text-right mt-auto pb-20 flex flex-col items-end">
        <p class="text-2xl md:text-3xl lg:text-4xl text-white font-semibold uppercase tracking-wide mb-6">WE ARE COMMITTED TO GIVING THEM THE BEST.</p>
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white tracking-tight uppercase">${company.name}</h1>
        <p class="text-lg md:text-xl text-gray-200 max-w-lg text-right uppercase">Professional Pet Supplies Manufacturer</p>
      </div>
    </header>

    <!-- Categories Section -->
    <section class="py-20 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16 text-gray-900">Our Products</h2>
        ${categories.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            ${categories.map(category => {
              const productCount = products.filter(p => p.category_id === category.id).length;
              return `
                <a href="/?category=${category.slug}" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer">
                  <div class="aspect-[4/3] overflow-hidden relative">
                    <img src="${category.image}" alt="${category.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 right-4">
                      <p class="text-white text-sm opacity-80">${productCount} products</p>
                    </div>
                  </div>
                  <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">${category.name}</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">${category.description || ''}</p>
                    <div class="mt-4 flex items-center text-gray-900 font-medium text-sm">
                      View Products
                      <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        ` : ''}
        ${uncategorizedProducts.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            ${uncategorizedProducts.map(product => renderProductCard(product, company.whatsapp)).join('')}
          </div>
        ` : ''}
      </div>
    </section>
    ${renderWholesaleSection()}
    ${renderAboutSection(company)}
    ${renderContactSection(company)}
    ${renderBlogCTA()}
    ${renderFooter(company)}
  `;
}

function renderCategoryPage(app: HTMLElement, categorySlug: string, categories: Category[], products: Product[], company: Company): void {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) {
    window.location.href = '/';
    return;
  }

  const categoryProducts = products.filter(p => p.category_id === category.id);

  app.innerHTML = `
    ${renderWhatsAppButton(company.whatsapp)}
    ${renderNavBar(company)}
    
    <!-- Category Hero -->
    <section class="bg-gray-50 py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <a href="/" class="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm mb-4">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Products
        </a>
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <img src="${category.image}" alt="${category.name}" class="w-full h-full object-cover" />
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900">${category.name}</h1>
            <p class="text-gray-600 mt-2">${category.description || ''}</p>
            <p class="text-sm text-gray-500 mt-1">${categoryProducts.length} products</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Products -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        ${categoryProducts.length === 0 ? `
          <p class="text-center text-gray-500 text-lg py-12">No products in this category yet.</p>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            ${categoryProducts.map(product => `
              <a href="/?product=${product.id}" class="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer">
                <div class="aspect-[4/3] overflow-hidden">
                  <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'" />
                </div>
                <div class="p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-600">${product.name}</h3>
                  <p class="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">${product.description}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xl font-bold text-gray-900">${product.price}</span>
                    <span class="text-gray-500 text-sm group-hover:text-gray-900">View Details →</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        `}
      </div>
    </section>
    ${renderContactSection(company)}
    ${renderFooter(company)}
  `;
}

async function renderProductDetailPage(app: HTMLElement, productId: number, categories: Category[], products: Product[], company: Company): Promise<void> {
  const product = products.find(p => p.id === productId);
  if (!product) {
    window.location.href = '/';
    return;
  }

  // 加载产品变体和尺寸
  const { data: variants } = await supabase.from('product_variants').select('*').eq('product_id', productId);
  const { data: sizes } = await supabase.from('product_sizes').select('*').eq('product_id', productId).order('sort_order', { ascending: true });

  const productVariants: ProductVariant[] = variants || [];
  const productSizes: ProductSize[] = sizes || [];

  app.innerHTML = `
    ${renderWhatsAppButton(company.whatsapp)}
    ${renderNavBar(company)}
    
    <!-- Breadcrumb -->
    <div class="bg-gray-50 py-4 px-4">
      <div class="max-w-6xl mx-auto">
        <nav class="flex items-center text-sm text-gray-500">
          <a href="/" class="hover:text-gray-700">Home</a>
          <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          ${product.category_id ? `
            <a href="/?category=${categories.find(c => c.id === product.category_id)?.slug || ''}" class="hover:text-gray-700">${categories.find(c => c.id === product.category_id)?.name || ''}</a>
            <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          ` : ''}
          <span class="text-gray-900">${product.name}</span>
        </nav>
      </div>
    </div>

    <!-- Product Detail -->
    <section class="py-12 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12">
          <!-- Product Images -->
          <div>
            <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img id="main-product-image" src="${(productVariants.length > 0 ? productVariants[0].image : product.image)}?v=20250330" alt="${product.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${product.image}?v=20250330';" />
            </div>
            ${productVariants.length > 1 ? `
              <div class="grid grid-cols-4 gap-3">
                ${productVariants.map((v, i) => `
                  <button onclick="changeVariantImage('${v.image}', this)" class="aspect-square rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-gray-900' : 'border-gray-200'} hover:border-gray-900 transition-colors">
                    <img src="${v.image}?v=20250330" alt="${v.color_name}" class="w-full h-full object-cover" />
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Product Info -->
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${product.name}</h1>
            <p class="text-gray-600 mb-6 leading-relaxed">${product.description}</p>
            
            <div class="mb-6">
              <p class="text-3xl font-bold text-gray-900">${product.price}</p>
              <p class="text-sm text-gray-500 mt-1">Wholesale pricing available</p>
            </div>

            <!-- Color Selection -->
            ${productVariants.length > 0 ? `
              <div class="mb-6">
                <p class="text-sm font-medium text-gray-900 mb-3">Color: <span id="selected-color-name">${productVariants[0].color_name}</span></p>
                <div class="flex flex-wrap gap-3">
                  ${productVariants.map((v, i) => `
                    <button 
                      onclick="selectColor('${v.color_name}', '${v.image}', this)"
                      class="color-btn w-12 h-12 rounded-full border-2 ${i === 0 ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-gray-300'} transition-all hover:scale-110 overflow-hidden"
                      title="${v.color_name}"
                    >
                      <img src="${v.image}?v=20250330" alt="${v.color_name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${v.image}';" />
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Size Selection -->
            ${productSizes.length > 0 ? `
              <div class="mb-6">
                <p class="text-sm font-medium text-gray-900 mb-3">Size: <span id="selected-size-name">${productSizes[0].size_name}</span></p>
                <div class="flex flex-wrap gap-3">
                  ${productSizes.map((s, i) => `
                    <button 
                      onclick="selectSize('${s.size_name}', '${s.dimensions}', this)"
                      class="size-btn px-6 py-3 rounded-lg border-2 ${i === 0 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-900'} transition-all font-medium"
                    >
                      <span class="block text-sm">${s.size_name}</span>
                      <span class="block text-xs ${i === 0 ? 'text-gray-300' : 'text-gray-500'}">${s.dimensions}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Size Chart Table -->
            ${productSizes.length > 0 ? `
              <div class="mb-6 overflow-x-auto">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Size Chart</h3>
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Size</th>
                      <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Dimensions (L×W×H)</th>
                      <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Net Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productSizes.map(s => `
                      <tr class="hover:bg-gray-50">
                        <td class="border border-gray-300 px-4 py-2 font-medium">${s.size_name}</td>
                        <td class="border border-gray-300 px-4 py-2">${s.dimensions}</td>
                        <td class="border border-gray-300 px-4 py-2">${s.price_adjustment || '-'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <p class="text-xs text-gray-500 mt-2">Note: Manual measurements may have slight variations. Please refer to the actual product.</p>
              </div>
            ` : ''}

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <a 
                id="inquiry-btn"
                href="https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}"
                target="_blank"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium transition-colors text-center flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Inquiry on WhatsApp
              </a>
              <a 
                href="mailto:${company.email}?subject=${encodeURIComponent(`Inquiry: ${product.name}`)}"
                class="flex-1 bg-gray-900 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-medium transition-colors text-center"
              >
                Email Inquiry
              </a>
            </div>

            <!-- Product Features -->
            <div class="mt-8 pt-8 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Product Features</h3>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  600D Oxford Fabric - Durable & Water Resistant
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Raised edges for security and comfort
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Machine washable
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Non-slip bottom
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    ${renderContactSection(company)}
    ${renderFooter(company)}
  `;
}

// 辅助函数
function renderProductCard(product: Product, whatsapp: string): string {
  return `
    <a href="/?product=${product.id}" class="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer">
      <div class="aspect-[4/3] overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'" />
      </div>
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-600">${product.name}</h3>
        <p class="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">${product.description}</p>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-gray-900">${product.price}</span>
          <span class="text-gray-500 text-sm group-hover:text-gray-900">View Details →</span>
        </div>
      </div>
    </a>
  `;
}

function renderWhatsAppButton(whatsapp: string): string {
  return `
    <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  `;
}

function renderNavBar(company: Company): string {
  return `
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" class="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">SHUNXI PET</a>
        <div class="flex items-center gap-6">
          <a href="/" class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Home</a>
          <a href="/blog.html" class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Blog</a>
          <a href="https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Contact Us</a>
        </div>
      </div>
    </nav>
  `;
}

function renderWholesaleSection(): string {
  return `
    <section class="py-16 px-4 bg-white">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
          <div class="relative h-64 md:h-80">
            <img src="/warehouse.jpg" alt="Warehouse" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8 text-center">
              <p class="text-white text-2xl md:text-3xl font-bold">CONTACT US FOR WHOLESALE PRICING</p>
            </div>
          </div>
          <div class="p-8 md:p-12">
            <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">OUR ADVANTAGES</h3>
            <div class="max-w-2xl mx-auto space-y-5">
              ${['Low MOQ, most items in stock, order from 50 pieces', 'Custom colors available based on your Pantone color code', 'Custom logo with laser engraving, hang tags, etc.', 'Custom packaging with kraft boxes, color cards, OPP bags, etc.', 'Stable quality, well-received by customers', 'Fast delivery, usually within one week'].map(text => `
                <div class="flex items-start gap-4">
                  <div class="bg-gray-900 rounded-full p-2.5 flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <p class="text-gray-700 text-lg">${text}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAboutSection(company: Company): string {
  return `
    <section class="py-20 px-4 bg-white">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-8 text-gray-900">About Us</h2>
        <div class="text-center space-y-6">
          <p class="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">${company.description}</p>
          <div class="mt-12">
            <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Tuanzi's Growth Diary</h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              ${['tuanzi-2.jpg', 'tuanzi-5.jpg', 'tuanzi-4.jpg', 'tuanzi-1.jpg', 'tuanzi-3.jpg'].map(img => `
                <div class="aspect-square overflow-hidden rounded-xl">
                  <img src="/${img}" alt="Tuanzi" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderContactSection(company: Company): string {
  return `
    <section class="py-20 px-4 bg-gray-900 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-10">Contact Us</h2>
        <div class="space-y-8">
          <div class="flex items-center justify-center gap-4">
            <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <a href="mailto:${company.email}" class="text-xl md:text-2xl hover:text-gray-300 transition-colors">${company.email}</a>
          </div>
          <div class="flex items-center justify-center gap-4">
            <svg class="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <a href="https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="text-xl md:text-2xl hover:text-green-400 transition-colors">${company.whatsapp}</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderBlogCTA(): string {
  return `
    <section class="py-16 px-4 bg-gray-100">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Pet Care Tips & Insights</h2>
        <p class="text-gray-600 mb-6">Check out our blog for helpful guides and industry news</p>
        <a href="/blog.html" class="inline-block bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">Read Our Blog →</a>
      </div>
    </section>
  `;
}

function renderFooter(company: Company): string {
  return `
    <footer class="bg-gray-800 text-gray-400 py-6 px-4 text-center text-sm">
      <p>&copy; ${new Date().getFullYear()} ${company.name}. All rights reserved.</p>
    </footer>
  `;
}

// 全局函数供 onclick 调用
(window as any).changeVariantImage = (imageUrl: string, btn: HTMLElement) => {
  const mainImage = document.getElementById('main-product-image') as HTMLImageElement;
  if (mainImage) mainImage.src = imageUrl;
  
  // 更新缩略图边框
  document.querySelectorAll('.color-btn')?.forEach(b => b.classList.remove('ring-2', 'ring-gray-900', 'ring-offset-2'));
};

(window as any).selectColor = (colorName: string, imageUrl: string, btn: HTMLElement) => {
  // 更新主图
  const mainImage = document.getElementById('main-product-image') as HTMLImageElement;
  if (mainImage) mainImage.src = imageUrl;
  
  // 更新颜色名称
  const colorNameEl = document.getElementById('selected-color-name');
  if (colorNameEl) colorNameEl.textContent = colorName;
  
  // 更新按钮样式
  document.querySelectorAll('.color-btn')?.forEach(b => {
    b.classList.remove('border-gray-900', 'ring-2', 'ring-gray-900', 'ring-offset-2');
    b.classList.add('border-gray-300');
  });
  btn.classList.remove('border-gray-300');
  btn.classList.add('border-gray-900', 'ring-2', 'ring-gray-900', 'ring-offset-2');
};

(window as any).selectSize = (sizeName: string, dimensions: string, btn: HTMLElement) => {
  // 更新尺寸名称
  const sizeNameEl = document.getElementById('selected-size-name');
  if (sizeNameEl) sizeNameEl.textContent = sizeName;
  
  // 更新按钮样式
  document.querySelectorAll('.size-btn')?.forEach(b => {
    b.classList.remove('border-gray-900', 'bg-gray-900', 'text-white');
    b.classList.add('border-gray-300', 'text-gray-700');
    const smallText = b.querySelector('span:last-child');
    if (smallText) smallText.classList.remove('text-gray-300');
    if (smallText) smallText.classList.add('text-gray-500');
  });
  btn.classList.remove('border-gray-300', 'text-gray-700');
  btn.classList.add('border-gray-900', 'bg-gray-900', 'text-white');
  const smallText = btn.querySelector('span:last-child');
  if (smallText) smallText.classList.remove('text-gray-500');
  if (smallText) smallText.classList.add('text-gray-300');
};
