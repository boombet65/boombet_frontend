import { createRouter, createWebHistory } from "vue-router";

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
const ProfilePage = ()=> import ("../pages/profile/ProfilePage.vue");

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

  // ── Main layout (public) ──────────────────────────────────────────────────
  {
    path: "/",
    component: DefaultLayout,
    children: [
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
        path: "profile",
        name: "profile",
        component: ProfilePage,
        meta: { title: "Profile" },
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
    ],
  },

  // ── Main layout (protected) ───────────────────────────────────────────────
  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardPage,
        meta: { title: "Dashboard" },
      },
      {
        path: "bets",
        name: "bets",
        component: BetsPage,
        meta: { title: "My Bets" },
      },
      {
        path: "bets/:id",
        name: "bet-detail",
        component: BetDetailPage,
        meta: { title: "Bet Detail" },
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
        meta: { title: "Admin" },
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

// ── Navigation guards ─────────────────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} — BoomBet` : "BoomBet";

  const token = localStorage.getItem("boom_token");
  const userRaw = localStorage.getItem("boom_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  // Redirect logged-in users away from guest-only pages
  if (to.meta.guest && token) {
    return next({ name: "home" });
  }

  // Protected routes → redirect to login
  if (to.meta.requiresAuth && !token) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // Admin only
  if (to.meta.requiresAdmin && user?.role !== "admin") {
    return next({ name: "home" });
  }

  next();
});

export default router;
