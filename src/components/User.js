import { useState, useRef } from "react";
import axios from 'axios';

export default function User() {
  const [userData, setUserData] = useState({
    name: "",
    socialMediaHandle: "",
    images: [],
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setUserData({ ...userData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("socialMediaHandle", userData.socialMediaHandle);

    for (let i = 0; i < userData.images.length; i++) {
      formData.append("images", userData.images[i]);
    }

    try {
      const response = await axios.post("https://social-media-backend-eta-ten.vercel.app/api/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Resetting the form fields after successful submission
      setUserData({
        name: "",
        socialMediaHandle: "",
        images: [],
      });

      // Clearing the file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Optionally, you can handle the response if needed
      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  return (
    <div className="container">
      <h2>User Submission Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={userData.name}
            onChange={handleChange}
            required
            minLength={3} 
            maxLength={20} 
          />
        </div>
        <div className="form-group">
          <label>Social Handle:</label>
          <input
            type="text"
            name="socialMediaHandle"
            placeholder="Enter your social media handle"
            value={userData.socialMediaHandle}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={30} 
          />
        </div>
        <div className="form-group">
          <label>Images:</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            required 
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
