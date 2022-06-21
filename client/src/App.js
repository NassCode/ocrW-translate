// import usestate hook
import { useState, useEffect } from 'react';
import UploadButtons from './components/uploadB';
import FileUploadPage from './components/uploadtest';



function App() {
  // useState hook to set the state of the app
  // const [state, setState] = useState()

  // useEffect(() => {

  //   fetch('http://localhost:3000/api').then(response => response.json()).then(data => {
  //     setState(data);
  //   })

  // },[])

  return (
    <div className="App">
      {/* <span>{state && state.msg}</span>
      <UploadButtons /> */}
      <FileUploadPage />
      
    </div>
  );
}

export default App;
