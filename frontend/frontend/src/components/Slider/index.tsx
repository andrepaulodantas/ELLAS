import React from "react";
import AliceCarousel, { Props as AliceCarouselProps } from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

// Definição das propriedades do componente Slider
type SliderComponentProps = AliceCarouselProps &
  Partial<{
    items: React.ReactElement[]; // Lista de itens a serem renderizados no carrossel
    centerMode: boolean; // Indica se o modo de centralização está ativo
    magnifiedIndex?: number; // Índice do slide a ser ampliado
    activeSlideCSS?: string; // Classe CSS a ser aplicada no slide ativo
    [x: string]: any; // Permite propriedades adicionais
  }>;

// Componente Slider usando React.forwardRef para passar ref
const Slider = React.forwardRef<AliceCarousel, SliderComponentProps>(
  (
    {
      items = [],
      activeIndex = 0,
      centerMode = false,
      magnifiedIndex = 0,
      activeSlideCSS = "scale-75",
      ...props
    },
    ref
  ) => {
    // Função para determinar se um slide deve ser pequeno
    const isSmall = (index: number) => {
      const adjustedIndex = activeIndex + magnifiedIndex >= items.length
        ? activeIndex + magnifiedIndex - items.length
        : activeIndex + magnifiedIndex;

      return index !== adjustedIndex;
    };

    // Configura os itens do slide com base no modo de centralização
    const slideItems = centerMode
      ? items.map((child, index) =>
          React.cloneElement(child, {
            ...child.props,
            className: [
              child.props?.className,
              isSmall(index) ? activeSlideCSS : "",
            ].filter(Boolean).join(" "),
          })
        )
      : items;

    return (
      <AliceCarousel
        items={slideItems}
        infinite
        ref={ref}
        {...props}
        touchTracking
        mouseTracking
        disableButtonsControls
      />
    );
  }
);

export { Slider };
