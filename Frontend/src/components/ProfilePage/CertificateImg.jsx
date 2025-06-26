import React from "react";
import { Download, Share2 } from "lucide-react"; // Optional icons

const CertificateImg = ({
  Certificatedata = {
    ImageUrl: "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
    DownloadUrl:
      "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
  },
}) => {
  console.log(Certificatedata);

  const imageUrl = "/your-image-path/Screenshot 2025-06-12 171439.png"; // Update if needed

  return (
    <div className="card bg-base-100 image-full w-full h-58 mt-4 shadow-sm relative ">
      <figure>
        <img
          className="w-full h-full object-cover object-center"
          src={Certificatedata.ImageUrl}
          alt="Shoes"
        />
      </figure>

      <div className="absolute opacity-20 inset-0 bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10" />

      <div className="card-body font-bold">
        <h2 className="card-title text-cyan-500">Ethical Hacking</h2>
        <p className="px-10 text-cyan-500">
          Discover techniques used by ethical hackers to identify
          vulnerabilities.
        </p>
        <div className="card-actions justify-end ">
          <a href={Certificatedata.DownloadUrl}>
            <Download
              size={24}
              className="text-cyan-500/50 hover:text-cyan-500 "
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CertificateImg;
