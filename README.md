# Meeting-Room-Booking-System
## Intro
- 一個會議室預約系統
- 將此系統拆分成 Backend API & Frontend Site
### Backend API
- based on Express.JS & MySQL
- 提供前端需要的資料，處理資料的儲存
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/api.md'>API doc</a>
### Frontend Site
## Features
### 串接 NCU OAuth
- 提供利用 NCU Portal 實作第三方登入機制，讓學校職員可以利用學校帳號登入此系統

  <details>
    <summary>流程圖</summary>

    ![image](https://github.com/user-attachments/assets/f62dd386-0089-4614-8aef-a58b838188a3)
  </details>

- 當特定 event 發生，使用 NCU email 寄信
  - Send email to all admins with alias email sender which could be different from gmail account.
  - In this case, alias email would be the ncu email which you need to <a href='https://support.mail.ncu.edu.tw/articles/conf/gmail_new.html'>add a mail account</a> in gmail settings.
- Text Editor
  - A simple text editor based on Editor.js.
  - you can now goto `/page/rules` and do text edition with saving function.
    <details>
      <summary>Demo</summary>

      ![image](https://github.com/user-attachments/assets/f8b8de1b-9051-4dff-885d-7a5747426808)
    </details>

  - text editor function
    1. support text and image input.
    2. support convert text to hypertext, bold and italics.
      - ![image](https://github.com/user-attachments/assets/950ae35c-ba8e-4f21-95f6-651d822fed12)
    3. support special char which will be converted to specify symbol
      - A `- ` at the begining of sentence will be converted to `• `
      - A `# ` at the begining of sentence will make content of this sentence to be the div element's id of this sentence.
    4. save the file by clicking save button with file name.
## Prerequisite
- Node v20 up
## Usage
### Backend API
- `mysql < schemal.sql`
- `npm install`
- `node index.js`
### Frontend Site
## Future Works
1. ~~目前會將 OAuth access token 以 query string 存到使用者的前端頁面，但這是不安全的作法，之後要改為將 access token 存到 session~~
2. 後端 API 的單元測試
## Workflow
- <a href='https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/workflow.md'>doc</a>
## Contribution
- 歡迎 PR，可以先看一下<a href="https://github.com/tommygood/Meeting-Room-Booking-System/blob/main/doc/contribution.md">教學</a>
