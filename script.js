let carrinho = []; //carrinho
let modalQtd = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//vai fazer uma copia do models
// a função map vai mapear a estrutura da pizza
pizzaJson.map((item, index) => {
  // clonar a estrutura da classe pizza-item e preencher os dados é depois joga da tela
  let pizzaItem = c(".models .pizza-item").cloneNode(true); // cloneNode(true), vai clona as classes

  // preencher as informações dos pissaItem
  pizzaItem.setAttribute("data-key", index); // vai seta um abributo na pizza-area
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  // quando eu clicar no link da pizza-item vai abrir o modal é vai acontecer os eventos abaixo
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault(); // vai tirar o efeito da teg a de recagerrar a tela

    // closest vai sai da teg <a> e procura o item mais proçimo sendo dentro ou fora
    // target é o proprio elemento
    // getAttribute vai pegar o atributo
    let key = e.target.closest(".pmizza-ite").getAttribute("data-key");
    modalQtd = 1; // sempre que abrir o modal vai incerrir esta quantidade
    modalKey = key; // vai indentificar qual pizza esta selecionada

    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;
    c(".pizzaInfo--size.selected").classList.remove("selected");
    // quando eu faço desse geito cs('.pizzaInfo--size') ele gera um array
    cs(".pizzaInfo--size").forEach((size, sizeIdex) => {
      if (sizeIdex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIdex];
    });

    c(".pizzaInfo--qt").innerHTML = modalQtd; // vai colocar o numero 1 para quantidade

    c(".pizzaWindowArea").style.opacity = 0; //vai deixar o modal trasparente
    c(".pizzaWindowArea").style.display = "flex"; // vai mostra o modal
    setInterval(() => {
      c(".pizzaWindowArea").style.opacity = 1; // vai tirar a opaçidade depois de um tempo
    }, 200);
  });

  // vai mostra as informações sem sobrepor
  c(".pizza-area").append(pizzaItem);
});

// Evendo do modal
function closeModal() {
  c(".pizzaWindowArea").style.opacity = 0; //vai deixar o modal trasparente
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 200); // duração de meio segundo
}
// vai selecionar os elemetos que gerar um array e adicionar o evento click
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

// aumentar a quantidade de pizza
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQtd > 1) {
    modalQtd--;
    c(".pizzaInfo--qt").innerHTML = modalQtd;
  }
});
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQtd++;
  c(".pizzaInfo--qt").innerHTML = modalQtd;
});

cs(".pizzaInfo--size").forEach((size, sizeIdex) => {
  // size é o próprio ítem que eu estou clicando
  size.addEventListener("click", (e) => {
    c(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

//botão de adicionar ao carrinho
c(".pizzaInfo--addButton").addEventListener("click", () => {
  //qual a pizza? = modalKey
  //qual o tamanho? = size
  //quantas pizzas? = modalQtd

  let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));

  let identificador = pizzaJson[modalKey].id + "@" + size; // vai gerar uma chave para identificar

  // antes de dar o push eu tenho que verificar para ver se tem o mesmo identificador
  //findIndex vai procurar por item inguais, se não achar ficar como -1, mais se achar ele volta o key dele
  let key = carrinho.findIndex((item) => item.identificador == identificador);

  if (key > -1) {
    // se achar vai aumentar a quantidade
    carrinho[key].qt += modalQtd;
  } else {
    // se não achar é porque o usuário não tinha a pizza no carrinho
    carrinho.push({
      identificador,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQtd,
    });
  }
  updateCarrinho();
  closeModal();
});

//abrir o carrinho no bobile
c(".menu-openner").addEventListener("click", () => {
  if (carrinho.length > 0) {
    c("aside").style.left = "0"; // vai abrir o carrinho
  }
});
c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vw"; // vai fechar o carrinho
});

// função que vai atualizar o carrinho e mostra
function updateCarrinho() {
  // vai adicionar quantidade no span
  c(".menu-openner span").innerHTML = carrinho.length;

  // vai verificar sé tem algum item no carrinho se tiver vai abrir
  if (carrinho.length > 0) {
    c("aside").classList.add("show"); // vai aparecer o carrinho
    c(".cart").innerHTML = ""; // vai zerar é mostra

    let subTotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in carrinho) {
      // find vai retorna todas as carraqueteristica da pizza, se ela for ingual a que foi clicada
      let pizzaItem = pizzaJson.find((item) => item.id == carrinho[i].id);
      subTotal += pizzaItem.price * carrinho[i].qt; // calculcando os subtotais
      let carrinhoItem = c(".models .cart--item").cloneNode(true); //clonando cart--item

      let pizzaSizeName;

      switch (carrinho[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      carrinhoItem.querySelector("img").src = pizzaItem.img;
      carrinhoItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      carrinhoItem.querySelector(".cart--item--qt").innerHTML = carrinho[i].qt;
      carrinhoItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (carrinho[i].qt > 1) {
            carrinho[i].qt--;
          } else {
            carrinho.splice(i, 1); // caso a quantidade o carrinho for menor do que 1 remover o item
          }
          updateCarrinho();
        });
      carrinhoItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          carrinho[i].qt++; // já esta incrementando a o item do contesto do for
          updateCarrinho(); // vai reatualizar o carrinho com os movos valores
        });

      c(".cart").append(carrinhoItem); //preencheu as infornações necessárias
    }

    desconto = subTotal * 0.1; //vai dar 10% de desconto
    total = subTotal - desconto;

    // span: last-child vai pegar  o ultimo span do subtotal
    c(".subtotal span:last-child").innerHTML = `R$ ${subTotal.toFixed(2)}`;
    // span: last-child vai pegar  o ultimo span do desconto
    c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    // span: last-child vai pegar  o ultimo span do total
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    // se não tiver item fechar o carrinho
    c("aside").classList.remove("show"); // vai remover o carrinho
    c("aside").style.left = "100vw"; // vai fechar no celular
  }
}
