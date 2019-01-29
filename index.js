function prepareConfirmation(click) {
  var parameters = extractParameters(click.target, 2)
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

  var type = target.getAttribute('skullType')
  if (type == null) {
    return extractParameters(target.parentNode, i - 1)
  }

  var amount = target.getAttribute('skullAmount')

  return [type, amount]
}

function showConfirmation() {
  document.getElementById('custom').style.display = 'flex'
  var confirm = document.getElementById('confirm')
  confirm.style.display = 'flex'
}

function hideConfirmation() {
  document.getElementById('custom').style.display = 'none'
  var confirm = document.getElementById('confirm')
  confirm.style.display = 'none'
  getParameters = null
}

function accept() {
  var type = document.getElementById('type').value
  var amount = document.getElementById('amount').value
  console.log(endpoint + '?type=' + type + '&amount=' + amount)
  // fetch('https://www.google.com', {
  //   method: 'GET',
  //   mode: 'no-cors',
  //   redirect: "follow",
  // })
  // .then(r => r.json())
  // .then(console.log)
  hideConfirmation()
}

function addGridButton(grid, value) {
  var icon = document.createElement('i')
  icon.setAttribute('class', value.icon)

  var button = document.createElement('span')
  button.setAttribute('class', 'GridButton')
  button.setAttribute('skullType', value.type)
  button.setAttribute('skullAmount', value.amount ? value.amount : '1')
  button.addEventListener('click', prepareConfirmation, false)
  button.appendChild(icon)

  grid.appendChild(button)
}

function setup() {
  var grid = document.getElementById('grid')

  if (quickValues.length == 0) {
    return
  }

  quickValues.forEach(value => addGridButton(grid, value))
  addGridButton(grid, { type: 'custom', icon: 'fas fa-question-circle' })

  document.getElementById('cancel').addEventListener('click', hideConfirmation, false)
  document.getElementById('accept').addEventListener('click', accept, false)
}

setup()
