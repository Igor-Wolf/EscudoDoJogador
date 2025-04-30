

async function audioTheme (chat, currentTheme) { 

    let lista = [...chat]
    lista = lista.slice(-4);

    lista.push({
        role: "user",
        content: `Considerando o conteudo da história, e que seu thema atual é ${currentTheme} qual deveria ser o próximo tema de audio? Você pode manter ou mudar de acordo com a necessidade`,
      });

    const bodyValue = {
        //gemma3:12b
        //deepseek-r1:14b
        model: "gemma3:12b",
        messages: lista, // Enviando as mensagens atualizadas
        system: "Responda sempre na linguagem Português do Brasil.",
        format: {
          type: "object",
          properties: {
            content: {
                  type: "string",
                  enum: ["normal", "ação", "misterio", "terror", "drama", "aventura"],
            },
          },
          required: ["content"],
        },
      };

    try {
        // Usando fetch para streaming de dados
        const response = await fetch("http://localhost:3333/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyValue),
        });
  
        // Verificando se a resposta foi bem-sucedida
        if (!response.ok) {
          throw new Error(`Erro na requisição. Status: ${response.status}`);
        }
  
        // Variável para acumular a resposta do assistente
        let accumulatedResponse = "";
  
        // Usando o Reader do Response para trabalhar com o fluxo de dados (streaming)
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let converter;
        let auxi2;
  
        while (!done) {
          // Lê o próximo "chunk" de dados
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
  
          // Decodificando o "chunk" de bytes para texto
          const chunk = decoder.decode(value, { stream: true });
  
          converter = JSON.parse("[" + chunk + "]");
          // Acumula a resposta recebida até o momento
          accumulatedResponse += converter[0].message.content;
  
          const match = accumulatedResponse.match(/"content"\s*:\s*"([^"]*)/);
  
          if (match && match[1]) {
            const partialContent = match[1]; // conteúdo até agora
            lista[lista.length - 1].content = partialContent;
          }
      
          
        }
      } catch (error) {
        //console.error("Erro ao fazer a requisição:", error.message);
      }
      return lista[lista.length - 1].content
    };






export { audioTheme } 