# Meeting-Room-Booking-System
## Intro
- 一個會議室預約系統
- 將此系統拆分成 Backend API & Frontend Site
### Backend API
- based on Express.JS & MySQL
- 提供前端需要的資料，處理資料的儲存
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/api.md'>API doc</a>
### Frontend Site
- html, js and css.
## Features
### 串接 NCU OAuth
- 提供利用 NCU Portal 實作第三方登入機制，讓學校職員可以利用學校帳號登入此系統

  <details>
    <summary>流程圖</summary>

    ![image](https://github.com/user-attachments/assets/f62dd386-0089-4614-8aef-a58b838188a3)
  </details>

- 當特定 event 發生，使用 NCU SMTP Mail Server 寄信
  - 預約成功
  - 取消預約
- Text Editor
  - A text editor based on Editor.js.
  - 功能
    1. 支援文字和圖片輸入
    2. 支援將文字轉為 hypertext, bold and italics
      - ![image](https://github.com/user-attachments/assets/950ae35c-ba8e-4f21-95f6-651d822fed12)
    3. 客製化功能
      - 句首的 `- ` 會被轉換成 `• `
      - 錨點
        1. 將文字設為 hypertext 作為錨點，並指定對應處的名稱
        - ![image](https://github.com/user-attachments/assets/7999edfc-b1ad-4bc6-acd0-e8ac2c43cbc0)
        3. 句首為 `# ` 指定錨點按下的對應處
        - ![image](https://github.com/user-attachments/assets/3e7e3f75-16a6-4a18-b161-9c92c31a5e92)
    4. 按下 save button 並輸入檔名
    5. 存取 `/page/rules/demo?doc_name=<檔名>` 即可看到輸入的內容
## Prerequisite
- Node v20 up
## Usage
### Backend API
- `mysql < schemal.sql`
- `npm install`
- `node index.js`
### Frontend Site
## Workflow
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/workflow.md'>doc</a>
## Contribution
- 歡迎 PR，可以先看一下<a href="https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/contribution.md">教學</a>
