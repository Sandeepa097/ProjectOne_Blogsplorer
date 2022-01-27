import React from "react";

const CustomFileUpload = ({chooseImage, text}) => {

  return (
    <div className="custom-file mb-3">
      <input type="file" 
        className="custom-file-input" 
        id="customFile2" 
        accept="image/*" 
        onChange={e => {chooseImage(e)}} />
      <label className="custom-file-label" htmlFor="customFile2">
        {text}
      </label>
    </div>
  )
}

export default CustomFileUpload;
