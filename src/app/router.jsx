import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import DashboardPage from '../features/dashboard/DashboardPage'
import StatsPage from '../features/stats/StatsPage'
import SettingsPage from '../features/settings/SettingsPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
