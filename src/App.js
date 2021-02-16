import Main from './components/main';
import './index.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
function App() {
  return (
    <div className="App">
      <body style={{background:"rgb(246, 246, 246)"}}>
        <Main />
        <ToastContainer />
      </body>
    </div>
  );
}

export default App;
