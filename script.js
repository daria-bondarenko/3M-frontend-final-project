let allExpenses = [];
let res = null;
let inputName = null;
let inputPrice = null;
let valueInputName = null;
let valueInputPrice = null;
let newInputName = null;
let newInputPrice = null;
let newInputDate = null;
const content = document.getElementById('all-expenses');
let isEdit = null;
let isEditDate = null;

window.onload = async () => {
  inputName = document.getElementById('add-buy-name');
  inputName.addEventListener('keyup', addValueName);

  inputPrice = document.getElementById('add-buy-price');
  inputPrice.addEventListener('keyup', addValuePrice);

  const resp = await fetch('http://localhost:4000/allExpenses', {
    method: 'GET'
  });

  res = await resp.json();
  allExpenses = res.data;

  render();
}

render = () => {
  cleaning();

  addAllPrice();

  let container = null;

  allExpenses.map((item, index) => {
    container = (isEdit === index) ? editBuy(item, index) : Buy(item, index);
    content.appendChild(container);
  });

  valueInputName = '';
  valueInputPrice = '';
  inputPrice.value = '';
  inputName.value = '';
};

const cleaning = () => {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
};

const addAllPrice = () => {
  let sumRes = 0;

  allExpenses.forEach(item => {
    sumRes = sumRes + Number(item.price);
  })

  let allPrice = document.getElementById('all-price');
  allPrice.innerText = `Итого ${sumRes} p.`
};

const Buy = (item, index) => {
  const container = document.createElement('div');
  container.id = `task-${index}`;
  container.className = `container-content`;

  const contentName = document.createElement('p');
  contentName.className = 'content-name';
  contentName.innerText = `Магазин "${item.text}"`
  contentName.ondblclick = () => {
    contentName.setAttribute('contentEditable', 'true');
    contentName.innerText = item.text;
    contentName.focus();
  };
  contentName.onblur = async () => {
    if (!contentName.innerText.trim()) {
      alert('Ты накосячил, а я должен убирать...');
      onDeleteClick(index);
      render();
      return;
    }

    const resp = await fetch('http://localhost:4000/editBuy', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({_id: item._id, text: contentName.innerText})
    });

    contentName.setAttribute('contentEditable', 'false');

    res = await resp.json();
    allExpenses = res.data;
    isEdit = null;
    render();
  }
  container.appendChild(contentName);

  if (isEditDate === index) {
    const contentDate = document.createElement('input');
    contentDate.type = 'date';
    contentDate.value = item.date.substr(6, 4) + '-' + item.date.substr(3, 2) + '-' + item.date.substr(0, 2);
    newInputDate = item.date;
    contentDate.className = 'content-date-input';
    contentDate.onchange = (e) => updateValueDate(e);
    contentDate.onblur = async () => {
      const resp = await fetch('http://localhost:4000/editBuy', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({_id: item._id, date: newInputDate})
      });

      res = await resp.json();
      allExpenses = res.data;
      isEditDate = null;
      render();
    }
    container.appendChild(contentDate);
  } else {
    const contentDate = document.createElement('p');
    contentDate.className = 'content-date';
    contentDate.innerText = item.date;
    contentDate.ondblclick = () => {
      isEditDate = index;
      render();
    };
    container.appendChild(contentDate);
  }

  const contentPrice = document.createElement('p');
  contentPrice.className = 'content-price';
  contentPrice.innerText = `${item.price}p.`
  contentPrice.ondblclick = () => {
    contentPrice.setAttribute('contentEditable', 'true');
    contentPrice.innerText = item.price;
    contentPrice.focus();
  };
  contentPrice.onblur = async () => {
    if (Number(contentPrice.innerText)) {

      const resp = await fetch('http://localhost:4000/editBuy', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({_id: item._id, price: contentPrice.innerText})
      });

      contentName.setAttribute('contentEditable', 'false');

      res = await resp.json();
      allExpenses = res.data;
      isEdit = null;
      render();
    } else {
      alert('Неверное значение');
      render();
    }
  }
  container.appendChild(contentPrice);

  const containerButton = document.createElement('div');
  containerButton.className = `container-button`;
  container.appendChild(containerButton);

  const buttonEdit = document.createElement('button');
  buttonEdit.className = `edit-button button`;
  buttonEdit.onclick = () => {
    onEditClick(index);
  };
  containerButton.appendChild(buttonEdit);

  const buttonDelete = document.createElement('button');
  buttonDelete.className = `delete-button button`;
  buttonDelete.onclick = () => {
    onDeleteClick(index);
  };
  containerButton.appendChild(buttonDelete);

  return container;
}

const editBuy = (item, index) => {
  const container = document.createElement('div');
  container.id = `task-${index}`;
  container.className = `container-content`;

  const contentName = document.createElement('input');
  contentName.type = 'text';
  contentName.value = item.text;
  contentName.onkeyup = (e) => updateValueName(e);
  contentName.className = 'content-name-input';
  container.appendChild(contentName);

  const contentDate = document.createElement('input');
  contentDate.type = 'date';
  contentDate.value = item.date.substr(6, 4) + '-' + item.date.substr(3, 2) + '-' + item.date.substr(0, 2);
  contentDate.className = 'content-date-input';
  contentDate.onchange = (e) => updateValueDate(e);
  container.appendChild(contentDate);

  const contentPrice = document.createElement('input');
  contentPrice.type = 'number';
  contentPrice.value = item.price;
  contentPrice.className = 'content-price-input';
  contentPrice.onkeyup = (e) => updateValuePrice(e);
  contentPrice.ondblclick = () => {
  };
  container.appendChild(contentPrice);

  const containerButton = document.createElement('div');
  containerButton.className = `container-button`;
  container.appendChild(containerButton);

  const buttonDone = document.createElement('button');
  buttonDone.className = `done-button button`;
  buttonDone.onclick = () => {
    onDoneClick(index)
  };
  containerButton.appendChild(buttonDone);

  const buttonCancel = document.createElement('button');
  buttonCancel.className = `cancel-button button`;
  buttonCancel.onclick = () => {
    onCancelClick()
  };
  containerButton.appendChild(buttonCancel);

  return container;
}

const onClickAdd = async () => {
  if (!valueInputName.trim() || !valueInputPrice) {
    alert('Что-то не так с данными :(');
    return;
  }

  const resp = await fetch('http://localhost:4000/createBuy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInputName,
      price: valueInputPrice,
      date: new Date().toLocaleDateString()
    })
  })

  let result = await resp.json();
  allExpenses = result.data;

  render();
}

const addValueName = (e) => {
  valueInputName = e.target.value;
};

const addValuePrice = (e) => {
  valueInputPrice = e.target.value;
};

const onEditClick = (index) => {
  isEdit = index;
  newInputName = allExpenses[index].text;
  newInputPrice = allExpenses[index].price;
  newInputDate = allExpenses[index].date;
  render();
}

const onCancelClick = () => {
  isEdit = null;
  render();
}

const onDoneClick = async (index) => {
  let {_id} = allExpenses[index];

  if (!newInputPrice || !newInputName.trim()) {
    alert('Ты накосячил, а я должен убирать...');
    onDeleteClick(index);
    isEdit = null;
    render();
    return;
  }

  const resp = await fetch('http://localhost:4000/editBuy', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({_id, text: newInputName, date: newInputDate, price: newInputPrice})
  });

  res = await resp.json();
  allExpenses = res.data;
  isEdit = null;
  render();
};

const onDeleteClick = async (index) => {
  let {_id} = allExpenses[index];

  const resp = await fetch('http://localhost:4000/deleteBuy?_id=', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({_id})
  })
  res = await resp.json();
  allExpenses = res.data;

  render();
}

const updateValueName = (e) => {
  newInputName = e.target.value
}

const updateValueDate = (e) => {
  newInputDate = e.target.value.substr(8, 2) + '.' + e.target.value.substr(5, 2) + '.' + e.target.value.substr(0, 4);
}

const updateValuePrice = (e) => {
  newInputPrice = e.target.value
}
