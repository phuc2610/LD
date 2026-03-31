# Kế Hoạch Nâng Cấp SEO Toàn Diện — VINUT USA

## Hiện trạng

| Tính năng | Trạng thái |
|---|---|
| Slug tự động | ✅ Có (từ title/name) — chưa cho phép tùy chỉnh cho trang tĩnh |
| SEO Panel | ✅ Cơ bản (title, description, keywords, OG image) |
| Sitemap.xml | ❌ |
| Schema Markup | ❌ |
| Redirect 301/404 | ❌ Chỉ SPA fallback |
| SEO Checklist | ❌ |
| Tags bài viết | ❌ |
| Internal Link gợi ý | ❌ |
| Auto ALT ảnh | ❌ |
| Facebook Comments / Share | ❌ |
| View counting | ❌ |
| GA4 / GSC / GTM | ❌ |
| CMS Error Checker | ❌ |
| Related Products | ✅ (theo category) |

---

## Phase 1: Slug, Redirect 301/404, Sitemap.xml

### 1.1 Slug chuẩn SEO

**Bước 1** — Tạo [NEW] `vncms/lib/slugify.ts`
- Viết hàm `seoSlugify(input: string)`: lowercase → bỏ dấu tiếng Việt → thay space bằng `-` → loại ký tự đặc biệt → trim dashes đầu/cuối

**Bước 2** — Sửa [post.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/post.ts)
- Import `seoSlugify` → dùng làm custom `slugify` function trong field `slug.options`
- Thêm validation: không cho slug trùng, giới hạn 96 ký tự

**Bước 3** — Sửa [product.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/product.ts) và [productcategory.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/productcategory.ts)
- Áp dụng `seoSlugify` tương tự post.ts
- Thêm SEO panel cho `productcategory`

**Bước 4** — Tạo [NEW] `vncms/schemaTypes/pageSlug.ts`
- Schema document cho phép admin cấu hình slug trang tĩnh (about-us, contact-us, faqs, blog, products...)
- Fields: `pageName` (string), `slug` (slug), `seo` (seoPanel)

**Bước 5** — Register `pageSlug` trong [index.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/index.ts)

---

### 1.2 Redirect 301/404

**Bước 1** — Tạo [NEW] `vncms/schemaTypes/redirect.ts`
```ts
// Fields: fromPath (string), toPath (string), statusCode (301|302), isActive (boolean)
```

**Bước 2** — Register `redirect` trong [schemaTypes/index.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/index.ts)

**Bước 3** — Thêm GROQ query vào [querries.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/lib/querries.ts)
```groq
*[_type == "redirect" && isActive == true]{ fromPath, toPath, statusCode }
```

**Bước 4** — Sửa [worker.js](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/worker.js)
- Trước SPA fallback, fetch redirect rules từ Sanity (cache 1 giờ bằng Cache API)
- Nếu `url.pathname` match `fromPath` → trả `Response.redirect(toPath, statusCode)`
- Không match → tiếp tục SPA fallback như cũ

**Bước 5** — Sửa [NotFound404.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/NotFound404.tsx)
- Thêm `<Helmet>` với `<meta name="robots" content="noindex">` 
- Thêm gợi ý links cho user (Home, Products, Blog)

---

### 1.3 Sitemap.xml (tự động cập nhật)

**Bước 1** — Tạo [NEW] `src/utils/sitemap-builder.ts`
- Hàm `buildSitemapIndex(sitemaps[])` → XML sitemap index
- Hàm `buildUrlSet(urls[])` → XML urlset
- Hàm `buildImageSitemap(images[])` → XML image sitemap
- Support `hreflang` alternate links cho multi-market (US + Thailand)

**Bước 2** — Sửa [worker.js](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/worker.js) — Thêm route handlers:

| Route | Nội dung |
|---|---|
| `/sitemap.xml` | Sitemap index trỏ đến 5 sub-sitemaps |
| `/sitemap-pages.xml` | Trang tĩnh: `/`, `/products`, `/blog`, `/about-us`, `/contact-us`, `/faqs` + Thailand variants |
| `/sitemap-posts.xml` | Fetch `*[_type=="post"]{slug, publishedAt, "imageUrl": mainImage.asset->url}` |
| `/sitemap-products.xml` | Fetch `*[_type=="product"]{slug, lastModified, "imageUrl": mainImage.asset->url}` |
| `/sitemap-categories.xml` | Fetch `*[_type=="productcategory"]{slug}` |
| `/image-sitemap.xml` | Tổng hợp imageUrl từ posts + products |

- Mỗi sitemap response có header `Content-Type: application/xml`
- Cache bằng Cloudflare Cache API (TTL 1 giờ) — tự cập nhật khi cache hết hạn

**Bước 3** — Thêm field `lastModified` (datetime) vào [post.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/post.ts) nếu chưa có (product.ts đã có)

**Bước 4** — Tạo/sửa `public/robots.txt`
```
User-agent: *
Allow: /
Sitemap: https://vinut-usa.vnt.workers.dev/sitemap.xml
```

---

## Phase 2: Schema Markup (Structured Data)

**Bước 1** — Tạo [NEW] `src/utils/schema-markup.ts`
- Các hàm generate JSON-LD object:

```ts
export function buildArticleSchema(post: ArticleType): object { ... }
export function buildProductSchema(product: ProductType, reviews?: ReviewType[]): object { ... }
export function buildBreadcrumbSchema(items: {name: string, url: string}[]): object { ... }
export function buildFAQSchema(faqs: FAQType[]): object { ... }
export function buildVideoSchema(video: {name, description, thumbnailUrl, contentUrl, uploadDate}): object { ... }
export function buildAggregateRatingSchema(reviews: ReviewType[]): object { ... }
export function buildNewsArticleSchema(post: ArticleType): object { ... }
```

**Bước 2** — Tạo [NEW] `src/components/JsonLd.tsx`
```tsx
const JsonLd = ({ data }: { data: object }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);
```

**Bước 3** — Sửa [BlogPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/BlogPost.tsx)
- Import `buildArticleSchema`, `buildBreadcrumbSchema`
- Thêm `<JsonLd data={buildArticleSchema(post)} />`
- Thêm `<JsonLd data={buildBreadcrumbSchema([{name:"Home",url:"/"},{name:"Blog",url:"/blog"},{name:post.title,url:currentUrl}])} />`

**Bước 4** — Sửa [ProductPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/ProductPost.tsx)
- Thêm `<JsonLd data={buildProductSchema(product)} />`
- Thêm `<JsonLd data={buildBreadcrumbSchema([...])} />`

**Bước 5** — Sửa [Faqs.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/Faqs.tsx)
- Thêm `<JsonLd data={buildFAQSchema(allFAQs)} />`

**Bước 6** — Sửa [AboutUs.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/AboutUs.tsx)
- Thêm `<JsonLd data={buildVideoSchema({name:"About VINUT",contentUrl:"/about-us.mp4",...})} />`

**Bước 7** — Sửa [Landing.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/Landing.tsx)
- Fetch reviews → thêm `<JsonLd data={buildAggregateRatingSchema(reviews)} />`

---

## Phase 3: Module Viết Bài Chuẩn SEO (Yoast-like)

**Bước 1** — Sửa [seoPanel.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/seoPanel.ts)
- Thêm field `focusKeyword` (string) — từ khóa chính
- Thêm field `canonicalUrl` (url) — canonical URL tùy chỉnh (optional)

**Bước 2** — Tạo [NEW] `vncms/components/SeoChecklist.tsx`
- Custom Sanity component nhận document data → chấm điểm real-time
- Checklist items:

| # | Kiểm tra | Điều kiện Pass |
|---|---|---|
| 1 | SEO Title chứa focus keyword | `seoTitle.includes(focusKeyword)` |
| 2 | Độ dài SEO Title | 30–60 ký tự |
| 3 | Meta Description chứa focus keyword | `seoDescription.includes(focusKeyword)` |
| 4 | Độ dài Meta Description | 80–160 ký tự |
| 5 | Có OG Image | `ogImage != null` |
| 6 | Slug chứa keyword | `slug.current.includes(keyword)` |
| 7 | Body có heading H2/H3 | Scan blockContent styles |
| 8 | Ảnh trong body có ALT | Scan image blocks |
| 9 | Có internal links | Scan link annotations |
| 10 | Độ dài body | >300 từ |
| 11 | Keyword ở đoạn đầu | Đoạn block đầu tiên chứa keyword |

- Hiển thị icon ✅/⚠️/❌ cho mỗi item + điểm tổng /100

**Bước 3** — Sửa [post.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/post.ts)
- Thêm `SeoChecklist` component vào group `seo` bằng `inputComponent` hoặc custom view

**Bước 4** — Sửa [product.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/product.ts)
- Tương tự — tích hợp `SeoChecklist`

---

## Phase 4: Internal Link & Tags

### 4.1 Tags

**Bước 1** — Tạo [NEW] `vncms/schemaTypes/tag.ts`
```ts
// document: name (string), slug (slug from name)
```

**Bước 2** — Register `tag` trong [schemaTypes/index.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/index.ts)

**Bước 3** — Sửa [post.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/post.ts) — thêm field:
```ts
defineField({
  name: 'tags',
  title: 'Tags',
  type: 'array',
  of: [{type: 'reference', to: {type: 'tag'}}],
})
```

**Bước 4** — Sửa [product.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/product.ts) — thêm field `tags` tương tự

**Bước 5** — Thêm GROQ queries vào [querries.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/lib/querries.ts):
```groq
// Bài viết liên quan theo tags chung
RELATED_POSTS_BY_TAGS = *[_type=="post" && slug.current != $currentSlug 
  && count(tags[@._ref in $tagIds]) > 0] | order(publishedAt desc)[0..5]
  { title, slug, "imageUrl": mainImage.asset->url, publishedAt }

// Fetch posts theo tag slug
POSTS_BY_TAG = *[_type=="post" && $tagSlug in tags[]->slug.current]
  { title, slug, "imageUrl": mainImage.asset->url, publishedAt }
```

**Bước 6** — Tạo [NEW] `src/components/TagList.tsx`
- Nhận `tags[]` → render danh sách tag pills
- Click tag → navigate đến `/blog?tag=<slug>`

**Bước 7** — Sửa [BlogPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/BlogPost.tsx) — thêm `<TagList tags={post.tags} />`

**Bước 8** — Sửa [ProductPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/ProductPost.tsx) — thêm `<TagList tags={product.tags} />`

### 4.2 Bài viết liên quan cải tiến

**Bước 9** — Sửa [BlogPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/BlogPost.tsx)
- Thay "Recent Articles" → fetch `RELATED_POSTS_BY_TAGS` (dựa trên tags chung)
- Fallback: nếu không đủ related → bổ sung bằng recent articles

### 4.3 Gợi ý chèn nội link

**Bước 10** — Tạo [NEW] `vncms/components/InternalLinkSuggestion.tsx`
- Custom Sanity Studio panel (document view pane)
- Khi đang edit bài viết, panel hiển thị danh sách bài viết/sản phẩm có title/tags liên quan đến `focusKeyword` hoặc title hiện tại
- Mỗi item hiển thị: tên + URL → admin copy-paste link vào body
- Query: `*[_type in ["post","product"] && (title match $keyword || $keyword in tags[]->name)]`

**Bước 11** — Đăng ký panel trong [sanity.config.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/sanity.config.ts) qua `structureTool` views

---

## Phase 5: Hình Ảnh — Tự Sinh ALT

**Bước 1** — Sửa [blockContent.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/blockContent.ts)
- Thêm field `alt` vào image member:
```ts
defineArrayMember({
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', title: 'Alt Text', type: 'string',
      description: 'Mô tả ảnh cho SEO. Nếu để trống sẽ tự sinh từ tên file.' }
  ],
})
```
- Thêm validation warning nếu `alt` trống

**Bước 2** — Tạo [NEW] `src/utils/auto-alt.ts`
```ts
export function generateAlt(imageUrl: string, contextTitle?: string): string {
  // Tách filename từ URL → bỏ extension → thay - _ bằng space → capitalize
  // Nếu có contextTitle → append: "filename - contextTitle"
}
```

**Bước 3** — Sửa [BlogPostBody.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/components/BlogPostBody.tsx)
- Trong image serializer: nếu không có `alt` field → gọi `generateAlt(url, parentTitle)`

**Bước 4** — Kiểm tra tất cả component có `<img>` (Nav, Footer, Hero, ProductCard, ArticleCard, StoreCard...)
- Đảm bảo mọi `<img>` có `alt` attribute có nghĩa (không phải chuỗi rỗng)

---

## Phase 6: Social Network

### 6.1 Facebook Comments

**Bước 1** — Sửa [index.html](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/index.html)
- Thêm `<meta property="fb:app_id" content="YOUR_FB_APP_ID" />` vào `<head>`
- Thêm `<div id="fb-root"></div>` sau `<body>`

**Bước 2** — Tạo [NEW] `src/components/FacebookComments.tsx`
```tsx
// Load Facebook JS SDK (async, chỉ load 1 lần)
// Render <div class="fb-comments" data-href={url} data-numposts={numPosts} />
// Gọi FB.XFBML.parse() sau khi mount
```

**Bước 3** — Sửa [BlogPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/BlogPost.tsx) — thêm `<FacebookComments url={canonicalUrl} numPosts={5} />` dưới nội dung

**Bước 4** — Sửa [ProductPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/ProductPost.tsx) — thêm `<FacebookComments url={canonicalUrl} numPosts={5} />`

### 6.2 Share Buttons

**Bước 5** — Tạo [NEW] `src/components/ShareButtons.tsx`
- Props: `url`, `title`, `description`
- Các nút share:
  - **Facebook**: `https://www.facebook.com/sharer/sharer.php?u=${url}`
  - **Twitter/X**: `https://twitter.com/intent/tweet?url=${url}&text=${title}`
  - **LinkedIn**: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`
  - **WhatsApp**: `https://wa.me/?text=${title} ${url}`
  - **Copy Link**: `navigator.clipboard.writeText(url)` + toast thông báo
- Mobile: dùng `navigator.share()` API nếu browser hỗ trợ

**Bước 6** — Sửa [BlogPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/BlogPost.tsx) + [ProductPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/ProductPost.tsx) — thêm `<ShareButtons />` ở đầu hoặc cuối bài

---

## Phase 7: View Counting

**Bước 1** — Tạo [NEW] `vncms/schemaTypes/viewCount.ts`
```ts
// document: contentType (string: "post"|"product"), contentSlug (string), 
//           views (number, default 0), lastViewed (datetime)
```

**Bước 2** — Register schema + thêm GROQ query:
```groq
VIEW_COUNT_BY_SLUG = *[_type=="viewCount" && contentType==$type && contentSlug==$slug][0]{ views }
TOP_VIEWED = *[_type=="viewCount" && contentType==$type] | order(views desc)[0..9]{ contentSlug, views }
```

**Bước 3** — Sửa [worker.js](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/worker.js)
- Thêm route `POST /api/view` → nhận body `{ type, slug }`
- Logic:
  1. Tạo `_id` = `viewcount-${type}-${slug}`
  2. Dùng Sanity `patch(_id).setIfMissing({views:0}).inc({views:1}).set({lastViewed: now})` 
  3. Trả về `{ views: newCount }`

**Bước 4** — Tạo [NEW] `src/hooks/useViewCount.ts`
```ts
// Khi mount: check localStorage "viewed-{type}-{slug}" 
// Nếu chưa viewed (hoặc viewed >24h trước) → POST /api/view → lưu localStorage
// Tránh count trùng khi user refresh
```

**Bước 5** — Tạo [NEW] `src/components/ViewCounter.tsx`
- Hiển thị 👁️ {views} lượt xem (fetch từ Sanity hoặc từ response của useViewCount)

**Bước 6** — Sửa [BlogPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/BlogPost.tsx) — gọi `useViewCount('post', slug)` + hiển thị `<ViewCounter />`

**Bước 7** — Sửa [ProductPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/ProductPost.tsx) — gọi `useViewCount('product', slug)` + hiển thị `<ViewCounter />`

---

## Phase 8: SEO Analytics Integration

**Bước 1** — Tạo [NEW] `vncms/schemaTypes/analyticsConfig.ts`
```ts
// Singleton document: 
//   gaTrackingId (string) → GA4 Measurement ID (G-XXXXXXX)
//   gscVerification (string) → Google Search Console verification code
//   gtmContainerId (string) → GTM Container ID (GTM-XXXXXXX)
//   fbPixelId (string, optional) → Facebook Pixel ID
```

**Bước 2** — Register schema trong [schemaTypes/index.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/index.ts)

**Bước 3** — Thêm GROQ query:
```groq
ANALYTICS_CONFIG = *[_type=="analyticsConfig"][0]{ gaTrackingId, gscVerification, gtmContainerId, fbPixelId }
```

**Bước 4** — Sửa [worker.js](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/worker.js)
- Khi trả về [index.html](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/index.html) (SPA fallback):
  1. Fetch `ANALYTICS_CONFIG` từ Sanity (cache 1 giờ)
  2. Read [index.html](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/index.html) content → inject vào `<head>`:
     - GSC: `<meta name="google-site-verification" content="${gscVerification}" />`
     - GTM: GTM script snippet
     - GA4: gtag.js script
     - FB Pixel: fbq script (nếu có)
  3. Trả về modified HTML

> [!NOTE]
> Cách này cho phép admin thay đổi tracking IDs từ CMS mà không cần redeploy.

---

## Phase 9: Module Kiểm Tra Lỗi Bài Viết

**Bước 1** — Tạo [NEW] `vncms/components/ContentAudit.tsx`
- Custom Sanity Studio tool (hiển thị như một tab riêng)
- Fetch tất cả `post` + `product` documents
- Quét từng document, đánh dấu các lỗi:

| Lỗi | Cách detect |
|---|---|
| Thiếu ALT ảnh | Scan `body` (blockContent) → tìm image blocks có `alt` trống/undefined |
| Thiếu Meta Title | `seo.seoTitle` trống |
| Thiếu Meta Description | `seo.seoDescription` trống |
| Meta Title quá dài/ngắn | Ngoài khoảng 30–60 ký tự |
| Meta Description quá dài/ngắn | Ngoài khoảng 80–160 ký tự |
| Thiếu Focus Keyword | `seo.focusKeyword` trống |
| Thiếu Keywords | `seo.seoKeywords` trống hoặc <3 items |
| Thiếu Slug | `slug.current` undefined/empty |
| Thiếu OG Image | `seo.ogImage` null |
| Lỗi Schema data | Article thiếu author/publishedAt, Product thiếu description... |

**Bước 2** — Tạo [NEW] `vncms/components/ContentAuditDashboard.tsx`
- Bảng tổng hợp: ✅ X tốt / ⚠️ Y cần sửa / ❌ Z lỗi nghiêm trọng
- Bộ lọc: theo loại content (post/product), theo loại lỗi
- Click vào dòng lỗi → mở document editor tương ứng trong Sanity

**Bước 3** — Sửa [sanity.config.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/sanity.config.ts)
- Đăng ký `ContentAudit` tool vào Sanity Studio plugins

---

## Tóm tắt files

### Files mới

| File | Phase |
|---|---|
| `vncms/lib/slugify.ts` | 1 |
| `vncms/schemaTypes/pageSlug.ts` | 1 |
| `vncms/schemaTypes/redirect.ts` | 1 |
| `src/utils/sitemap-builder.ts` | 1 |
| `public/robots.txt` | 1 |
| `src/utils/schema-markup.ts` | 2 |
| `src/components/JsonLd.tsx` | 2 |
| `vncms/components/SeoChecklist.tsx` | 3 |
| `vncms/schemaTypes/tag.ts` | 4 |
| `src/components/TagList.tsx` | 4 |
| `vncms/components/InternalLinkSuggestion.tsx` | 4 |
| `src/utils/auto-alt.ts` | 5 |
| `src/components/FacebookComments.tsx` | 6 |
| `src/components/ShareButtons.tsx` | 6 |
| `vncms/schemaTypes/viewCount.ts` | 7 |
| `src/hooks/useViewCount.ts` | 7 |
| `src/components/ViewCounter.tsx` | 7 |
| `vncms/schemaTypes/analyticsConfig.ts` | 8 |
| `vncms/components/ContentAudit.tsx` | 9 |
| `vncms/components/ContentAuditDashboard.tsx` | 9 |

### Files cần sửa

| File | Phases |
|---|---|
| [vncms/schemaTypes/post.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/post.ts) | 1, 3, 4 |
| [vncms/schemaTypes/product.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/product.ts) | 1, 3, 4 |
| [vncms/schemaTypes/productcategory.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/productcategory.ts) | 1 |
| [vncms/schemaTypes/seoPanel.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/seoPanel.ts) | 3 |
| [vncms/schemaTypes/blockContent.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/blockContent.ts) | 5 |
| [vncms/schemaTypes/index.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/schemaTypes/index.ts) | 1, 4, 7, 8 |
| [vncms/lib/querries.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/lib/querries.ts) | 1, 4, 7, 8 |
| [vncms/sanity.config.ts](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/vncms/sanity.config.ts) | 4, 9 |
| [worker.js](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/worker.js) | 1, 7, 8 |
| [index.html](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/index.html) | 6 |
| [src/Navigations/BlogPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/BlogPost.tsx) | 2, 4, 6, 7 |
| [src/Navigations/ProductPost.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/ProductPost.tsx) | 2, 4, 6, 7 |
| [src/Navigations/Faqs.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/Faqs.tsx) | 2 |
| [src/Navigations/AboutUs.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/AboutUs.tsx) | 2 |
| [src/Navigations/Landing.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/Landing.tsx) | 2 |
| [src/Navigations/NotFound404.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/Navigations/NotFound404.tsx) | 1 |
| [src/components/BlogPostBody.tsx](file:///c:/Users/ASUS%20TUF%20GAMING/Desktop/ALL/SRC/vinut-usa-release/vinut-usa-release/vinut-usa-release/src/components/BlogPostBody.tsx) | 5 |

---

## Kiểm tra sau hoàn thành

1. **Sitemap** — Truy cập `/sitemap.xml` → xác nhận XML hợp lệ, chứa tất cả URLs
2. **Schema Markup** — Paste URL vào [Google Rich Results Test](https://search.google.com/test/rich-results) → xác nhận pass
3. **Redirect** — Tạo redirect rule CMS → `curl -I <url-cũ>` → xác nhận status 301
4. **SEO Checklist** — Mở Sanity Studio → tạo bài → kiểm tra checklist realtime
5. **Tags** — Tạo tag CMS → gắn vào bài → xác nhận hiển thị + filter
6. **Auto ALT** — Upload ảnh không ALT → xác nhận ALT tự sinh khi render
7. **Facebook Comments** — Mở BlogPost → xác nhận FB comments hiển thị
8. **Share Buttons** — Click share → xác nhận đúng URL
9. **View Count** — Truy cập trang → refresh → xác nhận view tăng  
10. **Analytics** — Nhập GA4 ID vào CMS → kiểm tra GA4 Realtime report
11. **Content Audit** — Mở Sanity Studio → tab Content Audit → xác nhận quét đúng lỗi
