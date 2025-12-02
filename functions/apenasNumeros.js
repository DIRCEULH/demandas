  const  apenasNumeros = ( elemento) => {
    $(elemento).on('input', function () {
      const original = $(this).text();
      const apenasNumeros = original.replace(/\D/g, '');
      if (original !== apenasNumeros) {
        $(this).text(apenasNumeros);
        // Reposiciona o cursor no fim
        const el = this;
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  }