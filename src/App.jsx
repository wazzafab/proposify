import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProposalForm from './pages/ProposalForm'
import ProposalView from './pages/ProposalView'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/proposals/new" element={<ProposalForm />} />
        <Route path="/proposals/:id/edit" element={<ProposalForm />} />
        <Route path="/proposals/:id" element={<ProposalView />} />
        <Route path="/p/:slug" element={<ProposalView isPublic />} />
      </Routes>
    </BrowserRouter>
  )
}
