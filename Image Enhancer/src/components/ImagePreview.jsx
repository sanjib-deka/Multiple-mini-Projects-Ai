import Loading from "./Loading";

const ImagePreview = (props) => {
    return (
<div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto px-4">
  {/* Original Image Card */}
  <div className="bg-gradient-to-br from-[#f9f9f9] to-[#e6e6e6] border border-gray-300 rounded-3xl shadow-xl transition-transform duration-300 hover:scale-[1.01]">
    <div className="bg-[#fad02c] text-white text-lg tracking-wide text-center py-4 font-semibold rounded-t-3xl">
       Original Image
    </div>
    {props.uploaded ? (
      <img
        src={props.uploaded}
        alt="Original Upload"
        className="w-full h-[18rem] sm:h-[20rem] md:h-[24rem] object-cover rounded-b-3xl"
      />
    ) : (
      <div className="flex items-center justify-center h-[18rem] sm:h-[20rem] md:h-[24rem] bg-gray-100 text-gray-400 text-base font-medium rounded-b-3xl">
        No image selected
      </div>
    )}
  </div>

  {/* Enhanced Image Card */}
  <div className="bg-gradient-to-br from-[#edf4ff] to-[#dbe9ff] border border-[#6e6e6e] rounded-3xl shadow-xl transition-transform duration-300 hover:scale-[1.01]">
    <div className="bg-[#2C2C2C] text-white text-lg tracking-wide text-center py-4 font-semibold rounded-t-3xl">
       Enhanced Image
    </div>
    {props.enhanced && !props.loading ? (
      <img
        src={props.enhanced}
        alt="Enhanced Output"
        className="w-full h-[18rem] sm:h-[20rem] md:h-[24rem] object-cover rounded-b-3xl"
      />
    ) : props.loading ? (
      <Loading />
    ) : (
      <div className="flex items-center justify-center h-[18rem] sm:h-[20rem] md:h-[24rem] bg-blue-50 text-[#2C2C2C] text-base font-medium rounded-b-3xl">
        No enhanced image
      </div>
    )}
  </div>
</div>

    
    
    );
};

export default ImagePreview;