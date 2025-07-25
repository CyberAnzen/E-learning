import React, { cloneElement } from "react";

const Carousel = ({
  data,
  dataKey = "Certificatedata",
  children,
  carouselId = "carousel",
}) => {
  return (
    <div className="carousel col-span-1 lg:col-span-2 rounded-xl w-full h-auto border-[#38bdf8]/20 border-1 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      {data.map((item, index) => {
        const slideId = `${carouselId}-slide${index + 1}`;
        const prevSlide = `#${carouselId}-slide${
          index === 0 ? data.length : index
        }`;
        const nextSlide = `#${carouselId}-slide${
          index === data.length - 1 ? 1 : index + 2
        }`;

        return (
          <div
            key={index}
            id={slideId}
            className="carousel-item relative w-full"
          >
            {cloneElement(children, { [dataKey]: item })}
            <div className="absolute left-3 right-3 max-ms:left-right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href={prevSlide} className="btn btn-circle opacity-30">
                ❮
              </a>
              <a href={nextSlide} className="btn btn-circle opacity-30">
                ❯
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Carousel;
