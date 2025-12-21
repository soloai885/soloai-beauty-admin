# Services 資料表結構說明

## 資料庫連線狀態

✅ **連線成功**
- **資料庫類型**: PostgreSQL
- **資料庫名稱**: neondb
- **連線位置**: ep-wild-sound-a1wpo7tt-pooler.ap-southeast-1.aws.neon.tech
- **Schema 狀態**: ✅ 已與 Prisma schema 同步

## Services 資料表結構

根據 `prisma/schema.prisma` 定義，`services` 資料表結構如下：

### 表名
- **PostgreSQL 表名**: `services` (透過 `@@map("services")` 映射)
- **Prisma Model**: `Service`

### 欄位結構

| 欄位名稱 | 資料型別 | 約束 | 預設值 | 說明 |
|---------|---------|------|--------|------|
| `id` | `String` (VARCHAR) | PRIMARY KEY | `cuid()` | 服務 ID（唯一識別碼） |
| `name` | `String` (VARCHAR) | NOT NULL | - | 服務名稱 |
| `category` | `ServiceCategory` (ENUM) | NOT NULL | - | 服務類別（Nail/Lash/Facial） |
| `price` | `Int` (INTEGER) | NOT NULL | - | 價格（單位：元） |
| `duration` | `Int` (INTEGER) | NOT NULL | - | 服務時長（單位：分鐘） |
| `bufferTime` | `Int` (INTEGER) | NOT NULL | `0` | 緩衝時間（單位：分鐘） |
| `description` | `String` (TEXT) | NULLABLE | `NULL` | 服務說明 |
| `isActive` | `Boolean` (BOOLEAN) | NOT NULL | `true` | 是否上架 |
| `createdAt` | `DateTime` (TIMESTAMP) | NOT NULL | `now()` | 建立時間 |
| `updatedAt` | `DateTime` (TIMESTAMP) | NOT NULL | `updatedAt()` | 更新時間 |

### 索引 (Indexes)

1. **`category` 索引**: `@@index([category])`
   - 用途：加速依類別查詢服務

2. **`isActive` 索引**: `@@index([isActive])`
   - 用途：加速查詢上架/下架狀態的服務

### 關聯 (Relations)

- **`reservations`**: 一對多關聯到 `Reservation` 表
  - 一個服務可以有多筆預約記錄
  - 外鍵約束：`onDelete: Restrict`（若服務有預約記錄，無法刪除）

### Enum 定義

**ServiceCategory**:
- `Nail` - 美甲
- `Lash` - 美睫
- `Facial` - 美容

## 對應的 SQL CREATE TABLE 指令

```sql
-- 建立 ServiceCategory Enum
CREATE TYPE "ServiceCategory" AS ENUM ('Nail', 'Lash', 'Facial');

-- 建立 services 資料表
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "bufferTime" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- 建立索引
CREATE INDEX "services_category_idx" ON "services"("category");
CREATE INDEX "services_isActive_idx" ON "services"("isActive");
```

## Mock Data 對應關係

目前 `src/lib/mock-data.ts` 中的 `SERVICES_DATA` 結構：

```typescript
{
  id: string;           // → Service.id
  name: string;         // → Service.name
  category: string;     // → Service.category (需轉換為 Enum)
  price: number;        // → Service.price
  duration: number;     // → Service.duration
  bufferTime: number;   // → Service.bufferTime
  description: string;  // → Service.description
}
```

**注意事項**:
- Mock Data 中的 `category` 為字串（"Nail", "Lash", "Facial"），需對應到 Prisma Enum
- Mock Data 沒有 `isActive` 欄位，預設為 `true`
- Mock Data 沒有 `createdAt` 和 `updatedAt`，資料庫會自動產生

## 待對接位置

### 檔案：`src/app/admin/services/page.tsx`

**第 13 行** - Mock Data 引入：
```typescript
// ⚠️ 待替換：目前使用 Mock Data，需對接資料庫
import { SERVICES_DATA } from "@/lib/mock-data";
```

**第 50 行** - Mock Data 使用：
```typescript
{SERVICES_DATA.length === 0 ? (
  // ⚠️ 待替換：改為從資料庫查詢
```

**第 57 行** - Mock Data 迭代：
```typescript
SERVICES_DATA.map((service) => (
  // ⚠️ 待替換：改為使用資料庫查詢結果
```

## 建議的對接方式

1. **建立 Server Action** (`src/app/admin/services/actions.ts`):
   ```typescript
   'use server';
   import { prisma } from '@/lib/prisma';
   
   export async function getServices() {
     return await prisma.service.findMany({
       where: { isActive: true },
       orderBy: { createdAt: 'desc' },
     });
   }
   ```

2. **更新頁面為 Server Component** 或使用 `useEffect` 載入資料

3. **資料轉換**:
   - `category` 已為 Enum，無需轉換
   - 確保 `bufferTime` 有預設值 0

## 驗證清單

- [x] 資料庫連線正常
- [x] `services` 表已存在
- [x] Schema 與 Prisma 定義一致
- [ ] Mock Data 已標記待替換
- [ ] Server Action 已建立
- [ ] 頁面已對接資料庫

