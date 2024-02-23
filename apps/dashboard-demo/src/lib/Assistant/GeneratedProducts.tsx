"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type GeneratedProductsProps = {
  title?: string
  description?: string
  image: string
}

export const GeneratedProducts = (props: GeneratedProductsProps) => {
  const { title, description, image } = props;
  return (
    <Card className="text-dark w-[100%] border-none shadow-none">
      <CardHeader className="grid grid-cols-1 items-start gap-4 space-y-0 cursor-pointer">
        <div className="flex align-middle space-y-2">
          <Image
            src={image}
            width={600}
            height={600}
            alt={""}
            className="rounded-sm"
          />
        </div>
        <div>
          <div className="pt-2">
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription className="py-2 text-wrap">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};
