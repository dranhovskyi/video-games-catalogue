import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BrowsePage from './pages/BrowsePage';
import EditPage from './pages/EditPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<BrowsePage />} />
                    <Route path="edit" element={<EditPage />} />
                    <Route path="edit/:id" element={<EditPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;