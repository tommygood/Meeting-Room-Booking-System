// https://on.cypress.io/api
import config from '../../src/config.js'

const login = () => {
  
  cy.session(('test'), () => {
    cy.visit(config.host) // visit the app root url
    cy.contains('登入').click() // click the login button
    cy.url().should('not.include', config.host)
    cy.origin('https://portal.ncu.edu.tw', () => {
      const username = ""; // replace with your username
      const password = ""; // replace with your password
      cy.get('#inputAccount').type(username)
      cy.get('#inputPassword').type(password)
      // wait for 10 sec
      cy.get('body').then($body => {
        if ($body.find('iframe').length > 0) {   //evaluates as true
          cy.get('iframe') 
        .its('0.contentDocument.body') 
        .should('not.be.empty') 
        .then((body) => {
          body.click() 
          cy.wait(30000)
          cy.log('current page path', cy.url())
          cy.get('.btn-primary').click()
          cy.get('.btn-danger').click()
          // Log the body to the Cypress test runner
        });
        }
        else {
          cy.get('.btn-primary').click()
          cy.get('.btn-danger').click()
        }
      })
   })
  })
  // no visit here
}

beforeEach(() => {
  login()
})


describe('Reservation page : ', () => {
  // reservation test : post a reservation and delete it
  it('post and delete a reservation', () => {
    cy.visit(`${config.host}/lobby`) // visit the app root url
    // Click the hamburger request button
    cy.get('#hamburger-requestbutton').click();

    // Set the value of the first input field to 'test'
    cy.get('input').eq(0).clear().type('cypress reservation e2e test');

    // Set the value of the fourth input field to 'test'
    cy.get('input').eq(3).clear().type('test');

    // Set the value of the sixth input field to the current date in 'YYYY-MM-DD' format
    cy.get('input').eq(5).clear().type(new Date().toJSON().slice(0, 10));

    // Set the value of the seventh input field to the current date in 'YYYY-MM-DD' format
    cy.get('input').eq(6).clear().type(new Date().toJSON().slice(0, 10));

    // Check the checkbox in the eighth input field
    cy.get('input').eq(7).check();

    // Select the value '09' from the third select dropdown
    cy.get('select').eq(0).select('15');
    cy.get('select').eq(2).select('16');

    // Click the send button
    cy.get('#sendbutton').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include(`預約成功`);
      alertHandled = true;
    })
    // check if the reservation is posted
    cy.wait(5000)
    .then(() => {
      // reload the page
      cy.reload();
      // 使用 .get() 選擇所有的 .fc-event-title 元素
      let found = false;
      cy.get('.fc-event-title').each(($el) => {
        // 獲取元素的文本內容
        cy.wrap($el).invoke('text').then((text) => {
          if (text.trim() === 'cypress reservation e2e test') {
            found = true;
          }
        })
      }).then(() => {
        // 確保在循環結束後進行判斷
        expect(found).to.equal(true);
      });
    });

    // delete the reservation posted by cypress
    // 點擊最後一個 .list-content_box 元素
    cy.reload();
    cy.get('.list-content_box').last().click();

    // click delete button
    cy.get('.swal2-deny.swal2-styled').first().click();

    // click confirm button
    cy.get('.swal2-confirm.swal2-styled').first().click();

    cy.contains('刪除成功').should('exist');

    // click confirm button to reload the page
    cy.get('.swal2-confirm.swal2-styled').first().click();
  })
})

describe('Privelege page : ', () => {
  it('Add and delete a violation record on first user', () => {
    cy.visit(`${config.host}/privilege`);
    cy.get('.bind-addViolation').first().click();
    cy.get('.hamburger-title').last().click();
    cy.on('window:alert', (str) => {
      expect(str.includes('成功') || str.includes('完成')).to.be.true;
    })

    // wait for 5 sec
    cy.wait(5000).then(() => {
      cy.reload();
      cy.get('.bind-showViolation').first().click();
      cy.get('.delete-btn').last().click();
    })
  })
});


describe('Rule page : ', () => {
  it('add a text in editor', () => {
    cy.visit(`${config.host}/rule/use`);
    cy.wait(10000); // wait until the content in quill editor is loaded
    cy.document().then((doc) => {
      // 創建一個 <p> 元素
      const p = doc.createElement('p');
      p.innerHTML = 'cypress e2e test';
      // 獲取 .ql-editor 並將 <p> 插入到第一個子元素之前
      const editor = doc.getElementsByTagName('div')[0].childNodes[6].lastChild.firstChild;
      editor.insertBefore(p, editor.firstChild);
      cy.get('#save-button').click();
      cy.on('window:alert', (str) => {
        expect(str).to.include('文件已儲存');
      })
    })
    cy.wait(3000).then(() => {
      cy.contains('cypress e2e test').should('exist');
    })
  })
})