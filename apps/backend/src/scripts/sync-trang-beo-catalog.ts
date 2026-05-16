import type { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createStoresWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
  updateSalesChannelsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

import { demoShopSnapshot } from "../lib/demo-shop-snapshot"

type QueryRecord = Record<string, any>

const PRODUCT_IMAGE_URL_BY_KEY = {
  "product-special":
    "https://raw.githubusercontent.com/iamneongo/trang-beo-medusa/main/apps/backend/public/demo-catalog/product-special.png",
  "product-thigh":
    "https://raw.githubusercontent.com/iamneongo/trang-beo-medusa/main/apps/backend/public/demo-catalog/product-thigh.png",
  "product-breast":
    "https://raw.githubusercontent.com/iamneongo/trang-beo-medusa/main/apps/backend/public/demo-catalog/product-breast.png",
} as const

const DEFAULT_OPTION_TITLE = "Phần ăn"
const DEFAULT_OPTION_VALUE = "Tiêu chuẩn"

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const parsePriceToAmount = (value: string) => Number(value.replace(/[^\d]/g, ""))

const pickLatest = <T extends QueryRecord>(items: T[]) =>
  [...items].sort(
    (left, right) =>
      new Date(right.created_at ?? 0).getTime() -
      new Date(left.created_at ?? 0).getTime()
  )[0]

export default async function syncTrangBeoCatalog(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Loading Medusa state before Trang beo catalog sync...")

  const [
    shippingProfilesResponse,
    storesResponse,
    salesChannelsResponse,
    productsResponse,
    categoriesResponse,
    regionsResponse,
  ] = await Promise.all([
    query.graph({
      entity: "shipping_profile",
      fields: ["id", "created_at"],
    }),
    query.graph({
      entity: "store",
      fields: [
        "id",
        "name",
        "created_at",
        "default_sales_channel_id",
        "default_region_id",
      ],
    }),
    query.graph({
      entity: "sales_channel",
      fields: ["id", "name", "description", "created_at"],
    }),
    query.graph({
      entity: "product",
      fields: ["id", "title", "created_at"],
    }),
    query.graph({
      entity: "product_category",
      fields: ["id", "name", "created_at"],
    }),
    query.graph({
      entity: "region",
      fields: ["id", "name", "currency_code", "created_at"],
    }),
  ])

  const shippingProfile = pickLatest(shippingProfilesResponse.data as QueryRecord[])

  if (!shippingProfile?.id) {
    throw new Error("No shipping profile found in Medusa. Cannot sync catalog.")
  }

  let salesChannels = salesChannelsResponse.data as QueryRecord[]
  let stores = storesResponse.data as QueryRecord[]
  let regions = regionsResponse.data as QueryRecord[]

  let activeSalesChannel = pickLatest(salesChannels)

  if (!activeSalesChannel?.id) {
    logger.info("No sales channel found. Creating one for Trang beo...")
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "Trang beo Mobile App",
            description: "Danh muc mon an dong bo tu app mobile",
          },
        ],
      },
    })

    activeSalesChannel = result[0]
    salesChannels = [...salesChannels, activeSalesChannel]
  }

  let activeRegion =
    regions.find((region) => region.currency_code === "vnd") ?? null

  if (!activeRegion?.id) {
    logger.info("Creating Vietnam region with VND currency...")
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Viet Nam",
            currency_code: "vnd",
            countries: ["vn"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })

    activeRegion = result[0]
    regions = [...regions, activeRegion]
  }

  let activeStore = pickLatest(stores)

  if (!activeStore?.id) {
    logger.info("No store found. Creating Trang beo store...")
    const { result } = await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "Trang béo",
            default_sales_channel_id: activeSalesChannel.id,
            supported_currencies: [
              {
                currency_code: "vnd",
                is_default: true,
                is_tax_inclusive: true,
              },
            ],
          },
        ],
      },
    })

    activeStore = result[0]
    stores = [...stores, activeStore]
  } else {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: activeStore.id },
        update: {
          name: "Trang béo",
          default_region_id: activeRegion.id,
          default_sales_channel_id: activeSalesChannel.id,
          metadata: {
            brand: "Trang béo",
            synced_from: "mobile-demo",
          },
          supported_currencies: [
            {
              currency_code: "vnd",
              is_default: true,
              is_tax_inclusive: true,
            },
          ],
          supported_locales: [{ locale_code: "vi-VN" }],
        },
      },
    })
  }

  await updateSalesChannelsWorkflow(container).run({
    input: {
      selector: { id: activeSalesChannel.id },
      update: {
        name: "Trang béo Mobile App",
        description: "Danh mục món ăn đồng bộ từ app mobile",
      },
    },
  })

  const existingProductIds = (productsResponse.data as QueryRecord[]).map(
    (item) => item.id
  )
  const existingCategoryIds = (categoriesResponse.data as QueryRecord[]).map(
    (item) => item.id
  )

  if (existingProductIds.length) {
    logger.info(`Deleting ${existingProductIds.length} existing products...`)
    await deleteProductsWorkflow(container).run({
      input: { ids: existingProductIds },
    })
  }

  if (existingCategoryIds.length) {
    logger.info(`Deleting ${existingCategoryIds.length} existing categories...`)
    await deleteProductCategoriesWorkflow(container).run({
      input: existingCategoryIds,
    })
  }

  logger.info("Creating Trang beo product categories...")

  const { result: createdCategories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: demoShopSnapshot.categories.map((category) => ({
        is_active: true,
        name: category.label,
      })),
    },
  })

  const categoryIdByMobileId = new Map(
    demoShopSnapshot.categories.map((category) => [
      category.id,
      createdCategories.find((created) => created.name === category.label)!.id,
    ])
  )

  logger.info("Creating Trang beo products...")

  await createProductsWorkflow(container).run({
    input: {
      products: demoShopSnapshot.products.map((product) => ({
        title: product.name,
        handle: toSlug(product.name),
        description: product.description,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        category_ids: [categoryIdByMobileId.get(product.categoryId)!],
        images: [
          {
            url: PRODUCT_IMAGE_URL_BY_KEY[product.imageKey],
          },
        ],
        options: [
          {
            title: DEFAULT_OPTION_TITLE,
            values: [DEFAULT_OPTION_VALUE],
          },
        ],
        variants: [
          {
            title: DEFAULT_OPTION_VALUE,
            manage_inventory: false,
            options: {
              [DEFAULT_OPTION_TITLE]: DEFAULT_OPTION_VALUE,
            },
            prices: [
              {
                amount: parsePriceToAmount(product.price),
                currency_code: "vnd",
              },
            ],
            sku: `TRANGBEO-${product.id}`.toUpperCase(),
          },
        ],
        metadata: {
          category_id: product.categoryId,
          image_key: product.imageKey,
          mobile_id: product.id,
          source: "mobile-demo",
        },
        sales_channels: [{ id: activeSalesChannel.id }],
      })),
    },
  })

  logger.info("Trang beo catalog sync completed successfully.")
}
