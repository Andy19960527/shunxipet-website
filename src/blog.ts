import './index.css';
import blogData from './data/blog.json';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

async function initBlog(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  // Check if viewing a single post
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('post');

  if (slug) {
    renderSinglePost(app, slug);
  } else {
    renderBlogList(app);
  }
}

function renderBlogList(app: HTMLElement): void {
  const posts: BlogPost[] = blogData;

  app.innerHTML = `
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" class="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
          SHUNXI PET
        </a>
        <div class="flex items-center gap-6">
          <a href="/" class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Home</a>
          <span class="text-gray-900 font-medium text-sm">Blog</span>
          <a href="/admin.html" class="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Admin
          </a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-24 pb-12 px-4 bg-gray-50">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p class="text-lg text-gray-600">Pet care tips, industry insights, and product guides</p>
      </div>
    </section>

    <!-- Blog Posts -->
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-8">
          ${posts.map(post => `
            <article class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <a href="/blog.html?post=${post.slug}" class="block">
                <div class="aspect-video overflow-hidden">
                  <img 
                    src="${post.image}" 
                    alt="${post.title}"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="p-6">
                  <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>${formatDate(post.date)}</span>
                    <span>•</span>
                    <span>${post.author}</span>
                  </div>
                  <h2 class="text-xl font-bold text-gray-900 mb-3 hover:text-gray-600 transition-colors">
                    ${post.title}
                  </h2>
                  <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    ${post.excerpt}
                  </p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    ${post.tags.map(tag => `
                      <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        #${tag}
                      </span>
                    `).join('')}
                  </div>
                </div>
              </a>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-4 bg-gray-900 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-gray-400 text-sm">
          © 2026 Jinhua Shunxi Pet Products. All rights reserved.
        </p>
      </div>
    </footer>
  `;
}

function renderSinglePost(app: HTMLElement, slug: string): void {
  const post = blogData.find(p => p.slug === slug);

  if (!post) {
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <a href="/blog.html" class="text-blue-600 hover:underline">← Back to Blog</a>
        </div>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" class="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
          SHUNXI PET
        </a>
        <div class="flex items-center gap-6">
          <a href="/" class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Home</a>
          <a href="/blog.html" class="text-gray-900 font-medium text-sm">Blog</a>
          <a href="/admin.html" class="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Admin
          </a>
        </div>
      </div>
    </nav>

    <!-- Article -->
    <article class="pt-24 pb-16 px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <header class="mb-8">
          <a href="/blog.html" class="text-gray-500 hover:text-gray-700 text-sm mb-4 inline-block">
            ← Back to Blog
          </a>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ${post.title}
          </h1>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>${formatDate(post.date)}</span>
            <span>•</span>
            <span>${post.author}</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            ${post.tags.map(tag => `
              <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                #${tag}
              </span>
            `).join('')}
          </div>
        </header>

        <!-- Featured Image -->
        <div class="aspect-video rounded-2xl overflow-hidden mb-8">
          <img 
            src="${post.image}" 
            alt="${post.title}"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div class="text-gray-700 leading-relaxed space-y-4">
            ${post.content}
          </div>
        </div>

        <!-- Share -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Share this article</h3>
          <div class="flex gap-4">
            <a 
              href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}"
              target="_blank"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Twitter
            </a>
            <a 
              href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}"
              target="_blank"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Facebook
            </a>
            <a 
              href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}"
              target="_blank"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 class="text-xl font-bold text-gray-900 mb-2">Interested in Our Products?</h3>
          <p class="text-gray-600 mb-4">Contact us for wholesale pricing and custom branding options.</p>
          <a 
            href="https://wa.me/8615735169721"
            target="_blank"
            class="inline-block bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Contact Us on WhatsApp
          </a>
        </div>
      </div>
    </article>

    <!-- Footer -->
    <footer class="py-8 px-4 bg-gray-900 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-gray-400 text-sm">
          © 2026 Jinhua Shunxi Pet Products. All rights reserved.
        </p>
      </div>
    </footer>
  `;
}

initBlog();
