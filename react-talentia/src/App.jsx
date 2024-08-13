import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {UserFormPage} from './pages/UserFormPage';
import {ServicesPage} from './pages/ServicesPage';
import { Navigation } from './components/Navigation';
function App() {
  return (
    <BrowserRouter>
    <Navigation/>
    <Routes>
      <Route path ="/" element={<ServicesPage/>} /> 
      <Route path="/user-form" element={<UserFormPage/>} />
    </Routes>
    </BrowserRouter> 
  )
}
export default App;