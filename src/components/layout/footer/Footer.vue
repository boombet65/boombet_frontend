<!-- components/layout/Footer.vue -->
<template>
  <footer class="bg-slate-950 border-t border-cyan-800/20 mb-10">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <!-- Top Section - Brand & Links -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        <!-- Brand -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <span class="text-xl font-black text-white">BOOM</span>
              <span class="text-xl font-black text-cyan-400">BET</span>
              <span class="text-xs text-cyan-500 block -mt-1">365.com</span>
            </div>
          </div>
          <p class="text-cyan-600 text-sm leading-relaxed max-w-xs">
            Your trusted sports betting platform with real-time odds, instant payouts, and 24/7 customer support.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Sports</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Football</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Basketball</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Tennis</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Live Betting</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Promotions</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Welcome Bonus</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Daily Offers</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">VIP Club</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Refer a Friend</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Support</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Help Center</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">FAQ</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Contact Us</a></li>
            <li><a href="#" class="text-cyan-500 hover:text-cyan-300 text-sm transition-colors">Responsible Gambling</a></li>
          </ul>
        </div>

        <!-- Contact & Social -->
        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Get in Touch</h4>
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-cyan-500 text-sm">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span>support@boombet365.com</span>
            </div>
            <div class="flex items-center gap-2 text-cyan-500 text-sm">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span>+255 700 000 000</span>
            </div>
            <div class="flex gap-3 pt-2">
              <a href="#" class="p-2 rounded-lg bg-slate-800 border border-cyan-800/20 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="p-2 rounded-lg bg-slate-800 border border-cyan-800/20 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" class="p-2 rounded-lg bg-slate-800 border border-cyan-800/20 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500 transition-all">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust & Legitimacy Section - Kama Betpawa -->
      <div class="mt-12 pt-8 border-t border-cyan-800/20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Licensed & Regulated -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <h5 class="text-white font-bold text-sm">Licensed & Regulated</h5>
              <p class="text-cyan-600 text-xs mt-1">Fully licensed and regulated by the Tanzania Gaming Board. Operating under the Gaming Act of 2003.</p>
            </div>
          </div>

          <!-- Secure & Trusted -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div>
              <h5 class="text-white font-bold text-sm">Secure & Trusted</h5>
              <p class="text-cyan-600 text-xs mt-1">256-bit SSL encryption protects all transactions. Your data is safe with us.</p>
            </div>
          </div>

          <!-- Responsible Gambling -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h5 class="text-white font-bold text-sm">Responsible Gambling</h5>
              <p class="text-cyan-600 text-xs mt-1">We promote responsible gambling. Set limits and play responsibly. 18+ only.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Disclaimer - Important for legitimacy -->
      <div class="mt-6 pt-6 border-t border-cyan-800/10">
        <p class="text-cyan-700 text-[11px] leading-relaxed text-center">
          <strong class="text-cyan-500">Disclaimer:</strong> Boombet365.com is operated by Boombet Gaming Ltd, 
          a company registered in Tanzania with registration number 123456789. 
          All rights reserved. Gambling can be addictive. Please play responsibly. 
          For help and support, contact the Tanzania Gaming Board or visit 
          <a href="#" class="text-cyan-400 hover:text-cyan-300 underline">www.responsiblegambling.go.tz</a>
        </p>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-6 pt-6 border-t border-cyan-800/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-cyan-700 text-xs">
          &copy; {{ new Date().getFullYear() }} Boombet365.com. All rights reserved.
        </p>
        
        <div class="flex flex-wrap items-center gap-4 md:gap-6 justify-center">
          <a href="#" class="text-cyan-600 hover:text-cyan-400 text-xs transition-colors">Privacy Policy</a>
          <a href="#" class="text-cyan-600 hover:text-cyan-400 text-xs transition-colors">Terms & Conditions</a>
          <a href="#" class="text-cyan-600 hover:text-cyan-400 text-xs transition-colors">Cookie Policy</a>
          <a href="#" class="text-cyan-600 hover:text-cyan-400 text-xs transition-colors">AML Policy</a>
          
          <!-- Trust Badges -->
          <div class="flex items-center gap-2">
            <span class="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-[10px] font-bold flex items-center gap-1">
              <span>✓</span> Licensed
            </span>
            <span class="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-[10px] font-bold flex items-center gap-1">
              🔒 SSL Secure
            </span>
            <span class="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-[10px] font-bold">
              18+
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No additional logic needed
</script>

<style scoped>
/* Smooth transitions for hover effects */
</style>