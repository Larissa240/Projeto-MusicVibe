describe("Tela de Login MusicVibe", () => {
  
  it("exibe erro com credenciais inválidas", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="email"]').type("usuario@teste.com");
    cy.get('input[name="senha"]').type("senhaerrada");
    cy.get('button[type="submit"]').click();

    cy.contains("Credenciais inválidas");
  });

  it("redireciona para Home com credenciais válidas", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="email"]').type("usuario@teste.com");
    cy.get('input[name="senha"]').type("123456");
    cy.get('button[type="submit"]').click();

    cy.url().should("eq", "http://localhost:3000/home");
  });
});

describe("Tela de Cadastro MusicVibe", () => {

  it("realiza cadastro com dados válidos", () => {
    cy.visit("http://localhost:3000/cadastro");

    cy.get('input[name="email"]').type(`novo${Date.now()}@teste.com`);
    cy.get('input[name="senha"]').type("123456");
    cy.get('button[type="submit"]').click();

    cy.url().should("eq", "http://localhost:3000/login"); // Após cadastro deve ir para login
  });

  it("exibe erro com email inválido", () => {
    cy.visit("http://localhost:3000/cadastro");

    cy.get('input[name="email"]').type("emailinvalido"); // Email sem '@'
    cy.get('input[name="senha"]').type("123456");
    cy.get('button[type="submit"]').click();

    cy.contains("Email inválido");
  });

});

describe("Tela de Playlist MusicVibe", () => {

  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[name="email"]').type("usuario@teste.com");
    cy.get('input[name="senha"]').type("123456");
    cy.get('button[type="submit"]').click();
    cy.url().should("eq", "http://localhost:3000/home");
  });

  it("cria uma nova playlist com sucesso", () => {
    cy.visit("http://localhost:3000/playlist-new");

    cy.get('input[name="nomePlaylist"]').type("Minha Playlist Cypress");
    cy.get('button[type="submit"]').click();

    cy.contains("Playlist criada com sucesso");
  });

  it("exibe erro ao tentar criar playlist sem nome", () => {
    cy.visit("http://localhost:3000/playlist-new");

    cy.get('input[name="nomePlaylist"]').clear();
    cy.get('button[type="submit"]').click();

    cy.contains("Nome da playlist é obrigatório");
  });

});
