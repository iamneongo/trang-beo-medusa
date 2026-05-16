export type DemoCategoryImageKey =
  | "cat-pho-mieng"
  | "cat-pho-xe"
  | "cat-com-ga"
  | "cat-do-uong"
  | "cat-combo"

export type DemoProductImageKey =
  | "product-special"
  | "product-thigh"
  | "product-breast"

export type DemoStoreBannerKey =
  | "store-banner-long-bien"
  | "store-banner-hai-ba-trung"
  | "store-banner-dong-da"

export type DemoShopSnapshot = {
  categories: Array<{
    id: string
    imageKey: DemoCategoryImageKey
    label: string
  }>
  products: Array<{
    categoryId: string
    description: string
    id: string
    imageKey: DemoProductImageKey
    name: string
    price: string
  }>
  stores: Array<{
    address: string
    coverImageKey: DemoStoreBannerKey
    description: string
    distance: string
    eta: string
    hours: string
    id: string
    name: string
    phone: string
    promo: string
    rating: string
    status: "Đang mở" | "Sắp đóng cửa"
    subtitle: string
  }>
}

export const demoShopSnapshot: DemoShopSnapshot = {
  categories: [
    { id: "pho-ga-mieng", imageKey: "cat-pho-mieng", label: "Phở gà miếng" },
    { id: "pho-ga-xe", imageKey: "cat-pho-xe", label: "Phở gà xé" },
    { id: "com-ga", imageKey: "cat-com-ga", label: "Cơm gà" },
    { id: "do-uong", imageKey: "cat-do-uong", label: "Đồ uống" },
    { id: "combo", imageKey: "cat-combo", label: "Combo" },
  ],
  products: [
    {
      categoryId: "pho-ga-mieng",
      description: "Đùi gà to, thịt chắc, nước dùng ngọt thanh",
      id: "special",
      imageKey: "product-special",
      name: "Phở gà miếng đặc biệt",
      price: "45.000đ",
    },
    {
      categoryId: "pho-ga-mieng",
      description: "Đùi gà to thơm ngon",
      id: "thigh",
      imageKey: "product-thigh",
      name: "Phở gà miếng đùi",
      price: "40.000đ",
    },
    {
      categoryId: "pho-ga-mieng",
      description: "Ức gà mềm ngọt",
      id: "breast",
      imageKey: "product-breast",
      name: "Phở gà miếng lườn",
      price: "40.000đ",
    },
    {
      categoryId: "pho-ga-xe",
      description: "Sợi miến mềm, gà xé vừa miệng",
      id: "shredded-1",
      imageKey: "product-special",
      name: "Phở gà xé truyền thống",
      price: "42.000đ",
    },
    {
      categoryId: "pho-ga-xe",
      description: "Nước dùng đậm đà, ăn rất vừa miệng",
      id: "shredded-2",
      imageKey: "product-thigh",
      name: "Phở gà xé đùi",
      price: "40.000đ",
    },
    {
      categoryId: "pho-ga-xe",
      description: "Phần ức gà xé thanh nhẹ",
      id: "shredded-3",
      imageKey: "product-breast",
      name: "Phở gà xé lườn",
      price: "39.000đ",
    },
    {
      categoryId: "com-ga",
      description: "Cơm gà vàng óng, mềm thơm",
      id: "rice-1",
      imageKey: "product-special",
      name: "Cơm gà đặc biệt",
      price: "49.000đ",
    },
    {
      categoryId: "com-ga",
      description: "Đùi gà to, cơm dẻo vừa",
      id: "rice-2",
      imageKey: "product-thigh",
      name: "Cơm gà đùi",
      price: "45.000đ",
    },
    {
      categoryId: "com-ga",
      description: "Thịt ức mềm, ăn không ngấy",
      id: "rice-3",
      imageKey: "product-breast",
      name: "Cơm gà lườn",
      price: "43.000đ",
    },
    {
      categoryId: "do-uong",
      description: "Trà mát lạnh, uống rất đã",
      id: "drink-1",
      imageKey: "product-special",
      name: "Trà đào cam sả",
      price: "25.000đ",
    },
    {
      categoryId: "do-uong",
      description: "Vị ngọt nhẹ, rất hợp ăn kèm",
      id: "drink-2",
      imageKey: "product-thigh",
      name: "Nước chanh tươi",
      price: "18.000đ",
    },
    {
      categoryId: "do-uong",
      description: "Mát lạnh, dễ uống",
      id: "drink-3",
      imageKey: "product-breast",
      name: "Trà quất",
      price: "20.000đ",
    },
    {
      categoryId: "combo",
      description: "Một tô phở và đồ uống tiết kiệm hơn",
      id: "combo-1",
      imageKey: "product-special",
      name: "Combo đặc biệt",
      price: "59.000đ",
    },
    {
      categoryId: "combo",
      description: "Gà đùi đậm vị, phần ăn no bụng",
      id: "combo-2",
      imageKey: "product-thigh",
      name: "Combo đùi gà",
      price: "55.000đ",
    },
    {
      categoryId: "combo",
      description: "Phần combo thanh nhẹ dễ ăn",
      id: "combo-3",
      imageKey: "product-breast",
      name: "Combo lườn gà",
      price: "53.000đ",
    },
  ],
  stores: [
    {
      address: "12 Nguyễn Văn Cừ, Long Biên, Hà Nội",
      coverImageKey: "store-banner-long-bien",
      description: "Chi nhánh gốc với nước dùng thanh, lên món nhanh và rất hợp gọi bữa trưa.",
      distance: "2.1 km",
      eta: "12-18 phút",
      hours: "06:30 - 21:00",
      id: "long-bien",
      name: "Trang béo Long Biên",
      phone: "0902 123 456",
      promo: "Freeship cho đơn từ 79.000đ",
      rating: "4.9",
      status: "Đang mở",
      subtitle: "Chi nhánh gốc, đông khách nhất",
    },
  ],
}
