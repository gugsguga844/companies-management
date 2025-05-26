# ContabSys

**ContabSys** é um aplicativo voltado para o gerenciamento de empresas em escritórios de contabilidade.

## Sobre o App

O sistema foi desenvolvido para auxiliar escritórios contábeis na organização e controle das empresas que atendem.  

Entre as principais funcionalidades, estão:

- Cadastro de empresas pertencentes ao escritório;
- Gerenciamento de informações relevantes, como atividades e pagamento de honorários;
- Edição de dados das empresas;
- Exclusão de empresas;

### Protótipos de Tela

[Protótipos](https://drive.google.com/drive/folders/1txyrpxVXlaUo191P_OgbSSXEpj_jyNT5)

## Modelagem do Banco

[Modelagem](https://drive.google.com/file/d/1UXguQqn7jMW3oDRZE4fc5qHFBx_E4eQy/view?usp=sharing)

## Planejamento de Sprints
Obs: Criado em 17/05/2025

### Semana 1 - Setup Inicial
- [x] Implementação de mocks para testes.
- [X] Implementação da tela de login.
- [X] Implementação da tela inicial.
- [] Implementação da tela de cadastro de empresas. 
- [X] Implementação do menu de navegação.
- [] Estilização com NativeWind.
- [X] Implementação de Rotas com Expo Router.

### Semana 2 - Gerenciamento de Estados e Telas
- [X] Implementação de gerenciamento de estados com Zustand.
- [] Implementação da tela de relatórios
- [] Implementação da tela de honorários

### Semana 3 - Persistência de Dados Local.
- [] Implementação de banco de dados com SQLite.

### Semana 4 - Validação de Dados com ZOD
- [] Implementação de validação de dados com ZOD.
- [] Implementação das demais telas.

### Semana 5 - Implementação de Testes Unitários
- [] Implementação de testes unitários com Jest.

### Semana 6 - Empacotamento do APP para publicação
- [] Criação de build para Android.

## Atualizações desde o último checkpoint

### Semana 1

Checkpoint 1 finalizado no dia 17/05/2025.
Desde então, foram feitas as seguintes alterações:

- Criação de mocks para testes.
Sem banco de dados por enquanto, criei mocks para simular as informações que seriam salvas no banco de dados.
- Criação das telas utilizando Expo Router
Aqui, utilizei Stack para a maioria das telas e Tabs para o menu de navegação.
- Implementação de gerenciamento de estados com Zustand
Aqui, criei um state chamado useAuthStore para salvar as informações do usuário logado.
As informações salvas vem do mock de accounting_firm.
- Criação de componentes reutilizáveis
Criei componentes reutilizáveis para todas as telas implementadas até aqui, seguindo os conceitos da aula.
Exemplos: para a tela de login, dividi a exibição em 3 componentes principais: input, button e card.

