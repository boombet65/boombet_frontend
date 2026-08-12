<template>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-black text-cyan-100">Admin Dashboard</h1>
        <span class="text-xs text-cyan-600">Last updated: just now</span>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in adminStats" :key="stat.label"
             class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xl">{{ stat.icon }}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  :class="stat.trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
          </div>
          <p class="text-2xl font-black font-mono" :class="stat.color">{{ stat.value }}</p>
          <p class="text-xs text-cyan-600 mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Recent bets table -->
      <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl overflow-hidden">
        <div class="px-5 py-4 border-b border-cyan-800/40">
          <h3 class="font-bold text-cyan-100">Recent Bets</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-cyan-800/40">
                <th class="px-4 py-3 text-left text-xs font-bold text-cyan-600 uppercase">ID</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-cyan-600 uppercase">User</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-cyan-600 uppercase">Stake</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-cyan-600 uppercase">Odds</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-cyan-600 uppercase">Status</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-cyan-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cyan-800/30">
              <tr v-for="bet in recentBets" :key="bet.id" class="hover:bg-cyan-800/10 transition-colors">
                <td class="px-4 py-3 font-mono text-xs text-cyan-400">#{{ bet.id }}</td>
                <td class="px-4 py-3 text-cyan-200">{{ bet.user }}</td>
                <td class="px-4 py-3 font-mono text-yellow-400 font-bold">TZS {{ bet.stake }}</td>
                <td class="px-4 py-3 font-mono text-cyan-300">{{ bet.odds }}x</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border"
                        :class="bet.status === 'won' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                               : bet.status === 'lost' ? 'bg-red-500/10 text-red-400 border-red-500/20'
                               : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'">
                    {{ bet.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-cyan-600">{{ bet.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const adminStats = [
    { icon: '👥', label: 'Total Users',    value: '52,341',     color: 'text-cyan-200',    trend: 12 },
    { icon: '📋', label: 'Bets Today',     value: '8,920',      color: 'text-yellow-400',  trend: 5  },
    { icon: '💰', label: 'Revenue Today',  value: 'TZS 1.2M',   color: 'text-emerald-400', trend: 8  },
    { icon: '🏆', label: 'Payouts Today',  value: 'TZS 980K',   color: 'text-red-400',     trend: -3 },
  ]
  
  const recentBets = [
    { id: 'BB001', user: 'John Doe',    stake: '500',  odds: '4.50', status: 'won',     date: 'Today 14:32' },
    { id: 'BB002', user: 'Jane Smith',  stake: '200',  odds: '1.85', status: 'pending', date: 'Today 14:15' },
    { id: 'BB003', user: 'Mike Otieno', stake: '1,000',odds: '2.10', status: 'lost',    date: 'Today 13:50' },
    { id: 'BB004', user: 'Aisha K.',    stake: '350',  odds: '3.20', status: 'won',     date: 'Today 13:22' },
    { id: 'BB005', user: 'Peter N.',    stake: '750',  odds: '1.65', status: 'pending', date: 'Today 12:45' },
  ]
  </script>