import { BrowserRouter, Route, Routes } from 'react-router-dom';

import '@components';
import '@elements';
import { MainLayout } from '@layouts';
import { Home } from '@pages';

import './main.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
