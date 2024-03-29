import React from "react";
import { Button, Img, Text, Heading } from "./..";

interface Props {
  className?: string;
}

export default function Header({ ...props }: Props) {
  return (
    <header {...props}>
      <div className="flex flex-row justify-center w-full p-3 bg-white-A700 shadow-xs">
        <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 md:px-5 max-w-[1023px]">
          <Img
            src="images/img_logo_ellas_portal_prancheta.png"
            alt="logoellas_one"
            className="w-[13%] md:w-full md:h-[55px] object-cover"
          />
          <div className="flex flex-row md:flex-col justify-between items-center w-[69%] md:w-full md:gap-10">
            <ul className="flex flex-row sm:flex-col justify-between items-center w-auto sm:gap-10">
              <li>
                <a href="#">
                  <Heading as="p">Início</Heading>
                </a>
              </li>
              <li>
                <a href="#" className="cursor-pointer hover:text-gray-700 hover:font-bold">
                  <Text />
                </a>
              </li>
              <li>
                <a href="#" className="cursor-pointer hover:text-gray-700 hover:font-bold">
                  <Text />
                </a>
              </li>
              <li>
                <a href="#">
                  <Heading as="p">Apoie ELLAS</Heading>
                </a>
              </li>
              <li>
                <a href="#" className="cursor-pointer hover:text-gray-700 hover:font-bold">
                  <Text />
                </a>
              </li>
            </ul>
            <Button
              size="sm"
              shape="round"
              rightIcon={<Img src="images/img_iconx18.svg" alt="iconx18" />}
              className="gap-2.5 font-medium min-w-[106px]"
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
