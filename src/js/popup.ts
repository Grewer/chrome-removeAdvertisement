import Tab = chrome.tabs.Tab

function getEle(id: string): HTMLElement {
  return document.getElementById(id)
}

function getCurrent(callback: (result: Tab[]) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, callback)
}

window.onload = function () {
  console.log(chrome.tabs)

  let submit = <HTMLButtonElement>getEle('submit'), addQuery = <HTMLInputElement>getEle('addQuery'),
    jumpOptions = getEle('jumpOption'), rmFrame = <HTMLInputElement>getEle('rmFrame')

  submit.addEventListener('click', function () {
    submit.disabled = true

    let value = addQuery.value

    if (!value) {
      alert('规则为空')
      submit.disabled = false
      return
    }

    send(value)

    function send(query: string) {
      submit.disabled = false
      getCurrent(tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          method: 'deleteElement',
          message: query
        }, function (response) {

        })
      })
    }
  })

  jumpOptions.addEventListener('click', function () {
    chrome.tabs.create({ url: 'chrome://extensions/?options=' + chrome.runtime.id })
  })

  rmFrame.addEventListener('change', function (ev) {
    const checked = (<HTMLInputElement>ev.target).checked
    getCurrent(tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        method: 'rmFrame',
        message: checked
      }, function (response) {
        chrome.tabs.reload()
      })
    })
  })

  console.log(chrome.tabs.reload)

  chrome.storage.sync.get({ black: {}, isRmFrame: {} }, function (items) {
    getCurrent(tabs => {
      const url = new URL(tabs[0].url)
      rmFrame.checked = items.isRmFrame[url.host] ?? true
    })
  })
}
