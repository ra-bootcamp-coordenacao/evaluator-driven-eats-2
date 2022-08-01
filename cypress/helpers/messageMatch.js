export default function messageMatch(url, data, checkFormat) {
  let match = 0;
  let messageRegex = /Olá,gostariadefazeropedido:-Prato:[\s\S]*-Bebida:[\s\S]*-Sobremesa:[\s\S]*Total:R\$[0-9]*\,[0-9]+.*/;
  let searchParams = new URLSearchParams(url.split("?")[1]);
  let text = searchParams.get("text");
  let decodedText = decodeURIComponent(text);
  decodedText = decodedText.replace(/\s/g, '');

  let dish = data.dishTitle.replace(/\s/g, '');
  let drink = data.drinkTitle.replace(/\s/g, '');
  let dessert = data.dessertTitle.replace(/\s/g, '');
  let total = data.totalPrice.toFixed(2);

  if (!!checkFormat) {
    if(!decodedText.match(/R\$[0-9]*\,[0-9]+/)) {
      decodedText = decodedText.replace('.', ',');
    }
    if (messageRegex.test(decodedText)) return 2;
  }

  if (
    decodedText.includes(dish) &&
    decodedText.includes(drink) &&
    decodedText.includes(dessert) &&
    decodedText.replace('.', ',').includes(total.replace('.', ','))
  ) {
    match = 1;
  } else {
    if (!decodedText.includes(dish)) throw new Error(`O prato "${data.dishTitle}" não foi encontrado na mensagem a ser enviada via WhatsApp! Verifique se possui algum erro de digitação, espaçamento ou letras maiúsculas e minúsculas. Lembrando que o nome que aparece no elemento clicado deve ser exatamente igual ao nome enviado na mensagem.`);
    if (!decodedText.includes(drink)) throw new Error(`A bebida "${data.drinkTitle}" não foi encontrada na mensagem a ser enviada via WhatsApp! Verifique se possui algum erro de digitação, espaçamento ou letras maiúsculas e minúsculas. Lembrando que o nome que aparece no elemento clicado deve ser exatamente igual ao nome enviado na mensagem.`);
    if (!decodedText.includes(dessert)) throw new Error(`A sobremesa "${data.dessetTitle}" não foi encontrada na mensagem a ser enviada via WhatsApp! Verifique se possui algum erro de digitação, espaçamento ou letras maiúsculas e minúsculas. Lembrando que o nome que aparece no elemento clicado deve ser exatamente igual ao nome enviado na mensagem.`);
    if (!decodedText.replace('.', ',').includes(total.replace('.', ','))) throw new Error(`O preço correto não foi encontrado na mensagem a ser enviada via WhatsApp!`);
  }

  return match;
}
