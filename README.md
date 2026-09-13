# Monsten — catálogo e votação de filmes

Aplicação frontend para cadastrar filmes e séries, votar em títulos e acompanhar os totais de avaliações. Desenvolvida com **JavaScript, HTML e CSS**, sem framework.

## Funcionalidades

- Catálogo inicial com cinco títulos.
- Cadastro com título, gênero, descrição e URL da imagem.
- Validação dos campos obrigatórios e do protocolo da URL de imagem.
- Votos positivos e negativos, com atualização dos contadores.
- Abas de catálogo e cadastro.
- Persistência no navegador com `localStorage`.

## Executar localmente

Clone o repositório e abra `index.html` no navegador. Para uma origem local consistente, você também pode servir a pasta com Python 3:

```sh
git clone https://github.com/lucaslusni/Desafio_Monsten.git
cd Desafio_Monsten
python -m http.server 8000
```

Acesse http://localhost:8000. A aplicação não exige instalação de dependências.

## Como funciona

O código de `js/app.js` carrega os dados salvos na chave `votacao_filmes_v1`. Se não houver dados válidos para inicialização, usa o catálogo inicial. Eventos do formulário e dos botões atualizam o estado e salvam as alterações no navegador.

- `index.html`: estrutura da interface.
- `css/style.css`: apresentação visual.
- `js/app.js`: cadastro, renderização, votos e persistência.
- `img/`: imagens do catálogo inicial.

## Escopo e limitações

Este projeto demonstra fundamentos de frontend. Não possui backend, login ou sincronização entre dispositivos. Os votos são locais e podem ser repetidos; não representam uma votação verificada por usuário. Limpar os dados do site remove os cadastros e votos armazenados.

As imagens e os títulos do catálogo são utilizados no contexto do exercício; o repositório não declara direitos sobre essas obras.

## Roteiro de verificação manual

1. Abra a aplicação e confira os cinco títulos iniciais.
2. Cadastre um título com uma URL de imagem HTTP ou HTTPS.
3. Vote e confira os totais.
4. Recarregue a página e verifique a persistência.
5. Tente cadastrar sem título ou com URL inválida e confira a mensagem.

## Possíveis evoluções

- API Node.js com persistência compartilhada.
- Autenticação e controle de votos por usuário.
- Filtros de catálogo e testes automatizados.

Esses itens são propostas de evolução, não funcionalidades já implementadas.

