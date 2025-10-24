// import React, { useState } from 'react';

// const PdfReader = ({ theme }) => {
//     const [File, setFile]=useState();
//   // Function to handle file input change
//   const handleFileChange = (event) => {
//     const file = event.target.files[0]; // Get the first selected file
//     if (file) {
//       console.log('Selected file:', file);
//       setFile(file)
//       console.log(File)
//       // Additional logic to handle the file can be added here
//     }
//   };

//   // Function to trigger the file input click programmatically
//   const handleButtonClick = () => {
//     document.getElementById('upload-pdf').click();
//   };

//   return (
//     <>
//     <div>{File.name}</div>
//     <div>
//       {/* Hidden file input field */}
//       <input
//         type="file"
//         accept=".pdf"  // Accept only PDF files
//         onChange={handleFileChange}
//         id="upload-pdf"
//         style={{ display: 'none' }}  // Hide the input field
//       />
//       {/* Button to trigger the file input */}
//       <button
//         className={`rounded-md px-3 py-2 ${
//           theme === 'light' ? 'bg-slate-300 text-black' : 'bg-blue-700 text-white'
//         }`}
//         onClick={handleButtonClick}
//       >
//         Upload PDF
//       </button>
//     </div>
//     </>
//   );
// };

// export default PdfReader;
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/theme'; // Import ThemeContext

const PdfReader = () => {
  const [file, setFile] = useState(null); // Use camelCase for the state variable
  const [message, setMessage] = useState('');
  
  // Access the theme from ThemeContext
  const { theme } = useContext(ThemeContext);

  // Function to handle file input change
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0]; // Get the first selected file
    if (selectedFile) {
      setFile(selectedFile);
      console.log('Selected file:', selectedFile); // Log file for debugging
    }
  };

  // Function to trigger the file input click programmatically
  const handleButtonClick = () => {
    document.getElementById('upload-pdf').click();
  };

  // Function to handle form submission and file upload
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.detail);
    } catch (error) {
      setMessage('File upload failed.');
      console.error(error);
    }
  };

  return (
    <>
      {/* Conditionally display the file name */}
      <div className={`mb-2 track-tighter ${theme === 'light' ? 'text-black' : 'text-white'}`}>
        {file && file.name}
      </div>
      <div className='flex gap-[16px]'>
        {/* Hidden file input field */}
        <input
          type="file"
          accept=".pdf" // Accept only PDF files
          onChange={handleFileChange}
          id="upload-pdf"
          style={{ display: 'none' }} // Hide the input field
        />
        {/* Button to trigger the file input */}
        <button
          className={`rounded-md px-3 py-2 ${
            theme === 'light' ? 'bg-slate-300 text-black hover:bg-slate-500 hover:text-white' : 'bg-blue-700 text-white hover:bg-blue-600'
          }`}
          onClick={handleButtonClick}
        >
          Upload
        </button>
        <button
          className={`rounded-md px-3 py-2 ${
            theme === 'light' ? 'bg-slate-300 text-black hover:bg-slate-500 hover:text-white' : 'bg-blue-700 text-white hover:bg-blue-600'
          }`}
          onClick={handleSubmit}
        >
          Submit
        </button>
     
      </div>
      <div className={`mt-[8px] tracking-tighter ml-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>{message}</div>
    </>
  );
};

export default PdfReader;
