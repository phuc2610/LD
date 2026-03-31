# Kế Hoạch Nâng Cấp SEO & Đa Quốc Gia — VINUT USA

---

## Hiện trạng

| Tính năng | Trạng thái | Ghi chú |
|---|---|---|
| Market hiện có | US + Thailand | Hard-code trong market.config.ts |
| Geo-targeting theo IP | Chưa | User chọn thủ công bằng dropdown |
| Sản phẩm/banner theo quốc gia | Chưa | Chung cho tất cả |
| SEO Panel | Có | Cơ bản: title, description, keywords, OG image |
| Sitemap / Schema / Redirect | Chưa | — |
| SEO Checklist / Tags / Auto ALT | Chưa | — |
| Facebook Comments / Share | Chưa | — |
| View counting / Analytics | Chưa | — |

---

## Phase 0: Hệ Thống Đa Quốc Gia — Sẵn Sàng Mở Rộng Toàn Cầu

### Bối cảnh

Hiện tại website chỉ phục vụ 2 thị trường: US (mặc định) và Thailand. Tuy nhiên, mục tiêu dài hạn là mở rộng ra toàn thế giới — bất kỳ quốc gia nào VINUT muốn tiếp cận đều có thể được thêm vào hệ thống mà không cần sửa code hay deploy lại.

Toàn bộ kiến trúc Phase 0 phải được thiết kế theo nguyên tắc: admin chỉ cần thao tác trên CMS để thêm quốc gia mới, hệ thống tự xử lý routing, ngôn ngữ, sản phẩm, banner, SEO. Không có giới hạn về số lượng quốc gia.

---

### Bước 1 — Chuyển quản lý quốc gia từ code sang CMS

Hiện tại danh sách market nằm trong file [market.config.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/config/market.config.ts), hard-code 2 entry (US, Thailand). Mỗi lần muốn thêm quốc gia mới (ví dụ Japan, Korea, Vietnam, Indonesia...) phải sửa file này, thêm file translation, sửa routing, rồi deploy lại. Cách làm này không thể scale khi mở rộng toàn cầu.

Giải pháp: tạo schema `marketConfig` trong Sanity CMS. Mỗi document là một quốc gia. Admin tạo quốc gia mới hoàn toàn trên CMS — không cần developer can thiệp. Mỗi document chứa: mã quốc gia (unique, dùng trong URL + logic), tên hiển thị trong dropdown, prefix cho URL (rỗng = default market), mã ngôn ngữ BCP 47, mã tiền tệ ISO 4217, mã hreflang cho SEO, cờ quốc gia, flag đánh dấu market mặc định, danh sách mã ISO 3166-1 alpha-2 ánh xạ với market (để match IP), và trạng thái bật/tắt.

Field `isoCountryCodes` rất quan trọng: nó ánh xạ mã quốc gia từ IP (Cloudflare trả về ISO code như [US](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/interfaces.ts#119-123), `TH`, `JP`, `VN`, `KR`) với market tương ứng. Một market có thể map nhiều ISO code — ví dụ market "Southeast Asia" có thể map `SG, MY, ID, PH` cùng lúc.

Khi app khởi động, thay vì đọc mảng hard-code, sẽ fetch danh sách markets từ Sanity API. Kết quả được cache để không gọi API mỗi request. Ban đầu chuẩn bị sẵn 2 documents: US (isDefault=true) và Thailand.

Files liên quan: tạo mới **`vncms/schemaTypes/marketConfig.ts`**, sửa **[vncms/schemaTypes/index.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/index.ts)** để đăng ký schema, sửa **[src/config/market.config.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/config/market.config.ts)** bỏ hard-code để fetch từ Sanity, sửa **[vncms/lib/querries.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/lib/querries.ts)** thêm query lấy danh sách markets.

---

### Bước 2 — Tự động phát hiện quốc gia theo IP

Khi người dùng lần đầu truy cập website, hệ thống cần tự nhận diện họ đến từ quốc gia nào. Cloudflare Workers có sẵn header `cf-ipcountry` chứa mã quốc gia ISO 2 chữ cái — không cần gọi API bên ngoài, không tốn phí, không có độ trễ.

Luồng xử lý trong Worker khi user truy cập `/` (root): đầu tiên kiểm tra cookie `vinut-market` — nếu có thì dùng giá trị cookie, bỏ qua IP (cookie được set khi user tự chọn quốc gia hoặc lần đầu auto-detect). Nếu không có cookie, đọc `cf-ipcountry` từ request header, so sánh mã ISO với field `isoCountryCodes` trong danh sách markets đã cache. Nếu match (ví dụ IP từ Nhật, `JP` nằm trong isoCountryCodes của market Japan) → redirect 302 đến `/{urlPrefix}/` + set cookie `vinut-market=japan` (max-age 30 ngày). Nếu không match bất kỳ market nào → giữ nguyên ở US (default), set cookie `vinut-market=us`.

Dùng 302 (tạm thời) chứ không phải 301 (vĩnh viễn), vì cùng URL `/` redirect khác nhau tùy IP. Nếu dùng 301, trình duyệt hoặc CDN cache redirect vĩnh viễn → gây lỗi. Khi user tự chọn quốc gia khác qua dropdown → cookie cập nhật → lần sau Worker đọc cookie trước, không ghi đè bằng IP.

Khi mở rộng thêm quốc gia: admin chỉ cần tạo document market mới trong CMS với isoCountryCodes phù hợp → Worker tự nhận diện IP mới.

Files liên quan: sửa **[worker.js](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/worker.js)** thêm logic IP detection + market matching + redirect + cookie.

---

### Bước 3 — Sản phẩm riêng cho từng quốc gia

Mỗi thị trường có lineup sản phẩm khác nhau tùy thuộc vào sở thích tiêu dùng, quy định nhập khẩu, và chiến lược kinh doanh. Ví dụ Thailand bán nhiều nước dừa, Japan chuộng matcha, Hàn Quốc có Aloe Vera đặc biệt.

Thêm field `markets` vào schema product — mảng reference đến `marketConfig`. Admin khi tạo/sửa sản phẩm sẽ tick chọn quốc gia nào được bán sản phẩm này. Nếu product có `markets = [japan, korea]` → chỉ hiển thị ở Japan và Korea. Nếu product không gắn market nào (mảng rỗng) → hiển thị ở tất cả market (sản phẩm toàn cầu). User ở market Japan sẽ thấy: sản phẩm gắn Japan + sản phẩm toàn cầu.

Cách này backward compatible: tất cả sản phẩm hiện tại không có field markets → tự động là sản phẩm toàn cầu, vẫn hiển thị bình thường. Tất cả GROQ queries sản phẩm cần sửa để nhận thêm param `marketCode` và filter.

Files liên quan: sửa **[vncms/schemaTypes/product.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/product.ts)** thêm field markets, sửa **[vncms/lib/querries.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/lib/querries.ts)** filter theo market, sửa **[src/Navigations/Products.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/Products.tsx)**, **[src/sections/PopularProducts.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/sections/PopularProducts.tsx)**, **[src/components/RelatedProducts.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/components/RelatedProducts.tsx)** truyền market code.

---

### Bước 4 — Banner riêng cho từng quốc gia

Banner hero (carousel trang chủ) và banner trang con cần hình ảnh phù hợp văn hóa và sản phẩm chủ lực của từng quốc gia. Hiện tại 3 slides hero hard-code trong constants với ảnh cố định.

Tạo schema `heroBanner` trong CMS. Mỗi document chứa: tiêu đề, chủ đề, ảnh banner, mô tả, market (reference đến marketConfig), thứ tự hiển thị. Admin tạo nhiều bộ banner cho mỗi quốc gia. Khi market Japan có 4 banners riêng → hiển thị 4 banners đó. Khi market Korea chưa có banner riêng → fallback lấy banners của US (default market).

Tương tự, banner tiêu đề trên các trang con (Products, Blog, Contact...) cũng hỗ trợ ảnh khác nhau cho từng quốc gia thông qua schema `pageSlug` (Phase 1).

Files liên quan: tạo mới **`vncms/schemaTypes/heroBanner.ts`**, sửa **[vncms/schemaTypes/index.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/index.ts)**, sửa **[vncms/lib/querries.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/lib/querries.ts)** query banner theo market, sửa **[src/Navigations/Landing.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/Landing.tsx)** fetch banners từ Sanity thay constants, sửa **[src/sections/Hero.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/sections/Hero.tsx)** nhận data từ Sanity, sửa **[src/components/Layout.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/components/Layout.tsx)** banner trang con theo market, sửa **[src/constants/index.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/constants/index.tsx)** loại bỏ hard-code slides.

---

### Bước 5 — Routing động và mở rộng i18n

Routing hiện tạo routes từ mảng `MARKET_LIST` hard-code 2 entries. Khi admin thêm quốc gia mới trong CMS, hệ thống phải tự tạo routes mà không sửa code. App.tsx khi khởi động sẽ fetch danh sách markets từ Sanity → dựa trên kết quả tạo routes động cho N quốc gia. MarketDropdown hiển thị tất cả markets active từ CMS. Nếu Sanity API lỗi → app fallback về chạy US only.

Về i18n: mỗi market mới cần file translation trong `src/i18n/`. Tuy nhiên không bắt buộc — nếu chưa có file translation cho market đó, hệ thống tự fallback về US English. Cơ chế fallback: ưu tiên file translation theo market code (ví dụ `i18n/japan.ts`), nếu không tồn tại → dùng `i18n/us.ts`.

Files liên quan: sửa **`src/App.tsx`** fetch markets + tạo routes động, sửa **`src/context/MarketContext.tsx`** hỗ trợ dynamic markets, sửa **`src/components/MarketDropdown.tsx`** hiển thị từ CMS data, sửa **`src/i18n/index.ts`** dynamic import, tạo mới file **`src/i18n/[market].ts`** khi có market mới.

---

### Kịch bản mẫu: Thêm market Japan

| Bước | Ai | Hành động | Kết quả |
|---|---|---|---|
| 1 | Admin | CMS → tạo marketConfig: code=japan, prefix=japan, ISO=JP | Market Japan xuất hiện |
| 2 | Admin | CMS → tạo heroBanner cho Japan | Banner riêng |
| 3 | Admin | CMS → sửa products → gắn Japan | Sản phẩm phù hợp Nhật |
| 4 | Dev (optional) | Tạo `src/i18n/japan.ts` | UI tiếng Nhật (bỏ qua → dùng English) |
| 5 | Tự động | IP Nhật → Worker detect JP → redirect /japan/ | Hoàn tất, không cần deploy |

---

## Phase 1: Slug, Redirect, Sitemap

### Bước 1 — Hàm slug chuẩn SEO

Slug mặc định Sanity chỉ lowercase + thay space bằng `-`. Chưa xử lý dấu tiếng Việt, ký tự đặc biệt, hoặc slug quá dài. Viết hàm slugify dùng chung: lowercase → bỏ dấu (`ă→a`, `ê→e`, `ü→u`...) → thay space/ký tự đặc biệt bằng `-` → loại `-` liên tiếp → trim đầu/cuối. Ví dụ `"Nước Ép Trái Cây Tươi @2024"` → `"nuoc-ep-trai-cay-tuoi-2024"`.

Files liên quan: tạo mới **`vncms/lib/slugify.ts`**.

### Bước 2 — Áp dụng slug cho schemas

Thay slugify mặc định bằng hàm chuẩn SEO ở tất cả schemas có field slug.

Files liên quan: sửa **`vncms/schemaTypes/post.ts`**, **`product.ts`**, **`productcategory.ts`**, **`faq.ts`**, **`history.ts`**.

### Bước 3 — Slug trang tĩnh từ CMS

Trang About Us, Contact Us... hiện slug hard-code trong router. Tạo schema `pageSlug` cho admin tùy chỉnh slug — mỗi quốc gia có thể có slug khác (ví dụ `/about-us` cho US, `/gioi-thieu` cho VN). Mỗi document chứa: tên trang, slug tùy chỉnh, SEO panel, và market.

Files liên quan: tạo mới **`vncms/schemaTypes/pageSlug.ts`**, sửa **`vncms/schemaTypes/index.ts`**.

### Bước 4 — Redirect 301/404

Tạo schema `redirect` trong CMS. Admin nhập đường dẫn cũ, đường dẫn mới, mã HTTP (301 hoặc 302), trạng thái bật/tắt. Worker kiểm tra redirect rules trước SPA fallback — cache rules 1 giờ, nếu URL match fromPath → trả HTTP redirect. Trang 404 thêm meta `noindex` + gợi ý trang chính.

Files liên quan: tạo mới **`vncms/schemaTypes/redirect.ts`**, sửa **`vncms/schemaTypes/index.ts`**, sửa **`vncms/lib/querries.ts`**, sửa **`worker.js`**, sửa **`src/Navigations/NotFound404.tsx`**.

### Bước 5 — Sitemap.xml tự động

Worker xử lý 6 routes sitemap, fetch data từ Sanity, generate XML động, cache 1 giờ. Gồm: sitemap index trỏ đến 5 sub-sitemaps (pages, posts, products, categories, images). Mỗi URL kèm `hreflang` alternate links cho tất cả markets active — khi admin thêm market mới, sitemap tự bổ sung hreflang sau tối đa 1 giờ. Tạo `robots.txt` trỏ đến sitemap. Thêm field `lastModified` vào schema post (product đã có).

Files liên quan: tạo mới **`src/utils/sitemap-builder.ts`**, sửa **`worker.js`**, sửa **`vncms/schemaTypes/post.ts`**, tạo mới **`public/robots.txt`**.

---

## Phase 2: Schema Markup

Schema markup (JSON-LD) giúp Google hiểu cấu trúc nội dung → hiện rich snippets (sao đánh giá, FAQ, breadcrumb...) → tăng CTR.

### Bước 1 — Hàm generate JSON-LD

Tạo utility functions nhận dữ liệu → trả về object JSON-LD cho từng loại: Article (BlogPost — title, author, publishedAt, image), Product (ProductPost — name, description, image, brand, reviews), BreadcrumbList (tất cả trang con — Home → Section → Tên trang), FAQPage (Faqs — question + answer), VideoObject (AboutUs — video about-us.mp4), AggregateRating (Landing — trung bình rating), NewsArticle (BlogPost tin tức).

### Bước 2 — Component render và tích hợp

Tạo component `JsonLd` render `<script type="application/ld+json">` vào `<head>` qua Helmet. Gắn vào từng trang với hàm generate tương ứng.

Files liên quan: tạo mới **`src/utils/schema-markup.ts`**, **`src/components/JsonLd.tsx`**. Sửa **`src/Navigations/BlogPost.tsx`** (Article + Breadcrumb), **`ProductPost.tsx`** (Product + Breadcrumb), **`Faqs.tsx`** (FAQPage), **`AboutUs.tsx`** (VideoObject), **`Landing.tsx`** (AggregateRating).

---

## Phase 3: Module Viết Bài Chuẩn SEO

### Bước 1 — Mở rộng SEO panel

Thêm 2 field: `focusKeyword` (từ khóa chính muốn SEO, dùng để chấm điểm) và `canonicalUrl` (URL canonical tùy chỉnh, optional).

Files liên quan: sửa **`vncms/schemaTypes/seoPanel.ts`**.

### Bước 2 — SEO Checklist trong Sanity Studio

Tạo custom component hiển thị real-time khi soạn bài, đánh giá 11 tiêu chí: SEO title chứa focus keyword (30–60 ký tự), meta description chứa keyword (80–160 ký tự), có OG image, slug chứa keyword, body có heading H2/H3, tất cả ảnh có ALT, có internal links, độ dài body trên 300 từ, keyword ở đoạn đầu. Hiển thị pass/warning/fail + điểm tổng /100.

Files liên quan: tạo mới **`vncms/components/SeoChecklist.tsx`**, sửa **`vncms/schemaTypes/post.ts`** và **`product.ts`** tích hợp checklist vào group SEO.

---

## Phase 4: Internal Link & Tags

### Bước 1 — Tags

Tags phân loại nội dung chi tiết hơn categories — cho phép matching bài viết liên quan chính xác + tạo internal links. Tạo schema `tag` (name + slug). Thêm field `tags` vào post và product. Tạo component TagList hiển thị pills, click → filter bài viết/sản phẩm cùng tag.

Files liên quan: tạo mới **`vncms/schemaTypes/tag.ts`**, **`src/components/TagList.tsx`**. Sửa **`vncms/schemaTypes/index.ts`**, **`post.ts`**, **`product.ts`**, **`vncms/lib/querries.ts`**, **`src/Navigations/BlogPost.tsx`**, **`ProductPost.tsx`**.

### Bước 2 — Bài viết liên quan cải tiến

BlogPost hiện hiển thị "Recent Articles" (bài mới nhất). Thay bằng "Related Articles" — ưu tiên bài có tags chung, nếu không đủ bổ sung bằng recent.

Files liên quan: sửa **`src/Navigations/BlogPost.tsx`**.

### Bước 3 — Gợi ý nội link trong CMS

Tạo panel sidebar trong Sanity Studio. Khi edit bài, panel tự query bài viết/sản phẩm có title hoặc tags match focus keyword/title bài hiện tại → gợi ý link cho admin chèn vào body.

Files liên quan: tạo mới **`vncms/components/InternalLinkSuggestion.tsx`**, sửa **`vncms/sanity.config.ts`** đăng ký panel.

---

## Phase 5: Hình Ảnh — Tự Sinh ALT

ALT text là cách duy nhất Google hiểu nội dung ảnh. Thiếu ALT = mất ranking Google Images + accessibility kém.

Thêm field `alt` cho image type trong blockContent — khi admin chèn ảnh sẽ thấy ô nhập ALT. Validation warning nếu trống. Tạo hàm auto-generate ALT: tách filename từ URL → bỏ extension → thay `-`/`_` bằng space → capitalize → nối title bài nếu có. Ví dụ: URL `coconut-water-fresh.jpg` + title `Benefits of Coconut` → ALT `"Coconut Water Fresh - Benefits of Coconut"`. BlogPostBody khi render ảnh: nếu có alt → dùng, nếu không → auto-generate. Rà soát tất cả `<img>` tags trong components khác.

Files liên quan: sửa **`vncms/schemaTypes/blockContent.ts`**, tạo mới **`src/utils/auto-alt.ts`**, sửa **`src/components/BlogPostBody.tsx`**.

---

## Phase 6: Social Network

### Bước 1 — Facebook Comments

Đăng ký Facebook App → lấy App ID. Load Facebook JS SDK async vào index.html (không ảnh hưởng page speed). Tạo component FacebookComments render comments box. Gắn vào BlogPost và ProductPost dưới nội dung chính.

### Bước 2 — Share Buttons

Tạo component 5 nút share: Facebook (sharer.php), Twitter/X (intent/tweet), LinkedIn (shareArticle), WhatsApp (wa.me), Copy Link (clipboard + toast). Mobile dùng Web Share API native nếu browser hỗ trợ. Gắn vào BlogPost và ProductPost.

Files liên quan: sửa **`index.html`** (FB SDK), tạo mới **`src/components/FacebookComments.tsx`** và **`ShareButtons.tsx`**, sửa **`src/Navigations/BlogPost.tsx`** và **`ProductPost.tsx`**.

---

## Phase 7: View Counting

Đếm lượt xem giúp admin biết sản phẩm/bài viết nào được quan tâm → quyết định nội dung hiệu quả.

Tạo schema `viewCount` (contentType, contentSlug, views, lastViewed). Worker thêm API `POST /api/view` — nhận type + slug → atomic increment views trong Sanity. Frontend: hook `useViewCount` kiểm tra localStorage tránh count trùng 24h → gọi API. Component `ViewCounter` hiển thị số lượt xem. Gắn vào BlogPost và ProductPost.

Files liên quan: tạo mới **`vncms/schemaTypes/viewCount.ts`**, **`src/hooks/useViewCount.ts`**, **`src/components/ViewCounter.tsx`**. Sửa **`vncms/schemaTypes/index.ts`**, **`vncms/lib/querries.ts`**, **`worker.js`**, **`src/Navigations/BlogPost.tsx`**, **`ProductPost.tsx`**.

---

## Phase 8: SEO Analytics

Admin cần tích hợp tracking tools mà không cần developer deploy lại.

Tạo schema singleton `analyticsConfig` — admin nhập GA4 Measurement ID (`G-XXXXXXX`), GSC verification code, GTM Container ID (`GTM-XXXXXXX`), Facebook Pixel ID (optional). Worker khi trả index.html: fetch config từ Sanity (cache 1 giờ) → inject scripts (GSC meta tag + GTM + GA4 gtag.js + FB Pixel) vào `<head>` → trả HTML đã inject. Admin đổi ID trong CMS → tự apply khi cache hết hạn, không cần redeploy.

Files liên quan: tạo mới **`vncms/schemaTypes/analyticsConfig.ts`**. Sửa **`vncms/schemaTypes/index.ts`**, **`vncms/lib/querries.ts`**, **`worker.js`**.

---

## Phase 9: Module Kiểm Tra Lỗi Bài Viết

Tạo tool "Content Audit" trong Sanity Studio — quét tất cả post + product, phát hiện lỗi SEO.

Các lỗi kiểm tra:

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
| Thiếu dữ liệu schema | Article thiếu author, Product thiếu description | Cảnh báo |

Dashboard tổng hợp: bao nhiêu OK / cần sửa / lỗi nghiêm trọng. Bộ lọc theo loại content, loại lỗi. Click vào dòng lỗi → mở document editor sửa ngay.

Files liên quan: tạo mới **`vncms/components/ContentAudit.tsx`**, **`ContentAuditDashboard.tsx`**. Sửa **`vncms/sanity.config.ts`** đăng ký tool.
