const pais = async (country) => { // função que faz o fetch naquele endpoint, converte os dados e retorna a informação

    const response = await fetch('https://restcountries.com/v3.1/name/'+country); // fica à espera de algo

    if (response.status != 200) {
        throw new Error('Não é possível ler os dados.'); // com esta condição, ele é forçado a entrar no catch (apesar de retornar informação em json), caso a condição se verifique
    }

    const data = await response.json(); // quando recebe a informação, converte para o nosso formato

    return data;
};

export default pais