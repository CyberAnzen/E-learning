import React from "react";
import PropTypes from "prop-types";
import RadialProgess from "./RadialProgess";
import Modal from "./Modal";
import CertificateImg from "./CertificateImg";
import Carousel from "./Carousel";

const Avatargroup = ({
  certifications = [
    "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
    "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
    "https://img.daisyui.com/images/profile/demo/averagebulk@192.webp",
    "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
    "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
  ],
}) => {
  const Certifications = [
  {
    ImageUrl: "https://tse4.mm.bing.net/th?id=OIP.yYwNZAfYKu7bt1tDMXIkbgHaFm&pid=Api&P=0&h=180",
    DownloadUrl: "https://tse4.mm.bing.net/th?id=OIP.yYwNZAfYKu7bt1tDMXIkbgHaFm&pid=Api&P=0&h=180",
  },
  {
    ImageUrl: "https://tse2.mm.bing.net/th?id=OIP.7ZoCMCnNIfCjPZJia2Bq0QHaE4&pid=Api&P=0&h=180",
    DownloadUrl: "https://tse2.mm.bing.net/th?id=OIP.7ZoCMCnNIfCjPZJia2Bq0QHaE4&pid=Api&P=0&h=180",
  },
  {
    ImageUrl: "https://tse1.mm.bing.net/th?id=OIP.-kVdIcJXAaLK6XBKiiTPQQHaFY&pid=Api&P=0&h=180",
    DownloadUrl: "https://tse1.mm.bing.net/th?id=OIP.-kVdIcJXAaLK6XBKiiTPQQHaFY&pid=Api&P=0&h=180",
  },
  {
    ImageUrl: "https://tse1.mm.bing.net/th?id=OIP.iIuEYq48GYIbLeqHfuajoAHaFP&pid=Api&P=0&h=180",
    DownloadUrl: "https://tse1.mm.bing.net/th?id=OIP.iIuEYq48GYIbLeqHfuajoAHaFP&pid=Api&P=0&h=180",
  },
  {
    ImageUrl: "https://tse1.mm.bing.net/th?id=OIP.BZytSwOaaretcAGUwO-rbwHaFR&pid=Api&P=0&h=180",
    DownloadUrl: "https://tse1.mm.bing.net/th?id=OIP.BZytSwOaaretcAGUwO-rbwHaFR&pid=Api&P=0&h=180",
  },
];
  console.log(Certifications);

  return (
    <>
      <button
        className="cursor-pointer"
        onClick={() => document.getElementById("certificate_modal").showModal()}
      >
        <div className="avatar-group -space-x-6">
          {certifications.slice(0, 3).map((cert, index) => (
            <div className="avatar" key={index}>
              <div className="w-12">
                <img src={cert} alt={`Avatar ${index + 1}`} />
              </div>
            </div>
          ))}
          {certifications.length > 3 && (
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-12">
                <span>+{certifications.length - 3}</span>
              </div>
            </div>
          )}
        </div>
      </button>
      <Modal id="certificate_modal">
        <Carousel data={Certifications} dataKey="Certificatedata" carouselId="certificates">
          <CertificateImg />
        </Carousel>
      </Modal>
    </>
  );
};

export default Avatargroup;
