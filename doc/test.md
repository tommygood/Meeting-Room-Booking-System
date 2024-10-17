# Test
## 架構
- 此專案共有 3 種測試：
1. Frontend Unit Test
2. Backend Unit Test
3. End-to-End Test
## Frontend Unit Test
- files on `src\MRBS-frontend\__test__`
- 使用 vitest
### 測試項目
1. `RootMenu.test.js`
   - 管理者的左邊 bar list 是否正常
2. `Header.test.js`
   - 最上方的 header list 是否正常
3. `Preview.test.js`
   - 看板播放是否正常
   - 包含：今日會議、當前會議、下一個會議 在各情境下是否正常 顯示/不顯示
## Backend Unit Test
- files on `src\api\testing`
- 使用 mocha, chai
### 測試項目
1. `db_conn.js`
   - 測試和資料庫連線是否正常
2. `reservation.js`
   - 新增、查詢、刪除 會議預約是否正常
   - 當發生不同情境的重複預約，是否皆能正確判斷已重複
3. `violation.js`
   - 新增、查詢、刪除 違規是否正常
## End-to-End Test
- files on `src\MRBS-frontend\cypress\e2e`
- 使用 cypress
### 測試項目
1. `example.cy.js`
   - 登入
     - 自動填入 ncu portal account，
     - 自動觸發 google recaptcha2 的 "我不是機器人"（但某些情況下需要手動選擇圖片）
   - 預約會議室
     - 新增、查詢、刪除 會議室預約是否正常
   - 違規事項
     - 新增違規事項是否正常
   - 文字編輯器
     - 修改文件內容是否正常
