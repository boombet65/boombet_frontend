// router/index.js 
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

// ── Layouts ──────────────────────────────────────────────────────────────────
import DefaultLayout from "../components/layout/DefaultLayout.vue";
import AuthLayout from "../components/layout/AuthLayout.vue";
import AdminLayout from "../components/layout/AdminLayout.vue";

// ── Pages (lazy loaded) ───────────────────────────────────────────────────────
const HomePage = () => import("../pages/home/HomePage.vue");
const LoginPage = () => import("../pages/auth/LoginPage.vue");
const RegisterPage = () => import("../pages/auth/RegisterPage.vue");
const DashboardPage = () => import("../pages/dashboard/DashboardPage.vue");
const SportsPage = () => import("../pages/sports/SportsPage.vue");
const SportDetailPage = () => import("../pages/sports/view/SportDetailPage.vue");
const LivePage = () => import("../pages/sports/LivePage.vue");
const CasinoPage = () => import("../pages/casino/CasinoPage.vue");
const AviatorPage = () => import("../pages/casino/AviatorPage.vue");
const VirtualsPage = () => import("../pages/virtuals/VirtualsPage.vue");
const BetsPage = () => import("../pages/bets/BetsPage.vue");
const BetDetailPage = () => import("../pages/bets/BetDetailPage.vue");
const JackpotPage = () => import("../pages/jackpot/JackpotPage.vue");
const PromotionsPage = () => import("../pages/promotions/PromotionsPage.vue");
const AdminPage = () => import("../pages/admin/AdminPage.vue");
const NotFoundPage = () => import("../pages/errors/NotFoundPage.vue");
const ProfilePage = () => import("../pages/profile/ProfilePage.vue");
const DepositePage = () => import("../pages/deposite/Deposit.vue");
const WithdrawPage = () => import("../pages/withdraw/Withdraw.vue");

// ── Routes ────────────────────────────────────────────────────────────────────
const routes = [
  // ── Auth pages (no main layout) ───────────────────────────────────────────
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage,
        meta: { title: "Login", guest: true },
      },
      {
        path: "register",
        name: "register",
        component: RegisterPage,
        meta: { title: "Register", guest: true },
      },
    ],
  },

  // Shortcuts
  { path: "/login", redirect: "/auth/login" },
  { path: "/register", redirect: "/auth/register" },

  // ── Main layout (ALL routes in ONE block) ─────────────────────────────────
  {
    path: "/",
    component: DefaultLayout,
    children: [
      // Public routes (no requiresAuth)
      {
        path: "",
        name: "home",
        component: HomePage,
        meta: { title: "BoomBet" },
      },
      {
        path: "sports",
        name: "sports",
        component: SportsPage,
        meta: { title: "Sports" },
      },
      {
        path: "SportDetail/:id",
        name: "sport-detail",
        component: SportDetailPage,
        meta: { title: "Sport Detail" },
      },
      {
        path: '/deposit/status',
        name: 'DepositStatus',
        component: () => import('../pages/deposite/views/DepositStatus.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: "deposite",
        name: "deposite",
        component: DepositePage,
        meta: { title: "Deposite" },
      },
      {
        path: "withdraw",
        name: "withdraw",
        component: WithdrawPage,
        meta: { title: "Withdraw" },
      },
      {
        path: "sports/live",
        name: "live",
        component: LivePage,
        meta: { title: "Live Betting" },
      },
      {
        path: "casino",
        name: "casino",
        component: CasinoPage,
        meta: { title: "Casino" },
      },
      {
        path: "casino/aviator",
        name: "aviator",
        component: AviatorPage,
        meta: { title: "Aviator" },
      },
      {
        path: "virtuals",
        name: "virtuals",
        component: VirtualsPage,
        meta: { title: "Virtual Sports" },
      },
      {
        path: "jackpot",
        name: "jackpot",
        component: JackpotPage,
        meta: { title: "Jackpot" },
      },
      {
        path: "promotions",
        name: "promotions",
        component: PromotionsPage,
        meta: { title: "Promotions" },
      },
      
      // Protected routes (requiresAuth: true)
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardPage,
        meta: { title: "Dashboard", requiresAuth: true },
      },
      {
        path: "profile",
        name: "profile",
        component: ProfilePage,
        meta: { title: "Profile", requiresAuth: true },
      },
      {
        path: "bets",
        name: "bets",
        component: BetsPage,
        meta: { title: "My Bets", requiresAuth: true },
      },
      {
        path: "bets/:id",
        name: "bet-detail",
        component: BetDetailPage,
        meta: { title: "Bet Detail", requiresAuth: true },
      },
    ],
  },

  // ── Admin layout ──────────────────────────────────────────────────────────
  {
    path: "/admin",
    component: AdminLayout,
    meta: { 
      requiresAuth: true, 
      requiresRole: 'ADMIN'  // 👈 Badilisha kutoka requiresAdmin kwenda requiresRole
    },
    children: [
      {
        path: "",
        name: "admin",
        component: AdminPage,
        meta: { 
          title: "Admin", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "users",
        name: "users",
        component: () => import('../pages/admin/components/AdminUsers.vue'),
        meta: { 
          title: "Users", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "bets",
        name: "betsManage",
        component: () => import('../pages/admin/components/AdminBets.vue'),
        meta: { 
          title: "Manage Bets", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "notifications",
        name: "notfication",
        component: () => import('../pages/admin/components/AdminNotifications.vue'),
        meta: { 
          title: "Notifications", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "settings",
        name: "setting",
        component: () => import('../pages/admin/components/Setting.vue'),
        meta: { 
          title: "Settings", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "fixtures",
        name: "fixtures",
        component: () => import('../pages/admin/components/fixctures/AdminFixtures.vue'),
        meta: { 
          title: "Fixtures", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
    meta: { title: "404" },
  },
];

// ── Router instance ───────────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  },
});

// ── Navigation guards with RBAC ──────────────────────────────────────────────
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} — BoomBet` : "BoomBet";

  // Get auth store instance
  const authStore = useAuthStore();
  
  // ── CHECK KAMA TOKEN IPO NA STORE HAJAISHA INITIALIZE ──────────────────
  const token = localStorage.getItem('access_token');
  
  // Initialize if:
  // 1. Tuna token lakini store haijalogin
  // 2. Au store haijawahi initialize (isLoading === undefined)
  if (token && !authStore.isLoggedIn) {
    console.log('⏳ Token found but store not logged in, initializing...');
    await authStore.initialize();
  } else if (authStore.isLoading === undefined && !authStore.isLoggedIn) {
    console.log('⏳ Store not initialized, initializing...');
    await authStore.initialize();
  }

  const isLoggedIn = authStore.isLoggedIn;
  const userRole = authStore.user?.role;

  console.log(`🔐 Navigation to: ${to.path} | isLoggedIn: ${isLoggedIn} | Role: ${userRole} | Token: ${!!token}`);

  // ── 1. Guest routes (login/register) ──────────────────────────────────────
  if (to.meta.guest && isLoggedIn) {
    console.log("⛔ Guest route but user logged in, redirecting to home");
    return next({ name: "home" });
  }

  // ── 2. Protected routes - check authentication ────────────────────────────
  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log("🔒 Protected route requires auth, redirecting to login");
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // ── 3. Role-based access control (RBAC) ──────────────────────────────────
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole;
    
    // Kama hana role, jaribu kuinitialize tena
    if (!userRole && token) {
      console.log('⚠️ No role found, re-initializing...');
      await authStore.initialize();
      // Tena angalia role baada ya re-initialize
      const newRole = authStore.user?.role;
      if (!newRole) {
        console.log('❌ Still no role, logging out...');
        authStore.logout();
        return next({ name: "login", query: { redirect: to.fullPath } });
      }
      // Endelea na role mpya
      if (newRole !== requiredRole) {
        console.log(`⛔ Access denied: Required '${requiredRole}', user has '${newRole}'`);
        return next({ name: "home" });
      }
      console.log(`✅ Role check passed after re-init: ${newRole}`);
      return next();
    }
    
    // Check if user has the required role
    if (userRole !== requiredRole) {
      console.log(`⛔ Access denied: Required role '${requiredRole}', but user has '${userRole}'`);
      
      // Redirect based on role or go home
      if (userRole === 'AGENT') {
        return next({ name: 'dashboard' });
      } else if (userRole === 'USER') {
        return next({ name: 'home' });
      } else {
        return next({ name: 'home' });
      }
    }
    
    console.log(`✅ Role check passed: ${userRole} has access to ${to.path}`);
  }

  // ── 4. Additional: Agent-specific routes (if needed) ──────────────────────
  if (to.meta.requiresAgent) {
    if (userRole !== 'AGENT' && userRole !== 'ADMIN') {
      console.log(`⛔ Agent route requires AGENT or ADMIN role`);
      return next({ name: 'home' });
    }
  }

  next();
});
export default router;