import { useState } from "react";
import ResultPage from "./result";

export default function FileUploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [inputLang, setInputLang] = useState({ inlanguages: "" });
  const [targetLang, setTargetLang] = useState({ outlanguages: "ar" });
  const [isproccessing, setIsproccessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [typeError, setTypeError] = useState("");
  const [sizeError, setSizeError] = useState("");

  // useEffect(() => {

  // },[text])

  const changeHandler = (event) => {
    setSizeError("");
    setTypeError("");
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
    console.log(selectedFile);
    
  };

  const handleInputLangChange = (event) => {
    setInputLang({ inlanguages: event.target.value });
  };

  const handleTargetLangChange = (event) => {
    setTargetLang({ outlanguages: event.target.value });
  };

  function handleGoBack() {
    setIsproccessing(false);
    setIsFilePicked(false);
    setIsLoading(true);
    setText("");
  }

  const handleSubmission = async (e) => {
    e.preventDefault();
    console.log(selectedFile.type);
    
    if (selectedFile.size > 10000000) {
      setSizeError("Maximum file size is 10MB");
      setIsValid(false);
    }
    if (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg") {

      setSizeError("");
      setTypeError("");
      setIsValid(true);
      const formData = new FormData();

    formData.append("File", selectedFile);

    formData.append("inlanguages", inputLang.inlanguages);
    formData.append("outlanguages", targetLang.outlanguages);

    setIsproccessing(true);

    await fetch("https://pictotext-334711.lm.r.appspot.com/api", {
      // await fetch("http://localhost:3000/api", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        setText(result);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      

    }
     else {
      console.log(selectedFile.type);
      setTypeError("Please upload a valid image");
      setIsValid(false);
      
    }

    ;
  };

  return (
    <div className="wrapper">
      <div className="mainApp">
        {isproccessing ? (
          <ResultPage text={text} isLoading={isLoading} goback={handleGoBack} />
        ) : (
          <form onSubmit={handleSubmission}>
            <div className="centerMe">
              
              {isFilePicked ? (
                <div>
                  <p>Filename: {selectedFile.name}</p>
                  {/* <p>Filetype: {selectedFile.type}</p> */}
                  {isValid ? null : <p className="alert">{typeError}</p>}

                  {/* <p>Size in bytes: {selectedFile.size}</p> */}
                  {isValid ? null : <p className="alert">{sizeError}</p>}
                  
                </div>
              ) : (
                <p>Select a file to show details</p>
              )}

              <label className="label">
                <input type="file" name="file" onChange={changeHandler} />
                Upload file
              </label>    
            </div>
            
          

            <div className="centerMe">
              <label>Input language: </label>
              <select
                value={inputLang.inlanguages}
                onChange={handleInputLangChange}
              >
                <option value="">Auto detect</option>
                <option value="ka">Georgian</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div className="centerMe">
              <label>Output language: </label>
              <select
                value={targetLang.outlanguages}
                onChange={handleTargetLangChange}
              >
                <option value="ka">Georgian</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div className="centerMe">
              <button className="subBtn" type="submit">Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
