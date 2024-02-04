import vine from "@vinejs/vine";

/**
 * Validates the weev token creation action
 */
export const createWeevTokenValidator = vine.compile(
  vine.object({
    userId: vine.string(),
    integrations: vine.enum(["LAZADA", "SHOPEE"]),
    uuid: vine.string()
  })
);

/**
 * Validates the weev token removal action
 */
export const removeWeevTokenValidator = vine.compile(
  vine.object({
    userId: vine.string()
  })
);
