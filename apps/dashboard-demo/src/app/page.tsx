import { Menu } from "@/components/menu";
import { Assistant } from "@/lib/Assistant/Assistant";
import { GeneratedProducts } from "@/lib/Assistant/GeneratedProducts";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_HOST ?? "",
  token: process.env.UPSTASH_REDIS_PASSWORD ?? ""
});

export default async function Home() {
  const userId = "user:ed4ed10a-c087-41bb-8605-ebfb73ed7cd1:products";
  const genProduct = await redis.lrange(userId, 0, -1) as unknown[];

  return (
    <Menu>
      <div className="flex">
        <div className="w-[50%]">
          <Assistant title={"Alycia"} />
        </div>

        <div className="w-[50%] grid grid-cols-3 gap-3 align-middle">
          {
            genProduct.reverse().map((products: any) => {
              return <GeneratedProducts
                title={products["product_title"]}
                description={products["product_description"]}
                image={products["images"]["url"]}
                key={products["id"]}
              />;
            })
          }
        </div>
      </div>
    </Menu>
  );
}
