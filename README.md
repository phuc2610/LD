# Kế Hoạch Nâng Cấp SEO & Đa Quốc Gia — VINUT USA

---

## Hiện trạng

| Tính năng | Trạng thái | Ghi chú |
|---|---|---|
| Market hiện có | US + Thailand | Hard-code trong market.config.ts, cần chuyển sang CMS |
| Geo-targeting theo IP | Chưa có | User chọn thủ công bằng dropdown |
| Sản phẩm theo quốc gia | Chưa có | Chung cho tất cả market |
| Banner theo quốc gia | Chưa có | Hard-code trong constants |
| Slug tự động | Có | Từ title/name, chưa tùy chỉnh cho trang tĩnh |
| SEO Panel | Có | Cơ bản: title, description, keywords, OG image |
| Sitemap.xml | Chưa có | — |
| Schema Markup | Chưa có | — |
| Redirect 301/404 | Chưa có | Chỉ SPA fallback |
| SEO Checklist | Chưa có | — |
| Tags bài viết | Chưa có | — |
| Internal Link gợi ý | Chưa có | — |
| Auto ALT ảnh | Chưa có | — |
| Facebook Comments / Share | Chưa có | — |
| View counting | Chưa có | — |
| GA4 / GSC / GTM | Chưa có | — |
| CMS Error Checker | Chưa có | — |

---

## Phase 0: Hệ Thống Đa Quốc Gia — Sẵn Sàng Mở Rộng Toàn Cầu

### Bối cảnh

Hiện tại website chỉ phục vụ 2 thị trường: US (mặc định) và Thailand. Tuy nhiên, mục tiêu dài hạn là mở rộng ra toàn thế giới — bất kỳ quốc gia nào VINUT muốn tiếp cận đều có thể được thêm vào hệ thống mà không cần sửa code hay deploy lại.

Vì vậy, toàn bộ kiến trúc Phase 0 phải được thiết kế theo nguyên tắc: **admin chỉ cần thao tác trên CMS để thêm quốc gia mới**, hệ thống tự xử lý routing, ngôn ngữ, sản phẩm, banner, SEO. Không có giới hạn về số lượng quốc gia.

---

### Bước 1 — Chuyển quản lý quốc gia từ code sang CMS

Hiện tại danh sách market nằm trong file [market.config.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/config/market.config.ts), hard-code 2 entry (US, Thailand). Mỗi lần muốn thêm quốc gia mới (ví dụ Japan, Korea, Vietnam, Indonesia...) phải sửa file này, thêm file translation, sửa routing, rồi deploy lại. Cách làm này không thể scale khi mở rộng toàn cầu.

Giải pháp: tạo schema `marketConfig` trong Sanity CMS. Mỗi document là một quốc gia. Admin tạo quốc gia mới hoàn toàn trên CMS — không cần developer can thiệp.

Schema chứa các thông tin:

| Field | Mô tả | Ví dụ US | Ví dụ Japan |
|---|---|---|---|
| code | Mã nội bộ (unique, dùng trong URL + logic) | [us](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/hooks/useMarket.ts#4-11) | `japan` |
| label | Tên hiển thị trong dropdown | `United States` | `Japan` |
| urlPrefix | Prefix cho URL (rỗng = default market) | _(rỗng)_ | `japan` |
| locale | Mã ngôn ngữ BCP 47 | `en-US` | `ja-JP` |
| currency | Mã tiền tệ ISO 4217 | `USD` | `JPY` |
| hreflang | Mã hreflang cho SEO | `en-us` | `ja-jp` |
| flag | Cờ quốc gia (emoji hoặc ảnh) | 🇺🇸 | 🇯🇵 |
| isDefault | Đánh dấu market mặc định | true | false |
| isoCountryCodes | Mảng mã ISO 3166-1 alpha-2 ánh xạ với market này | `["US"]` | `["JP"]` |
| isActive | Bật/tắt market | true | true |

Field `isoCountryCodes` rất quan trọng: nó ánh xạ mã quốc gia từ IP (Cloudflare trả về ISO code như [US](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/interfaces.ts#119-123), `TH`, `JP`, `VN`, `KR`) với market tương ứng. Một market có thể map nhiều ISO code — ví dụ market "Southeast Asia" có thể map `["SG","MY","ID","PH"]`.

Khi app khởi động, thay vì đọc mảng hard-code, sẽ fetch danh sách markets từ Sanity API. Kết quả được cache để không gọi API mỗi request.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/marketConfig.ts** | Tạo mới — schema quốc gia |
| **vncms/schemaTypes/index.ts** | Sửa — đăng ký schema |
| **src/config/market.config.ts** | Sửa — bỏ hard-code, fetch từ Sanity |
| **vncms/lib/querries.ts** | Sửa — thêm query lấy danh sách markets |

Sau bước này, admin có thể vào CMS → tạo document "Japan" → nhập thông tin → market Japan xuất hiện trong hệ thống. Ban đầu chuẩn bị sẵn 2 documents: US (isDefault=true) và Thailand.

---

### Bước 2 — Tự động phát hiện quốc gia theo IP

Khi người dùng lần đầu truy cập website, hệ thống cần tự nhận diện họ đến từ quốc gia nào để hiển thị nội dung phù hợp. Cloudflare Workers có sẵn header `cf-ipcountry` chứa mã quốc gia ISO 2 chữ cái — không cần gọi API bên ngoài, không tốn phí, không có độ trễ thêm.

Luồng xử lý trong Worker:

| Bước | Logic | Ví dụ |
|---|---|---|
| 1. Kiểm tra cookie | Nếu user đã có cookie `vinut-market` → dùng giá trị cookie, bỏ qua IP. Cookie được set khi user tự chọn quốc gia hoặc lần đầu auto-detect | Cookie = `japan` → bỏ qua IP |
| 2. Đọc IP country | Lấy `cf-ipcountry` từ request header | Header trả về `JP` |
| 3. Tìm market match | So sánh mã ISO với field `isoCountryCodes` trong danh sách markets (đã cache). Nếu `JP` nằm trong `isoCountryCodes` của market Japan → match | `JP` match market `japan` |
| 4a. Có match | Redirect 302 đến `/{urlPrefix}/` + set cookie `vinut-market=japan` (max-age 30 ngày) | Redirect 302 → `/japan/` |
| 4b. Không match | Giữ nguyên ở US (default, không redirect). Set cookie `vinut-market=us` | User từ Argentina → ở lại `/` (US) |

Dùng 302 (tạm thời) chứ không phải 301 (vĩnh viễn), vì cùng URL `/` redirect khác nhau tùy IP của người truy cập. Nếu dùng 301, trình duyệt hoặc CDN cache redirect vĩnh viễn → user VN sẽ luôn bị redirect đến Japan nếu cache sai.

Khi user tự chọn quốc gia khác qua dropdown → cookie được cập nhật → lần sau Worker đọc cookie trước, không ghi đè bằng IP.

Khi mở rộng thêm quốc gia: admin chỉ cần tạo document market mới trong CMS với isoCountryCodes phù hợp → Worker tự nhận diện IP mới.

| File | Hành động |
|---|---|
| **worker.js** | Sửa — thêm logic IP detection + market matching + redirect + cookie |

---

### Bước 3 — Sản phẩm riêng cho từng quốc gia

Mỗi thị trường có lineup sản phẩm khác nhau tùy thuộc vào sở thích tiêu dùng, quy định nhập khẩu, và chiến lược kinh doanh. Ví dụ: Thailand bán nhiều nước dừa, Japan chuộng matcha, Hàn Quốc có sản phẩm Aloe Vera đặc biệt. Cần cơ chế gắn sản phẩm vào market cụ thể.

Thêm field `markets` vào schema product. Đây là mảng reference đến `marketConfig`. Admin khi tạo/sửa sản phẩm sẽ tick chọn quốc gia nào được bán sản phẩm này.

Logic hiển thị:

| Trường hợp | Kết quả |
|---|---|
| Product có `markets = [japan, korea]` | Chỉ hiển thị ở Japan và Korea |
| Product không gắn market nào (mảng rỗng) | Hiển thị ở TẤT CẢ market (sản phẩm toàn cầu) |
| User ở market `japan` | Thấy: sản phẩm gắn Japan + sản phẩm toàn cầu |
| User ở market `brazil` (chưa cấu hình) | Fallback về US → thấy sản phẩm gắn US + toàn cầu |

Cách này backward compatible: tất cả sản phẩm hiện tại không có field markets → tự động là sản phẩm toàn cầu, vẫn hiển thị bình thường.

Tất cả GROQ queries sản phẩm cần được sửa để nhận thêm param `marketCode` và filter theo market.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/product.ts** | Sửa — thêm field `markets` |
| **vncms/lib/querries.ts** | Sửa — filter queries theo market |
| **src/Navigations/Products.tsx** | Sửa — truyền market code vào query |
| **src/sections/PopularProducts.tsx** | Sửa — filter theo market |
| **src/components/RelatedProducts.tsx** | Sửa — filter theo market |

---

### Bước 4 — Banner riêng cho từng quốc gia

Banner hero (carousel trang chủ) và banner trang con cần hình ảnh phù hợp văn hóa và sản phẩm chủ lực của từng quốc gia. Hiện tại 3 slides hero hard-code trong constants với ảnh cố định.

Tạo schema `heroBanner` trong CMS. Admin tạo nhiều bộ banner cho mỗi quốc gia:

| Field | Mô tả |
|---|---|
| title | Tiêu đề trên banner |
| topic | Chủ đề (ví dụ JUICES, COCONUT...) |
| image | Ảnh banner (upload lên Sanity) |
| description | Mô tả ngắn |
| market | Reference đến marketConfig — banner này thuộc quốc gia nào |
| order | Thứ tự hiển thị trong carousel |

Logic hiển thị:

| Trường hợp | Kết quả |
|---|---|
| Market Japan có 4 banners riêng | Hiển thị 4 banners đó |
| Market Korea chưa có banner riêng | Fallback: lấy banners của US (default market) |
| Market US (default) | Luôn có banners |

Tương tự, banner tiêu đề trên các trang con (Products, Blog, Contact...) cũng cần hỗ trợ ảnh khác nhau cho từng quốc gia. Có thể thêm vào schema `pageSlug` (Phase 1) field ảnh banner header cho mỗi market.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/heroBanner.ts** | Tạo mới — schema banner |
| **vncms/schemaTypes/index.ts** | Sửa — đăng ký |
| **vncms/lib/querries.ts** | Sửa — query banner theo market |
| **src/Navigations/Landing.tsx** | Sửa — fetch banners từ Sanity thay constants |
| **src/sections/Hero.tsx** | Sửa — nhận data từ Sanity |
| **src/components/Layout.tsx** | Sửa — banner trang con theo market |
| **src/constants/index.tsx** | Sửa — loại bỏ hard-code slides |

---

### Bước 5 — Routing động và mở rộng i18n

Routing hiện tạo routes từ mảng `MARKET_LIST` hard-code 2 entries. Khi admin thêm quốc gia mới trong CMS, hệ thống phải tự tạo routes tương ứng mà không cần sửa code.

| Hiện tại | Sau khi sửa |
|---|---|
| `MARKET_LIST` hard-code 2 markets | Fetch từ Sanity API khi app init |
| Routes cố định cho US + Thailand | Tạo routes động cho N quốc gia |
| MarketDropdown hiển thị 2 options | Hiển thị tất cả markets active từ CMS |
| 2 file translation (us.ts, thailand.ts) | Dynamic import theo market code, fallback US English |

Về i18n: mỗi market mới cần file translation tương ứng trong `src/i18n/`. Tuy nhiên không bắt buộc — nếu chưa có file translation cho market đó, hệ thống tự fallback về US English. Khi team dịch xong, chỉ cần thêm file translation → ngôn ngữ tự áp dụng.

Cơ chế fallback đa tầng cho translation:

| Ưu tiên | Nguồn | Ví dụ market Japan |
|---|---|---|
| 1 | File translation theo market code | `i18n/japan.ts` nếu tồn tại |
| 2 | US English (mặc định) | `i18n/us.ts` luôn có |

Nếu Sanity API lỗi khi fetch markets → app fallback về chạy US only, đảm bảo website không bao giờ trắng trang.

| File | Hành động |
|---|---|
| **src/App.tsx** | Sửa — fetch markets từ Sanity → tạo routes động |
| **src/context/MarketContext.tsx** | Sửa — hỗ trợ dynamic markets |
| **src/components/MarketDropdown.tsx** | Sửa — hiển thị từ CMS data |
| **src/i18n/index.ts** | Sửa — dynamic import translation files |
| **src/i18n/[market].ts** | Tạo mới khi có market mới — file dịch |

---

### Tóm tắt luồng toàn cầu

Kịch bản: admin muốn thêm market Japan.

| Bước | Ai làm | Ở đâu | Kết quả |
|---|---|---|---|
| 1 | Admin | CMS → tạo document marketConfig: code=`japan`, urlPrefix=`japan`, isoCountryCodes=`["JP"]` | Market Japan xuất hiện trong hệ thống |
| 2 | Admin | CMS → tạo heroBanner cho Japan (upload ảnh phù hợp thị trường Nhật) | Banner riêng cho Japan |
| 3 | Admin | CMS → sửa products → gắn Japan vào field markets | Sản phẩm phù hợp thị trường Nhật |
| 4 | Dev (optional) | Tạo file `src/i18n/japan.ts` với bản dịch tiếng Nhật | UI tiếng Nhật. Nếu bỏ qua → dùng English |
| 5 | Tự động | User IP từ Nhật truy cập → Worker detect `JP` → redirect `/japan/` | User Nhật thấy sản phẩm + banner + ngôn ngữ Nhật |

Không cần deploy lại. Không cần sửa code (trừ bước 4 nếu muốn dịch UI).

---

## Phase 1: Slug, Redirect, Sitemap

### Bước 1 — Hàm slug chuẩn SEO

Slug mặc định Sanity chỉ lowercase + thay space bằng `-`. Chưa xử lý dấu tiếng Việt, ký tự đặc biệt, hoặc slug quá dài.

Viết hàm slugify dùng chung: lowercase → bỏ dấu (`ă→a`, `ê→e`, `ü→u`...) → thay space/ký tự đặc biệt bằng `-` → loại `-` liên tiếp → trim đầu/cuối.

| Input | Output |
|---|---|
| `Nước Ép Trái Cây Tươi @2024` | `nuoc-ep-trai-cay-tuoi-2024` |
| `VINUT Coconut Water 500ml` | `vinut-coconut-water-500ml` |
| `お茶 Matcha Green Tea` | `matcha-green-tea` |

| File | Hành động |
|---|---|
| **vncms/lib/slugify.ts** | Tạo mới |

### Bước 2 — Áp dụng slug cho schemas

Thay slugify mặc định bằng hàm chuẩn SEO ở tất cả schemas có field slug.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/post.ts** | Sửa — dùng custom slugify |
| **vncms/schemaTypes/product.ts** | Sửa |
| **vncms/schemaTypes/productcategory.ts** | Sửa |
| **vncms/schemaTypes/faq.ts** | Sửa |
| **vncms/schemaTypes/history.ts** | Sửa |

### Bước 3 — Slug trang tĩnh từ CMS

Trang About Us, Contact Us... hiện slug hard-code trong router. Tạo schema `pageSlug` cho admin tùy chỉnh slug — mỗi quốc gia có thể có slug khác (ví dụ `/about-us` cho US, `/gioi-thieu` cho VN, `/about` cho Japan).

| File | Hành động |
|---|---|
| **vncms/schemaTypes/pageSlug.ts** | Tạo mới |
| **vncms/schemaTypes/index.ts** | Sửa — đăng ký |

### Bước 4 — Redirect 301/404

Tạo schema `redirect` trong CMS:

| Field | Mô tả | Ví dụ |
|---|---|---|
| fromPath | URL cũ | `/old-product` |
| toPath | URL mới | `/products/new-product` |
| statusCode | HTTP status | `301` |
| isActive | Bật/tắt | `true` |

Worker kiểm tra redirect rules trước SPA fallback (cache rules 1 giờ). Trang 404 thêm meta `noindex` + gợi ý trang chính.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/redirect.ts** | Tạo mới |
| **vncms/schemaTypes/index.ts** | Sửa |
| **vncms/lib/querries.ts** | Sửa — query redirects |
| **worker.js** | Sửa — logic redirect |
| **src/Navigations/NotFound404.tsx** | Sửa — noindex + gợi ý |

### Bước 5 — Sitemap.xml tự động

Worker xử lý 6 routes sitemap, fetch data từ Sanity, generate XML động, cache 1 giờ:

| Route | Nội dung | Data source |
|---|---|---|
| `/sitemap.xml` | Sitemap index | Trỏ đến 5 sub-sitemaps |
| `/sitemap-pages.xml` | Trang tĩnh cho TẤT CẢ quốc gia | pageSlug + markets từ CMS |
| `/sitemap-posts.xml` | Tất cả bài viết | `*[_type=="post"]` |
| `/sitemap-products.xml` | Tất cả sản phẩm | `*[_type=="product"]` |
| `/sitemap-categories.xml` | Danh mục sản phẩm | `*[_type=="productcategory"]` |
| `/image-sitemap.xml` | Tổng hợp ảnh | imageUrl từ posts + products |

Mỗi URL kèm `hreflang` alternate links cho tất cả markets active — đảm bảo Google biết phiên bản quốc gia nào tương ứng. Khi admin thêm market mới → sitemap tự bổ sung hreflang links sau tối đa 1 giờ.

| File | Hành động |
|---|---|
| **src/utils/sitemap-builder.ts** | Tạo mới — helper tạo XML |
| **worker.js** | Sửa — route handlers sitemap |
| **vncms/schemaTypes/post.ts** | Sửa — thêm field lastModified |
| **public/robots.txt** | Tạo mới |

---

## Phase 2: Schema Markup

Schema markup (JSON-LD) giúp Google hiểu cấu trúc nội dung → hiện rich snippets (sao đánh giá, FAQ, breadcrumb...) → tăng CTR.

### Bước 1 — Hàm generate JSON-LD

Tạo utility functions nhận dữ liệu → trả về object JSON-LD.

| Schema Type | Trang | Dữ liệu cần |
|---|---|---|
| Article | BlogPost | title, author, publishedAt, image, description |
| Product | ProductPost | name, description, image, category, brand, reviews |
| BreadcrumbList | Tất cả trang con | Path: Home → Section → Tên trang |
| FAQPage | Faqs | Tất cả question + answer |
| VideoObject | AboutUs | Video about-us.mp4, title, description |
| AggregateRating | Landing | Trung bình rating từ reviews |
| NewsArticle | BlogPost | Tương tự Article (cho tin tức) |

### Bước 2 — Component render và tích hợp

Tạo component `JsonLd` render `<script type="application/ld+json">` vào `<head>`. Gắn vào các trang.

| File | Hành động |
|---|---|
| **src/utils/schema-markup.ts** | Tạo mới |
| **src/components/JsonLd.tsx** | Tạo mới |
| **src/Navigations/BlogPost.tsx** | Sửa — Article + Breadcrumb |
| **src/Navigations/ProductPost.tsx** | Sửa — Product + Breadcrumb |
| **src/Navigations/Faqs.tsx** | Sửa — FAQPage |
| **src/Navigations/AboutUs.tsx** | Sửa — VideoObject |
| **src/Navigations/Landing.tsx** | Sửa — AggregateRating |

---

## Phase 3: Module Viết Bài Chuẩn SEO

### Bước 1 — Mở rộng SEO panel

| Field mới | Mô tả |
|---|---|
| focusKeyword | Từ khóa chính muốn SEO |
| canonicalUrl | URL canonical tùy chỉnh (optional) |

| File | Hành động |
|---|---|
| **vncms/schemaTypes/seoPanel.ts** | Sửa |

### Bước 2 — SEO Checklist trong Sanity Studio

Tạo custom component hiển thị real-time khi soạn bài, 11 tiêu chí:

| # | Tiêu chí | Điều kiện Pass |
|---|---|---|
| 1 | SEO title chứa focus keyword | seoTitle chứa focusKeyword |
| 2 | Độ dài SEO title | 30–60 ký tự |
| 3 | Meta description chứa keyword | seoDescription chứa focusKeyword |
| 4 | Độ dài meta description | 80–160 ký tự |
| 5 | Có OG image | ogImage không null |
| 6 | Slug chứa keyword | slug.current chứa keyword |
| 7 | Body có heading H2/H3 | Scan blockContent có style h2/h3 |
| 8 | Tất cả ảnh có ALT | Scan image blocks đều có alt |
| 9 | Có internal links | Link annotations có href bắt đầu `/` |
| 10 | Độ dài body | Trên 300 từ |
| 11 | Keyword ở đoạn đầu | Block text đầu tiên chứa keyword |

Hiển thị pass/warning/fail + điểm tổng /100.

| File | Hành động |
|---|---|
| **vncms/components/SeoChecklist.tsx** | Tạo mới |
| **vncms/schemaTypes/post.ts** | Sửa — tích hợp checklist |
| **vncms/schemaTypes/product.ts** | Sửa — tích hợp checklist |

---

## Phase 4: Internal Link & Tags

### Bước 1 — Tags

Tạo schema `tag` (name + slug). Thêm field `tags` vào post và product. Component TagList hiển thị pills, click → filter.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/tag.ts** | Tạo mới |
| **vncms/schemaTypes/index.ts** | Sửa |
| **vncms/schemaTypes/post.ts** | Sửa — thêm field tags |
| **vncms/schemaTypes/product.ts** | Sửa — thêm field tags |
| **vncms/lib/querries.ts** | Sửa — queries theo tag |
| **src/components/TagList.tsx** | Tạo mới |
| **src/Navigations/BlogPost.tsx** | Sửa — hiển thị TagList |
| **src/Navigations/ProductPost.tsx** | Sửa — hiển thị TagList |

### Bước 2 — Bài viết liên quan cải tiến

Thay "Recent Articles" ở BlogPost bằng "Related Articles" — ưu tiên tags chung, fallback recent.

| File | Hành động |
|---|---|
| **src/Navigations/BlogPost.tsx** | Sửa |

### Bước 3 — Gợi ý nội link trong CMS

Panel sidebar: khi edit bài, tự query bài viết/sản phẩm match focus keyword/title → gợi ý link cho admin chèn.

| File | Hành động |
|---|---|
| **vncms/components/InternalLinkSuggestion.tsx** | Tạo mới |
| **vncms/sanity.config.ts** | Sửa — đăng ký panel |

---

## Phase 5: Hình Ảnh — Tự Sinh ALT

### Bước 1 — Thêm field ALT vào images trong editor

Thêm field `alt` cho image type trong blockContent. Validation warning nếu trống.

### Bước 2 — Hàm auto-generate ALT

| Input | Output |
|---|---|
| URL: `coconut-water-fresh.jpg`, title: `Benefits of Coconut` | `Coconut Water Fresh - Benefits of Coconut` |
| URL: `tropical-juice-500ml.jpg`, title: null | `Tropical Juice 500ml` |

### Bước 3 — Áp dụng khi render

BlogPostBody: nếu image có alt → dùng, nếu không → auto-generate. Rà soát tất cả `<img>` tags.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/blockContent.ts** | Sửa — thêm field alt |
| **src/utils/auto-alt.ts** | Tạo mới |
| **src/components/BlogPostBody.tsx** | Sửa — auto ALT fallback |

---

## Phase 6: Social Network

### Bước 1 — Facebook Comments

Facebook JS SDK async vào index.html. Component render comments box. Gắn vào BlogPost và ProductPost.

### Bước 2 — Share Buttons

| Platform | Cách share |
|---|---|
| Facebook | URL sharer.php |
| Twitter/X | URL intent/tweet |
| LinkedIn | URL shareArticle |
| WhatsApp | URL wa.me |
| Copy Link | navigator.clipboard + toast |

Mobile: dùng Web Share API nếu hỗ trợ.

| File | Hành động |
|---|---|
| **index.html** | Sửa — FB SDK |
| **src/components/FacebookComments.tsx** | Tạo mới |
| **src/components/ShareButtons.tsx** | Tạo mới |
| **src/Navigations/BlogPost.tsx** | Sửa |
| **src/Navigations/ProductPost.tsx** | Sửa |

---

## Phase 7: View Counting

### Bước 1 — Schema + API

Schema `viewCount`: contentType, contentSlug, views, lastViewed. Worker API `POST /api/view` → atomic increment.

### Bước 2 — Frontend

Hook `useViewCount`: check localStorage 24h → gọi API. Component `ViewCounter` hiển thị lượt xem.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/viewCount.ts** | Tạo mới |
| **vncms/schemaTypes/index.ts** | Sửa |
| **vncms/lib/querries.ts** | Sửa |
| **worker.js** | Sửa — API endpoint |
| **src/hooks/useViewCount.ts** | Tạo mới |
| **src/components/ViewCounter.tsx** | Tạo mới |
| **src/Navigations/BlogPost.tsx** | Sửa |
| **src/Navigations/ProductPost.tsx** | Sửa |

---

## Phase 8: SEO Analytics

### Bước 1 — Cấu hình trong CMS

Schema singleton `analyticsConfig`:

| Field | Mô tả | Ví dụ |
|---|---|---|
| gaTrackingId | GA4 Measurement ID | `G-XXXXXXX` |
| gscVerification | Google Search Console code | Chuỗi meta tag |
| gtmContainerId | GTM Container ID | `GTM-XXXXXXX` |
| fbPixelId | Facebook Pixel (optional) | `123456789` |

### Bước 2 — Worker inject scripts

Worker fetch config (cache 1 giờ) → inject scripts vào `<head>` của index.html trước khi trả response. Admin đổi ID trong CMS → tự apply.

| File | Hành động |
|---|---|
| **vncms/schemaTypes/analyticsConfig.ts** | Tạo mới |
| **vncms/schemaTypes/index.ts** | Sửa |
| **vncms/lib/querries.ts** | Sửa |
| **worker.js** | Sửa — inject scripts |

---

## Phase 9: Module Kiểm Tra Lỗi Bài Viết

Tool "Content Audit" trong Sanity Studio — quét tất cả post + product:

| Loại lỗi | Cách detect | Mức độ |
|---|---|---|
| Thiếu ALT ảnh | Scan body → image blocks có alt trống | Nghiêm trọng |
| Thiếu meta title | seo.seoTitle trống | Nghiêm trọng |
| Thiếu meta description | seo.seoDescription trống | Nghiêm trọng |
| Meta title quá dài/ngắn | Ngoài 30–60 ký tự | Cảnh báo |
| Meta description quá dài/ngắn | Ngoài 80–160 ký tự | Cảnh báo |
| Thiếu focus keyword | seo.focusKeyword trống | Cảnh báo |
| Thiếu keywords | seo.seoKeywords length < 3 | Cảnh báo |
| Thiếu slug | slug.current undefined | Nghiêm trọng |
| Thiếu OG Image | seo.ogImage null | Cảnh báo |
| Dữ liệu thiếu cho schema | Article thiếu author, Product thiếu description | Cảnh báo |

Dashboard: bao nhiêu OK / cần sửa / lỗi nghiêm trọng. Bộ lọc theo type + lỗi. Click → mở editor sửa.

| File | Hành động |
|---|---|
| **vncms/components/ContentAudit.tsx** | Tạo mới |
| **vncms/components/ContentAuditDashboard.tsx** | Tạo mới |
| **vncms/sanity.config.ts** | Sửa — đăng ký tool |
