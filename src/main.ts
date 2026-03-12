import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
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

  if (!app) {
    console.error('App element not found');
    return;
  }

  // 显示加载状态
  app.innerHTML = `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading...</p>
      </div>
    </div>
  `;

  // 从数据库加载数据
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  const { data: companyData, error: companyError } = await supabase
    .from('company')
    .select('*')
    .limit(1)
    .single();

  if (productsError || companyError) {
    console.error('Error loading data:', productsError || companyError);
  }

  const company: Company = companyData || {
    name: 'Jinhua Shunxi',
    slogan: 'Professional Pet Supplies Manufacturer from Jinhua, China',
    description: 'Professional pet supplies manufacturer.',
    email: 'sales1pet@163.com',
    whatsapp: '+8615735169721',
  };

  const productList: Product[] = products || [];

  app.innerHTML = `
    <!-- WhatsApp Floating Button -->
    <a 
      href="https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}" 
      target="_blank"
      class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>

    <!-- Header Banner -->
    <header class="relative min-h-[600px] md:min-h-[700px] flex flex-col overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://coze-coding-project.tos.coze.site/coze_storage_7615892821844951067/image/generate_image_800e7262-9c14-4e9d-9b7e-9c9d2cc27dbb.jpeg?sign=1804763004-5c73299aca-0-930d9aa02ad16a917f0c53723f388c539e6280b89222fc0763e8fed76742d4e2" 
          alt="Dog and owner"
          class="w-full h-full object-cover object-top"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 max-w-6xl mx-auto px-4 flex flex-col items-center pt-4">
        <p class="text-4xl md:text-5xl lg:text-6xl text-white animate-fade-in font-bold uppercase tracking-wide">
          WE LOVE PETS
        </p>
      </div>
      <div class="relative z-10 w-full px-8 md:px-16 lg:px-24 text-right mt-auto pb-20 flex flex-col items-end">
        <p class="text-2xl md:text-3xl lg:text-4xl text-white font-semibold uppercase tracking-wide mb-6">
          WE ARE COMMITTED TO GIVING THEM THE BEST.
        </p>
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white tracking-tight uppercase">
          ${company.name}
        </h1>
        <p class="text-lg md:text-xl text-gray-200 max-w-lg text-right uppercase">
          Professional Pet Supplies Manufacturer
        </p>
      </div>
    </header>

    <!-- Products Section -->
    <section class="py-20 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Our Products
        </h2>
        ${productList.length === 0 ? `
          <p class="text-center text-gray-500 text-lg">Products coming soon...</p>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            ${productList.map(product => `
              <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                <div class="aspect-[4/3] overflow-hidden">
                  <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'"
                  />
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">${product.name}</h3>
                  <p class="text-gray-600 text-sm mb-4 leading-relaxed">${product.description}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold text-gray-900">${product.price}</span>
                    <a 
                      href="https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in ${encodeURIComponent(product.name)}"
                      target="_blank"
                      class="bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Inquiry
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </section>

    <!-- Wholesale Info Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
          <!-- Top Image -->
          <div class="relative h-64 md:h-80">
            <img src="/warehouse.jpg" alt="Warehouse" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8 text-center">
              <p class="text-white text-2xl md:text-3xl font-bold">CONTACT US FOR WHOLESALE PRICING</p>
            </div>
          </div>
          <!-- Advantages -->
          <div class="p-8 md:p-12">
            <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">OUR ADVANTAGES</h3>
            <div class="max-w-2xl mx-auto space-y-5">
              <div class="flex items-start gap-4">
                <div class="bg-gray-900 rounded-full p-2.5 flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <p class="text-gray-700 text-lg">Low MOQ, most items in stock, order from 50 pieces</p>
              </div>
              <div class="flex items-start gap-4">
                <div class="bg-gray-900 rounded-full p-2.5 flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                  </svg>
                </div>
                <p class="text-gray-700 text-lg">Custom colors available based on your Pantone color code</p>
              </div>
              <div class="flex items-start gap-4">
                <div class="bg-gray-900 rounded-full p-2.5 flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                </div>
                <p class="text-gray-700 text-lg">Custom logo with laser engraving, hang tags, etc.</p>
              </div>
              <div class="flex items-start gap-4">
                <div class="bg-gray-900 rounded-full p-2.5 flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  </svg>
                </div>
                <p class="text-gray-700 text-lg">Custom packaging with kraft boxes, color cards, OPP bags, etc.</p>
              </div>
              <div class="flex items-start gap-4">
                <div class="bg-gray-900 rounded-full p-2.5 flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <p class="text-gray-700 text-lg">Stable quality, well-received by customers</p>
              </div>
              <div class="flex items-start gap-4">
                <div class="bg-gray-900 rounded-full p-2.5 flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <p class="text-gray-700 text-lg">Fast delivery, usually within one week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Info Section -->
    <section class="py-20 px-4 bg-white">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-8 text-gray-900">
          About Us
        </h2>
        <div class="text-center space-y-6">
          <p class="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            ${company.description}
          </p>
          <div class="mt-12">
            <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Tuanzi's Growth Diary</h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div class="aspect-square overflow-hidden rounded-xl">
                <img src="/tuanzi-2.jpg" alt="Tuanzi" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div class="aspect-square overflow-hidden rounded-xl">
                <img src="/tuanzi-5.jpg" alt="Tuanzi" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div class="aspect-square overflow-hidden rounded-xl">
                <img src="/tuanzi-4.jpg" alt="Tuanzi" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div class="aspect-square overflow-hidden rounded-xl">
                <img src="/tuanzi-1.jpg" alt="Tuanzi" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div class="aspect-square overflow-hidden rounded-xl">
                <img src="/tuanzi-3.jpg" alt="Tuanzi" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 px-4 bg-gray-900 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-10">
          Contact Us
        </h2>
        <div class="space-y-8">
          <div class="flex items-center justify-center gap-4">
            <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <a href="mailto:${company.email}" class="text-xl md:text-2xl hover:text-gray-300 transition-colors">
              ${company.email}
            </a>
          </div>
          <div class="flex items-center justify-center gap-4">
            <svg class="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <a 
              href="https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}" 
              target="_blank"
              class="text-xl md:text-2xl hover:text-green-400 transition-colors"
            >
              ${company.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-400 py-6 px-4 text-center text-sm">
      <p>&copy; ${new Date().getFullYear()} ${company.name}. All rights reserved.</p>
    </footer>
  `;
}
