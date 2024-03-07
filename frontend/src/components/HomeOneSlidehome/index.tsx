import React from "react";
import { Button, Img, Text, Slider, Heading } from "./..";
import AliceCarousel, { EventObject, DotsItem } from "react-alice-carousel";

interface Props {
  className?: string;
  dadosabertos?: string;
  saibaMais?: string;
  escolhauma?: string;
  prop?: string;
  oquedeseja?: string;
  botaoprimario?: string;
}

export default function HomeOneSlidehome({
  dadosabertos = "Dados abertos para Equidade de Gênero em Ciências e Tecnologia na América Latina",
  saibaMais = "Saiba mais",
  escolhauma = "Escolha uma Categoria",
  prop = "|",
  oquedeseja = "O que deseja perguntar aos dados?",
  botaoprimario = "Pesquisar",
  ...props
}: Props) {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);

  return (
    <div {...props}>
      <Img
        src="images/img_fundo_home_1.png"
        alt="fundohomeone"
        className="justify-center h-[475px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
      />
      <div className="flex flex-row justify-start w-[89%] h-full left-0 bottom-0 top-0 p-[37px] m-auto sm:p-5 bg-gradient absolute">
        <div className="flex flex-col items-end justify-start w-[60%] mt-[49px] ml-[3px]">
          <Heading size="2xl" as="h1" className="w-[73%] mr-[53px] md:mr-5 !leading-10">
            {dadosabertos}
          </Heading>
          <div className="flex flex-row justify-between w-[41%] md:w-full mt-3 mr-[402px] md:mr-5">
            <Button color="white_A700_99" shape="circle" className="w-[38px] mb-3.5">
              <Img src="images/img_botao_icone_38px.svg" />
            </Button>
            <Button
              size="sm"
              shape="round"
              rightIcon={<Img src="images/img_iconx18_white_a700.svg" alt="iconx18" />}
              className="mt-3.5 gap-2.5 font-medium min-w-[138px]"
            >
              {saibaMais}
            </Button>
          </div>
        </div>
      </div>
      <div className="w-[85%]">
        <Slider
          autoPlay
          autoPlayInterval={2000}
          responsive={{ "0": { items: 1 }, "550": { items: 1 }, "1050": { items: 3 } }}
          renderDotsItem={(props: DotsItem) => {
            return props?.isActive ? (
              <div className="h-[10px] w-[10px] mr-3.5 bg-gray-700" />
            ) : (
              <div className="h-[10px] w-[10px] mr-3.5 bg-white-A700_99" />
            );
          }}
          activeIndex={sliderState}
          onSlideChanged={(e: EventObject) => {
            setSliderState(e?.item);
          }}
          ref={sliderRef}
          className="right-[3%] bottom-0 top-0 m-auto absolute"
          items={[...Array(9)].map(() => (
            <React.Fragment key={Math.random()}>
              <div className="flex flex-row justify-start w-full mx-2.5 md:px-5 max-w-[723px]">
                <div className="flex flex-row md:flex-col justify-start items-center w-full gap-2.5 p-2 md:gap-5 bg-white-A700 rounded-[29px]">
                  <div className="flex flex-row sm:flex-col justify-start items-center w-[80%] md:w-full gap-2 sm:gap-5">
                    <div className="flex flex-row justify-start items-center w-[45%] sm:w-full gap-5 p-[11px]">
                      <Img src="images/img_iconx18_1.svg" alt="iconxeighteen" className="h-[18px] w-[18px] ml-[3px]" />
                      <Text as="p" className="!text-blue_gray-300_01">
                        {escolhauma}
                      </Text>
                      <Img src="images/img_iconx18_2.svg" alt="iconxeighteen" className="h-[18px] w-[18px] mr-[3px]" />
                    </div>
                    <Text size="5xl" as="p" className="!text-blue_gray-300_01 !font-normal">
                      {prop}
                    </Text>
                    <div className="flex flex-row justify-start items-center w-[52%] sm:w-full gap-[21px] p-[11px]">
                      <Text as="p" className="ml-[3px] !text-blue_gray-300_01">
                        {oquedeseja}
                      </Text>
                      <Img src="images/img_iconx18_2.svg" alt="iconxeighteen" className="h-[18px] w-[18px] mr-[3px]" />
                    </div>
                  </div>
                  <Button
                    color="red_300_03"
                    size="sm"
                    shape="round"
                    rightIcon={<Img src="images/img_iconx18_white_a700_18x18.svg" alt="iconx18" />}
                    className="mr-1 gap-2.5 font-medium min-w-[131px]"
                  >
                    {botaoprimario}
                  </Button>
                </div>
              </div>
            </React.Fragment>
          ))}
        />
      </div>
    </div>
  );
}
