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
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "",
        name: "admin",
        component: AdminPage,
        meta: { title: "Admin", requiresAuth: true, requiresAdmin: true },
      },
        {
        path: "/users",
        name: "users",
        component: () => import('../pages/admin/components/AdminUsers.vue'),
        meta: { title: "Admin", requiresAuth: true, requiresAdmin: true },
      },
        {
        path: "/bets",
        name: "betsManage",
        component: () => import('../pages/admin/components/AdminBets.vue'),
        meta: { title: "Admin", requiresAuth: true, requiresAdmin: true },
      },
        {
        path: "/notifications",
        name: "notfication",
        component: () => import('../pages/admin/components/AdminNotifications.vue'),
        meta: { title: "Admin", requiresAuth: true, requiresAdmin: true },
      },
        {
        path: "/settings",
        name: "setting",
        component: () => import('../pages/admin/components/AdminBets.vue'),
        meta: { title: "Admin", requiresAuth: true, requiresAdmin: true },
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

// ── Navigation guards (UPDATED to use authStore) ──────────────────────────────
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} — BoomBet` : "BoomBet";

  // Get auth store instance
  const authStore = useAuthStore();
  
  // If store not initialized, wait for it
  if (authStore.isLoading === undefined && !authStore.isLoggedIn) {
    await authStore.initialize();
  }

  const isLoggedIn = authStore.isLoggedIn;
  const token = localStorage.getItem("access_token");

  // Debug logging (unaweza kuondoa baada ya kuhakikisha inafanya kazi)
  console.log(`🔐 Navigation to: ${to.path} | isLoggedIn: ${isLoggedIn} | hasToken: ${!!token}`);

  // Guest routes (login/register) - if logged in, redirect to home
  if (to.meta.guest && isLoggedIn) {
    console.log("⛔ Guest route but user logged in, redirecting to home");
    return next({ name: "home" });
  }

  // Protected routes - if not logged in, redirect to login
  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log("🔒 Protected route requires auth, redirecting to login");
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // Admin routes - check if user is admin (using phone numbers from backend)
  if (to.meta.requiresAdmin) {
    const adminPhones = ['255683307420', '255748090224', '255672572874', '255745211365', '255749003366', '255690802328'];
    const userPhone = authStore.user?.phone_number;
    
    if (!adminPhones.includes(userPhone)) {
      console.log("⛔ Admin route but user is not admin, redirecting to home");
      return next({ name: "home" });
    }
  }

  next();
});

export default router;