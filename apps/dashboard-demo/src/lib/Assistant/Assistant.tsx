"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAddQueueProductsAtom, useStatusAtom } from "@/store/gen-loading";

type AssistantCardProps = {
  title: string
}

export const Assistant = (props: AssistantCardProps) => {
  const { title } = props;
  const addQueueProducts = useAddQueueProductsAtom();
  const status = useStatusAtom();

  return (
    <Card className="text-dark w-[60%] cursor-pointer">
      <CardHeader className="grid grid-cols-1 items-start gap-4 space-y-0 cursor-pointer">
        <div className="flex align-middle space-y-2">
          <div>
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://res.cloudinary.com/dd7oj4ita/image/upload/v1708595676/singapore_e60wrp.png"
                alt="@shadcn"
              />
            </Avatar>
          </div>
          <div className="mr-3">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src="https://res.cloudinary.com/dd7oj4ita/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1708594293/alycia.png"
                alt="@shadcn"
              />
            </Avatar>
          </div>
          <div>
            <div className="pt-2">
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription className="py-2 text-wrap">
              Your personal agent to generate product title expert in everything
              in Singapore.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-start space-x-4 text-sm text-[#a1a1aa]">
          {
            status.length ? "Creating 2 Images (this might take a minute)" : (
              <Button
                onClick={async () => await addQueueProducts()}
                className="bg-[#d80027]">Generate image</Button>
            )
          }
        </div>
      </CardContent>
    </Card>
  );
};
