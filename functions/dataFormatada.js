const dataFormatada = (data = new Date(), formato = 'dd/mm/yyyy') => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0, então somamos 1
    const ano = data.getFullYear();
  
    return formato
      .replace(/dd/, dia)
      .replace(/mm/, mes)
      .replace(/yyyy/, ano);
  };
  

  
  