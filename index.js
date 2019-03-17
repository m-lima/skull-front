function prepareConfirmation(click) {
  const parameters = extractParameters(click.target, 2)
  if (parameters == null) {
    return
  }

  if (parameters[0] !== 'custom') {
    document.getElementById('type').value = parameters[0]
    document.getElementById('amount').value = parameters[1]
  }

  showConfirmation()
}

function extractParameters(target, i) {
  if (i == 0) {
    return null
  }

  const type = target.getAttribute('skullType')
  if (type == null) {
    return extractParameters(target.parentNode, i - 1)
  }

  const amount = target.getAttribute('skullAmount')

  return [type, amount]
}

function showConfirmation() {
  document.getElementById('custom').style.display = 'flex'
  document.getElementById('confirm').style.display = 'flex'
}

function hideConfirmation() {
  document.getElementById('custom').style.display = 'none'
  document.getElementById('confirm').style.display = 'none'
}

function accept() {
  const type = document.getElementById('type').value
  const amount = document.getElementById('amount').value
  console.log(endpoint + '?type=' + type + '&amount=' + amount)
  fetch(endpoint + skullPath + '?type=' + type + '&amount=' + amount, {
    method: 'POST',
    redirect: "follow",
  })
  .then(r => r.json())
  .then(console.log)
  hideConfirmation()
}

function addQuickValue(grid, combo, value) {
  addGridButton(grid, value)
  addComboItem(combo, value)
}

function addGridButton(grid, value) {
  const icon = document.createElement('i')
  icon.setAttribute('class', value.icon)

  const button = document.createElement('span')
  button.setAttribute('class', 'GridButton')
  button.setAttribute('skullType', value.type)
  button.setAttribute('skullAmount', value.amount ? value.amount : '1')
  button.addEventListener('click', prepareConfirmation, false)
  button.appendChild(icon)

  grid.appendChild(button)
}

function addComboItem(combo, value) {
  const comboItem = document.createElement('option')
  comboItem.value = value.type
  comboItem.appendChild(document.createTextNode(value.type))
  combo.appendChild(comboItem)
}

function setup() {
  const grid = document.getElementById('grid')
  const combo = document.getElementById('type')

  fetch(endpoint + quickValuesPath + '?type=' + type + '&amount=' + amount, {
    method: 'GET',
    redirect: "follow",
  })
  .then(r => r.json())
  .then(quickValues => {
    if (quickValues.length == 0) {
      return
    }

    quickValues.forEach(value => addQuickValue(grid, combo, value))
    addGridButton(grid, { type: 'custom', icon: 'fas fa-question-circle' })

    document.getElementById('cancel').addEventListener('click', hideConfirmation, false)
    document.getElementById('accept').addEventListener('click', accept, false)
  })
}

setup()
