import React, { useState } from 'react';
import { ContainerPDF, PdfFile } from './styles';

function PdfViwer() {
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Pega o primeiro arquivo selecionado
    if (file && file.type === "application/pdf") { // Verifica se o arquivo é PDF
      const objectUrl = URL.createObjectURL(file); // Cria uma URL temporária para o arquivo
      setPdfUrl(objectUrl); // Armazena a URL temporária
    } else {
      alert("Por favor, selecione um arquivo PDF.");
    }
  };

  return (
    <ContainerPDF>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange} // Chama a função para processar o arquivo
      />
      {pdfUrl && (
        <PdfFile
          src={pdfUrl} // Usando a URL temporária do arquivo PDF
         
        />
      )}
    </ContainerPDF>
  );
}

export default PdfViwer;