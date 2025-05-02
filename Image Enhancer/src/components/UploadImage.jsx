const ImageUpload = (props) => {
  const ShowImageHandler = (e) => {
      const file = e.target.files[0];
      if (file) {
          props.UploadImageHandler(file);
      }
  };

  return (
      <div className="bg-[#fad02c] shadow-lg rounded-2xl p-6 w-full max-w-2xl">
          <label
              htmlFor="fileInput"
              className="block w-full cursor-pointer border-3 border-dashed border-white  rounded-lg p-6 text-center hover:border-blue-500 transition-all"
          >
              <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={ShowImageHandler}

              />
              <span className="text-lg font-medium text-gray-600">
                  Click and drag to upload your image
              </span>
          </label>
      </div>
  );
};

export default ImageUpload;