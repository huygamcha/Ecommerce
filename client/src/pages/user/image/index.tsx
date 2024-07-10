import { useState } from "react";
import axios from "axios";

function TestCloudfare() {
  const [file, setFile] = useState("");

  const handleChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    });

    const message = await response.text();
    // console.log("message", message);
  };

  return (
    <>
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file">Select file:</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Upload</button>
        </div>
      </form>
    </>
  );
}

export default TestCloudfare;
