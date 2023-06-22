import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';




export default function ResultPage({ text, goback, isLoading }) {
  return (
    <div>
      {isLoading ? (
        <div style={{position: 'absolute', left: '47%', top: '10%'}}>
           <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
            <CircularProgress color="success" />
           </Stack>
        </div>
      ) : (
        <div className='res'>
          

          <pre>{text.msg}</pre>
          <h2>Original text:</h2>
          <pre>{text.detections}</pre>
          <h2>Translated text:</h2>
          <pre>{text.translations}</pre>

          <button style={{marginTop: '10px'}} className="subBtn" onClick={goback}>New translation</button>
        </div>
      )}
    </div>
  );
}
