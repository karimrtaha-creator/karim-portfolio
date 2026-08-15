import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { Home } from '@/pages/Home'

const CaseStudy = lazy(() => import('@/pages/CaseStudy').then((m) => ({ default: m.CaseStudy })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))
const AgentMonitorDemo = lazy(() => import('@/pages/demos/AgentMonitor').then((m) => ({ default: m.AgentMonitorDemo })))
const OrderAnalyzerDemo = lazy(() => import('@/pages/demos/OrderAnalyzer').then((m) => ({ default: m.OrderAnalyzerDemo })))
const CouponTrackerDemo = lazy(() => import('@/pages/demos/CouponTracker').then((m) => ({ default: m.CouponTrackerDemo })))
const WebWatcherDemo = lazy(() => import('@/pages/demos/WebWatcher').then((m) => ({ default: m.WebWatcherDemo })))
const TeamOpsDemo = lazy(() => import('@/pages/demos/TeamOps').then((m) => ({ default: m.TeamOpsDemo })))
const DeliveryDemo = lazy(() => import('@/pages/demos/Delivery').then((m) => ({ default: m.DeliveryDemo })))

const AdminGate = lazy(() => import('@/pages/admin/AdminGate').then((m) => ({ default: m.AdminGate })))
const ProjectList = lazy(() => import('@/pages/admin/ProjectList').then((m) => ({ default: m.ProjectList })))
const ProjectForm = lazy(() => import('@/pages/admin/ProjectForm').then((m) => ({ default: m.ProjectForm })))
const ProjectPreview = lazy(() => import('@/pages/admin/ProjectPreview').then((m) => ({ default: m.ProjectPreview })))

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="font-mono text-[13px] text-ink-dim">Loading…</span>
    </div>
  )
}

function PublicSite() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 pb-16 md:pb-0">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/demo/agent-monitor" element={<AgentMonitorDemo />} />
            <Route path="/demo/order-analyzer" element={<OrderAnalyzerDemo />} />
            <Route path="/demo/coupon-tracker" element={<CouponTrackerDemo />} />
            <Route path="/demo/web-watcher" element={<WebWatcherDemo />} />
            <Route path="/demo/team-ops" element={<TeamOpsDemo />} />
            <Route path="/demo/delivery" element={<DeliveryDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}

function AdminArea() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <AdminGate>
        <Routes>
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
          <Route path="projects/:id/preview" element={<ProjectPreview />} />
          <Route path="*" element={<ProjectList />} />
        </Routes>
      </AdminGate>
    </Suspense>
  )
}

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminArea />} />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </ToastProvider>
  )
}

export default App
