import config from '../../src/config.js'

describe('Lobby Page', () => {
  it('visits the app root url', () => {
    cy.session('test', { testIsolation: false }, () => {
        const url = `${config.host}/lobby`;
        cy.visit(url) // visit the app root url
        // check whether title contains '行政大樓 二樓會議室借用系統'
        cy.title().should('include', '國立中央大學-行政大樓2樓會議室借用系統')
    })
    const url = `${config.host}/lobby`;
    cy.visit(url) // visit the app root url
  })
})