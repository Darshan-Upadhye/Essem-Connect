import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Layout from './Layout.tsx'
import Dashboard from './Dashboard.tsx'
import Model from './Model.tsx'
import Material from './Material.tsx'
import Departments from './Departments.tsx'
import IntroLoader from './IntroLoader.tsx'
import Safety from './Safety.tsx'
import Learn from './Learn.tsx'
import Defects from './Defects.tsx'
import Feedback from './Feedback.tsx'
import Rejection from './Rejection.tsx'
import DailyPlan from './DailyPlan.tsx'
import Note from './Note.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IntroLoader>
      <BrowserRouter>
        <Routes>
          {/* Welcome Page has no header/footer */}
          <Route path="/" element={<App />} />
          
          {/* All these pages will have the header/footer automatically! */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/model" element={<Model />} />
            <Route path="/material" element={<Material />} />
            <Route path="/rejection" element={<Rejection />} />
            <Route path="/daily-plan" element={<DailyPlan />} />
            <Route path="/defects" element={<Defects />} /> 
            <Route path="/note" element={<Note />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </IntroLoader>
  </React.StrictMode>,
)