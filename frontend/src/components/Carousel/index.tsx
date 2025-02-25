import React, { ReactNode } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

interface CarouselProps {
  children?: ReactNode;
  images?: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  responsive?: Record<number, { items: number }>;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  images,
  autoPlay = false,
  autoPlayInterval = 3000,
  responsive = {
    0: { items: 1 },
    768: { items: 2 },
    1024: { items: 3 },
  },
  className = "",
}) => {
  const items = images
    ? images.map((image, index) => (
        <div key={index} className="carousel-item">
          <img src={image.src} alt={image.alt} className="w-full h-auto" />
          {image.caption && <div className="caption">{image.caption}</div>}
        </div>
      ))
    : children;

  return (
    <div className={className}>
      <AliceCarousel
        mouseTracking
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        responsive={responsive}
        controlsStrategy="alternate"
        infinite
        items={items ? React.Children.toArray(items) : []}
      />
    </div>
  );
};

export default Carousel;
