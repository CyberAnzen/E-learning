import React from "react";
import { Download, Share2 } from "lucide-react"; // Optional icons

const CertificateImg = ( {
  Certificatedata= {
    ImageUrl: "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
    DownloadUrl: "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
  },
} ) => {
  console.log(Certificatedata);
  
  const imageUrl = "/your-image-path/Screenshot 2025-06-12 171439.png"; // Update if needed

  return (
    <div className="max-w-3xl mx-auto py-4 shadow-lg rounded-xl bg-white ">
      <img
        src={Certificatedata.ImageUrl}
        alt="City Skyline"
        className="rounded-lg w-full h-auto object-cover"
      />

        <a
        href={Certificatedata.DownloadUrl}
          className="btn btn-primary flex items-center gap-2"
        >
          <Download size={18} /> Download
        </a>
    </div>
  );
};

export default CertificateImg;
