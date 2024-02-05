import vine from "@vinejs/vine";

export const Endpoint = ["world", "chinese_mainland", "brazil", "test", "test_chinese_mainland"] as const;

export type CreateShopeeTokenValidatorType = {
  access_token: string
  shop_id: string
  main_account_id: string
  user_id: string
}

export const createShopeeTokenValidator = vine.compile(
  vine.object({
    access_token: vine.string(),
    shop_id: vine.string(),
    main_account_id: vine.string(),
    user_id: vine.string()
  })
);

export const createShopeeEndpointValidator = vine.compile(
  vine.object({
    endpoint: vine.enum(Endpoint),
    user_id: vine.string()
  })
);

export const inputQueryShopeeApiPath = vine.compile(
  vine.object({
    api_path: vine.string()
  })
);
